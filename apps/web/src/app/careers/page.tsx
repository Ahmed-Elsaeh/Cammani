import React from 'react';
import { Briefcase, Heart, Sparkles, Zap } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: "Senior Frontend Engineer", team: "Engineering", type: "Full-time", location: "Remote" },
    { title: "Product Designer", team: "Design", type: "Full-time", location: "London / Remote" },
    { title: "Customer Success Lead", team: "Support", type: "Full-time", location: "New York" },
    { title: "Community Manager", team: "Marketing", type: "Part-time", location: "Remote" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-8">
            <Sparkles size={16} />
            <span>We're growing fast!</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Join the <span className="text-blue-600">Future</span> of Commerce</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Help us build a more human way to buy and sell. At Cammani, we're looking for passionate individuals who care about craft, community, and code.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              View Openings
            </button>
            <button className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Our Values
            </button>
          </div>
        </div>
      </div>

      {/* Perks Section */}
      <div className="py-24 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Why Work at Cammani?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Wellness First", desc: "Full health coverage, mental health support, and flexible time off." },
            { icon: Zap, title: "Fast Growth", desc: "A high-impact environment where your work directly shapes the company." },
            { icon: Briefcase, title: "Remote Friendly", desc: "Work from anywhere in the world with a generous home office budget." }
          ].map((perk, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
                <perk.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{perk.title}</h3>
              <p className="text-gray-600 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Open Roles</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.team}</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{job.type}</span>
                  <button className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">Apply Now &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
