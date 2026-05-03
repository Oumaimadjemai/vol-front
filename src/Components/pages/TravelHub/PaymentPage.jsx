// Components/pages/TravelHub/PaymentPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safe destructuring with defaults
  const state = location.state || {};
  const plan = state.plan || { name: 'Basic', price: 49 };
  const billingCycle = state.billingCycle || 'month';
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [processing, setProcessing] = useState(false);

  const price = billingCycle === 'year' ? plan.price * 12 * 0.8 : plan.price;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      // Generate random agency ID and subdomain
      const agencyId = Math.random().toString(36).substring(2, 10);
      const subdomain = agencyId.toLowerCase();
      
      navigate('/travelhub/success', {
        state: {
          plan: {
            id: plan.id,
            name: plan.name,
            price: plan.price
          },
          billingCycle: billingCycle,
          amount: price,
          agencyId: agencyId,
          subdomain: subdomain,
          domain: `${subdomain}.travelhub.com`
        }
      });
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/travelhub/plans')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Plans
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Pay $${Math.round(price)}`}
                </button>
                
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure payment powered by Stripe
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>{plan.name} Plan</span>
                  <span>${Math.round(price)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Billing Cycle</span>
                  <span>{billingCycle === 'month' ? 'Monthly' : 'Yearly'}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>${Math.round(price)}</span>
              </div>
              <div className="text-sm text-gray-500">
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Cancel anytime</p>
                <p>✓ Includes all features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}