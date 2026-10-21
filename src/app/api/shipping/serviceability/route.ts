import { NextRequest, NextResponse } from 'next/server';
import { ServiceabilityRequestSchema } from '@/lib/validation/schemas';
import { checkPincodeServiceability } from '@/lib/services/shippingService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ServiceabilityRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid 6-digit Indian PIN code.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(parsed.data.pincode);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/shipping/serviceability] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while evaluating courier serviceability.' },
      { status: 500 }
    );
  }
}
