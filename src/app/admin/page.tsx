"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Edit2, ExternalLink, LogOut, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Link {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  links: Link[];
}

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editLinkName, setEditLinkName] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editLinkDesc, setEditLinkDesc] = useState("");

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("获取分类失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, [checkAuth, fetchCategories]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      await res.json();
      toast.success("分类添加成功");
      setNewCategoryName("");
      fetchCategories();
    } catch {
      toast.error("添加分类失败");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("确定删除该分类及其所有链接？")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      toast.success("分类删除成功");
      fetchCategories();
    } catch {
      toast.error("删除分类失败");
    }
  };

  const handleAddLink = async () => {
    if (!newLinkName.trim() || !newLinkUrl.trim() || !selectedCategoryId) return;
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLinkName,
          url: newLinkUrl,
          description: newLinkDesc,
          categoryId: selectedCategoryId,
        }),
      });
      await res.json();
      toast.success("链接添加成功");
      setNewLinkName("");
      setNewLinkUrl("");
      setNewLinkDesc("");
      fetchCategories();
    } catch {
      toast.error("添加链接失败");
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      toast.success("链接删除成功");
      fetchCategories();
    } catch {
      toast.error("删除链接失败");
    }
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCatName(category.name);
  };

  const openEditLink = (link: Link) => {
    setEditingLink(link);
    setEditLinkName(link.name);
    setEditLinkUrl(link.url);
    setEditLinkDesc(link.description || "");
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCatName.trim()) return;
    try {
      await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCatName }),
      });
      toast.success("分类更新成功");
      setEditingCategory(null);
      fetchCategories();
    } catch {
      toast.error("更新分类失败");
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink || !editLinkName.trim() || !editLinkUrl.trim()) return;
    try {
      await fetch(`/api/links/${editingLink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editLinkName,
          url: editLinkUrl,
          description: editLinkDesc,
        }),
      });
      toast.success("链接更新成功");
      setEditingLink(null);
      fetchCategories();
    } catch {
      toast.error("更新链接失败");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#06B6D4]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#EC4899]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <header className="sticky top-0 z-50 w-full">
        <div className="container">
          <div className="glass rounded-2xl mt-4 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                <Edit2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">管理后台</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="glass hover:bg-[#8B5CF6]/20 border-[#8B5CF6]/30" onClick={() => router.push("/")}>
                <ExternalLink className="h-4 w-4 mr-1" />
                查看前台
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-[#8B5CF6]/20" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 relative z-10 max-w-2xl mx-auto space-y-6">
        {/* 添加分类 */}
        <div className="tech-card rounded-xl p-6">
          <h2 className="text-lg font-semibold gradient-text mb-4">添加分类</h2>
          <div className="flex gap-2">
            <Input
              placeholder="分类名称"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="glass"
            />
            <Button onClick={handleAddCategory} className="btn-gradient">添加</Button>
          </div>
        </div>

        {/* 添加链接 */}
        <div className="tech-card rounded-xl p-6">
          <h2 className="text-lg font-semibold gradient-text mb-4">添加链接</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>链接名称</Label>
                <Input
                  placeholder="网站名称"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label>链接 URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="glass"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述（可选）</Label>
              <Textarea
                placeholder="描述..."
                value={newLinkDesc}
                onChange={(e) => setNewLinkDesc(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>选择分类</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategoryId === cat.id ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${selectedCategoryId === cat.id ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10'}`}
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleAddLink} disabled={!selectedCategoryId} className="btn-gradient">
              添加链接
            </Button>
          </div>
        </div>

        {/* 分类和链接列表 */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="tech-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-[#8B5CF6]/60" />
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <Badge variant="secondary" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-0">{category.links.length}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#8B5CF6]/20"
                    onClick={() => openEditCategory(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-[#EC4899]/20"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-[#EC4899]" />
                  </Button>
                </div>
              </div>
              {category.links.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 py-2">
                  该分类下暂无链接
                </p>
              ) : (
                <ScrollArea className="h-auto">
                  <div className="space-y-2">
                    {category.links.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-[#8B5CF6]/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical className="h-4 w-4 text-[#8B5CF6]/40 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{link.name}</p>
                            <p className="text-xs text-muted-foreground/60 truncate">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#8B5CF6]/20"
                            onClick={() => openEditLink(link)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#EC4899]/20"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4 text-[#EC4899]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 编辑分类弹窗 */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="glass border-[#8B5CF6]/30">
          <DialogHeader>
            <DialogTitle className="gradient-text">编辑分类</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>分类名称</Label>
              <Input
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
                className="glass"
              />
            </div>
            <Button onClick={handleUpdateCategory} className="btn-gradient w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑链接弹窗 */}
      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent className="glass border-[#8B5CF6]/30">
          <DialogHeader>
            <DialogTitle className="gradient-text">编辑链接</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>名称</Label>
              <Input value={editLinkName} onChange={(e) => setEditLinkName(e.target.value)} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={editLinkUrl} onChange={(e) => setEditLinkUrl(e.target.value)} className="glass" />
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea value={editLinkDesc} onChange={(e) => setEditLinkDesc(e.target.value)} className="glass" />
            </div>
            <Button onClick={handleUpdateLink} className="btn-gradient w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
