import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const { name, url, description, favicon, categoryId } = await request.json();
  const maxOrder = await prisma.link.aggregate({
    where: { categoryId },
    _max: { order: true },
  });
  const link = await prisma.link.create({
    data: {
      name,
      url,
      description,
      favicon,
      categoryId,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(link);
}
