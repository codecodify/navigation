"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen bg-muted/50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">管理后台</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <ExternalLink className="h-4 w-4 mr-1" />
              查看前台
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* 添加分类 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">添加分类</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="分类名称"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>添加</Button>
          </CardContent>
        </Card>

        {/* 添加链接 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">添加链接</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>链接名称</Label>
                <Input
                  placeholder="网站名称"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>链接 URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述（可选）</Label>
              <Textarea
                placeholder="描述..."
                value={newLinkDesc}
                onChange={(e) => setNewLinkDesc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>选择分类</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategoryId === cat.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleAddLink} disabled={!selectedCategoryId}>
              添加链接
            </Button>
          </CardContent>
        </Card>

        {/* 分类和链接列表 */}
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.links.length}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditCategory(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {category.links.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    该分类下暂无链接
                  </p>
                ) : (
                  <ScrollArea className="h-auto">
                    <div className="space-y-2">
                      {category.links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{link.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {link.url}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditLink(link)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLink(link.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* 编辑分类弹窗 */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>分类名称</Label>
              <Input
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateCategory}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑链接弹窗 */}
      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑链接</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>名称</Label>
              <Input value={editLinkName} onChange={(e) => setEditLinkName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={editLinkUrl} onChange={(e) => setEditLinkUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea value={editLinkDesc} onChange={(e) => setEditLinkDesc(e.target.value)} />
            </div>
            <Button onClick={handleUpdateLink}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
