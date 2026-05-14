// Components/pages/TripHubDz/Plans.jsx (Updated)
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Zap, Crown, Building, ArrowLeft, AlertCircle } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9000,
    period: 'month',
    iconName: 'Building',
    features: [
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
    price: 12000,
    period: 'month',
    iconName: 'Zap',
    features: [
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
    price: 15000,
    period: 'month',
    iconName: 'Crown',
    features: [
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

const iconMap = {
  Building: Building,
  Zap: Zap,
  Crown: Crown
};

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('month');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if agency is verified
    const verifiedAgency = sessionStorage.getItem('verifiedAgency');
    if (verifiedAgency || location.state?.verified) {
      setVerified(true);
    } else {
      // Redirect to signup if not verified
      setVerified(true)
    }
  }, [navigate, location.state]);

  const handleSelectPlan = (plan) => {
    const verifiedAgency = JSON.parse(sessionStorage.getItem('verifiedAgency'));
    
    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      iconName: plan.iconName,
      features: plan.features,
      color: plan.color,
      popular: plan.popular
    };
    
    navigate('/TripHubDz/payment', { 
      state: { 
        plan: serializablePlan, 
        billingCycle,
        agencyInfo: verifiedAgency
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

  if (!verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verification Required</h2>
          <p className="text-gray-600 mb-4">Please complete agency verification first.</p>
          <button
            onClick={() => navigate('/TripHubDz/signup')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/TripHubDz')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to TripHubDz
          </button>
        </div>
      </div>

      {/* Verification Badge */}
      {/* <div className="bg-green-50 border-b border-green-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center text-green-800">
            <Check className="h-5 w-5 mr-2" />
            <span>Agency verified successfully! Choose your plan to get started.</span>
          </div>
        </div>
      </div> */}

      {/* Hero */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choisissez votre plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Commencez avec un plan qui correspond à vos besoins d'agence. Mettez à niveau à tout moment.
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
            Mansuel
          </button>
          <button
            onClick={() => setBillingCycle('year')}
            className={`px-6 py-2 rounded-lg transition ${
              billingCycle === 'year' ? 'bg-white shadow-md font-semibold' : 'text-gray-600'
            }`}
          >
            Annuel <span className="text-green-600 text-sm">Save 20%</span>
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
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 flex flex-col ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm z-10">
                    Most Popular
                  </div>
                )}
                
                {/* Card Content - Flex column to push button to bottom */}
                <div className="p-8 flex flex-col h-full">
                  {/* Top section - always at top */}
                  <div className="flex-grow">
                    <div className="flex justify-center">
                      {getIcon(plan.iconName, colorClass)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                    <div className="mb-6 text-center">
                      <span className="text-4xl font-bold">{Math.round(price)}</span>
                      <span className="text-gray-500"> DA/{billingCycle === 'month' ? 'month' : 'year'}</span>
                    </div>
                    
                    {/* Features list */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Button section - always at bottom */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-lg font-semibold transition transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Get Started
                    </button>
                    
                    {/* Optional: Add a small text under button */}
                    {plan.popular && (
                      <p className="text-xs text-center text-gray-500 mt-3">
                        Most popular choice
                      </p>
                    )}
                  </div>
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
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-2">Can I change plans later?</h4>
            <p className="text-gray-600">Yes, you can upgrade or downgrade anytime.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
            <p className="text-gray-600">No, all plans include free setup and onboarding.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-2">What payment methods are accepted?</h4>
            <p className="text-gray-600">Credit cards, PayPal, and bank transfers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-semibold mb-2">Can I get a refund?</h4>
            <p className="text-gray-600">30-day money-back guarantee on all plans.</p>
          </div>
        </div>
      </div>

      {/* Comparison Table (Optional) */}
      <div className="container mx-auto px-6 py-16 bg-white rounded-2xl shadow-lg mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4">Feature</th>
                <th className="text-center py-4 px-4">Basic</th>
                <th className="text-center py-4 px-4 bg-purple-50">Professional</th>
                <th className="text-center py-4 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Price (Monthly)</td>
                <td className="text-center py-3 px-4">9000 DA</td>
                <td className="text-center py-3 px-4 bg-purple-50 font-semibold">12000 DA</td>
                <td className="text-center py-3 px-4">15000 DA</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Agents</td>
                <td className="text-center py-3 px-4">Up to 5</td>
                <td className="text-center py-3 px-4 bg-purple-50">Up to 20</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Travelers</td>
                <td className="text-center py-3 px-4">100/month</td>
                <td className="text-center py-3 px-4 bg-purple-50">1,000/month</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Support</td>
                <td className="text-center py-3 px-4">Email</td>
                <td className="text-center py-3 px-4 bg-purple-50">Priority</td>
                <td className="text-center py-3 px-4">24/7 Dedicated</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Custom Branding</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4 bg-purple-50">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}