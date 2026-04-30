import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Video, PlayCircle } from 'lucide-react';

const VideoGallery = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <Video className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'वीडियो गैलरी' : 'Video Gallery'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border border-gray-300 p-1.5 bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer rounded-sm">
                <div className="h-48 bg-gray-900 relative flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + item * 200000}?w=400&auto=format&fit=crop`} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                  <PlayCircle size={56} className="text-white relative z-10 group-hover:text-[#e65100] transition-colors drop-shadow-lg" />
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 font-bold text-[#002b5e] mt-1.5 text-[14px]">
                  {lang === 'hi' ? 'विभागीय दिशानिर्देश वीडियो भाग - ' + item : 'Departmental Guidelines Video Part - ' + item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoGallery;
