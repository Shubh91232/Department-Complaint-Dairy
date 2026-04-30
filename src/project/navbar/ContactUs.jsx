import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { PhoneCall, MapPin, Mail, Clock } from 'lucide-react';

const ContactUs = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <PhoneCall className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#e65100] border-b border-gray-200 pb-2">
                {lang === 'hi' ? 'कार्यालय का पता' : 'Office Address'}
              </h2>
              
              <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                <MapPin className="text-[#002b5e] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-[#002b5e] text-[15px]">{lang === 'hi' ? 'ग्रामीण विकास एवं पंचायती राज विभाग' : 'Rural Development and Panchayati Raj Department'}</h3>
                  <p className="text-gray-700 mt-1.5 leading-relaxed text-[14px]">
                    {lang === 'hi' ? 'सचिवालय, जयपुर,' : 'Secretariat, Jaipur,'}<br />
                    {lang === 'hi' ? 'राजस्थान - 302005' : 'Rajasthan - 302005'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                <PhoneCall className="text-[#002b5e] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-[#002b5e] text-[15px]">{lang === 'hi' ? 'हेल्पलाइन नंबर' : 'Helpline Number'}</h3>
                  <p className="text-gray-700 mt-1.5 text-[14px] font-bold">1800-180-6127 <span className="font-normal text-gray-500">(Toll Free)</span></p>
                  <p className="text-gray-700 text-[14px]">0141-2227324</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                <Mail className="text-[#002b5e] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-[#002b5e] text-[15px]">{lang === 'hi' ? 'ईमेल' : 'Email'}</h3>
                  <p className="text-blue-600 hover:underline cursor-pointer mt-1.5 text-[14px]">contact.rdprd@rajasthan.gov.in</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                <Clock className="text-[#002b5e] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-[#002b5e] text-[15px]">{lang === 'hi' ? 'कार्य समय' : 'Working Hours'}</h3>
                  <p className="text-gray-700 mt-1.5 text-[14px]">{lang === 'hi' ? 'सोमवार - शुक्रवार: सुबह 9:30 - शाम 6:00' : 'Monday - Friday: 9:30 AM - 6:00 PM'}</p>
                </div>
              </div>
            </div>

            <div className="h-full min-h-[400px] bg-gray-200 border border-gray-300 relative flex items-center justify-center overflow-hidden rounded-sm shadow-inner">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop" alt="Map Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px]" />
                <div className="absolute bg-white p-4 font-bold text-[#002b5e] border-2 border-[#e65100] shadow-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <MapPin size={20} className="text-[#e65100]" /> {lang === 'hi' ? 'मानचित्र स्थान (Google Maps)' : 'Map Location (Google Maps)'}
                </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
