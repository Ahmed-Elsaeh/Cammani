import React from 'react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">What are Cookies?</h2>
          <p>Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember information about your visit.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">How We Use Cookies</h2>
          <p>We use essential cookies to make our site work (e.g., for logging in). We also use analytical cookies to understand how people use our site and to improve it.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Managing Your Preferences</h2>
          <p>You can choose to disable cookies through your individual browser options. However, this may affect your ability to use certain features of our site.</p>
        </div>
      </div>
    </div>
  );
}
