import { useState, useEffect } from "react"
import { useToast } from "../context/ToastContext"

const PolicySection = ({ id, title, children }) => {
  const { success } = useToast()
  const [agreed, setAgreed] = useState(false)
  const [checked, setChecked] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedAgreements = JSON.parse(localStorage.getItem("shopease_policy_agreements") || "{}")
    if (savedAgreements[id]) {
      setAgreed(true)
      setChecked(true)
    }
  }, [id])

  const handleAgree = () => {
    setAgreed(true)
    const savedAgreements = JSON.parse(localStorage.getItem("shopease_policy_agreements") || "{}")
    savedAgreements[id] = true
    localStorage.setItem("shopease_policy_agreements", JSON.stringify(savedAgreements))
    success(`You have agreed to the ${title}.`)
  }

  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
        {children}
        
        {/* Agreement Area */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className={`flex items-center gap-3 cursor-pointer ${agreed ? "opacity-70 pointer-events-none" : ""}`}>
            <input 
              type="checkbox" 
              checked={checked} 
              onChange={(e) => setChecked(e.target.checked)}
              disabled={agreed}
              className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <span className={`text-sm font-medium ${agreed ? "text-emerald-600" : "text-gray-700"}`}>
              {agreed ? "✅ You have agreed to these terms and conditions." : "I agree to the terms and conditions"}
            </span>
          </label>
          
          <button
            onClick={handleAgree}
            disabled={!checked || agreed}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              agreed 
                ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" 
                : checked 
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {agreed ? "Agreed" : "Agree"}
          </button>
        </div>
      </div>
    </section>
  )
}

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Policies</h1>

        <PolicySection id="privacy" title="Privacy Policy">
          <p>At ShopEase Nepal, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Information We Collect</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, phone number, and delivery address</li>
            <li>Order history and preferences</li>
            <li>Payment information (processed securely through third-party gateways)</li>
            <li>Device and browsing data for analytics</li>
          </ul>
          <h3 className="font-semibold text-gray-900 pt-2">How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To provide customer support</li>
            <li>To improve our products and services</li>
            <li>To send order updates and promotional offers (with consent)</li>
          </ul>
          <h3 className="font-semibold text-gray-900 pt-2">Data Security</h3>
          <p>We implement industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your explicit consent, except as required by law.</p>
          <p>You have the right to access, update, or delete your personal data at any time by contacting us at <a href="mailto:support@shopease.com.np" className="text-amber-600 hover:underline">support@shopease.com.np</a>.</p>
        </PolicySection>

        <PolicySection id="terms" title="Terms of Use">
          <p>By using ShopEase Nepal, you agree to the following terms and conditions.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Account Registration</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Product Listings</h3>
          <p>We strive to display accurate product descriptions, prices, and availability. However, we reserve the right to correct any errors and update information without prior notice.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Order Acceptance</h3>
          <p>We reserve the right to refuse or cancel any order for reasons including but not limited to: product unavailability, pricing errors, or suspected fraudulent activity.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Limitation of Liability</h3>
          <p>ShopEase Nepal shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
        </PolicySection>

        <PolicySection id="cod" title="Cash on Delivery (COD) Policy">
          <p>We offer Cash on Delivery across all 7 provinces of Nepal to make your shopping convenient and secure.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Coverage Areas</h3>
          <p>COD is available in all major cities and towns across Nepal. Remote rural areas may have limited availability — please check your delivery address during checkout.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Payment Upon Delivery</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pay in cash at the time of delivery</li>
            <li>Please have the exact amount ready; our delivery partners may not always carry change</li>
            <li>A small COD convenience fee may apply (displayed at checkout)</li>
          </ul>
          <h3 className="font-semibold text-gray-900 pt-2">Failed Delivery Attempts</h3>
          <p>If delivery cannot be completed due to an incorrect address or repeated unavailability, the order will be cancelled. A restocking fee may apply for perishable or made-to-order items.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Returns & Refunds</h3>
          <p>If you are not satisfied with your purchase, you may request a return within 7 days of delivery. Refunds for COD orders will be processed via bank transfer within 7–10 business days after the returned item is inspected.</p>
          <p>For any COD-related queries, contact us at <a href="mailto:support@shopease.com.np" className="text-amber-600 hover:underline">support@shopease.com.np</a> or call our helpline.</p>
        </PolicySection>

        <PolicySection id="seller" title="Seller Policy">
          <p>ShopEase Nepal empowers local merchants to reach customers nationwide. By registering as a seller on our platform, you agree to these operational guidelines.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Product Authenticity & Quality</h3>
          <p>Sellers are strictly prohibited from listing counterfeit, illegal, or hazardous items. You must guarantee the authenticity and quality of every product listed on your dashboard.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Platform Fees & Commissions</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>ShopEase Nepal charges a flat 8.2% commission on successful sales.</li>
            <li>Registration and product listing are entirely free.</li>
            <li>Logistics and shipping fees are calculated based on item weight and customer location, which may be subsidized by the platform during promotional periods.</li>
          </ul>
          <h3 className="font-semibold text-gray-900 pt-2">Order Fulfillment</h3>
          <p>Sellers are expected to pack and ready orders for dispatch within 48 hours of order placement. Habitual delays or high cancellation rates may lead to penalties or account suspension.</p>
          <h3 className="font-semibold text-gray-900 pt-2">Violations & Bans</h3>
          <p>Any breach of these policies—including selling fake goods or attempting to bypass the platform's payment systems—will result in an official violation. Repeated violations will result in an immediate, permanent ban.</p>
        </PolicySection>
      </div>
    </div>
  )
}

export default PolicyPage;
