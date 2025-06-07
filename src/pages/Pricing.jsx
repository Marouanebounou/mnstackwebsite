import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../contexts/AuthContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: [
      'AI Code Assistant',
      'Basic Analytics',
      '5 Projects',
      'Community Support',
      'Basic Debugging Tools',
    ],
    recommended: false,
  },
  {
    name: 'Professional',
    price: 79,
    features: [
      'Everything in Starter',
      'Advanced Analytics',
      'Unlimited Projects',
      'Priority Support',
      'Team Collaboration',
      'Advanced Debugging',
      'Deployment Automation',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 299,
    features: [
      'Everything in Professional',
      'Custom AI Models',
      'Dedicated Support',
      'SLA Guarantee',
      'Custom Integrations',
      'Advanced Security',
      'On-premise Option',
    ],
    recommended: false,
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const { currentUser } = useAuth()

  const handleSubscribe = async (planName) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    try {
      const stripe = await stripePromise
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          billingCycle,
        }),
      })

      const session = await response.json()
      await stripe.redirectToCheckout({
        sessionId: session.id,
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-100">
              Choose the plan that's right for you
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="container-custom py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              className={`px-6 py-2 rounded-md ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="ml-2 text-sm text-green-500">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.recommended ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'yearly' ? plan.price * 0.8 : plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold ${
                    plan.recommended
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for
                enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on all plans. No credit card
                required to start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 