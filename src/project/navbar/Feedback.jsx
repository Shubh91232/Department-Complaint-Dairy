import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
  const { lang, t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(lang === 'hi' ? 'आपका सुझाव सफलतापूर्वक सबमिट कर दिया गया है। धन्यवाद!' : 'Your feedback has been submitted successfully. Thank you!');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <MessageSquare className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'सुझाव एवं प्रतिक्रिया' : 'Feedback & Suggestions'}
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  {lang === 'hi' ? 'नाम *' : 'Name *'}
                </label>
                <input required type="text" className="w-full border border-gray-300 p-2.5 focus:border-[#e65100] outline-none shadow-inner" placeholder={lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'} />
              </div>
              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                <input required type="tel" className="w-full border border-gray-300 p-2.5 focus:border-[#e65100] outline-none shadow-inner" placeholder={lang === 'hi' ? '10 अंकों का नंबर' : '10-digit number'} />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-800 font-bold mb-2">
                {lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
              </label>
              <input type="email" className="w-full border border-gray-300 p-2.5 focus:border-[#e65100] outline-none shadow-inner" placeholder="example@email.com" />
            </div>

            <div>
              <label className="block text-gray-800 font-bold mb-2">
                {lang === 'hi' ? 'आपका सुझाव / प्रतिक्रिया *' : 'Your Feedback / Suggestion *'}
              </label>
              <textarea required rows="5" className="w-full border border-gray-300 p-2.5 focus:border-[#e65100] outline-none shadow-inner resize-y" placeholder={lang === 'hi' ? 'यहां लिखें...' : 'Write here...'}></textarea>
            </div>

            <div className="pt-2">
                <button type="submit" className="bg-[#002b5e] hover:bg-[#001f44] text-white px-8 py-3 font-bold rounded-sm flex items-center gap-2 shadow-md transition-colors">
                <Send size={18} />
                {lang === 'hi' ? 'जमा करें' : 'Submit Feedback'}
                </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Feedback;
