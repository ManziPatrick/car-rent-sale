import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ContractPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);

  const car = state?.car;
  const type = state?.type; // 'buy' or 'rent'

  if (!car || !user) {
    return <div className="text-center py-12 text-red-500">Missing car or user information.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleAccept = () => {
    if (accepted) {
      // Navigate to checkout with contract acceptance
      navigate('/checkout', { 
        state: { 
          car, 
          type, 
          contractAccepted: true 
        } 
      });
    }
  };

  const handleDecline = () => {
    navigate(`/car/${car._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Car Rental/Purchase Contract</h1>
          <p className="text-blue-100">Please read all terms carefully before proceeding</p>
        </div>

        {/* Contract Content */}
        <div className="p-8 space-y-8">
          {/* Contract Details */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Vehicle Information</h3>
                <p><strong>Vehicle:</strong> {car.brand} {car.model} {car.year}</p>
                <p><strong>Type:</strong> {type === 'buy' ? 'Purchase' : 'Rental'}</p>
                <p><strong>Price:</strong> ${type === 'buy' ? car.salePrice?.toLocaleString() : car.rentPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Payment Requirements</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li><strong>50% upfront payment required</strong> before vehicle handover</li>
                <li>Remaining balance due upon vehicle return (for rentals) or completion of purchase</li>
                <li>All payments must be made through approved payment methods</li>
                <li>Late payments will incur additional fees</li>
              </ul>
            </div>
          </div>

          {/* Fuel Policy */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fuel Policy</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">⛽ Fuel Requirements</h3>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li><strong>Vehicle must be returned with the same fuel level as received</strong></li>
                <li>Fuel gauge will be documented at pickup and return</li>
                <li>Additional fuel charges will apply if returned with less fuel</li>
                <li>Fuel costs are the responsibility of the customer during rental period</li>
              </ul>
            </div>
          </div>

          {/* Maintenance Requirements */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance & Care Requirements</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">🔧 Maintenance Obligations</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li><strong>Regular maintenance is mandatory</strong> during rental period</li>
                <li>Oil changes must be performed according to manufacturer schedule</li>
                <li>Tire pressure must be maintained at recommended levels</li>
                <li>Any mechanical issues must be reported immediately</li>
                <li>Vehicle must be kept clean and in good condition</li>
                <li>No modifications allowed without written permission</li>
              </ul>
            </div>
          </div>

          {/* Checkup Requirements */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pre & Post Trip Checkup</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">🔍 Inspection Requirements</h3>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                <li><strong>Pre-trip inspection required</strong> before vehicle handover</li>
                <li>Post-trip inspection required upon vehicle return</li>
                <li>Both parties must sign inspection reports</li>
                <li>Photos will be taken of vehicle condition</li>
                <li>Any damage must be documented immediately</li>
                <li>Regular checkups during long-term rentals</li>
              </ul>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Terms & Conditions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Insurance & Liability</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Comprehensive insurance coverage is mandatory</li>
                  <li>Customer is responsible for any damage beyond normal wear</li>
                  <li>Deductible amounts apply as per insurance policy</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Usage Restrictions</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Vehicle may not be used for illegal activities</li>
                  <li>No smoking or pets without prior approval</li>
                  <li>Speed limits and traffic laws must be obeyed</li>
                  <li>Vehicle may not be driven outside approved areas</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>24-hour notice required for cancellations</li>
                  <li>Cancellation fees may apply</li>
                  <li>No refunds for early returns without notice</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                By accepting this contract, I acknowledge that I have read, understood, and agree to all terms and conditions stated above. 
                I understand my obligations regarding payment, fuel, maintenance, and vehicle care.
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="accept"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="accept" className="text-gray-700 font-medium">
                  I accept all terms and conditions of this contract
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            📄 Print Contract
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            ❌ Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Accept & Continue
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .bg-gray-50, .bg-gradient-to-r, .bg-yellow-50, .bg-green-50, .bg-blue-50, .bg-purple-50 {
            background: white !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContractPage; 