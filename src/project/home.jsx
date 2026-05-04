import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, RefreshCw, User, Lock, PieChart as PieChartIcon, Search, Download, FileText, Bell, Book, Scale, Newspaper, ChevronRight, AlertCircle, CheckCircle, Landmark, Info, ExternalLink, TrendingUp, BarChart2, Activity, X, LogOut, UserCheck, History, Loader2 } from 'lucide-react';
import userDetails from '../assets/user_details.json';
import Header from './head_foot/head';
import Footer from './head_foot/foot';
import Captcha, { verifyCaptcha } from './complain_path/captcha';
import { loginDepartmentAPI } from '../apiHandler/apis';

const Home = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const statusCaptchaRef = React.useRef(null);
  const loginCaptchaRef = React.useRef(null);

  const [statusCaptchaData, setStatusCaptchaData] = useState({ code: '', token: '' });
  const [loginCaptchaData, setLoginCaptchaData] = useState({ code: '', token: '' });

  const [statusInput, setStatusInput] = useState('');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  
  const [loggedInUserData, setLoggedInUserData] = useState(() => {
    const data = localStorage.getItem('agentUserData');
    return data ? JSON.parse(data) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('agentLogin') === 'true');
  const [isFlipping, setIsFlipping] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });

  const showAlert = (message, type = 'error') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
        q: "How I can register the grievance?",
        a: (
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                <li>The citizen shall visit the <strong>"Department of Rural Development - A Grievance Redressal Portal."</strong></li>
                <li>The citizen shall click on <strong>Citizen Registration</strong> and complete the registration form in all respects.</li>
                <li>After successful registration, the citizen shall navigate to the <strong>Login</strong> page.</li>
                <li>The citizen shall select the <strong>Citizen</strong> option and enter the registered mobile number.</li>
                <li>The citizen shall enter the <strong>One-Time Password (OTP)</strong> received on the registered mobile number and click on <strong>Verify</strong>.</li>
                <li>Upon successful login, the citizen shall click on <strong>Register Grievance</strong>, fill in the grievance details, and upload supporting documents, if any.</li>
                <li>The citizen shall submit the grievance by clicking on the <strong>Submit</strong> button.</li>
                <li>On successful submission, the grievance shall be registered in the system.</li>
                <li>The citizen may download the <strong>acknowledgement PDF</strong> for future reference and tracking of the grievance.</li>
            </ol>
        )
    },
    { q: "How do I track my grievance status?", a: "You can track your grievance status by entering your Grievance ID / Mobile No. and captcha in the 'View Status' section on the homepage." },
    { q: "How do I change the language using Bhashini?", a: "You can change the language using the translation widget available on the portal." }
  ];

  const handleStatusSearch = async () => {
    if (!statusInput || !statusCaptchaData.code) {
      showAlert(lang === 'hi' ? "कृपया सभी फ़ील्ड भरें।" : "Please fill all fields.", 'error');
      return;
    }
    const isValid = await verifyCaptcha(statusCaptchaData.token, statusCaptchaData.code);
    if (!isValid) {
      showAlert(lang === 'hi' ? "कैप्चा कोड अमान्य है!" : "Invalid Captcha code!", 'error');
      statusCaptchaRef.current?.refresh();
      return;
    }
    showAlert(`${lang === 'hi' ? "स्थिति खोजी जा रही है:" : "Searching status for:"} ${statusInput}`, 'success');
  };

  const handleLogin = async () => {
    if (!username || !password || !loginCaptchaData.code) {
      showAlert(lang === 'hi' ? "लॉगिन के लिए सभी विवरण आवश्यक हैं।" : "All login details are required.", 'error');
      return;
    }
    
    setIsLoginLoading(true);
    
    try {
      const isValid = await verifyCaptcha(loginCaptchaData.token, loginCaptchaData.code);
      if (!isValid) {
        showAlert(lang === 'hi' ? "कैप्चा कोड अमान्य है!" : "Invalid Captcha code!", 'error');
        loginCaptchaRef.current?.refresh();
        setIsLoginLoading(false);
        return;
      }

      const response = await loginDepartmentAPI({ username, password });
      if (response && response.success) {
        localStorage.setItem('agentLogin', 'true');
        localStorage.setItem('agentUserData', JSON.stringify(response.data));
        setLoggedInUserData(response.data);
        setIsFlipping(true);
        setTimeout(() => {
          setIsLoggedIn(true);
          setIsFlipping(false);
          setUsername('');
          setPassword('');
          loginCaptchaRef.current?.refresh();
        }, 300);
        showAlert(lang === 'hi' ? "सफलतापूर्वक प्रवेश किया!" : "Logged in successfully!", 'success');
      }
    } catch (err) {
      showAlert(err.message || "Invalid Login Details!", 'error');
      loginCaptchaRef.current?.refresh();
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsFlipping(true);
    setTimeout(() => {
      localStorage.clear();
      setLoggedInUserData(null);
      setIsLoggedIn(false);
      setIsFlipping(false);
      setShowLogoutConfirm(false);
    }, 300);
  };

  const handleComplainClick = () => {
    const isLoggedIn = localStorage.getItem('agentLogin');
    if (isLoggedIn === 'true') {
      navigate('/complain');
    } else {
      setNotification(lang === 'hi' ? "मास्टर प्रविष्टि के लिए लॉगिन अनिवार्य है।" : "Login is mandatory for master entry.");
      setTimeout(() => setNotification(''), 5000);
      const loginSection = document.getElementById('login-section');
      if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        loginSection.classList.add('ring-4', 'ring-red-400', 'transition-all');
        setTimeout(() => loginSection.classList.remove('ring-4', 'ring-red-400'), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 relative">

      {/* Custom Alert Toast */}
      {customAlert.show && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-sm shadow-xl border-l-4 transform transition-all animate-slide-in-right ${customAlert.type === 'error' ? 'bg-white border-red-500 text-gray-800' : 'bg-white border-green-500 text-gray-800'}`}>
          {customAlert.type === 'error' ? <div className="text-red-500 bg-red-50 p-1 rounded-full"><Shield size={16} /></div> : <div className="text-green-500 bg-green-50 p-1 rounded-full"><CheckCircle size={16} /></div>}
          <p className="text-[13px] font-semibold">{customAlert.message}</p>
          <button onClick={() => setCustomAlert(prev => ({ ...prev, show: false }))} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none text-xl leading-none">
             &times;
          </button>
        </div>
      )}

      {notification && (
        <div className="fixed top-24 left-4 bg-red-600 text-white px-4 py-3 rounded-md shadow-lg z-50 flex items-center gap-3 border border-red-800 animate-bounce">
          <AlertCircle size={20} />
          <span className="font-bold text-[14px]">{notification}</span>
          <button onClick={() => setNotification('')} className="ml-2 hover:text-red-200"><X size={16}/></button>
        </div>
      )}

      <Header />

      {/* News Flash (Marquee style) */}
      <div className="bg-[#fff8e1] text-[12px] md:text-[13px] border-b border-orange-200 flex items-stretch shadow-sm relative z-10">
        <div className="bg-[#cc0000] text-white font-bold px-3 md:px-6 py-2 whitespace-nowrap flex items-center shrink-0">
          <Bell size={14} className="mr-1.5 md:mr-2 md:block hidden" /> 
          <span className="hidden sm:inline">{t.newsFlash}</span>
          <span className="sm:hidden">News</span>
        </div>
        <div className="flex-1 py-2 px-3 md:px-4 text-red-700 font-semibold flex items-center overflow-hidden">
          <marquee scrollamount="5" className="hover:pause-marquee">नागरिक अब अपनी शिकायतें सीधे पोर्टल के माध्यम से दर्ज कर सकते हैं। | जनसुनवाई का नया कार्यक्रम जारी किया गया है।</marquee>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 md:gap-8">

        {/* Left Column (Information & Links) - Order 2 on Mobile/LG, 1 on XL */}
        <div className="lg:col-span-2 xl:col-span-3 order-2 lg:order-3 xl:order-1 flex flex-col gap-5">

          {/* Quick Info Menu */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <div className="bg-[#002b5e] text-white px-4 py-3 font-semibold text-[13px] flex items-center gap-2 border-b-[3px] border-[#e65100]">
              <Info size={16} /> महत्वपूर्ण जानकारी / Info
            </div>
            <div className="flex flex-col">
              {[
                { icon: <PieChartIcon size={16} />, label: t.icons.cause },
                { icon: <Scale size={16} />, label: t.icons.act },
                { icon: <Book size={16} />, label: t.icons.manual },
                { 
                  icon: <Bell size={16} />, 
                  label: t.icons.notification, 
                  path: '/notifications', 
                  badge: '3' 
                },
                { icon: <FileText size={16} />, label: t.icons.circular },
                { icon: <Newspaper size={16} />, label: t.icons.news }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.path ? navigate(item.path) : null}
                  className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-gray-700 font-medium transition-colors last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#e65100]">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e7b34] border border-[#145a24] shadow-sm p-4 rounded-md flex justify-between items-center text-white">
            <div className="flex flex-col">
              <span className="text-green-100 uppercase text-[11px] tracking-wider mb-0.5 font-bold">Helpline</span>
              <span className="text-[13px] font-medium leading-tight">Toll-Free Support</span>
            </div>
            <div className="bg-white text-[#1e7b34] px-4 py-2 rounded shadow-sm flex items-center gap-2 border border-green-600">
               <Phone size={18} />
               <span className="text-xl font-bold tracking-wider">181</span>
            </div>
          </div>

          {/* Useful Links */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-4">
            <h3 className="font-semibold text-[#002b5e] border-b-2 border-[#e65100] pb-2 mb-3 flex items-center gap-2">
              <ExternalLink size={16} /> योजनाएं एवं सेवाएं
            </h3>
            <ul className="space-y-2.5 text-[12px] text-gray-700">
              {t.links1.map((link, idx) => (
                <li key={idx} className="flex items-start gap-2 hover:text-[#002b5e] cursor-pointer leading-tight transition-colors">
                  <ChevronRight size={14} className="text-[#e65100] mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{link}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Middle Column (Process, Chart, Banner) - Order 1 on Mobile/LG, 2 on XL */}
        <div className="lg:col-span-1 xl:col-span-6 order-1 lg:order-1 xl:order-2 flex flex-col gap-6">

          {/* Hero Banner Image */}
          <div className="bg-white p-1 shadow-sm border border-gray-200 rounded-md overflow-hidden">
            <div className="h-40 sm:h-56 md:h-64 lg:h-56 relative flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=800&q=80" alt="Rajasthan Govt Building" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#002b5e]/90 to-transparent"></div>
              <div className="absolute bottom-0 w-full p-4 md:p-6 text-left">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 uppercase tracking-wide">{t.bannerTitle}</h2>
                <p className="text-gray-200 font-medium text-[12px] md:text-[13px]">Empowering citizens through transparent governance</p>
              </div>
            </div>
          </div>

          {/* Action Boxes (Govt Style Process) */}
          <div className="mt-2">
            <h3 className="text-[14px] md:text-[15px] font-bold text-[#002b5e] mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
              <span className="w-4 h-4 bg-[#e65100] inline-block"></span>
              {t.complainTitle}
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div onClick={() => showAlert(t.process.citizen, 'success')} className="bg-white border border-gray-200 shadow-sm p-4 md:p-5 text-center cursor-pointer hover:border-[#002b5e] transition-colors rounded-md group">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-blue-50 text-[#002b5e] border border-blue-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-[#002b5e] group-hover:text-white transition-colors">
                  <User size={18} />
                </div>
                <span className="font-semibold text-[#002b5e] text-[12px] md:text-[13px] leading-tight block">{t.process.citizen}</span>
              </div>

              <div onClick={handleComplainClick} className="bg-white border border-gray-200 shadow-sm p-4 md:p-5 text-center cursor-pointer hover:border-[#e65100] transition-colors rounded-md group">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-orange-50 text-[#e65100] border border-orange-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-[#e65100] group-hover:text-white transition-colors">
                  <FileText size={18} />
                </div>
                <span className="font-semibold text-[#002b5e] text-[12px] md:text-[13px] leading-tight block">{t.process.grievance}</span>
              </div>

              <div onClick={() => showAlert(t.process.reminder, 'success')} className="bg-white border border-gray-200 shadow-sm p-4 md:p-5 text-center cursor-pointer hover:border-yellow-600 transition-colors rounded-md group">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <Bell size={18} />
                </div>
                <span className="font-semibold text-[#002b5e] text-[12px] md:text-[13px] leading-tight block">{t.process.reminder}</span>
              </div>

              <div onClick={() => showAlert(t.process.action, 'success')} className="bg-white border border-gray-200 shadow-sm p-4 md:p-5 text-center cursor-pointer hover:border-green-600 transition-colors rounded-md group">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-green-50 text-green-600 border border-green-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Search size={18} />
                </div>
                <span className="font-semibold text-[#002b5e] text-[12px] md:text-[13px] leading-tight block">{t.process.action}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Forms & Direct Actions) - Order 3 on Mobile, 2 on LG, 3 on XL */}
        <div className="lg:col-span-1 xl:col-span-3 order-3 lg:order-2 xl:order-3 flex flex-col gap-4">

          <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            <button onClick={handleComplainClick} className="bg-[#1e7b34] text-white py-2.5 px-2 font-semibold text-[13px] hover:bg-[#145a24] shadow-sm rounded-md flex flex-col justify-center items-center gap-1 border border-[#145a24] transition-colors">
              <AlertCircle size={18} /> <span className="text-center leading-tight">{t.btnNew}</span>
            </button>
            <button onClick={() => showAlert(t.btnAppeal, 'success')} className="bg-[#002b5e] text-white py-2.5 px-2 font-semibold text-[13px] hover:bg-[#001f44] shadow-sm rounded-md flex flex-col justify-center items-center gap-1 border border-[#001f44] transition-colors">
              <Book size={18} /> <span className="text-center leading-tight">{t.btnAppeal}</span>
            </button>
          </div>

          {/* Status Form (Official Box) */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 font-semibold text-[#002b5e] text-[13px] flex items-center gap-2">
              <Search size={16} className="text-[#002b5e]" /> {t.statusForm.title}
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder={t.statusForm.input}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] mb-3 focus:outline-none focus:border-[#002b5e] transition-colors bg-white"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
              />

              <div className="mb-4">
                <Captcha 
                  ref={statusCaptchaRef}
                  onCodeChange={(code, token) => setStatusCaptchaData({ code, token })}
                />
              </div>
              <button onClick={handleStatusSearch} className="w-full bg-[#002b5e] text-white px-4 py-2 font-semibold text-[13px] rounded-sm hover:bg-[#001f44] transition-colors flex justify-center items-center gap-2 border border-[#001533]">
                {t.statusForm.btn} <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Login Form / User Profile (SSO Logic) */}
          <div id="login-section" className="relative perspective-1000">
            <div className={`transition-all duration-300 origin-center ${isFlipping ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'}`}>
              {!isLoggedIn ? (
                <div className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
                  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 font-semibold text-[#002b5e] text-[13px] flex items-center gap-2">
                    <Lock size={16} className="text-[#002b5e]" /> {t.loginForm.title}
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="p-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">{t.loginForm.id}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400"><User size={14} /></span>
                        <input
                          type="text"
                          placeholder={t.loginForm.userPh}
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-1.5 text-[13px] focus:outline-none focus:border-[#002b5e] transition-colors"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">{t.loginForm.pass}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400"><Lock size={14} /></span>
                        <input
                          type="password"
                          placeholder={t.loginForm.passPh}
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-1.5 text-[13px] focus:outline-none focus:border-[#002b5e] transition-colors"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <Captcha 
                        ref={loginCaptchaRef}
                        onCodeChange={(code, token) => setLoginCaptchaData({ code, token })}
                      />
                    </div>

                    <button type="submit" disabled={isLoginLoading} className="w-full bg-[#1e7b34] text-white py-2 font-semibold text-[13px] rounded-sm hover:bg-[#145a24] transition-colors border border-[#145a24] mt-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isLoginLoading && <Loader2 size={16} className="animate-spin" />}
                      {isLoginLoading ? (lang === 'hi' ? 'प्रवेश हो रहा है...' : 'Logging in...') : t.loginForm.btn}
                    </button>

                    <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                      <p className="text-[11px] text-gray-500 mb-1.5">{lang === 'hi' ? 'विभाग प्रशासक?' : 'Department Admin?'}</p>
                      <button type="button" onClick={() => navigate('/register')} className="cursor-pointer w-full bg-white text-[#002b5e] border border-[#002b5e] py-1.5 font-semibold text-[12px] rounded-sm hover:bg-gray-50 transition-colors flex justify-center items-center gap-1">
                        <User size={14} /> {lang === 'hi' ? 'नया उपयोगकर्ता पंजीकृत करें' : 'Register New User'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white border border-green-200 shadow-sm rounded-md overflow-hidden ring-1 ring-green-100">
                  <div className="bg-green-50 border-b border-green-200 px-4 py-2.5 font-semibold text-[#1e7b34] text-[13px] flex items-center justify-between">
                    <span className="flex items-center gap-2"><UserCheck size={16} /> User Profile</span>
                    <div className="flex items-center gap-3">
                      <Link to="/notifications" className="relative group p-1.5 rounded-full hover:bg-white transition-colors" title="Notifications">
                        <Bell size={20} className="text-[#002b5e] group-hover:scale-110 transition-transform" />
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full border border-white shadow-sm">3</span>
                      </Link>
                      <span className="text-[10px] bg-green-200 px-2 py-0.5 rounded-full text-green-800 border border-green-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> Online
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-12 h-12 bg-[#002b5e] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm uppercase">
                          {loggedInUserData?.name?.charAt(0) || 'U'}
                       </div>
                       <div>
                         <h4 className="font-bold text-[#002b5e] text-[15px] leading-tight">{loggedInUserData?.name || 'User'}</h4>
                         <p className="text-gray-500 text-[11px] font-medium">{loggedInUserData?.designation || 'N/A'}</p>
                       </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 text-[12px] space-y-2.5 shadow-inner">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                        <span className="text-gray-500 font-medium shrink-0">Employee ID:</span> 
                        <span className="font-bold text-gray-800">{loggedInUserData?.id || 'N/A'}</span>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-gray-500 font-medium shrink-0">Dept:</span> 
                          <span className="font-bold text-gray-700 text-right leading-tight">{loggedInUserData?.department || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-500 font-medium">Work Location:</span> 
                          <span className="font-bold text-gray-700 leading-snug break-words">{loggedInUserData?.district || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-gray-500 font-medium shrink-0">Status:</span> 
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wide ${loggedInUserData?.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                          {loggedInUserData?.status === 'approved' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <style>{`
                      @keyframes growPop {
                        0% { transform: scale(0.9); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                      }
                      .animate-grow-pop { animation: growPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    `}</style>
                    {showLogoutConfirm ? (
                      <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded-sm animate-grow-pop">
                        <p className="text-red-700 text-[13px] font-bold text-center mb-2">
                          {lang === 'hi' ? 'क्या आप वाकई लॉगआउट करना चाहते हैं?' : 'Are you sure you want to logout?'}
                        </p>
                        <div className="flex gap-2">
                          <button onClick={handleLogout} className="flex-1 bg-red-600 text-white py-1.5 rounded-sm font-bold text-[12px] hover:bg-red-700 transition-colors shadow-sm">
                            {lang === 'hi' ? 'हाँ, लॉगआउट' : 'Yes, Logout'}
                          </button>
                          <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white text-gray-700 border border-gray-300 py-1.5 rounded-sm font-bold text-[12px] hover:bg-gray-50 transition-colors shadow-sm">
                            {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 mt-2">
                        <button onClick={() => navigate('/dashboard')} className="cursor-pointer w-full bg-blue-50 text-blue-700 py-2 font-bold text-[13px] rounded-sm hover:bg-blue-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-blue-200 flex items-center justify-center gap-2">
                          <BarChart2 size={16} /> {lang === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}
                        </button>
                        <button onClick={() => navigate('/history')} className="cursor-pointer w-full bg-orange-50 text-[#e65100] py-2 font-bold text-[13px] rounded-sm hover:bg-orange-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-orange-200 flex items-center justify-center gap-2">
                          <History size={16} /> {lang === 'hi' ? 'कार्य इतिहास देखें' : 'View Work History'}
                        </button>
                        <button onClick={() => setShowLogoutConfirm(true)} className="w-full bg-red-50 text-red-700 py-2 font-bold text-[13px] rounded-sm hover:bg-red-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-red-200 flex items-center justify-center gap-2">
                          <LogOut size={16} /> Secure Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Our Schemes Section */}
      <div className="bg-white py-10 shadow-sm relative z-10 border-b border-gray-200 overflow-hidden">
        <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-slide {
            animation: slide 35s linear infinite;
          }
          .animate-slide:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-3">
            <div>
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-[#002b5e]"></div>
                 <h2 className="text-2xl font-bold text-[#002b5e]">{lang === 'hi' ? 'हमारी योजनाएं' : 'Key Schemes & Programmes'}</h2>
               </div>
               <p className="text-gray-500 text-[13px] mt-1 ml-4">Explore major development initiatives</p>
            </div>
            <button className="text-[#e65100] text-[13px] font-bold hover:underline flex items-center gap-1">View All <ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Infinite Carousel */}
        <div className="w-full overflow-hidden pb-4">
          <div className="flex gap-5 animate-slide w-max px-4">
            {[
              "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
              "Pradhan Mantri Awaas Yojana - Gramin",
              "Pradhan Mantri Gram Sadak Yojana",
              "Deendayal Antyodaya Yojana - NRLM",
              "Saansad Adarsh Gram Yojana",
              "National Social Assistance Programme",
              "Rural Self Employment Training",
              // DUPLICATES FOR SEAMLESS LOOP
              "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
              "Pradhan Mantri Awaas Yojana - Gramin",
              "Pradhan Mantri Gram Sadak Yojana",
              "Deendayal Antyodaya Yojana - NRLM",
              "Saansad Adarsh Gram Yojana",
              "National Social Assistance Programme",
              "Rural Self Employment Training"
            ].map((scheme, idx) => (
              <div key={idx} className="w-[280px] h-[160px] bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center hover:border-[#002b5e] hover:shadow-md transition-all cursor-pointer group flex-shrink-0">
                <div className="w-14 h-14 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center mb-4 text-[#002b5e] group-hover:bg-[#002b5e] group-hover:text-white transition-colors">
                  <Landmark size={24} />
                </div>
                <span className="text-[12px] font-bold text-[#002b5e] leading-snug">{scheme}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Statistics Dashboard (Formalized) */}
      <div className="bg-[#002b5e] py-10 md:py-16 border-y border-[#001f44] mt-4">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-10 relative flex flex-col items-center">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wider">Public Grievance Dashboard</h2>
            <div className="w-20 h-1.5 bg-[#e65100] mx-auto mb-4"></div>
            <p className="text-blue-200 text-[13px] md:text-[14px] max-w-2xl">Monitoring and analytics of public grievances to ensure transparent governance and departmental accountability across the state.</p>
            {isLoggedIn && (
              <div className="mt-6 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                 <button onClick={() => navigate('/dashboard')} className="cursor-pointer bg-[#1e7b34] text-white border border-[#145a24] px-5 py-2.5 font-bold text-[13px] rounded-sm hover:bg-[#145a24] transition-all flex items-center gap-2 shadow-lg active:scale-95">
                   <BarChart2 size={16} /> {lang === 'hi' ? 'डैशबोर्ड देखें' : 'View Full Dashboard'}
                 </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            {/* Stat Cards */}
            <div className="bg-white border-t-4 border-blue-600 p-4 md:p-6 rounded-sm text-center shadow-md transform hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-2 md:mb-3">
                <FileText size={18} />
              </div>
              <div className="text-gray-500 mb-1 font-bold uppercase text-[9px] md:text-[10px] tracking-widest leading-tight">{t.stats.total || 'Total Received'}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#002b5e] break-all sm:break-normal">2,450,192</div>
            </div>
            
            <div className="bg-white border-t-4 border-green-600 p-4 md:p-6 rounded-sm text-center shadow-md transform hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto bg-green-50 text-green-700 rounded-full flex items-center justify-center mb-2 md:mb-3">
                <CheckCircle size={18} />
              </div>
              <div className="text-gray-500 mb-1 font-bold uppercase text-[9px] md:text-[10px] tracking-widest leading-tight">{t.stats.executed || 'Total Disposed'}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-green-700 break-all sm:break-normal">2,380,441</div>
            </div>

            <div className="bg-white border-t-4 border-orange-500 p-4 md:p-6 rounded-sm text-center shadow-md transform hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-2 md:mb-3">
                <RefreshCw size={18} />
              </div>
              <div className="text-gray-500 mb-1 font-bold uppercase text-[9px] md:text-[10px] tracking-widest leading-tight">Pending Cases</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-orange-600 break-all sm:break-normal">45,337</div>
            </div>

            <div className="bg-white border-t-4 border-purple-600 p-4 md:p-6 rounded-sm text-center shadow-md transform hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mb-2 md:mb-3">
                <BarChart2 size={18} />
              </div>
              <div className="text-gray-500 mb-1 font-bold uppercase text-[9px] md:text-[10px] tracking-widest leading-tight">Avg. Resolution</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-purple-700 break-all sm:break-normal">14 Days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Donut Chart Block */}
            <div className="bg-white rounded-md p-8 shadow-md flex flex-col items-center justify-center border border-gray-200">
              <h3 className="font-bold text-[#002b5e] text-[16px] mb-8 self-start border-b border-gray-100 w-full pb-3">Disposal Breakdown</h3>
              <div className="w-48 h-48 rounded-full relative shadow-inner mb-8 border-8 border-gray-50" style={{ background: 'conic-gradient(#1e88e5 0% 63.5%, #43a047 63.5% 83.5%, #fb8c00 83.5% 100%)' }}>
                <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                   <span className="text-3xl font-black text-gray-800">97%</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Disposed</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-3 text-[13px] font-semibold">
                 <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-sm"><div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-[#1e88e5] rounded-full"></div><span className="text-gray-700">Accepted</span></div><span className="text-[#002b5e] font-black">63.5%</span></div>
                 <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-sm"><div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-[#43a047] rounded-full"></div><span className="text-gray-700">Alternate</span></div><span className="text-[#002b5e] font-black">20.0%</span></div>
                 <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-sm"><div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-[#fb8c00] rounded-full"></div><span className="text-gray-700">Rejected</span></div><span className="text-[#002b5e] font-black">16.5%</span></div>
              </div>
            </div>

            {/* Department Performance Bar Chart */}
            <div className="bg-white rounded-md p-8 shadow-md lg:col-span-2 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-100 pb-4 gap-4">
                <h3 className="font-bold text-[#002b5e] text-[16px]">Top Performing Departments</h3>
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider bg-gray-50 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-gray-400 rounded-sm"></div><span className="text-gray-600">Total</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div><span className="text-green-700">Resolved</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div><span className="text-red-600">Rejected</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-400 rounded-sm"></div><span className="text-orange-600">Pending</span></div>
                </div>
              </div>
              <div className="space-y-8">
                 {[
                   {name: 'Panchayati Raj & Rural Development', total: 12450, resolved: 12201, rejected: 150, pending: 99, color: 'bg-[#1e7b34]', textColor: 'text-[#1e7b34]'},
                   {name: 'Public Health Engineering (PHED)', total: 8920, resolved: 8384, rejected: 310, pending: 226, color: 'bg-[#0059b3]', textColor: 'text-[#0059b3]'},
                   {name: 'Revenue & Colonization Department', total: 15600, resolved: 13884, rejected: 980, pending: 736, color: 'bg-[#002b5e]', textColor: 'text-[#002b5e]'},
                   {name: 'Medical & Health Services', total: 6420, resolved: 5521, rejected: 400, pending: 499, color: 'bg-[#e65100]', textColor: 'text-[#e65100]'},
                 ].map((dept, i) => {
                   const resolvePercent = ((dept.resolved / dept.total) * 100).toFixed(1);
                   return (
                     <div key={i} className="group">
                       <div className="flex justify-between items-end text-[13px] font-bold text-gray-800 mb-2">
                         <span className="max-w-[70%] sm:max-w-none truncate sm:whitespace-normal">{dept.name}</span>
                         <span className={`${dept.textColor} font-black text-[13px] whitespace-nowrap`}>{resolvePercent}% Resolved</span>
                       </div>
                       <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3 flex shadow-inner">
                         <div className="bg-green-500 h-full transition-all group-hover:brightness-110" style={{width: `${(dept.resolved / dept.total) * 100}%`}} title={`Resolved: ${dept.resolved}`}></div>
                         <div className="bg-red-500 h-full transition-all group-hover:brightness-110" style={{width: `${(dept.rejected / dept.total) * 100}%`}} title={`Rejected: ${dept.rejected}`}></div>
                         <div className="bg-orange-400 h-full transition-all group-hover:brightness-110" style={{width: `${(dept.pending / dept.total) * 100}%`}} title={`Pending: ${dept.pending}`}></div>
                       </div>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] font-black text-center pt-1">
                          <div className="bg-gray-50 py-1.5 rounded text-gray-600 flex flex-col sm:flex-row items-center justify-center gap-1"><span className="text-[9px] uppercase text-gray-400 sm:hidden">Total:</span> {dept.total.toLocaleString()}</div>
                          <div className="bg-green-50 py-1.5 rounded text-green-600 flex flex-col sm:flex-row items-center justify-center gap-1"><span className="text-[9px] uppercase text-green-400 sm:hidden">Res:</span> {dept.resolved.toLocaleString()}</div>
                          <div className="bg-red-50 py-1.5 rounded text-red-500 flex flex-col sm:flex-row items-center justify-center gap-1"><span className="text-[9px] uppercase text-red-400 sm:hidden">Rej:</span> {dept.rejected.toLocaleString()}</div>
                          <div className="bg-orange-50 py-1.5 rounded text-orange-500 flex flex-col sm:flex-row items-center justify-center gap-1"><span className="text-[9px] uppercase text-orange-400 sm:hidden">Pend:</span> {dept.pending.toLocaleString()}</div>
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ and Steps Layout (Formalized) */}
      <div className="bg-gray-50 py-10 border-b border-gray-200">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FAQs */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-[#e65100] rounded-full flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#002b5e] leading-tight">Help Center</h2>
              </div>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-gray-200">FAQ</span>
            </div>

            <div className="space-y-2 flex-1">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`border rounded-md overflow-hidden transition-all duration-200 ${openFaq === idx ? 'border-[#002b5e] bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left px-5 py-3.5 font-semibold text-[13px] flex justify-between items-center text-[#002b5e]"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <div className="text-gray-500 shrink-0">
                      <ChevronRight size={16} className={`transform transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 pt-1 text-[12.5px] text-gray-700 leading-relaxed border-t border-gray-200 mt-2">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Timeline (Circular & Vertical Dual Layout) */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 overflow-hidden relative flex flex-col">
            <div className="mb-6 pb-3 border-b border-gray-200 flex justify-between items-end relative z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#002b5e] leading-tight">Process Flow</h2>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Steps to register grievance</p>
                </div>
              </div>
            </div>

            {/* Mobile View: Vertical Timeline */}
            <div className="lg:hidden relative overflow-y-auto pr-4 flex-1" style={{ scrollbarWidth: 'thin' }}>
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-blue-100"></div>
              <div className="space-y-6 relative pb-4">
                {[
                  { title: "Open Portal", desc: "Visit the official rural development portal" },
                  { title: "User Registration", desc: "Click and complete citizen registration" },
                  { title: "Fill Details", desc: "Submit basic registration details" },
                  { title: "Login", desc: "Go to 'Login With User' option" },
                  { title: "Enter Mobile", desc: "Provide your registered number" },
                  { title: "Verify OTP", desc: "Authenticate with the OTP received" },
                  { title: "Register Grievance", desc: "Click the register grievance button" },
                  { title: "Upload Docs", desc: "Fill form and attach evidence" },
                  { title: "Submit", desc: "Finalize your complaint submission" },
                  { title: "Track", desc: "Download PDF and note grievance ID" }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group cursor-default">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold z-10 border-2 bg-white`} style={{borderColor: ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50', '#009688', '#00bcd4', '#03a9f4', '#3f51b5', '#9c27b0'][idx], color: ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50', '#009688', '#00bcd4', '#03a9f4', '#3f51b5', '#9c27b0'][idx]}}>
                       {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-lg p-3.5 flex-1 shadow-sm">
                       <h4 className="text-[13px] font-bold text-[#002b5e] mb-0.5">{step.title}</h4>
                       <p className="text-[11px] font-medium text-gray-500 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View: Compact Circular Timeline */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative min-h-[500px]">
              <div className="relative w-full h-full flex items-center justify-center scale-[0.80] xl:scale-[0.90] 2xl:scale-100 origin-center transition-transform">
                 {/* Dashed Background Circle */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border-2 border-gray-100 border-dashed z-0"></div>
                 
                 {/* Center Badge */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[6px] border-gray-50 flex flex-col items-center justify-center shadow-sm bg-white z-10">
                    <span className="text-4xl font-black text-blue-500 mb-0 leading-none">10</span>
                    <span className="text-[11px] font-bold text-[#002b5e] text-center leading-tight mt-1">Step Circular<br/>Process</span>
                 </div>
                 
                 {/* 10 Nodes mapped circularly */}
                 {[
                    { title: "Open Portal", desc: "Visit official portal" },
                    { title: "User Reg.", desc: "Complete citizen reg" },
                    { title: "Fill Details", desc: "Submit basic details" },
                    { title: "Login", desc: "Go to Login With User" },
                    { title: "Enter Mobile", desc: "Provide registered #" },
                    { title: "Verify OTP", desc: "Authenticate with OTP" },
                    { title: "Reg Grievance", desc: "Click register button" },
                    { title: "Upload Docs", desc: "Attach evidence" },
                    { title: "Submit", desc: "Finalize submission" },
                    { title: "Track", desc: "Note grievance ID" }
                  ].map((step, idx) => {
                    const angle = (idx * 36) - 90; // Start at top
                    const normalized = (idx * 36);
                    
                    // Text placement depending on quadrant
                    let textClasses = "";
                    if (normalized === 0) textClasses = "bottom-[115%] left-1/2 -translate-x-1/2 text-center pb-1.5";
                    else if (normalized === 180) textClasses = "top-[115%] left-1/2 -translate-x-1/2 text-center pt-1.5";
                    else if (normalized > 0 && normalized < 180) textClasses = "left-[115%] top-1/2 -translate-y-1/2 text-left pl-2.5";
                    else textClasses = "right-[115%] top-1/2 -translate-y-1/2 text-right pr-2.5";

                    return (
                      <div 
                        key={idx} 
                        className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] text-white shadow-md border-[3px] border-white z-20 hover:scale-110 transition-transform cursor-default"
                        style={{
                          backgroundColor: ['#f44336', '#ff9800', '#ffc107', '#8bc34a', '#4caf50', '#009688', '#00bcd4', '#03a9f4', '#3f51b5', '#9c27b0'][idx],
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translate(130px) rotate(${-angle}deg)`,
                          left: '50%',
                          top: '50%'
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                        <div className={`absolute w-32 ${textClasses}`}>
                           <h4 className="text-[12px] font-bold text-[#002b5e] leading-tight mb-0.5">{step.title}</h4>
                           <p className="text-[10px] text-gray-500 leading-tight hidden xl:block">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(-5%); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;