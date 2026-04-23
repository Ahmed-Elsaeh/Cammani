import React from 'react';
import { Search, MessageCircle, HelpCircle, Package, CreditCard, ShieldCheck } from 'lucide-react';

export default function HelpPage() {
  const categories = [
    { icon: Package, title: "Orders & Shipping", count: "24 articles" },
    { icon: CreditCard, title: "Payments & Refunds", count: "18 articles" },
    { icon: ShieldCheck, title: "Trust & Safety", count: "12 articles" },
    { icon: HelpCircle, title: "Account & Login", count: "15 articles" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <div className="bg-blue-600 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-8">How can we help you?</h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles (e.g. tracking my order)"
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 text-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-transform cursor-pointer border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <cat.icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{cat.title}</h3>
              <p className="text-sm text-gray-500">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-gray-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "How do I track my order?", a: "Once your order is shipped, you will receive an email with a tracking link. You can also view it in your dashboard." },
              { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee for most items. Some handmade products may have different policies." },
              { q: "How do I become a seller?", a: "Click on 'Become a Seller' in the footer and follow the application process. We'd love to have you!" }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">{faq.q}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Footer */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <MessageCircle size={40} className="mx-auto mb-6 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-400 mb-8">Our support team is available 24/7 to assist you with any questions.</p>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
