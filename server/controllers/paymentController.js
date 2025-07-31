const Stripe = require('stripe');
const { z } = require('zod');
const User = require('../models/User');
const Course = require('../models/Course');

// Check if Stripe is properly configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('⚠️  STRIPE_SECRET_KEY is not configured. Payment functionality will be disabled.');
  console.error('Please add STRIPE_SECRET_KEY to your .env file');
}

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

const initiateSchema = z.object({
  courseId: z.string().min(1),
});

async function initiatePurchase(req, res) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Payment service is not configured. Please contact support.' 
      });
    }

    const { courseId } = initiateSchema.parse(req.body);
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (req.user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ error: 'Already purchased' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description,
            images: course.thumbnail ? [course.thumbnail] : [],
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      }],
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        courseId: course._id.toString(),
      },
      success_url: process.env.FRONTEND_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.FRONTEND_URL + '/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
}

// Webhook handler
async function handleWebhook(req, res) {
  // Check if Stripe is configured
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Payment service is not configured' 
    });
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Log event (optional: to DB/file)
  // await WebhookLog.create({ event });
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const courseId = session.metadata.courseId;
    // Add course to user's purchasedCourses if not already present
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedCourses: courseId },
    });
  }
  res.json({ received: true });
}

module.exports = {
  initiatePurchase,
  handleWebhook,
}; 