import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  const { lang, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: lang === 'hi' ? 'मैं अपनी शिकायत कैसे दर्ज कर सकता हूँ?' : 'How can I register my grievance?',
      a: lang === 'hi' ? 'आप होम पेज पर "नागरिक सेवाएं" अनुभाग के माध्यम से ऑनलाइन शिकायत दर्ज कर सकते हैं।' : 'You can register your grievance online through the "Citizen Services" section on the Home page.'
    },
    {
      q: lang === 'hi' ? 'क्या शिकायत दर्ज करने के लिए कोई शुल्क है?' : 'Is there any fee for registering a grievance?',
      a: lang === 'hi' ? 'नहीं, पोर्टल पर शिकायत दर्ज करना पूरी तरह से निःशुल्क है।' : 'No, registering a grievance on the portal is completely free of charge.'
    },
    {
      q: lang === 'hi' ? 'मैं अपनी शिकायत की स्थिति कैसे जांच सकता हूँ?' : 'How can I check the status of my grievance?',
      a: lang === 'hi' ? 'आप होम पेज पर दिए गए "स्थिति जांचें" फॉर्म में अपना शिकायत नंबर डालकर स्थिति देख सकते हैं।' : 'You can check the status by entering your Grievance ID or Mobile Number in the "Track Status" form on the Home page.'
    },
    {
      q: lang === 'hi' ? 'अगर मेरी शिकायत का समाधान नहीं होता है तो मैं क्या कर सकता हूँ?' : 'What can I do if my grievance is not resolved?',
      a: lang === 'hi' ? 'आप निर्धारित समय सीमा समाप्त होने के बाद "प्रथम/द्वितीय अपील" विकल्प के माध्यम से अपील दायर कर सकते हैं।' : 'You can file an appeal through the "First/Second Appeal" option after the stipulated time limit has expired.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <HelpCircle className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'सामान्य प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </h1>
          </div>
          
          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-bold text-[#002b5e] text-left transition-colors"
                >
                  <span className="text-[14px]">{faq.q}</span>
                  {openIdx === idx ? <ChevronUp size={20} className="text-[#e65100]" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {openIdx === idx && (
                  <div className="p-4 bg-white border-t border-gray-200 text-gray-700 text-[14px] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;
