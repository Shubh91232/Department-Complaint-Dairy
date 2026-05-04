import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Newspaper, Home, ChevronRight, ExternalLink, Calendar, Tag } from 'lucide-react';

const clippings = [
  {
    id: 1,
    headline: 'Rajasthan Govt Launches Raj NyaySetu Portal for Faster Grievance Redressal',
    source: 'Rajasthan Patrika',
    date: '2024-05-01',
    category: 'Launch',
    summary: 'The Rural Development and Panchayati Raj Department launched the Raj NyaySetu portal, aiming to resolve public grievances within 30 days. The portal provides a transparent tracking mechanism.',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 2,
    headline: '97% Grievance Disposal Rate Achieved by Rajasthan Panchayati Raj Dept in FY 2023-24',
    source: 'Dainik Bhaskar',
    date: '2024-04-18',
    category: 'Achievement',
    summary: 'In a landmark achievement, the department resolved over 2.38 million grievances out of 2.45 million received, maintaining a 97% disposal rate — highest in the state\'s history.',
    img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 3,
    headline: 'Digital Grievance System to be Extended to All Districts by June 2024',
    source: 'The Hindu',
    date: '2024-03-30',
    category: 'Policy',
    summary: 'State government announced the expansion of the digital grievance portal to all 50 districts of Rajasthan. District-level Grievance Redressal Officers will be trained using the new user manual.',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 4,
    headline: 'Raj NyaySetu Wins National e-Governance Award 2024 in the Grievance Category',
    source: 'Times of India',
    date: '2024-03-12',
    category: 'Award',
    summary: 'The Ministry of Electronics & IT recognized Raj NyaySetu with the National e-Governance Award for its innovative approach to digital grievance management and citizen-centric design.',
    img: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 5,
    headline: 'MNREGA Grievances Now Routed Through Unified Raj NyaySetu Platform',
    source: 'Indian Express',
    date: '2024-02-25',
    category: 'Integration',
    summary: 'Following a new circular, all MNREGA-related complaints including wage payment delays and job card issues will now be filed and tracked exclusively through the Raj NyaySetu portal.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 6,
    headline: 'Panchayati Raj Department Resolves 12,201 PHED Grievances in Record Time',
    source: 'Navbharat Times',
    date: '2024-01-20',
    category: 'Achievement',
    summary: 'Public Health Engineering Department successfully resolved over 12,201 water-related grievances in Q3 FY 2023-24, achieving a 98% resolution rate through targeted grievance camps.',
    img: 'https://images.unsplash.com/photo-1482731215275-a1f151646268?auto=format&fit=crop&w=400&q=60'
  },
];

const categoryColors = {
  'Launch': 'bg-blue-50 text-blue-700 border-blue-200',
  'Achievement': 'bg-green-50 text-green-700 border-green-200',
  'Policy': 'bg-purple-50 text-purple-700 border-purple-200',
  'Award': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Integration': 'bg-teal-50 text-teal-700 border-teal-200',
};

const NewsClippings = () => {
  const { lang } = useLanguage();
  const [catFilter, setCatFilter] = useState('All');
  const [featured, setFeatured] = useState(clippings[0]);

  const categories = ['All', ...new Set(clippings.map(c => c.category))];
  const filtered = clippings.filter(c => catFilter === 'All' || c.category === catFilter);

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">News Clippings</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
              <Newspaper size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                {lang === 'hi' ? 'समाचार क्लिपिंग' : 'News Clippings'}
              </h1>
              <p className="text-blue-200 text-[13px]">Media Coverage of Raj NyaySetu & Rural Development Activities</p>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        <div className="bg-white border border-gray-200 shadow-md rounded-sm mb-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 h-48 md:h-auto overflow-hidden">
              <img src={featured.img} alt={featured.headline} className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#e65100] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Featured</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[featured.category]}`}>{featured.category}</span>
                </div>
                <h2 className="text-xl font-bold text-[#002b5e] leading-snug mb-3">{featured.headline}</h2>
                <p className="text-gray-600 text-[13px] leading-relaxed">{featured.summary}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold">
                  <span className="flex items-center gap-1"><Newspaper size={12} /> {featured.source}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {featured.date}</span>
                </div>
                <button className="text-[#002b5e] font-bold text-[12px] flex items-center gap-1 hover:underline">
                  Read Full Article <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${catFilter === c ? 'bg-[#002b5e] text-white border-[#002b5e]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#002b5e] hover:text-[#002b5e]'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setFeatured(item)}
              className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden hover:shadow-md hover:border-[#002b5e] transition-all cursor-pointer group"
            >
              <div className="h-40 overflow-hidden">
                <img src={item.img} alt={item.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                </div>
                <h3 className="font-bold text-[#002b5e] text-[13px] leading-snug mb-2 group-hover:text-[#e65100] transition-colors line-clamp-2">{item.headline}</h3>
                <p className="text-gray-500 text-[11px] leading-snug line-clamp-2 mb-3">{item.summary}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-t border-gray-100 pt-2">
                  <span className="flex items-center gap-1"><Newspaper size={11} />{item.source}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default NewsClippings;
