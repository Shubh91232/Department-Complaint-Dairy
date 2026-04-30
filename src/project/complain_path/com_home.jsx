import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { RefreshCw, Smartphone, Edit2, FileText, Check } from 'lucide-react';

const ComplainHome = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [captcha, setCaptcha] = useState('bLH8ot');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleGenerateOTP = () => {
    if (!mobile || !captchaInput) {
      alert("कृपया सभी जानकारी भरें / Please fill all details");
      return;
    }
    if (captchaInput !== captcha) {
      alert("अमान्य कैप्चा / Invalid Captcha");
      setCaptcha(generateCaptcha());
      return;
    }
    // Navigate to form after successful OTP
    navigate('/complain-form');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Top bar with icons (Phone, Pencil, Document, Check) - like in the screenshot */}
        <div className="bg-white border-b border-gray-300 py-2 px-8 flex gap-6 items-center shadow-sm">
          <div className="border border-gray-300 p-1 bg-gray-50"><Smartphone size={16} className="text-gray-600" /></div>
          <div className="text-gray-400"><Edit2 size={16} /></div>
          <div className="text-gray-400"><FileText size={16} /></div>
          <div className="text-gray-400"><Check size={16} /></div>
        </div>
        
        {/* Main Content Area in Official Project Theme */}
        <div className="bg-[#f4f6f9] min-h-[500px] p-8 flex flex-col items-center pt-10">
          
          {/* Progress Indicator (Optional but looks official) */}
          <div className="w-full max-w-3xl mb-6">
            <h1 className="text-2xl font-bold text-[#002b5e] mb-2">
              {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'Lodge a New Grievance'}
            </h1>
            <p className="text-gray-600 text-[13px]">
              {lang === 'hi' ? 'शिकायत दर्ज करने के लिए कृपया अपना मोबाइल नंबर सत्यापित करें।' : 'Please verify your mobile number to proceed with grievance registration.'}
            </p>
          </div>

          <div className="bg-white p-8 shadow-sm border border-gray-300 w-full max-w-3xl rounded-sm">
            <h2 className="text-[#e65100] text-lg font-bold mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Smartphone size={20} className="text-[#002b5e]" />
              {lang === 'hi' ? 'अपना मोबाइल नंबर दर्ज करें' : 'Enter Your Mobile Number'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-gray-800 font-bold w-40 text-[14px]">
                  {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                
                <input 
                  type="text" 
                  placeholder={lang === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                  className="border border-gray-300 px-4 py-2 w-full md:w-72 focus:outline-none focus:border-[#e65100] focus:ring-1 focus:ring-[#e65100]"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-gray-800 font-bold w-40 text-[14px]">
                  {lang === 'hi' ? 'कैप्चा कोड *' : 'Captcha Code *'}
                </label>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="border border-gray-300 bg-gray-100 text-[#002b5e] px-4 py-1.5 font-mono tracking-widest font-bold text-[16px] min-w-[100px] text-center select-none shadow-inner">
                    {captcha}
                  </div>
                  <button onClick={() => setCaptcha(generateCaptcha())} className="text-[#e65100] hover:text-[#cc4800] transition-colors bg-orange-50 p-2 rounded-sm border border-orange-100" title="Refresh Captcha">
                    <RefreshCw size={18} />
                  </button>
                  <input 
                    type="text" 
                    placeholder={lang === 'hi' ? 'कैप्चा कोड लिखें' : 'Enter Captcha'}
                    className="border border-gray-300 px-4 py-2 w-full md:w-40 focus:outline-none focus:border-[#e65100] focus:ring-1 focus:ring-[#e65100]"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center md:justify-start md:pl-44">
              <button 
                onClick={handleGenerateOTP}
                className="bg-[#002b5e] hover:bg-[#001f44] text-white px-8 py-2.5 font-bold rounded-sm shadow-sm transition-colors text-[14px] uppercase tracking-wide flex items-center gap-2"
              >
                <Check size={16} />
                {lang === 'hi' ? 'OTP प्राप्त करें' : 'Generate OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplainHome;