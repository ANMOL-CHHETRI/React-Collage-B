import { useState } from "react";
import { NavLink } from "react-router-dom";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse products, add your desired items to the cart, then proceed to checkout and complete your payment.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We currently support Cash on Delivery (COD), eSewa, Khalti, and bank transfer.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery within Kathmandu Valley usually takes 1–2 business days. Outside the valley, delivery takes 3–7 business days.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes. Products can be returned within 7 days if they arrive damaged or incorrect.",
  },
  {
    question: "Do you deliver all over Nepal?",
    answer:
      "Yes! We deliver to most cities and districts across Nepal.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us through our Contact page or email us at support@shopeasenepal.com.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Everything you need to know about shopping with ShopEase Nepal.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">

        <div className="space-y-5">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {faq.question}
                </h2>

                <span className="text-2xl text-orange-500 font-bold">
                  {open === index ? "−" : "+"}
                </span>
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-7">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Contact Card */}

        <div className="mt-20 bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 text-center border border-slate-100 dark:border-slate-800">

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Still have questions?
          </h2>

          <p className="mt-3 text-slate-500">
            Our support team is always ready to help you.
          </p>

          <NavLink
            to="/contact"
            className="inline-block mt-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Contact Support
          </NavLink>

        </div>

      </section>
    </div>
  );
}