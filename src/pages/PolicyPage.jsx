const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Policies</h1>

        <section id="privacy" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
            <p>At ShopEase Nepal, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            <h3 className="font-semibold text-gray-900">Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, email address, phone number, and delivery address</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely through third-party gateways)</li>
              <li>Device and browsing data for analytics</li>
            </ul>
            <h3 className="font-semibold text-gray-900">How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and deliver your orders</li>
              <li>To provide customer support</li>
              <li>To improve our products and services</li>
              <li>To send order updates and promotional offers (with consent)</li>
            </ul>
            <h3 className="font-semibold text-gray-900">Data Security</h3>
            <p>We implement industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your explicit consent, except as required by law.</p>
            <p>You have the right to access, update, or delete your personal data at any time by contacting us at <a href="mailto:support@shopease.com.np" className="text-amber-600 hover:underline">support@shopease.com.np</a>.</p>
          </div>
        </section>

        <section id="terms" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Use</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
            <p>By using ShopEase Nepal, you agree to the following terms and conditions.</p>
            <h3 className="font-semibold text-gray-900">Account Registration</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility.</p>
            <h3 className="font-semibold text-gray-900">Product Listings</h3>
            <p>We strive to display accurate product descriptions, prices, and availability. However, we reserve the right to correct any errors and update information without prior notice.</p>
            <h3 className="font-semibold text-gray-900">Order Acceptance</h3>
            <p>We reserve the right to refuse or cancel any order for reasons including but not limited to: product unavailability, pricing errors, or suspected fraudulent activity.</p>
            <h3 className="font-semibold text-gray-900">Limitation of Liability</h3>
            <p>ShopEase Nepal shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
          </div>
        </section>

        <section id="cod" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cash on Delivery (COD) Policy</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
            <p>We offer Cash on Delivery across all 7 provinces of Nepal to make your shopping convenient and secure.</p>
            <h3 className="font-semibold text-gray-900">Coverage Areas</h3>
            <p>COD is available in all major cities and towns across Nepal. Remote rural areas may have limited availability — please check your delivery address during checkout.</p>
            <h3 className="font-semibold text-gray-900">Payment Upon Delivery</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pay in cash at the time of delivery</li>
              <li>Please have the exact amount ready; our delivery partners may not always carry change</li>
              <li>A small COD convenience fee may apply (displayed at checkout)</li>
            </ul>
            <h3 className="font-semibold text-gray-900">Failed Delivery Attempts</h3>
            <p>If delivery cannot be completed due to an incorrect address or repeated unavailability, the order will be cancelled. A restocking fee may apply for perishable or made-to-order items.</p>
            <h3 className="font-semibold text-gray-900">Returns & Refunds</h3>
            <p>If you are not satisfied with your purchase, you may request a return within 7 days of delivery. Refunds for COD orders will be processed via bank transfer within 7–10 business days after the returned item is inspected.</p>
            <p>For any COD-related queries, contact us at <a href="mailto:support@shopease.com.np" className="text-amber-600 hover:underline">support@shopease.com.np</a> or call our helpline.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PolicyPage
