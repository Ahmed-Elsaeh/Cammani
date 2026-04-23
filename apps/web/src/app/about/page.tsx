import React from 'react';
import { Shield, Users, Target, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 mix-blend-multiply" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Redefining <span className="text-blue-400 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Marketplaces</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Cammani is a global community where creativity meets commerce. We provide a platform for unique sellers to reach passionate buyers.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We started Cammani with a simple idea: to empower independent sellers and provide buyers with access to extraordinary products that can't be found anywhere else. 
            </p>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Trust & Safety", desc: "Every transaction is protected by our secure systems." },
                { icon: Users, title: "Community First", desc: "We build tools that foster direct connections between people." },
                { icon: Target, title: "Precision Craft", desc: "We celebrate quality and the stories behind every item." },
                { icon: Globe, title: "Global Reach", desc: "Connecting local talent with a worldwide audience." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
              alt="Team collaborating"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
