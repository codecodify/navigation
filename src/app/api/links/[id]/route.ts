import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, url, description, favicon, order, categoryId } =
    await request.json();
  const link = await prisma.link.update({
    where: { id },
    data: { name, url, description, favicon, order, categoryId },
  });
  return NextResponse.json(link);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.link.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
