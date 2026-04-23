import React from 'react';
import { Percent, Award, TrendingUp, Handshake } from 'lucide-react';

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Partner with <span className="text-blue-400">Cammani</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our affiliate program and earn up to <span className="text-white font-bold">15% commission</span> on every sale you refer. Share the craft, earn the rewards.
          </p>
          <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20">
            Apply to Program
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-600">Three simple steps to start earning with us.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: Handshake, title: "1. Join", desc: "Apply for our program and get access to your personal affiliate dashboard." },
            { icon: TrendingUp, title: "2. Promote", desc: "Share your unique links on your blog, social media, or with friends." },
            { icon: Award, title: "3. Earn", desc: "Get paid monthly for every successful purchase made through your link." }
          ].map((step, i) => (
            <div key={i} className="text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-12">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Why choose our program?</h2>
                <div className="space-y-6">
                  {[
                    "Industry-leading commission rates",
                    "30-day tracking cookie",
                    "Dedicated affiliate support team",
                    "High-quality marketing materials",
                    "Real-time tracking and reporting"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Percent size={12} strokeWidth={3} />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-600 rounded-3xl p-10 text-white text-center">
                <TrendingUp size={48} className="mx-auto mb-6 opacity-50" />
                <p className="text-5xl font-bold mb-2">15%</p>
                <p className="text-blue-200 uppercase tracking-widest font-semibold text-sm">Base Commission</p>
                <div className="mt-8 pt-8 border-t border-blue-500/50">
                  <p className="text-sm opacity-80">Plus bonuses for high-performing partners!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
