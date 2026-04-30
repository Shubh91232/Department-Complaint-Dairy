import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Header = () => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  return (
    <>
      {/* Top Accessibility Bar (Classic Navy Blue) */}
      <div className="bg-[#002b5e] text-white px-6 py-1 flex justify-between items-center text-[11px] font-medium border-b-2 border-[#e65100]">
        <div className="flex gap-4">
          <a href="#" className="hover:text-yellow-300">Skip to Main Content</a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:text-yellow-300">Screen Reader Access</a>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex gap-1 items-center">
            <span className="mr-1">Text Size:</span>
            <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3]">A-</button>
            <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3]">A</button>
            <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3]">A+</button>
          </div>
          <div className="flex items-center gap-2">
            <span>{t.changeLang}:</span>
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white text-black text-[11px] px-1 py-0.5 rounded-sm outline-none border border-gray-300"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <div className="hidden md:flex items-center gap-2 border-l border-[#0059b3] pl-4 ml-1">
             <span className="text-gray-300">Visitor Count:</span>
             <span className="font-bold text-[#e65100] bg-white px-2 py-0.5 rounded shadow-inner tracking-wider">40,460,734</span>
          </div>
        </div>
      </div>

      {/* Main Header (White, Official Government Look) */}
      <div className="bg-white py-4 px-6 shadow-sm flex justify-between items-center relative z-10">
        <div className="flex items-center gap-5">
          {/* Emblem */}
          <div className="flex-shrink-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyameva Jayate" className="h-[75px]" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2 mb-1">
                <h1 className="text-xl font-bold text-[#e65100]">राजस्थान सरकार</h1>
                <span className="text-sm font-semibold text-[#002b5e]">Government of Rajasthan</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#002b5e] tracking-tight">{t.title}</h2>
            <p className="text-[13px] font-semibold text-gray-600 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* CM Photo Placeholder (Authentic gov site element) */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-20 bg-gray-200 border-2 border-[#e65100] shadow-sm overflow-hidden p-0.5">
              <img src="https://i.pravatar.cc/150?img=11" alt="Hon'ble CM" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-[#002b5e]">Hon'ble Chief Minister</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation (Saffron) */}
      <div className="bg-[#e65100] shadow-md border-y border-[#cc4800]">
        <div className="container mx-auto px-4 flex flex-wrap text-white text-[13px] font-semibold">
          {[
            {label: t.nav.home, path: '/'}, 
            {label: t.nav.act, path: '/act'}, 
            {label: t.nav.format, path: '/format'}, 
            {label: t.nav.faq, path: '/faq'}, 
            {label: t.nav.pub, path: '/publications'}, 
            {label: t.nav.feedback, path: '/feedback'}, 
            {label: t.nav.photo, path: '/photo-gallery'}, 
            {label: t.nav.video, path: '/video-gallery'}, 
            {label: t.nav.contact, path: '/contact-us'}
          ].map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`px-5 py-2.5 hover:bg-[#cc4800] border-r border-[#f26a1d] last:border-r-0 transition-colors ${isActive ? 'bg-[#002b5e] hover:bg-[#001f44]' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
