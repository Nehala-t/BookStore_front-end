import Link from "next/link";
import { 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Globe2, 
  Award 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Top Navbar Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-10 shadow-xs">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">SaaSBookstore</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/books" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Browse Catalog
          </Link>
          <Link 
            href="/books" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            Explore Books
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-16 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" /> Our Story & Vision
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Connecting Readers with Stories That Matter
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            We believe that every book is a portal to a new world. Our mission is to curate an exceptional collection of literature, empowering readers, students, and lifelong learners across the globe.
          </p>
        </div>

        {/* Image / Banner Showcase */}
        <div className="w-full h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-md border border-slate-200 relative bg-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1400" 
            alt="Library bookshelf" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-8">
            <p className="text-white text-lg font-medium max-w-xl">
              "A room without books is like a body without a soul." — Marcus Tullius Cicero
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <p className="text-3xl font-extrabold text-indigo-600">10k+</p>
            <p className="text-sm font-medium text-slate-500">Active Readers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <p className="text-3xl font-extrabold text-indigo-600">5,500+</p>
            <p className="text-sm font-medium text-slate-500">Books Available</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <p className="text-3xl font-extrabold text-indigo-600">120+</p>
            <p className="text-sm font-medium text-slate-500">Partner Publishers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <p className="text-3xl font-extrabold text-indigo-600">99.8%</p>
            <p className="text-sm font-medium text-slate-500">Satisfaction Rate</p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Choose Us?</h2>
            <p className="text-sm text-slate-500">We go beyond traditional bookstores to deliver a seamless reading experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Curated Collection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every title in our inventory is hand-picked by literary experts across technology, fiction, science, and business.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Trusted Quality</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We partner directly with authorized publishers and independent authors to guarantee authentic, high-quality editions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Community First</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our platform is built for readers. Enjoy personalized recommendations, user reviews, and effortless order tracking.
              </p>
            </div>

          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-indigo-600 text-white rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Ready to find your next great read?</h2>
            <p className="text-indigo-100 text-sm lg:text-base">Browse through thousands of bestsellers, textbooks, and novels today.</p>
          </div>
          <Link 
            href="/books"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} SaaSBookstore. All rights reserved.</p>
      </footer>

    </div>
  );
}