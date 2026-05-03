// Components/pages/TravelHub/Plans.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Building, ArrowLeft } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    period: 'month',
    iconName: 'Building', // Store icon name instead of component
    features: [
      '1 Custom Domain',
      'Up to 5 Agents',
      '100 Voyageurs/month',
      'Basic Analytics',
      'Email Support',
      'Standard Theme',
      'API Access (Limited)'
    ],
    color: 'blue',
    popular: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    period: 'month',
    iconName: 'Zap',
    features: [
      '3 Custom Domains',
      'Up to 20 Agents',
      '1000 Voyageurs/month',
      'Advanced Analytics',
      'Priority Support',
      'Premium Themes',
      'Full API Access',
      'Custom Branding'
    ],
    color: 'purple',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    period: 'month',
    iconName: 'Crown',
    features: [
      'Unlimited Domains',
      'Unlimited Agents',
      'Unlimited Voyageurs',
      'Custom Analytics',
      '24/7 Dedicated Support',
      'Custom Development',
      'Full API Access',
      'White-label Solution',
      'SLA Agreement'
    ],
    color: 'gold',
    popular: false
  }
];

// Map icon names to components
const iconMap = {
  Building: Building,
  Zap: Zap,
  Crown: Crown
};

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('month');
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    // Create a serializable version of the plan (without the icon component)
    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      iconName: plan.iconName,
      features: plan.features,
      color: plan.color,
      popular: plan.popular
    };
    
    navigate('/travelhub/payment', { 
      state: { 
        plan: serializablePlan, 
        billingCycle 
      } 
    });
  };

  const getIcon = (iconName, colorClass) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={`h-12 w-12 ${colorClass} mb-4`} /> : null;
  };

  const getColorClass = (color) => {
    switch(color) {
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'gold': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/travelhub')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to TravelHub
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start with a plan that fits your agency's needs. Upgrade anytime.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-200 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setBillingCycle('month')}
            className={`px-6 py-2 rounded-lg transition ${
              billingCycle === 'month' ? 'bg-white shadow-md font-semibold' : 'text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('year')}
            className={`px-6 py-2 rounded-lg transition ${
              billingCycle === 'year' ? 'bg-white shadow-md font-semibold' : 'text-gray-600'
            }`}
          >
            Yearly <span className="text-green-600 text-sm">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = billingCycle === 'year' ? plan.price * 12 * 0.8 : plan.price;
            const colorClass = getColorClass(plan.color);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  {getIcon(plan.iconName, colorClass)}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${Math.round(price)}</span>
                    <span className="text-gray-500">/{billingCycle === 'month' ? 'month' : 'year'}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      plan.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div>
            <h4 className="font-semibold mb-2">Can I change plans later?</h4>
            <p className="text-gray-600">Yes, you can upgrade or downgrade anytime.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
            <p className="text-gray-600">No, all plans include free setup and onboarding.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What payment methods are accepted?</h4>
            <p className="text-gray-600">Credit cards, PayPal, and bank transfers.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Can I get a refund?</h4>
            <p className="text-gray-600">30-day money-back guarantee on all plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}