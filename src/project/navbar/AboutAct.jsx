import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { BookOpen } from 'lucide-react';

const AboutAct = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <BookOpen className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'अधिनियम के बारे में' : 'About the Act'}
            </h1>
          </div>
          
          <div className="space-y-6 text-[14px] leading-relaxed text-gray-700">
            <p>
              {lang === 'hi' 
                ? 'राजस्थान लोक सेवाओं के प्रदान की गारंटी और जवाबदेही अधिनियम का उद्देश्य राज्य के नागरिकों को समयबद्ध तरीके से सार्वजनिक सेवाएं प्रदान करना है।' 
                : 'The Rajasthan Guaranteed Delivery of Public Services and Accountability Act aims to provide public services to the citizens of the state in a time-bound manner.'}
            </p>
            
            <h3 className="text-lg font-bold text-[#002b5e]">
              {lang === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>{lang === 'hi' ? 'सेवाओं का समयबद्ध वितरण' : 'Time-bound delivery of services'}</li>
              <li>{lang === 'hi' ? 'अपीलीय अधिकारियों का प्रावधान' : 'Provision of Appellate Authorities'}</li>
              <li>{lang === 'hi' ? 'विलंब के लिए जुर्माना' : 'Penalty for delay'}</li>
              <li>{lang === 'hi' ? 'पारदर्शिता और जवाबदेही' : 'Transparency and accountability'}</li>
            </ul>

            <div className="bg-blue-50 p-4 border-l-4 border-[#002b5e]">
              <p className="font-semibold">
                {lang === 'hi' ? 'नोट:' : 'Note:'}
              </p>
              <p>
                {lang === 'hi' 
                  ? 'अधिनियम का पूरा पाठ राज्य सरकार के राजपत्र में देखा जा सकता है।' 
                  : 'The full text of the act can be viewed in the State Government Gazette.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutAct;
