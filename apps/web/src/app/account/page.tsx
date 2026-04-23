import React from 'react';
import { User, Package, Settings, Heart, LogOut, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const menuItems = [
    { icon: Package, title: "My Orders", desc: "View your order history and tracking" },
    { icon: Heart, title: "Saved Items", desc: "Items you've added to your wishlist" },
    { icon: Settings, title: "Settings", desc: "Manage your profile and security" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            JD
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
            <p className="text-gray-500">john.doe@example.com</p>
          </div>
          <button className="ml-auto px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4">
          {menuItems.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer flex items-center gap-6 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <item.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
          ))}
          
          <button className="mt-4 flex items-center justify-center gap-2 w-full p-6 text-red-600 font-bold bg-white rounded-2xl border border-red-50 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
