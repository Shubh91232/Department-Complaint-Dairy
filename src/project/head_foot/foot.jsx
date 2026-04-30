import React from 'react';
import { Download, MapPin, Phone, Mail, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  // Determine language easily without changing external state
  const isEn = t.changeLang === "Language";

  return (
    <div className="bg-[#001f44] text-white border-t-4 border-[#e65100] mt-auto w-full">
      {/* Top Banner inside Footer for Downloads */}
      <div className="bg-[#e65100] py-3 text-center shadow-inner">
        <a onClick={() => alert(t.download)} className="text-white hover:text-[#001f44] cursor-pointer font-bold text-[14px] flex items-center justify-center gap-2 transition-colors">
            <Download size={18} /> {t.download}
        </a>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 border-b border-blue-900 pb-8">
          {/* Column 1: About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-14 opacity-80" />
              <div>
                <h3 className="font-bold text-lg text-yellow-500 leading-tight">{isEn ? 'Government of Rajasthan' : 'राजस्थान सरकार'}</h3>
                <p className="text-[12px] text-blue-200 mt-1 leading-snug">{t.subtitle}</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-300 leading-relaxed mt-2 pr-4">
              {isEn ? 'This is the official Public Grievance Redressal Portal for the Rural Development and Panchayati Raj Department, aimed at ensuring timely resolution of citizen grievances.' : 'यह ग्रामीण विकास एवं पंचायती राज विभाग का आधिकारिक लोक शिकायत निवारण पोर्टल है, जिसका उद्देश्य नागरिक शिकायतों का समयबद्ध समाधान सुनिश्चित करना है।'}
            </p>
          </div>

          {/* Column 2: Important Links */}
          <div>
            <h3 className="text-[15px] font-bold border-b border-blue-800 pb-2 mb-4 text-white uppercase tracking-wider">{isEn ? 'Important Links' : 'महत्वपूर्ण लिंक'}</h3>
            <ul className="space-y-3 text-[13px] text-blue-200">
              <li className="hover:text-yellow-400 cursor-pointer flex items-center gap-2 transition-colors"><LinkIcon size={12} /> {isEn ? 'Rajasthan Sampark Portal' : 'राजस्थान संपर्क पोर्टल'}</li>
              <li className="hover:text-yellow-400 cursor-pointer flex items-center gap-2 transition-colors"><LinkIcon size={12} /> {isEn ? 'Chief Minister Office' : 'मुख्यमंत्री कार्यालय'}</li>
              <li className="hover:text-yellow-400 cursor-pointer flex items-center gap-2 transition-colors"><LinkIcon size={12} /> {isEn ? 'India.gov.in' : 'भारत सरकार (India.gov.in)'}</li>
              <li className="hover:text-yellow-400 cursor-pointer flex items-center gap-2 transition-colors"><LinkIcon size={12} /> {isEn ? 'Right to Information (RTI)' : 'सूचना का अधिकार (RTI)'}</li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-[15px] font-bold border-b border-blue-800 pb-2 mb-4 text-white uppercase tracking-wider">{isEn ? 'Contact Us' : 'संपर्क करें'}</h3>
            <ul className="space-y-3 text-[13px] text-blue-200">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{isEn ? 'Secretariat, Jaipur, Rajasthan - 302005' : 'सचिवालय, जयपुर, राजस्थान - 302005'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>1800-180-6127 (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="hover:underline cursor-pointer">contact.rdprd@rajasthan.gov.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Nodal Officer */}
          <div>
            <h3 className="text-[15px] font-bold border-b border-blue-800 pb-2 mb-4 text-white uppercase tracking-wider">{isEn ? 'Nodal Officer' : 'नोडल अधिकारी'}</h3>
            <div className="bg-[#002b5e] p-3 border border-blue-800 rounded-sm shadow-inner">
              <p className="font-bold text-[13px] text-yellow-400 mb-1">{isEn ? 'Sh. Rajendra Singh' : 'श्री राजेंद्र सिंह'}</p>
              <p className="text-[11px] text-gray-300 mb-2">{isEn ? 'Joint Secretary (Grievance)' : 'संयुक्त सचिव (शिकायत)'}</p>
              <p className="text-[11px] text-blue-200 flex items-center gap-1"><Phone size={10}/> 0141-2227324</p>
            </div>
            <div className="mt-4 text-[11px] text-gray-400">
              {isEn ? 'Last Updated: ' : 'अंतिम अद्यतन: '} <span className="text-white font-semibold">29-Apr-2026</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[12px] text-gray-400 gap-4">
          <div className="flex flex-col text-center md:text-left gap-1">
              <span className="text-white font-semibold">{t.rights}</span>
              <span>{t.designed}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-blue-300">
              <a href="#" className="hover:text-white transition-colors">{isEn ? 'Privacy Policy' : 'गोपनीयता नीति'}</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">{isEn ? 'Disclaimer' : 'अस्वीकरण'}</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">{isEn ? 'Terms of Use' : 'उपयोग की शर्तें'}</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">{isEn ? 'Sitemap' : 'साइटमैप'}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
