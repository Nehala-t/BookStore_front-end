'use client';

import React, { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    queryType: 'General Inquiry',
    orderNumber: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        queryType: 'General Inquiry',
        orderNumber: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-amber-800 font-medium tracking-wide uppercase text-xs sm:text-sm">
            We'd Love to Help
          </span>
          <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-stone-900 sm:text-5xl">
            Get in Touch with Our Booksellers
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            Have questions about an order, seeking book recommendations, or looking for bulk ordering? Reach out to us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookstore Info Sidebar */}
          <div className="lg:col-span-1 bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-amber-200 mb-4">
                Visit Our Store
              </h2>
              <p className="text-stone-300 text-sm mb-6 leading-relaxed">
                Step inside for cozy reading corners, freshly brewed coffee, and curated collections.
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    123 Bookworm Lane, Cultural Quarter
                    <br />
                    Kozhikode, Kerala, 673001
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 98765 43210</span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@thebookstore.com</span>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <h3 className="text-amber-300 font-medium mb-2 text-xs uppercase tracking-wider">
                    Store Hours
                  </h3>
                  <p className="text-xs text-stone-300">Mon – Sat: 9:30 AM – 8:30 PM</p>
                  <p className="text-xs text-stone-300">Sunday: 10:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800 text-xs text-stone-400">
              © {new Date().getFullYear()} The Chapter House. All rights reserved.
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mb-4 border border-amber-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-stone-900">Message Received!</h3>
                <p className="text-stone-600 mt-2 text-sm max-w-md">
                  Thank you for reaching out to us. Our team will review your message and reply back within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-800"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ananya Sharma"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ananya@example.com"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="queryType" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Reason for Contact
                    </label>
                    <select
                      name="queryType"
                      id="queryType"
                      value={formData.queryType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Book Recommendation">Book Recommendation</option>
                      <option value="Bulk Order">Bulk / Institutional Order</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Order ID <span className="text-stone-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g. BK-98231"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the book title you're looking for or how we can assist you..."
                    className="w-full rounded-lg border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending Request...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}