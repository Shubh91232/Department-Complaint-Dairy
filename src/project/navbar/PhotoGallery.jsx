import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Image as ImageIcon } from 'lucide-react';

const PhotoGallery = () => {
  const { lang, t } = useLanguage();

  const photos = [
    { url: '/assets/gallery/govt_inauguration.png', caption: lang === 'hi' ? 'सरकारी भवन का उद्घाटन' : 'Government Building Inauguration' },
    { url: '/assets/gallery/public_hearing.png', caption: lang === 'hi' ? 'जन सुनवाई सत्र' : 'Public Hearing Session' },
    { url: '/assets/gallery/dept_meeting.png', caption: lang === 'hi' ? 'विभागीय बैठक' : 'Departmental Meeting' },
    { url: '/assets/gallery/awareness_campaign.png', caption: lang === 'hi' ? 'जागरूकता अभियान' : 'Awareness Campaign' },
    { url: '/assets/gallery/office_infra.png', caption: lang === 'hi' ? 'कार्यालय का बुनियादी ढांचा' : 'Office Infrastructure' },
    { url: '/assets/gallery/panchayat_session.png', caption: lang === 'hi' ? 'पंचायत सत्र' : 'Panchayat Session' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <ImageIcon className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo, idx) => (
              <div key={idx} className="border border-gray-300 p-1.5 bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer rounded-sm">
                <div className="h-48 overflow-hidden relative border border-gray-200">
                  <img src={photo.url} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 bg-gray-50 text-center font-bold text-[#002b5e] border-t border-gray-200 mt-1.5 text-[14px]">
                  {photo.caption}
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

export default PhotoGallery;
