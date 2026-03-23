import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { links: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  const category = await prisma.category.create({
    data: {
      name,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(category);
}
