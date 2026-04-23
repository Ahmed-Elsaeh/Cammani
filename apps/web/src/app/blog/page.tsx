import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: "The Art of Curating a Unique Marketplace",
      excerpt: "Discover the secrets behind selecting products that stand out in a crowded digital world...",
      category: "Marketplace Tips",
      author: "Elena Rossi",
      date: "Oct 12, 2026",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
    },
    {
      title: "How to Build a Global Brand from Your Bedroom",
      excerpt: "Meet the makers who turned their local crafts into international success stories using Cammani.",
      category: "Success Stories",
      author: "Marcus Chen",
      date: "Oct 08, 2026",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
    },
    {
      title: "Upcoming Design Trends for 2027",
      excerpt: "From neo-brutalism to eco-minimalism, here's what to watch for in the coming year.",
      category: "Design",
      author: "Sarah Jenkins",
      date: "Oct 05, 2026",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Journal</span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Innovation</span> and Craft.</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Explore the latest insights from our community of creators, designers, and entrepreneurs.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <article key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                    <Tag size={12} className="text-blue-600" />
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="pt-6 border-t border-gray-50 mt-auto flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-sm">Read Article</span>
                  <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-6 mb-24">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay in the loop</h2>
            <p className="text-gray-400 mb-10 leading-relaxed text-lg">
              Get the best of Cammani delivered to your inbox every week. No spam, just inspiration.
            </p>
            <form className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-white"
              />
              <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
