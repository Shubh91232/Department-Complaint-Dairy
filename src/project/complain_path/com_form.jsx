import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { UserCheck, User, MapPin, Phone, FileText, ChevronRight, Home, Check, RefreshCw, Database, X, Activity, ShieldAlert, Calendar, LayoutList, UploadCloud, Loader2 } from 'lucide-react';
import userDetails from '../../assets/user_details.json';

const ComplainForm = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState('8KFFV2');
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Step 1 State
  const [applicantData, setApplicantData] = useState({
    name: '',
    mobile: '',
    address: ''
  });

  // Step 2 State
  const [formData, setFormData] = useState({
    source: 'PR',
    serialNumber: '',
    departmentRef: '',
    financialYear: '2025-2026',
    dateReceived: '',
    district: '',
    block: '',
    panchayat: '',
    level: 'District',
    department: '',
    scheme: '',
    complaintCategory: '',
    description: '',
    responsibleOfficer: '',
    currentStatus: 'Pending',
    actionTaken: '',
    remarks: '',
    captchaInput: ''
  });

  const handleApplicantChange = (e) => {
    setApplicantData({...applicantData, [e.target.name]: e.target.value});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'department') {
        newData.scheme = ''; // Reset scheme when department changes
      }
      return newData;
    });
  };

  const handleProceed = () => {
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);

    if (file.name.endsWith('.json') || file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const extractedData = JSON.parse(event.target.result);
          setTimeout(() => {
            setFormData(prev => ({ ...prev, ...extractedData }));
            setIsUploading(false);
            alert(lang === 'hi' ? 'फ़ाइल से डेटा सफलतापूर्वक पढ़ा गया!' : 'Data successfully extracted from uploaded file!');
          }, 1500);
        } catch (error) {
          setIsUploading(false);
          alert(lang === 'hi' ? 'अमान्य फ़ाइल स्वरूप!' : 'Invalid file format!');
        }
      };
      reader.readAsText(file);
      return;
    }

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        source: 'CS',
        serialNumber: 'CS-2026-8921',
        departmentRef: 'DEP/2026/04/99',
        financialYear: '2026-2027',
        dateReceived: '2026-04-28',
        district: 'Jaipur',
        level: 'District',
        department: 'Rural Development',
        scheme: 'PMAY-G (Awas)',
        complaintCategory: 'Financial Irregularity',
        description: 'Fund misuse reported in the recent road construction project. Attached evidence suggests a discrepancy of Rs. 4,50,000 in material costs.',
        responsibleOfficer: 'Zila Parishad CEO',
        currentStatus: 'Pending',
        actionTaken: 'Initial notice sent to contractor.',
        remarks: 'Requires immediate audit.'
      }));
      setIsUploading(false);
      alert(lang === 'hi' ? 'दस्तावेज़ से डेटा सफलतापूर्वक निकाला गया!' : 'Data successfully extracted from document!');
    }, 2000);
  };

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.captchaInput !== captcha) {
      alert(lang === 'hi' ? 'अमान्य कैप्चा!' : 'Invalid Captcha!');
      generateCaptcha();
      return;
    }
    setShowPreview(true);
  };

  const confirmSubmit = () => {
    alert(lang === 'hi' ? 'रिकॉर्ड सफलतापूर्वक मास्टर सूची में सहेजा गया।' : 'Record successfully saved to Master List.');
    navigate('/');
  };

  const districts = ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'];
  const blocks = formData.district ? ['Block 1', 'Block 2', 'Block 3'] : [];
  const panchayats = formData.block ? ['Panchayat 1', 'Panchayat 2', 'Panchayat 3'] : [];

  const deptSchemes = {
    'Rajveeka': ['SHG Formation', 'Revolving Fund', 'CIF Disbursement', 'Startup Fund'],
    'Rural Development': ['PMAY-G (Awas)', 'SBM-G (Toilets)', 'Sansad Adarsh Gram Yojana', 'MPLAD/MLALAD'],
    'MGNREGA': ['Wage Payment Issue', 'Work Demand', 'Muster Roll Irregularity', 'Individual Asset Construction'],
    'Panchayati Raj': ['Section 38 (Panchayati Raj Act)', 'Encroachment', 'Tender Irregularity', 'Gram Panchayat Fund']
  };

  const labelClass = "text-[12px] font-bold text-gray-700 block mb-1";
  const inputClass = "w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] bg-white transition-all";
  const requiredSpan = <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col relative">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] transition-colors flex items-center gap-1"><Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}</Link>
          <ChevronRight size={14} className="mx-2" />
          <button onClick={() => setStep(1)} className="hover:text-[#1976d2] transition-colors font-semibold">
            {lang === 'hi' ? 'मास्टर प्रविष्टि' : 'Master Entry'}
          </button>
          {step === 2 && (
            <>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-[#002b5e] font-semibold">{lang === 'hi' ? 'डेटा प्रविष्टि' : 'Data Entry'}</span>
            </>
          )}
        </div>

        {step === 1 ? (
          // --- STEP 1: COMPLAINANT DETAILS ---
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#002b5e] mb-2 border-b-2 border-[#1976d2] inline-block pb-1">
                {lang === 'hi' ? 'मास्टर प्रविष्टि - नया प्रकरण' : 'Master Entry - New Case'}
              </h1>
              <p className="text-gray-600 text-[13px] mt-2">
                {lang === 'hi' ? 'कृपया परिवादी का विवरण दर्ज करें (यदि उपलब्ध हो)।' : 'Please enter the complainant details (if available).'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <div className="bg-white border border-green-200 shadow-sm rounded-md overflow-hidden ring-1 ring-green-100 sticky top-6">
                  <div className="bg-green-50 border-b border-green-200 px-4 py-3 font-semibold text-[#1e7b34] text-[14px] flex items-center justify-between">
                    <span className="flex items-center gap-2"><UserCheck size={18} /> {lang === 'hi' ? 'प्रविष्टि कर्ता विवरण' : 'Entry Officer Details'}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-14 h-14 bg-[#002b5e] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-sm">
                          {userDetails.name.charAt(0)}
                       </div>
                       <div>
                         <h4 className="font-bold text-[#002b5e] text-[16px] leading-tight">{userDetails.name}</h4>
                         <p className="text-gray-500 text-[12px] font-medium">{userDetails.designation}</p>
                       </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 text-[13px] space-y-3 shadow-inner">
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Employee ID:</span> <span className="font-bold text-gray-800">{userDetails.id}</span></div>
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Dept:</span> <span className="font-semibold text-gray-700 text-right">{userDetails.department}</span></div>
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Location:</span> <span className="font-semibold text-gray-700">{userDetails.district}</span></div>
                      <div className="flex justify-between pt-1"><span className="text-gray-500">Session Start:</span> <span className="font-medium text-blue-600">{userDetails.lastLogin}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
                    <User size={20} className="text-[#1976d2]" />
                    <h2 className="font-bold text-[18px] text-[#002b5e]">
                      {lang === 'hi' ? 'परिवादी का विवरण (वैकल्पिक)' : 'Complainant Details (Optional)'}
                    </h2>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6 text-blue-800 text-[13px] flex gap-3 items-start">
                    <FileText size={18} className="flex-shrink-0 mt-0.5 text-blue-600" />
                    <p>
                      {lang === 'hi' 
                        ? 'यह अनुभाग वैकल्पिक है। यदि आपके पास परिवादी का विवरण उपलब्ध नहीं है, तो आप इसे खाली छोड़ कर आगे बढ़ सकते हैं।' 
                        : 'This section is optional. If you do not have the complainant details from the physical record, you may leave these fields empty and proceed to the grievance form.'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'परिवादी का नाम' : 'Complainant Name'}</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400"><User size={16} /></span>
                          <input type="text" name="name" placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Enter full name'} className={`${inputClass} pl-9`} value={applicantData.name} onChange={handleApplicantChange} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400"><Phone size={16} /></span>
                          <input type="text" name="mobile" placeholder={lang === 'hi' ? '10 अंकों का नंबर' : '10-digit number'} className={`${inputClass} pl-9`} value={applicantData.mobile} onChange={handleApplicantChange} maxLength={10} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'पूरा पता' : 'Full Address'}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400"><MapPin size={16} /></span>
                        <textarea name="address" placeholder={lang === 'hi' ? 'पता दर्ज करें' : 'Enter complete address'} className={`${inputClass} pl-9 pt-2`} rows="3" value={applicantData.address} onChange={handleApplicantChange} ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
                    <button type="button" onClick={handleProceed} className="cursor-pointer bg-[#002b5e] hover:bg-[#001f44] text-white px-8 py-2.5 font-bold rounded-sm shadow-sm transition-colors text-[14px] flex items-center gap-2 group">
                      {lang === 'hi' ? 'प्रकरण विवरण दर्ज करें' : 'Proceed to Case Details'}
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // --- STEP 2: CASE SPECIFICS FORM ---
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8 border-b-2 border-[#1976d2] pb-4 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#002b5e] mb-2 flex items-center gap-3">
                  <Database size={32} className="text-[#1976d2]" />
                  {lang === 'hi' ? 'मास्टर शिकायत प्रविष्टि (Master Data Entry)' : 'Master Grievance Data Entry'}
                </h1>
                <p className="text-gray-600 text-[14px] font-medium">
                  {lang === 'hi' ? 'विभागीय एक्सेल शीट से प्राप्त डेटा को पोर्टल में दर्ज करें।' : 'Digitize and enter offline departmental records into the central database.'}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1976d2] bg-blue-50 px-4 py-2 rounded-sm border border-blue-100">
                 <LayoutList size={18}/>
                 {lang === 'hi' ? 'रिकॉर्ड प्रारूप: मानक' : 'Record Format: Standard'}
              </div>
            </div>

            {/* OCR File Upload Section */}
            <div className="mb-6 bg-[#e3f2fd] border-2 border-dashed border-[#90caf9] p-6 rounded-sm text-center flex flex-col items-center justify-center transition-colors hover:bg-[#bbdefb]">
              <input type="file" id="ocr-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.json" onChange={handleFileUpload} />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-[#1565c0]">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="font-bold text-[14px]">{lang === 'hi' ? 'दस्तावेज़ से डेटा निकाला जा रहा है (OCR)...' : 'Extracting Data from Document (OCR)...'}</p>
                </div>
              ) : (
                <label htmlFor="ocr-upload" className="cursor-pointer flex flex-col items-center gap-2 text-[#1565c0]">
                  <UploadCloud size={32} />
                  <p className="font-bold text-[14px]">{lang === 'hi' ? 'ऑटो-फिल के लिए दस्तावेज़ अपलोड करें (OCR/JSON)' : 'Upload Document for Auto-fill (OCR/JSON)'}</p>
                  <p className="text-[12px] font-medium opacity-80">{lang === 'hi' ? 'समर्थित फ़ाइलें: PDF, JPG, PNG, Excel, JSON' : 'Supported files: PDF, JPG, PNG, Excel, JSON'}</p>
                </label>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Origin & Reference */}
                  <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#002b5e] border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <Calendar size={18} className="text-[#1976d2]" />
                      <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'मूल स्रोत और संदर्भ' : 'Origin & Reference'}</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'प्राप्ति स्रोत' : 'Source'} {requiredSpan}</label>
                          <select name="source" value={formData.source} onChange={handleFormChange} required className={inputClass}>
                            <option value="PR">PR (Rural Dev Dept)</option>
                            <option value="CS">CS (Chief Secretary)</option>
                            <option value="HM">HM (Hon. Minister)</option>
                            <option value="Other">Other Meetings</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'वित्तीय वर्ष' : 'Financial Year'} {requiredSpan}</label>
                          <select name="financialYear" value={formData.financialYear} onChange={handleFormChange} required className={inputClass}>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2026-2027">2026-2027</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'क्र.स. (Serial No.)' : 'Serial No.'} {requiredSpan}</label>
                          <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleFormChange} required className={`${inputClass} bg-yellow-50/50`} />
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'प्राप्त तिथि' : 'Date Received'} {requiredSpan}</label>
                          <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleFormChange} required className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Location */}
                  <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#e65100] border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <MapPin size={18} className="text-[#e65100]" />
                      <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'भौगोलिक स्थान' : 'Geographic Location'}</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'स्तर (Level)' : 'Level'} {requiredSpan}</label>
                        <select name="level" value={formData.level} onChange={handleFormChange} required className={inputClass}>
                          <option value="State">State Level</option>
                          <option value="District">District Level</option>
                          <option value="Panchayat">Panchayat Level</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'ज़िला (District)' : 'District'} {requiredSpan}</label>
                          <select name="district" value={formData.district} onChange={handleFormChange} required className={inputClass}>
                            <option value="">-- Select --</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'ब्लॉक (Block)' : 'Block'}</label>
                          <select name="block" value={formData.block} onChange={handleFormChange} disabled={!formData.district} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                            <option value="">-- Select --</option>
                            {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}</label>
                        <select name="panchayat" value={formData.panchayat} onChange={handleFormChange} disabled={!formData.block} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                          <option value="">-- Select --</option>
                          {panchayats.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  {/* Case Specifics */}
                  <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#2e7d32] border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <ShieldAlert size={18} className="text-[#2e7d32]" />
                      <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'प्रकरण का विवरण' : 'Case Specifics'}</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'विभाग (Department)' : 'Department'} {requiredSpan}</label>
                          <select name="department" value={formData.department} onChange={handleFormChange} required className={inputClass}>
                            <option value="">-- Select Department --</option>
                            {Object.keys(deptSchemes).map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'योजना (Scheme)' : 'Scheme'} {requiredSpan}</label>
                          <select name="scheme" value={formData.scheme} onChange={handleFormChange} required disabled={!formData.department} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                            <option value="">-- Select Scheme --</option>
                            {formData.department && deptSchemes[formData.department].map(scheme => (
                              <option key={scheme} value={scheme}>{scheme}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'शिकायत की श्रेणी' : 'Complaint Category'} {requiredSpan}</label>
                        <select name="complaintCategory" value={formData.complaintCategory} onChange={handleFormChange} required className={`${inputClass} font-semibold text-[#002b5e]`}>
                          <option value="">-- Select Category --</option>
                          <option value="Financial Irregularity">Financial Irregularity / Fund Misuse</option>
                          <option value="Operational Delay">Operational Delay in Work</option>
                          <option value="Quality Issue">Quality Issue in Construction</option>
                          <option value="Payment Pending">Payment Pending / Wage Issue</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'शिकायत / प्रकरण का विवरण' : 'Complaint / Case Description'} {requiredSpan}</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} rows="5" required placeholder="Enter exact details as written in the Excel sheet..." className={`${inputClass} bg-yellow-50/30 leading-relaxed`}></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Enforcement & Status */}
                  <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#6a1b9a] border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <Activity size={18} className="text-[#6a1b9a]" />
                      <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'कार्रवाई और वर्तमान स्थिति' : 'Enforcement & Current Status'}</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'संबंधित अधिकारी का नाम/पद' : 'Responsible Officer'} {requiredSpan}</label>
                          <input type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleFormChange} required placeholder="e.g. BDO, Sarpanch, Zila Parishad CEO" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'} {requiredSpan}</label>
                          <select name="currentStatus" value={formData.currentStatus} onChange={handleFormChange} required className={`${inputClass} font-bold ${
                              formData.currentStatus === 'Pending' ? 'text-red-600' :
                              formData.currentStatus === 'Resolved' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                            <option value="Pending">{lang === 'hi' ? 'लंबित (Pending)' : 'Pending'}</option>
                            <option value="In Progress">{lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress'}</option>
                            <option value="Resolved">{lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved'}</option>
                            <option value="Rejected">{lang === 'hi' ? 'अस्वीकृत (Rejected)' : 'Rejected'}</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'विभागीय संदर्भ क्र.' : 'Dept Ref No.'}</label>
                          <input type="text" name="departmentRef" value={formData.departmentRef} onChange={handleFormChange} placeholder="e.g. CS-2026-X" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'की गई कार्रवाई / अनुपालना' : 'Action Taken'}</label>
                        <textarea name="actionTaken" value={formData.actionTaken} onChange={handleFormChange} rows="2" placeholder="Describe actions taken so far..." className={inputClass}></textarea>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'टिप्पणी' : 'Remarks'}</label>
                        <input type="text" name="remarks" value={formData.remarks} onChange={handleFormChange} placeholder="Additional notes or remarks from the sheet" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 font-mono tracking-widest font-bold text-[18px] select-none shadow-inner">
                    {captcha}
                  </div>
                  <button type="button" onClick={generateCaptcha} className="text-[#1976d2] hover:text-[#115293] transition-colors p-2 rounded-full hover:bg-blue-50" title="Refresh Captcha">
                    <RefreshCw size={20} />
                  </button>
                  <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleFormChange} required placeholder="Enter Captcha" className="border border-gray-300 px-4 py-2 w-40 focus:outline-none focus:border-[#1976d2] rounded-sm" />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <button type="button" onClick={() => { setStep(1); window.scrollTo(0,0); }} className="cursor-pointer flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 font-bold rounded-sm shadow-sm transition-colors text-[14px] flex items-center justify-center">
                    {lang === 'hi' ? 'वापस जाएं' : 'Go Back'}
                  </button>
                  <button type="submit" className="cursor-pointer flex-1 md:flex-none bg-[#002b5e] hover:bg-[#001c3d] text-white px-8 py-3 font-bold rounded-sm shadow-md transition-colors text-[14px] flex items-center gap-2 uppercase tracking-wide justify-center">
                    <Database size={18} />
                    {lang === 'hi' ? 'डेटा सत्यापित करें' : 'Verify Data Entry'}
                  </button>
                </div>
              </div>
            </form>

            {/* Preview Modal Overlay */}
            {showPreview && (
              <div className="fixed inset-0 bg-[#002b5e]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-md shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                  <div className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center z-10">
                    <h2 className="text-lg font-bold text-[#002b5e] flex items-center gap-2"><FileText size={20}/> {lang === 'hi' ? 'डेटा प्रविष्टि सारांश' : 'Data Entry Summary'}</h2>
                    <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                  </div>
                  
                  <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow bg-gray-50">
                    {applicantData.name && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm shadow-sm text-[14px]">
                        <h3 className="font-bold text-[#002b5e] mb-2 border-b border-blue-200 pb-1">Complainant Details</h3>
                        <p><strong>Name:</strong> {applicantData.name} | <strong>Mobile:</strong> {applicantData.mobile}</p>
                        {applicantData.address && <p><strong>Address:</strong> {applicantData.address}</p>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[14px]">
                      <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                        <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><Calendar size={16} className="text-[#1976d2]"/> Metadata</h3>
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium w-1/3">Source</th><td className="py-2 font-semibold">{formData.source}</td></tr>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Serial No</th><td className="py-2 font-semibold text-[#e65100]">{formData.serialNumber}</td></tr>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Fin. Year</th><td className="py-2 font-semibold">{formData.financialYear}</td></tr>
                            <tr><th className="py-2 text-gray-500 font-medium">Received Date</th><td className="py-2 font-semibold">{formData.dateReceived}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                        <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><MapPin size={16} className="text-[#e65100]"/> Location</h3>
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium w-1/3">Level</th><td className="py-2 font-semibold">{formData.level}</td></tr>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">District</th><td className="py-2 font-semibold">{formData.district}</td></tr>
                            <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Block</th><td className="py-2 font-semibold">{formData.block || '-'}</td></tr>
                            <tr><th className="py-2 text-gray-500 font-medium">Panchayat</th><td className="py-2 font-semibold">{formData.panchayat || '-'}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                      <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><ShieldAlert size={16} className="text-[#2e7d32]"/> Complaint Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Department</span>
                          <p className="font-semibold text-[#002b5e]">{formData.department}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Scheme</span>
                          <p className="font-semibold text-[#002b5e]">{formData.scheme}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-gray-500 font-medium block mb-1">Category</span>
                        <p className="font-semibold text-lg text-[#002b5e]">{formData.complaintCategory}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium block mb-1">Description</span>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-sm border border-gray-100 whitespace-pre-wrap">{formData.description}</p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                      <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><Activity size={16} className="text-[#6a1b9a]"/> Enforcement</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Responsible Officer</span>
                          <p className="font-semibold">{formData.responsibleOfficer}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium block mb-1">Status</span>
                          <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${
                              formData.currentStatus === 'Pending' ? 'bg-red-100 text-red-800 border border-red-200' :
                              formData.currentStatus === 'Resolved' ? 'bg-green-100 text-green-800 border border-green-200' :
                              'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>{formData.currentStatus}</span>
                        </div>
                      </div>
                      {(formData.actionTaken || formData.remarks) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
                          {formData.actionTaken && (
                            <div>
                              <span className="text-gray-500 font-medium block mb-1">Action Taken</span>
                              <p className="text-gray-800">{formData.actionTaken}</p>
                            </div>
                          )}
                          {formData.remarks && (
                            <div>
                              <span className="text-gray-500 font-medium block mb-1">Remarks</span>
                              <p className="text-gray-800">{formData.remarks}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                  </div>
                  <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-4 shadow-md z-10">
                    <button onClick={() => setShowPreview(false)} className="px-6 py-2 border border-gray-300 hover:bg-gray-50 font-bold text-gray-700 transition-colors rounded-sm">
                      {lang === 'hi' ? 'संशोधन करें' : 'Edit Info'}
                    </button>
                    <button onClick={confirmSubmit} className="px-8 py-2 bg-[#1976d2] hover:bg-[#115293] font-bold text-white shadow-md flex items-center gap-2 transition-colors rounded-sm">
                      <Check size={18}/> {lang === 'hi' ? 'मास्टर सूची में सहेजें' : 'Save to Master List'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default ComplainForm;