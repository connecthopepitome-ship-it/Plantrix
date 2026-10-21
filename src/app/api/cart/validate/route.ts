import { NextRequest, NextResponse } from 'next/server';
import { calculateOrderTotals, CheckoutItemInput } from '@/lib/services/orderService';
import { z } from 'zod';


const CartValidateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.number().int().min(1).max(99),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CartValidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { calculation, errors } = await calculateOrderTotals(parsed.data.items);

    return NextResponse.json(
      {
        success: true,
        data: calculation,
        hasErrors: Boolean(errors && errors.length > 0),
        validationErrors: errors,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/cart/validate] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while validating cart items.' },
      { status: 500 }
    );
  }
}
