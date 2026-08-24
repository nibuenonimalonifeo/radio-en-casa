import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/getStoreProducts';

export async function GET() {
  const products = getStoreProducts();
  return NextResponse.json(products);
}