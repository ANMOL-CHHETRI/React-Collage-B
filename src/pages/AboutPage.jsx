import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const features = [
  {
    title: "Authentic Goods",
    description:
      "Sourced directly from local cooperatives and rural artisans.",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
  {
    title: "Fast Nepal Delivery",
    description:
      "Free shipping across Nepal on orders over Rs. 2,000.",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Cash on Delivery",
    description:
      "Pay safely in cash once the courier brings the product to your door.",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          About ShopEase Nepal
        </span>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connecting Nepal Through Local Commerce
        </h1>

        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-8">
          ShopEase Nepal is an online marketplace that connects customers with
          authentic Nepali products. From traditional clothing and handmade
          crafts to fresh organic products, we empower local businesses while
          providing customers with a trusted shopping experience.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-orange-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Our Mission
            </h2>

            <p className="text-gray-600 leading-7">
              Our mission is to empower local farmers, artisans, and small
              businesses by providing an easy-to-use online marketplace where
              they can reach customers across Nepal.
            </p>
          </div>

          <div className="bg-orange-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Our Vision
            </h2>

            <p className="text-gray-600 leading-7">
              We envision a future where every local producer has equal
              opportunities to grow digitally while preserving Nepal's rich
              culture and traditions.
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose ShopEase Nepal?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <h2 className="text-4xl font-bold text-amber-600">500+</h2>
              <p className="mt-2 text-gray-600">Products</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-amber-600">100+</h2>
              <p className="mt-2 text-gray-600">Local Sellers</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-amber-600">77</h2>
              <p className="mt-2 text-gray-600">District Delivery</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-amber-600">24/7</h2>
              <p className="mt-2 text-gray-600">Customer Support</p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto text-center py-20 px-6">

        <h2 className="text-4xl font-bold mb-4">
          Support Local. Shop Smart.
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Every purchase helps local farmers, artisans, and small businesses
          grow while bringing authentic Nepali products to your doorstep.
        </p>

        <button onClick={() => navigate("/user-login")} className="bg-linear-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-700 transition">
          Start Shopping
        </button>

      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;