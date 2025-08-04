import { PaymentProcessor } from '@/lib/payment-processor';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, firstName, paymentId, amount, currency } = body;

    // Use the PaymentProcessor method for consistency
    const result = await PaymentProcessor.sendConfirmationEmail({
      to,
      firstName,
      paymentId,
      amount,
      currency
    });

    return Response.json(result.data);
  } catch (error) {
    console.error('API Send Route Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}