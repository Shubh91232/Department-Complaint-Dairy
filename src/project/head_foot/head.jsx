import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { Bell, Menu, X, ChevronDown, User, Globe, Type } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopBarOpen, setIsTopBarOpen] = useState(false);

  return (
    <>
      {/* Top Accessibility Bar (Classic Navy Blue) */}
      <div className="bg-[#002b5e] text-white px-4 md:px-6 py-1 relative z-50 border-b-2 border-[#e65100]">
        <div className="container mx-auto flex justify-between items-center text-[10px] md:text-[11px] font-medium min-h-[30px]">
          {/* Mobile Toggle for accessibility bar */}
          <button 
            onClick={() => setIsTopBarOpen(!isTopBarOpen)}
            className="md:hidden flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Globe size={12} /> {t.changeLang} / Accessibility <ChevronDown size={12} className={`transform transition-transform ${isTopBarOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${isTopBarOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-full left-0 w-full md:w-auto bg-[#002b5e] flex-col md:flex-row gap-2 md:gap-4 p-3 md:p-0 shadow-lg md:shadow-none border-t md:border-t-0 border-[#0059b3]`}>
            <a href="#" className="hover:text-yellow-300 px-2 py-1 md:p-0">Skip to Main Content</a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a href="#" className="hover:text-yellow-300 px-2 py-1 md:p-0">Screen Reader Access</a>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex gap-1 items-center">
              <Type size={12} className="mr-1 text-blue-200" />
              <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3] active:bg-[#002b5e]">A-</button>
              <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3] active:bg-[#002b5e]">A</button>
              <button className="bg-[#004080] border border-[#0059b3] px-1.5 hover:bg-[#0059b3] active:bg-[#002b5e]">A+</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden xs:inline">{t.changeLang}:</span>
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white text-black text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-sm outline-none border border-gray-300 font-bold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            <div className="hidden xl:flex items-center gap-2 border-l border-[#0059b3] pl-4 ml-1">
               <span className="text-gray-300">Visitors:</span>
               <span className="font-bold text-[#e65100] bg-white px-2 py-0.5 rounded shadow-inner tracking-wider">40,460,734</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header (White, Official Government Look) */}
      <div className="bg-white py-4 px-4 md:px-6 shadow-sm relative z-30">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 md:gap-5">
            {/* Emblem */}
            <div className="flex-shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyameva Jayate" className="h-[50px] sm:h-[65px] md:h-[75px]" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2 mb-0.5 sm:mb-1">
                  <h1 className="text-sm md:text-lg lg:text-xl font-bold text-[#e65100] leading-tight">राजस्थान सरकार</h1>
                  <span className="text-[10px] md:text-xs lg:text-sm font-semibold text-[#002b5e] opacity-80">Government of Rajasthan</span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#002b5e] tracking-tight leading-none mb-1">{t.title}</h2>
              <p className="hidden xs:block text-[10px] md:text-[12px] lg:text-[13px] font-semibold text-gray-500 leading-tight">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center shrink-0">
            {/* CM Photo Placeholder */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="w-12 h-14 md:w-16 md:h-20 bg-gray-50 border border-[#e65100] shadow-sm overflow-hidden p-0.5">
                <img src="https://i.pravatar.cc/150?img=11" alt="Hon'ble CM" className="w-full h-full object-cover" />
              </div>
              <span className="text-[8px] md:text-[10px] font-bold mt-1 text-[#002b5e] text-center leading-none">Hon'ble CM</span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-[#002b5e] hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation (Saffron) */}
      <div className={`bg-[#e65100] shadow-md border-y border-[#cc4800] relative z-20 transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] overflow-y-auto' : 'max-h-0 xl:max-h-none overflow-hidden xl:overflow-visible'}`}>
        <div className="container mx-auto px-0 xl:px-4 flex flex-col xl:flex-row text-white text-[13px] font-bold">
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
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-3 xl:px-5 xl:py-2.5 hover:bg-[#cc4800] border-b xl:border-b-0 xl:border-r border-white/20 xl:border-[#f26a1d] last:border-0 transition-all duration-200 flex items-center justify-between xl:justify-start ${isActive ? 'bg-[#002b5e] hover:bg-[#001f44]' : ''}`}
              >
                <span>{item.label}</span>
                <Menu size={14} className="xl:hidden opacity-30" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
