import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>By using the Cammani marketplace, you agree to comply with and be bound by the following terms and conditions of use.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Seller Obligations</h2>
          <p>Sellers are responsible for the accuracy of their product listings and for fulfilling orders in a timely manner. All items sold must comply with local laws and regulations.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Termination</h2>
          <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including breach of terms.</p>
        </div>
      </div>
    </div>
  );
}
