import React from 'react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Returns & Refunds</h1>
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>We want you to be completely satisfied with your purchase. If you're not happy with an item, we're here to help.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">30-Day Return Window</h2>
          <p>You have 30 days from the date of delivery to return any item purchased on Cammani. Items must be in their original condition, unworn, and with all tags attached.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Exclusions</h2>
          <p>Certain items cannot be returned, including custom-made products, perishable goods, and digital downloads. Please check the seller's specific policy on the product page before purchasing.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Refund Process</h2>
          <p>Once we receive your return, we will inspect it and notify you of the status of your refund. If approved, the refund will be processed to your original payment method within 5-10 business days.</p>
        </div>
      </div>
    </div>
  );
}
