import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This may include your name, email address, and payment information.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">How We Use Your Data</h2>
          <p>We use your information to process transactions, provide customer support, and send you updates about your orders and our services.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted and stored securely.</p>
        </div>
      </div>
    </div>
  );
}
