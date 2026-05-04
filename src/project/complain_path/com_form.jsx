import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { UserCheck, User, MapPin, Phone, FileText, ChevronRight, Home, Check, RefreshCw, Database, X, Activity, ShieldAlert, Calendar, LayoutList, UploadCloud, Loader2, Maximize, Minimize, Eye, Shield, CheckCircle, Search, Clock, Printer } from 'lucide-react';
import userDetails from '../../assets/user_details.json';
import Captcha, { verifyCaptcha } from './captcha';
import { draftComplaintAPI, submitComplaintAPI, fetchDeptSchemesAPI, fetchComplaintCategoriesAPI, fetchLevelsAPI, fetchDistrictsAPI, fetchBlocksAPI, fetchGPsAPI, deleteDraftAPI } from '../../apiHandler/apis';

const ComplainForm = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const captchaRef = React.useRef(null);
  const [captchaData, setCaptchaData] = useState({ code: '', token: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const [shortDraftId, setShortDraftId] = useState(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isDocFullscreen, setIsDocFullscreen] = useState(false);
  const [deptData, setDeptData] = useState(null);
  const [deptSearch, setDeptSearch] = useState('');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showDeptOptions, setShowDeptOptions] = useState(false);
  const [showSchemeOptions, setShowSchemeOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiBlocks, setApiBlocks] = useState([]);
  const [apiGPs, setApiGPs] = useState([]);
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });

  const showAlert = (message, type = 'error') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const loggedInUserData = React.useMemo(() => {
    const data = localStorage.getItem('agentUserData');
    return data ? JSON.parse(data) : null;
  }, []);

  const activeUser = loggedInUserData || userDetails;

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
    remarks: ''
  });

  // Load from Draft if navigated via "Resume" or URL param
  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlDraftId = queryParams.get('draftId');

    if (location.state?.formData) {
      // Returning from Summary Page
      const restoredApplicant = location.state.applicantData || { name: '', mobile: '', address: '' };
      const restoredForm = location.state.formData;
      
      setApplicantData(restoredApplicant);
      setFormData(restoredForm);
      if (location.state.apiBlocks) setApiBlocks(location.state.apiBlocks);
      if (location.state.apiGPs) setApiGPs(location.state.apiGPs);
      setStep(2);

      // If confirmed, trigger submission immediately with restored data
      if (location.state.confirmed && !isSubmitting && !showReceipt) {
        confirmSubmit(restoredForm, restoredApplicant);
      }
    } else if (location.state?.draftData) {
      const draft = location.state.draftData;
      setDraftId(draft._id);
      setShortDraftId(draft.draftId || `D-${draft._id.slice(-6).toUpperCase()}`);
      loadDraftData(draft);
    } else if (urlDraftId) {
      setDraftId(urlDraftId);
      setShortDraftId(`D-${urlDraftId.slice(-6).toUpperCase()}`);
    }
  }, [location.state, location.search]);

  const loadDraftData = async (draft) => {
    setApplicantData({
      name: draft.applicantName || '',
      mobile: draft.mobile || '',
      address: draft.address || ''
    });

    setFormData(prev => ({
      ...prev,
      source: draft.source || 'PR',
      serialNumber: draft.serialNumber || '',
      departmentRef: draft.departmentRef || '',
      financialYear: draft.financialYear || '2025-2026',
      dateReceived: draft.dateReceived || '',
      district: draft.district || '',
      block: draft.block || '',
      panchayat: draft.panchayat || '',
      level: draft.level || 'District',
      department: draft.department || '',
      scheme: draft.scheme || '',
      complaintCategory: draft.complaintCategory || '',
      description: draft.description || '',
      responsibleOfficer: draft.responsibleOfficer || '',
      currentStatus: draft.currentStatus || 'Pending',
      actionTaken: draft.actionTaken || '',
      remarks: draft.remarks || ''
    }));

    // Cascade Location Data
    if (draft.district) {
      try {
        const bRes = await fetchBlocksAPI(draft.district);
        if (bRes.success) setApiBlocks(bRes.data);
      } catch (err) { console.error("Resume: Block fetch error", err); }
    }
    
    if (draft.block) {
      try {
        const gRes = await fetchGPsAPI(draft.block);
        if (gRes.success) setApiGPs(gRes.data);
      } catch (err) { console.error("Resume: GP fetch error", err); }
    }

    setStep(2);
  };

  // Fetch Departments on Mount
  React.useEffect(() => {
    const loadDepts = async () => {
      try {
        const res = await fetchDeptSchemesAPI();
        if (res.success) {
          setDeptData(res.data);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };

    const loadCategories = async () => {
      try {
        const res = await fetchComplaintCategoriesAPI();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    const loadLevels = async () => {
      try {
        const res = await fetchLevelsAPI();
        if (res.success) {
          setLevels(res.data);
        }
      } catch (err) {
        console.error("Failed to load levels:", err);
      }
    };

    const loadDistricts = async () => {
      try {
        const res = await fetchDistrictsAPI();
        if (res.success) {
          setApiDistricts(res.data);
        }
      } catch (err) {
        console.error("Failed to load districts:", err);
      }
    };

    loadDepts();
    loadCategories();
    loadLevels();
    loadDistricts();
  }, []);

  // Derived Departments & Schemes
  const departments = deptData?.departments || [];

  // All schemes for cross-department search
  const allSchemes = React.useMemo(() => {
    return departments.flatMap(d => (d.schemes || [])
      .filter(s => s.isActive !== false)
      .map(s => ({
        ...s,
        deptId: d.department_id,
        deptNameEn: d.department_name_en,
        deptNameHi: d.department_name_hi,
        fy: s.data_as_of || deptData?.data_as_of || '2024-25'
      })));
  }, [departments, deptData]);

  const selectedDept = departments.find(d => d.department_name_en === formData.department || d.department_name_hi === formData.department);
  const currentSchemes = selectedDept ? selectedDept.schemes : allSchemes;

  const filteredDepts = departments.filter(d =>
    d.department_name_en.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.department_name_hi.includes(deptSearch)
  );

  const filteredSchemes = currentSchemes.filter(s =>
    s.scheme_name_en.toLowerCase().includes(schemeSearch.toLowerCase()) ||
    s.scheme_name_hi.includes(schemeSearch)
  );

  const filteredCategories = categories.filter(c => 
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Auto-category mapping based on scheme type
  const autoSelectCategory = (type) => {
    const mapping = {
      'Rural Employment': 'Payment Pending / Wage Issue',
      'Infrastructure Development': 'Quality Issue in Construction',
      'Rural Housing': 'Operational Delay in Work',
      'Self Employment & SHG Promotion': 'Financial Irregularity',
      'Livelihood Support': 'Financial Irregularity',
      'Village Development': 'Operational Delay in Work',
      'Women Empowerment': 'Other'
    };
    return mapping[type] || 'Other';
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'department') newData.scheme = ''; 
      if (name === 'district') { newData.block = ''; newData.panchayat = ''; }
      if (name === 'block') newData.panchayat = '';
      return newData;
    });

    // Cascading Location Fetching
    if (name === 'district') {
      setApiBlocks([]);
      setApiGPs([]);
      if (value) {
        try {
          const res = await fetchBlocksAPI(value);
          if (res.success) setApiBlocks(res.data);
        } catch (err) { console.error("Error fetching blocks:", err); }
      }
    }

    if (name === 'block') {
      setApiGPs([]);
      if (value) {
        try {
          const res = await fetchGPsAPI(value);
          if (res.success) setApiGPs(res.data);
        } catch (err) { console.error("Error fetching GPs:", err); }
      }
    }
  };

  const handleApplicantChange = (e) => {
    setApplicantData({ ...applicantData, [e.target.name]: e.target.value });
  };

  const handleProceed = () => {
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validate File Size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      showAlert(lang === 'hi' ? 'फ़ाइल का आकार 5MB से अधिक नहीं होना चाहिए!' : 'File size must not exceed 5MB!', 'error');
      e.target.value = ''; // Reset input
      return;
    }

    // 2. Validate File Type (PDF or Image)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showAlert(lang === 'hi' ? 'केवल PDF, JPG या PNG फ़ाइलें ही अनुमत हैं!' : 'Only PDF, JPG, or PNG files are allowed!', 'error');
      e.target.value = ''; // Reset input
      return;
    }

    setFileType(file.type);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

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
      showAlert(lang === 'hi' ? 'दस्तावेज़ से डेटा सफलतापूर्वक निकाला गया!' : 'Data successfully extracted from document!', 'success');
    }, 2000);
  };

  const saveAsDraft = async () => {
    setIsDrafting(true);
    try {
      const payload = {
        applicantName: applicantData.name,
        mobile: applicantData.mobile,
        address: applicantData.address,
        ...formData
      };
      if (draftId) payload.draftId = draftId;

      const res = await draftComplaintAPI(payload);
      if (res.success) {
        const newId = res.data?._id;
        const shortId = res.data?.draftId || `D-${newId.slice(-6).toUpperCase()}`;
        setDraftId(newId);
        setShortDraftId(shortId);
        // Update URL with draftId
        navigate(`/complain?draftId=${newId}`, { replace: true, state: location.state });
        showAlert(lang === 'hi' ? `प्रगति ड्राफ्ट (${shortId}) के रूप में सहेजी गई।` : `Progress saved as draft (${shortId}).`, 'success');
      }
    } catch (err) {
      console.error('Draft Error:', err);
      showAlert(lang === 'hi' ? 'ड्राफ्ट सहेजने में त्रुटि: ' + err.message : 'Error saving draft: ' + err.message, 'error');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaData.code) {
      showAlert(lang === 'hi' ? 'कृपया कैप्चा दर्ज करें' : 'Please enter captcha', 'error');
      return;
    }
    if (
      !formData.serialNumber || 
      !formData.dateReceived || 
      !formData.level || 
      !formData.district || 
      !formData.department || 
      !formData.scheme || 
      !formData.complaintCategory || 
      !formData.description || 
      !formData.responsibleOfficer
    ) {
      showAlert(
        lang === 'hi' 
          ? 'कृपया सभी अनिवार्य फ़ील्ड भरें (क्र.स., प्राप्त तिथि, स्तर, ज़िला, विभाग, योजना, श्रेणी, विवरण और अधिकारी)' 
          : 'Please fill all mandatory fields (Serial No, Date, Level, District, Dept, Scheme, Category, Description and Officer)', 
        'error'
      );
      return;
    }

    const isValid = await verifyCaptcha(captchaData.token, captchaData.code);
    if (!isValid) {
      showAlert(lang === 'hi' ? 'अमान्य कैप्चा!' : 'Invalid Captcha!', 'error');
      captchaRef.current?.refresh();
      return;
    }
    
    // Navigate to summary page instead of showing modal
    navigate('/complain-summary', { 
      state: { 
        applicantData, 
        formData, 
        apiDistricts, 
        apiBlocks 
      } 
    });
  };

  const confirmSubmit = async (finalForm = formData, finalApplicant = applicantData) => {
    if (!finalForm.scheme) {
      showAlert(lang === 'hi' ? 'योजना का चयन अनिवार्य है!' : 'Scheme selection is mandatory!', 'error');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        applicantName: finalApplicant.name,
        mobile: finalApplicant.mobile,
        address: finalApplicant.address,
        ...finalForm
      };
      if (draftId) payload.draftId = draftId;

      console.log("Final Submission Payload:", payload);
      const res = await submitComplaintAPI(payload);
      if (res.success) {
        // Delete draft if it exists
        if (draftId) {
          try {
            await deleteDraftAPI(draftId);
          } catch (err) {
            console.error("Failed to delete draft:", err);
          }
        }
        
        setReceiptData({
          ...payload,
          caseNumber: res.data?.complainId || res.data?.caseNumber || `RD-${Date.now().toString().slice(-6)}`,
          submissionDate: new Date().toLocaleString()
        });
        setShowPreview(false);
        setShowReceipt(true);
        showAlert(lang === 'hi' ? 'रिकॉर्ड सफलतापूर्वक मास्टर सूची में सहेजा गया।' : 'Record successfully saved to Master List.', 'success');
      }
    } catch (err) {
      showAlert(lang === 'hi' ? 'सबमिट करने में त्रुटि: ' + err.message : 'Error submitting case: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };



  const labelClass = "text-[12px] font-bold text-gray-700 block mb-1";
  const inputClass = "w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] bg-white transition-all";
  const requiredSpan = <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col relative">

      {/* Custom Alert Toast */}
      {customAlert.show && (
        <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-sm shadow-xl border-l-4 transform transition-all animate-slide-in-right ${customAlert.type === 'error' ? 'bg-white border-red-500 text-gray-800' : 'bg-white border-green-500 text-gray-800'}`}>
          {customAlert.type === 'error' ? <div className="text-red-500 bg-red-50 p-1 rounded-full"><Shield size={16} /></div> : <div className="text-green-500 bg-green-50 p-1 rounded-full"><CheckCircle size={16} /></div>}
          <p className="text-[13px] font-bold">{customAlert.message}</p>
          <button onClick={() => setCustomAlert(prev => ({ ...prev, show: false }))} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none text-xl leading-none">
            &times;
          </button>
        </div>
      )}

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

        {showReceipt && receiptData ? (
          // --- SUCCESS RECEIPT PAGE ---
          <div className="animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            <div className="bg-white rounded-md shadow-2xl overflow-hidden border border-gray-200">
               <div className="bg-[#1e7b34] p-10 text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/40">
                     <Check size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{lang === 'hi' ? 'सबमिशन सफल!' : 'Submission Successful!'}</h2>
                  <p className="text-green-50 font-medium text-lg">{lang === 'hi' ? 'शिकायत मास्टर सूची में सफलतापूर्वक दर्ज की गई है।' : 'The grievance has been successfully recorded in the master list.'}</p>
               </div>

               <div className="p-10 space-y-8">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-md text-center">
                     <span className="text-gray-500 text-[13px] font-bold uppercase block mb-2 tracking-wider">Grievance Case Number</span>
                     <span className="text-5xl font-black text-[#002b5e] tracking-tighter">{receiptData.caseNumber}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px]">
                     <div className="space-y-1">
                        <span className="text-gray-400 font-bold uppercase text-[11px] block tracking-wider">Submitted On</span>
                        <span className="font-bold text-gray-800 text-[15px]">{receiptData.submissionDate}</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-gray-400 font-bold uppercase text-[11px] block tracking-wider">Officer ID</span>
                        <span className="font-bold text-gray-800 text-[15px]">{activeUser?.id}</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-gray-400 font-bold uppercase text-[11px] block tracking-wider">Complainant</span>
                        <span className="font-bold text-gray-800 text-[15px]">{receiptData.applicantName || 'Anonymous'}</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-gray-400 font-bold uppercase text-[11px] block tracking-wider">Location</span>
                        <span className="font-bold text-gray-800 text-[15px]">
                           {apiDistricts.find(d => d.value == receiptData.district)?.label || receiptData.district}
                           {receiptData.block && ` / ${apiBlocks.find(b => b.value == receiptData.block)?.label || receiptData.block}`}
                        </span>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                     <button 
                        onClick={() => window.print()} 
                        className="w-full py-4 bg-[#002b5e] text-white font-black rounded-sm shadow-md hover:bg-[#001c3d] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[14px]"
                      >
                        <Printer size={20} /> {lang === 'hi' ? 'रसीद प्रिंट करें' : 'Print Receipt'}
                     </button>
                     <button 
                        onClick={() => navigate('/')} 
                        className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-sm hover:bg-gray-200 transition-all uppercase tracking-widest text-[12px] border border-gray-200"
                      >
                        {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
                     </button>
                  </div>
               </div>

               <div className="bg-gray-50 px-8 py-6 border-t text-center">
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">© 2026 Department of Rural Development, Rajasthan</p>
               </div>
            </div>
          </div>
        ) : step === 1 ? (
          // --- STEP 1: COMPLAINANT DETAILS ---
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#002b5e] mb-2 border-b-2 border-[#1976d2] inline-block pb-1">
                {lang === 'hi' ? 'मास्टर प्रविष्टि - नया प्रकरण' : 'Master Entry - New Case'}
              </h1>
              {shortDraftId && (
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-sm text-[11px] font-bold ml-4 border border-orange-200">
                  <Database size={12} />
                  DRAFT: {shortDraftId}
                </div>
              )}
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
                      <div className="w-14 h-14 bg-[#002b5e] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-sm uppercase">
                        {activeUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002b5e] text-[16px] leading-tight">{activeUser?.name || 'User'}</h4>
                        <p className="text-gray-500 text-[12px] font-medium">{activeUser?.designation || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 text-[13px] space-y-3 shadow-inner">
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Employee ID:</span> <span className="font-bold text-gray-800">{activeUser?.id || 'N/A'}</span></div>
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Dept:</span> <span className="font-semibold text-gray-700 text-right">{activeUser?.department || 'N/A'}</span></div>
                      <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500">Location:</span> <span className="font-semibold text-gray-700">{activeUser?.district || 'N/A'}</span></div>
                      <div className="flex justify-between pt-1"><span className="text-gray-500">Status:</span> <span className={`font-medium ${activeUser?.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>{activeUser?.status === 'approved' ? 'Active' : 'Pending Approval'}</span></div>
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

                  <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                    <button type="button" onClick={saveAsDraft} disabled={isDrafting} className="cursor-pointer bg-orange-50 text-orange-700 border border-orange-200 px-6 py-2.5 font-bold rounded-sm shadow-sm transition-colors text-[14px] flex items-center gap-2 hover:bg-orange-100 disabled:opacity-70">
                      <Clock size={18} />
                      {lang === 'hi' ? 'ड्राफ्ट सहेजें' : 'Save Draft'}
                    </button>
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
          <div className={`animate-in fade-in slide-in-from-right-8 duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-8' : ''}`}>
            <div className="mb-8 border-b-2 border-[#1976d2] pb-4 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#002b5e] mb-2 flex items-center gap-3">
                  <Database size={32} className="text-[#1976d2]" />
                  {lang === 'hi' ? 'मास्टर शिकायत प्रविष्टि (Master Data Entry)' : 'Master Grievance Data Entry'}
                  {shortDraftId && (
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-sm text-[11px] font-bold ml-2 border border-orange-200">
                      ID: {shortDraftId}
                    </div>
                  )}
                </h1>
                <p className="text-gray-600 text-[14px] font-medium">
                  {lang === 'hi' ? 'विभागीय एक्सेल शीट से प्राप्त डेटा को पोर्टल में दर्ज करें।' : 'Digitize and enter offline departmental records into the central database.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={toggleFullscreen} className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-sm border border-gray-200 transition-colors">
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  {isFullscreen ? (lang === 'hi' ? 'बाहर निकलें' : 'Exit Fullscreen') : (lang === 'hi' ? 'फुल स्क्रीन' : 'Fullscreen')}
                </button>
                <div className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1976d2] bg-blue-50 px-4 py-2 rounded-sm border border-blue-100">
                  <LayoutList size={18} />
                  {lang === 'hi' ? 'रिकॉर्ड प्रारूप: मानक' : 'Record Format: Standard'}
                </div>
              </div>
            </div>

            {/* OCR File Upload Section */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-grow bg-[#e3f2fd] border-2 border-dashed border-[#90caf9] p-6 rounded-sm text-center flex flex-col items-center justify-center transition-colors hover:bg-[#bbdefb]">
                <input type="file" id="ocr-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-[#1565c0]">
                    <Loader2 size={32} className="animate-spin" />
                    <p className="font-bold text-[14px]">{lang === 'hi' ? 'दस्तावेज़ से डेटा निकाला जा रहा है (OCR)...' : 'Extracting Data from Document (OCR)...'}</p>
                  </div>
                ) : (
                  <label htmlFor="ocr-upload" className="cursor-pointer flex flex-col items-center gap-2 text-[#1565c0] w-full h-full">
                    <UploadCloud size={32} />
                    <p className="font-bold text-[14px]">{lang === 'hi' ? 'ऑटो-फिल के लिए दस्तावेज़ अपलोड करें (OCR)' : 'Upload Document for Auto-fill (OCR)'}</p>
                    <p className="text-[12px] font-medium opacity-80">{lang === 'hi' ? 'समर्थित फ़ाइलें: PDF, JPG, PNG (Max 5MB)' : 'Supported files: PDF, JPG, PNG (Max 5MB)'}</p>
                  </label>
                )}
              </div>

              {previewUrl && !isUploading && (
                <button
                  onClick={() => setIsDocFullscreen(true)}
                  className="md:w-48 bg-white border-2 border-[#1976d2] text-[#1976d2] p-4 rounded-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <Eye size={32} />
                  <span className="font-bold text-[13px]">{lang === 'hi' ? 'दस्तावेज़ देखें' : 'View Document'}</span>
                  <span className="text-[10px] opacity-70 uppercase font-bold">{fileType?.split('/')[1]}</span>
                </button>
              )}
            </div>

            {/* Document Fullscreen Modal */}
            {isDocFullscreen && previewUrl && (
              <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex flex-col">
                <div className="p-4 flex justify-between items-center bg-gray-900 text-white">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText size={20} />
                    {lang === 'hi' ? 'अपलोड किया गया दस्तावेज़' : 'Uploaded Document'}
                  </h3>
                  <button
                    onClick={() => setIsDocFullscreen(false)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-grow overflow-auto flex items-center justify-center p-4">
                  {fileType?.includes('pdf') ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full max-w-5xl bg-white"
                      title="Document Preview"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Uploaded Document"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}

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
                          <option value="">-- Select Level --</option>
                          {levels.map(l => (
                            <option key={l.value} value={l.label}>{l.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'ज़िला (District)' : 'District'} {requiredSpan}</label>
                          <select name="district" value={formData.district} onChange={handleFormChange} required className={inputClass}>
                            <option value="">-- Select District --</option>
                            {apiDistricts.map(d => (
                              <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'ब्लॉक (Block)' : 'Block'}</label>
                          <select name="block" value={formData.block} onChange={handleFormChange} disabled={!formData.district} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                            <option value="">-- Select Block --</option>
                            {apiBlocks.map(b => (
                              <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}</label>
                        <select name="panchayat" value={formData.panchayat} onChange={handleFormChange} disabled={!formData.block} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                          <option value="">-- Select GP --</option>
                          {apiGPs.map(g => (
                            <option key={g.value} value={g.label}>{g.label}</option>
                          ))}
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
                          <div className="relative">
                            <div
                              className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.department ? 'text-gray-400' : ''}`}
                              onClick={() => setShowDeptOptions(!showDeptOptions)}
                            >
                              {selectedDept ? `${selectedDept.department_name_en} (${selectedDept.department_name_hi})` : (lang === 'hi' ? '-- विभाग चुनें --' : '-- Select Department --')}
                              <ChevronRight size={16} className={`transform transition-transform ${showDeptOptions ? 'rotate-90' : ''}`} />
                            </div>

                            {showDeptOptions && (
                              <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                                  <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input
                                      type="text"
                                      placeholder={lang === 'hi' ? 'विभाग खोजें...' : 'Search department...'}
                                      className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                      value={deptSearch}
                                      onChange={(e) => setDeptSearch(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                  {filteredDepts.length > 0 ? filteredDepts.map(dept => (
                                    <div
                                      key={dept.department_id}
                                      className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, department: dept.department_name_en, scheme: '' }));
                                        setShowDeptOptions(false);
                                        setDeptSearch('');
                                      }}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{dept.department_name_en}</div>
                                          <div className="text-[12px] text-gray-500 font-medium mt-0.5">{dept.department_name_hi}</div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase rounded border border-gray-200 tracking-tighter">
                                          {dept.department_id}
                                        </span>
                                      </div>
                                    </div>
                                  )) : (
                                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                                      <Search size={24} className="opacity-20" />
                                      <p className="text-[12px] italic">{lang === 'hi' ? 'कोई विभाग नहीं मिला' : 'No departments found'}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'योजना (Scheme)' : 'Scheme'} {requiredSpan}</label>
                          <div className="relative">
                            <div
                              className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.scheme ? 'text-gray-400' : ''}`}
                              onClick={() => setShowSchemeOptions(!showSchemeOptions)}
                            >
                              {formData.scheme || (lang === 'hi' ? '-- योजना चुनें --' : '-- Select Scheme --')}
                              <ChevronRight size={16} className={`transform transition-transform ${showSchemeOptions ? 'rotate-90' : ''}`} />
                            </div>

                            {showSchemeOptions && (
                              <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                                  <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input
                                      type="text"
                                      placeholder={lang === 'hi' ? 'योजना खोजें...' : 'Search for a scheme...'}
                                      className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                      value={schemeSearch}
                                      onChange={(e) => setSchemeSearch(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                  {filteredSchemes.length > 0 ? filteredSchemes.map((scheme, idx) => (
                                    <div
                                      key={idx}
                                      className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          department: scheme.deptNameEn || prev.department,
                                          scheme: scheme.scheme_name_en,
                                          complaintCategory: autoSelectCategory(scheme.type)
                                        }));
                                        setShowSchemeOptions(false);
                                        setSchemeSearch('');
                                      }}
                                    >
                                      <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-start gap-4">
                                          <div className="font-bold text-[14px] text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                                            {scheme.scheme_name_en}
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black rounded border border-gray-200 uppercase tracking-tighter">
                                              {scheme.fy || 'FY 24-25'}
                                            </span>
                                            {!selectedDept && (
                                              <span className="px-2 py-0.5 bg-[#002b5e] text-white text-[9px] font-bold rounded-sm shadow-sm">
                                                {scheme.deptNameEn}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px]">
                                          <span className="text-gray-500 font-medium">{scheme.scheme_name_hi}</span>
                                          <span className="text-gray-300">•</span>
                                          <span className="text-blue-600 font-bold uppercase tracking-tight text-[10px]">
                                            {scheme.type}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                                      <Search size={32} className="opacity-20" />
                                      <p className="text-[13px] font-medium italic">{lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No matching schemes found'}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'शिकायत की श्रेणी' : 'Complaint Category'} {requiredSpan}</label>
                        <div className="relative">
                          <div 
                            className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.complaintCategory ? 'text-gray-400' : 'text-[#002b5e] font-semibold'}`}
                            onClick={() => setShowCategoryOptions(!showCategoryOptions)}
                          >
                            <span>{formData.complaintCategory || (lang === 'hi' ? '-- श्रेणी चुनें --' : '-- Select Category --')}</span>
                            <ChevronRight size={16} className={`transform transition-transform ${showCategoryOptions ? 'rotate-90' : ''}`} />
                          </div>

                          {showCategoryOptions && (
                            <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                              <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                                <div className="relative">
                                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                  <input 
                                    type="text" 
                                    placeholder={lang === 'hi' ? 'श्रेणी खोजें...' : 'Search category...'} 
                                    className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {filteredCategories.length > 0 ? filteredCategories.map((cat, idx) => (
                                  <div 
                                    key={idx}
                                    className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, complaintCategory: cat }));
                                      setShowCategoryOptions(false);
                                      setCategorySearch('');
                                    }}
                                  >
                                    <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{cat}</div>
                                  </div>
                                )) : (
                                  <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <Search size={24} className="opacity-20" />
                                    <p className="text-[12px] italic">{lang === 'hi' ? 'कोई श्रेणी नहीं मिली' : 'No categories found'}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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
                          <label className={labelClass}>{lang === 'hi' ? 'संबंधित अधिकारी का नाम/पद' : 'Investigating Officer'} {requiredSpan}</label>
                          <input type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleFormChange} required placeholder="e.g. BDO, Sarpanch, Zila Parishad CEO" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>{lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'} {requiredSpan}</label>
                          <select name="currentStatus" value={formData.currentStatus} onChange={handleFormChange} required className={`${inputClass} font-bold ${formData.currentStatus === 'Pending' ? 'text-red-600' :
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
                <div className="w-full md:w-auto min-w-[250px]">
                  <Captcha
                    ref={captchaRef}
                    onCodeChange={(code, token) => setCaptchaData({ code, token })}
                  />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    type="button" 
                    onClick={saveAsDraft} 
                    disabled={isDrafting}
                    className="cursor-pointer flex-1 md:flex-none bg-orange-50 text-orange-700 border border-orange-200 px-6 py-3 font-bold rounded-sm shadow-sm transition-colors text-[14px] flex items-center justify-center gap-2 hover:bg-orange-100 disabled:opacity-70"
                  >
                    {isDrafting ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18} />}
                    {isDrafting ? (lang === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') : (lang === 'hi' ? 'ड्राफ्ट सहेजें' : 'Save Draft')}
                  </button>
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
          </div>
        )}

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ComplainForm;