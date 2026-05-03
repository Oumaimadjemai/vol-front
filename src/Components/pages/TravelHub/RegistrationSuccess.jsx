// Components/pages/TravelHub/RegistrationSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, billingCycle, amount, agencyId, subdomain, domain } = location.state || {
    plan: { name: 'Basic' },
    billingCycle: 'month',
    amount: 49,
    agencyId: 'demo123',
    subdomain: 'demo',
    domain: 'demo.travelhub.com'
  };
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20 px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold mb-4">Registration Successful! 🎉</h1>
          <p className="text-gray-600 mb-8">
            Your agency has been successfully created. You can now access your platform.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">Your Agency Details</h3>
            <div className="space-y-2 text-left">
              <p><span className="font-medium">Plan:</span> {plan.name} ({billingCycle})</p>
              <p><span className="font-medium">Amount Paid:</span> ${Math.round(amount)}</p>
              <p><span className="font-medium">Agency ID:</span> {agencyId}</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border mt-2">
                <div>
                  <p className="font-medium">Your Domain</p>
                  <p className="text-blue-600">{domain}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <a
              href={`http://${subdomain}.127.0.0.1.nip.io:3000`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Your Agency Portal
              <ExternalLink className="h-5 w-5 ml-2" />
            </a>
            
            <button
              onClick={() => navigate('/travelhub')}
              className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Back to TravelHub
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <ol className="text-sm text-left text-gray-600 space-y-1 list-decimal list-inside">
              <li>Check your email for login credentials</li>
              <li>Customize your agency portal</li>
              <li>Add your team members</li>
              <li>Start accepting bookings!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}