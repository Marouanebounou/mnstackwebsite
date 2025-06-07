import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { planName, billingCycle } = req.body;

    // Define prices based on plan and billing cycle
    const prices = {
      Starter: {
        monthly: 2900, // $29.00
        yearly: 27840, // $29.00 * 12 * 0.8 (20% discount)
      },
      Professional: {
        monthly: 7900, // $79.00
        yearly: 75840, // $79.00 * 12 * 0.8 (20% discount)
      },
      Enterprise: {
        monthly: 29900, // $299.00
        yearly: 287040, // $299.00 * 12 * 0.8 (20% discount)
      },
    };

    const price = prices[planName][billingCycle];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planName} Plan`,
              description: `${billingCycle} billing`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 