import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../config/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const handleStripeWebhook = async (req: Request, res: Response) => {
  // CRITICAL: The request body must be parsed as raw (Buffer) for signature verification to work.
  // In your Express setup, ensure this route uses: express.raw({ type: 'application/json' })
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error('No Stripe signature found');
    
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️ Stripe webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Assuming you passed the internal User ID in client_reference_id during checkout creation
      const userId = session.client_reference_id;

      if (userId) {
        try {
          // Note: The schema.prisma Enum currently only supports ADMIN and FAN.
          // You MUST update the Prisma schema Role enum to include PREMIUM_FAN and run a migration 
          // before this logic will successfully execute against the database.
          await prisma.user.update({
            where: { id: userId },
            data: { role: 'PREMIUM_FAN' as any }, // Type casting applied to bypass TS error pending schema update
          });
          console.log(`✅ Successfully upgraded user ${userId} to PREMIUM_FAN`);
        } catch (error) {
          console.error(`❌ Failed to update user role for ${userId}:`, error);
        }
      }
      break;
      
    // Handle other event types if necessary
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
};
