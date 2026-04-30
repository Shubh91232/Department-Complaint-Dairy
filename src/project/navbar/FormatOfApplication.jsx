import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { FileText, Download } from 'lucide-react';

const FormatOfApplication = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center justify-between border-b-2 border-[#e65100] pb-2 mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-[#002b5e]" size={24} />
              <h1 className="text-2xl font-bold text-[#002b5e]">
                {lang === 'hi' ? 'आवेदन का प्रारूप' : 'Format of Application'}
              </h1>
            </div>
            <button className="bg-[#e65100] hover:bg-[#cc4800] text-white px-4 py-2 rounded-sm flex items-center gap-2 font-semibold transition-colors shadow-sm">
              <Download size={16} />
              {lang === 'hi' ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}
            </button>
          </div>
          
          <div className="border border-gray-300 p-8 max-w-3xl mx-auto bg-gray-50 shadow-inner">
            <h2 className="text-center font-bold text-lg mb-6 underline text-[#002b5e]">
              {lang === 'hi' ? 'शिकायत पंजीकरण प्रपत्र' : 'Grievance Registration Form'}
            </h2>
            
            <div className="space-y-4 text-gray-800 text-[14px]">
              <div className="grid grid-cols-3 border-b border-gray-300 pb-2">
                <span className="font-semibold col-span-1">1. {lang === 'hi' ? 'आवेदक का नाम' : 'Applicant Name'}</span>
                <span className="col-span-2 border-b border-dotted border-gray-400 block h-6"></span>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-300 pb-2">
                <span className="font-semibold col-span-1">2. {lang === 'hi' ? 'पिता/पति का नाम' : 'Father/Husband Name'}</span>
                <span className="col-span-2 border-b border-dotted border-gray-400 block h-6"></span>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-300 pb-2">
                <span className="font-semibold col-span-1">3. {lang === 'hi' ? 'पूरा पता' : 'Full Address'}</span>
                <span className="col-span-2 border-b border-dotted border-gray-400 block h-6"></span>
              </div>
              <div className="grid grid-cols-3 border-b border-gray-300 pb-2">
                <span className="font-semibold col-span-1">4. {lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</span>
                <span className="col-span-2 border-b border-dotted border-gray-400 block h-6"></span>
              </div>
              <div className="grid grid-cols-3 pb-2">
                <span className="font-semibold col-span-1">5. {lang === 'hi' ? 'शिकायत का विवरण' : 'Grievance Details'}</span>
              </div>
              <div className="w-full border border-gray-400 h-40 bg-white"></div>
              
              <div className="mt-8 flex justify-between items-end pt-8">
                <div>
                  <span className="block border-b border-dotted border-gray-400 w-32 h-4 mb-2"></span>
                  <span className="font-semibold">{lang === 'hi' ? 'दिनांक' : 'Date'}</span>
                </div>
                <div className="text-center">
                  <span className="block border-b border-dotted border-gray-400 w-48 h-4 mb-2"></span>
                  <span className="font-semibold">{lang === 'hi' ? 'आवेदक के हस्ताक्षर' : 'Signature of Applicant'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FormatOfApplication;
