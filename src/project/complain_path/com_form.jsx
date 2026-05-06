import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { UserCheck, User, MapPin, Phone, Smartphone, ChevronRight, Home, Check, RefreshCw, Database, X, Activity, ShieldAlert, Calendar, LayoutList, UploadCloud, Loader2, Maximize, Minimize, Eye, EyeOff, Shield, CheckCircle, Search, Clock, Printer, FileUp, Trash2, ArrowRight, ArrowLeft, FileSearch, ScanLine } from 'lucide-react';
import userDetails from '../../assets/user_details.json';
import Captcha, { verifyCaptcha } from './captcha';
import { SERVER_URL, draftComplaintAPI, submitComplaintAPI, fetchDeptSchemesAPI, fetchComplaintCategoriesAPI, fetchLevelsAPI, fetchDistrictsAPI, fetchBlocksAPI, fetchGPsAPI, deleteDraftAPI } from '../../apiHandler/apis';

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
  const [ocrFile, setOcrFile] = useState(null);
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
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [advancedDocs, setAdvancedDocs] = useState({});
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });

  const showAlert = (message, type = 'error') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 4000);
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
    financialYear: '2026-27',
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
    actionTaken: '',
    remarks: '',
    caseStatus: 'Pending',
    pendingLevel: '',
    accountFreeze: 'No',
    firInstruction: 'No',
    enquiryStatus: 'Pending',
    deptLetter: 'No',
    recoverableAmount: '',
    amountRecovered: '',
    showCauseNotice: 'No',
    suspensionOrdered: 'No',
    terminationOrdered: 'No',
    firCasesFiled: ''
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

  // Lock body scroll when advanced details modal is open
  React.useEffect(() => {
    if (showAdvancedDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAdvancedDetails]);

  const loadDraftData = async (draft) => {
    const profile = draft.complain_profile || {};
    const complainer = profile.complainer || {};
    const core = draft.core_case_information || {};
    const geo = draft.geographic_information || {};
    const specifics = draft.case_specifics || {};
    const advanced = draft.advanced_details || {};

    setApplicantData({
      name: complainer.name || '',
      mobile: complainer.mobile || '',
      address: complainer.address || ''
    });

    setFormData(prev => ({
      ...prev,
      source: core.source || 'PR',
      serialNumber: core.serial_no || '',
      departmentRef: core.department_ref || '',
      financialYear: core.fy || '2026-27',
      dateReceived: core.date || '',
      district: geo.district || '',
      block: geo.block || '',
      panchayat: geo.gram_panchayat || '',
      level: geo.level || 'District',
      department: specifics.department || '',
      scheme: specifics.scheme || '',
      complaintCategory: specifics.complaint_category || '',
      description: specifics.complain_details || '',
      responsibleOfficer: specifics.responsible_officer || '',
      currentStatus: specifics.current_status || 'Pending',
      actionTaken: specifics.action_taken || '',
      remarks: specifics.remarks || '',
      caseStatus: advanced.case_status || 'Pending',
      pendingLevel: advanced.pending_level || '',
      accountFreeze: advanced.account_freeze || 'No',
      firInstruction: advanced.fir_instruction || 'No',
      enquiryStatus: advanced.enquiry_status || 'Pending',
      deptLetter: advanced.dept_letter || 'No',
      recoverableAmount: advanced.recoverable_amount || '',
      amountRecovered: advanced.amount_recovered || '',
      showCauseNotice: advanced.show_cause_notice || 'No',
      suspensionOrdered: advanced.suspension_ordered || 'No',
      terminationOrdered: advanced.termination_ordered || 'No',
      firCasesFiled: advanced.fir_cases_filed || ''
    }));

    // Restore Advanced Docs (Paths from DB)
    const docs = {};
    if (profile.document) docs.complaintCopy = profile.document;
    if (advanced.account_freeze_doc) docs.accountFreeze = advanced.account_freeze_doc;
    if (advanced.fir_instruction_doc) docs.firInstruction = advanced.fir_instruction_doc;
    if (advanced.dept_letter_doc) docs.deptLetter = advanced.dept_letter_doc;
    if (advanced.show_cause_notice_doc) docs.showCauseNotice = advanced.show_cause_notice_doc;
    if (advanced.suspension_ordered_doc) docs.suspensionOrdered = advanced.suspension_ordered_doc;
    if (advanced.termination_ordered_doc) docs.terminationOrdered = advanced.termination_ordered_doc;
    setAdvancedDocs(docs);

    // If there is a complaint copy, show a preview if it's an image
    if (profile.document) {
      setPreviewUrl(`${SERVER_URL}/${profile.document.replace(/\\/g, '/')}`);
      setFileType(profile.document.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    }

    // Cascade Location Data
    if (geo.district) {
      try {
        const bRes = await fetchBlocksAPI(geo.district);
        if (bRes.success) setApiBlocks(bRes.data);
      } catch (err) { console.error("Resume: Block fetch error", err); }
    }

    if (geo.block) {
      try {
        const gRes = await fetchGPsAPI(geo.block);
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
    setOcrFile(file);

    // Automatically link this to the official complaint copy field for submission
    setAdvancedDocs(prev => ({ ...prev, complaintCopy: file }));

    showAlert(lang === 'hi' ? 'दस्तावेज़ सफलतापूर्वक लिंक किया गया!' : 'Document ready for entry & archive!', 'success');
  };

  const handleAutoFillScan = () => {
    if (!ocrFile) {
      showAlert(lang === 'hi' ? 'कृपया पहले दस्तावेज़ अपलोड करें!' : 'Please upload a document first!', 'error');
      return;
    }

    setIsUploading(true);

    // Simulating OCR extraction with more professional/varied data
    const scenarios = [
      {
        source: 'CS',
        serialNumber: `RJ-RD-${Math.floor(1000 + Math.random() * 9000)}`,
        departmentRef: `SEC/RD/2026/${Math.floor(100 + Math.random() * 900)}`,
        financialYear: '2026-27',
        dateReceived: new Date().toISOString().split('T')[0],
        district: 'Ajmer',
        level: 'District',
        department: 'Rural Development',
        scheme: 'Mahatma Gandhi NREGA',
        complaintCategory: 'Wages Payment Issue',
        description: 'Muster roll payment delayed for 3 consecutive weeks for workers in the block. Total affected workers: 42. Immediate clearance required.',
        responsibleOfficer: 'BDO (Ajmer)',
        currentStatus: 'In-Progress',
        actionTaken: 'Payment process initiated in system.',
        remarks: 'Priority: High'
      },
      {
        source: 'PR',
        serialNumber: `ML-REF-${Math.floor(1000 + Math.random() * 9000)}`,
        departmentRef: `MLA/OFFICE/V/${Math.floor(10 + Math.random() * 90)}`,
        financialYear: '2026-27',
        dateReceived: '2026-05-01',
        district: 'Bikaner',
        level: 'Block',
        department: 'Panchayati Raj',
        scheme: 'SBM-G (Toilet Construction)',
        complaintCategory: 'Incomplete Construction',
        description: 'Verification of 12 community toilets shows that only 4 are functional. Remaining units lack water connection and proper flooring despite full fund disbursement.',
        responsibleOfficer: 'J.En (Panchayati Raj)',
        currentStatus: 'Pending',
        actionTaken: 'Explanation call issued to Sarpanch.',
        remarks: 'Physical audit required.'
      }
    ];

    const randomCase = scenarios[Math.floor(Math.random() * scenarios.length)];

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        ...randomCase
      }));
      setIsUploading(false);
      showAlert(lang === 'hi' ? 'दस्तावेज़ से डेटा सफलतापूर्वक निकाला गया!' : 'Data successfully extracted from document!', 'success');
    }, 2000);
  };

  const saveAsDraft = async () => {
    setIsDrafting(true);
    try {
      const data = new FormData();

      // Basic Info
      data.append('applicantName', applicantData.name);
      data.append('mobile', applicantData.mobile);
      data.append('address', applicantData.address);

      // Form Fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Draft ID if exists
      if (draftId) data.append('draftId', draftId);

      // Advanced Documents & Existing Paths
      Object.keys(advancedDocs).forEach(key => {
        const val = advancedDocs[key];
        if (val instanceof File) {
          data.append(key, val);
        } else if (typeof val === 'string') {
          // Send back the existing path so backend knows to keep it
          data.append(`${key}Doc`, val);
        }
      });

      const res = await draftComplaintAPI(data);
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
      const data = new FormData();

      // Basic Info
      data.append('applicantName', finalApplicant.name);
      data.append('mobile', finalApplicant.mobile);
      data.append('address', finalApplicant.address);

      // Form Fields
      Object.keys(finalForm).forEach(key => {
        data.append(key, finalForm[key]);
      });

      // Draft ID if exists - Backend will handle deletion
      if (draftId) data.append('draftId', draftId);

      // Advanced Documents & Existing Paths
      Object.keys(advancedDocs).forEach(key => {
        const val = advancedDocs[key];
        if (val instanceof File) {
          data.append(key, val);
        } else if (typeof val === 'string') {
          // Send back the existing path so backend knows to keep it
          // We use the same field name suffix as the model for clarity or specific logic
          data.append(`${key}Doc`, val);
        }
      });

      const res = await submitComplaintAPI(data);
      if (res.success) {
        const finalReceiptData = {
          applicantName: finalApplicant.name,
          mobile: finalApplicant.mobile,
          address: finalApplicant.address,
          district: finalForm.district,
          block: finalForm.block,
          department: finalForm.department,
          scheme: finalForm.scheme,
          description: finalForm.description,
          caseNumber: res.data?.complainId || res.data?.caseNumber || `RD-${Date.now().toString().slice(-6)}`,
          submissionDate: new Date().toLocaleString()
        };

        setReceiptData(finalReceiptData);
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
          // --- FORMAL RECEIVING COPY (ACKNOWLEDGMENT) ---
          <div className="animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
            <div className="bg-white border-2 border-gray-800 shadow-2xl p-0 relative overflow-hidden print:border-0 print:shadow-none">

              {/* Official Header */}
              <div className="bg-[#f8f9fa] border-b-2 border-gray-800 p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-[#002b5e] p-2 rounded-sm flex items-center justify-center">
                    <img src="/rajasthan_logo.png" alt="Govt. Logo" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-[#002b5e] uppercase tracking-tight leading-none mb-1">Government of Rajasthan</h1>
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">{lang === 'hi' ? 'ग्रामीण विकास एवं पंचायती राज विभाग' : 'Dept of Rural Development & PR'}</h2>
                    <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase mt-1">Integrated Grievance Monitoring System (IGMS)</p>
                  </div>
                </div>
                <div className="text-right border-l-2 border-gray-200 pl-6 hidden sm:block">
                  <div className="bg-gray-800 text-white px-3 py-1 text-[12px] font-black uppercase tracking-widest mb-1">Acknowledgment</div>
                  <div className="text-[10px] font-bold text-gray-400">Date: {receiptData.submissionDate.split(',')[0]}</div>
                </div>
              </div>

              {/* Case ID Box */}
              <div className="bg-white px-8 py-6 border-b-2 border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 border border-gray-300">
                    <Database size={24} className="text-gray-800" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Grievance Case Number</p>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{receiptData.caseNumber}</h3>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border-2 border-blue-800 text-blue-800`}>
                    Status: New
                  </span>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="p-8">
                <div className="mb-8">
                  <h4 className="text-[13px] font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <User size={16} /> 1. Complainant Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Name of Complainant</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.applicantName || 'Not Provided'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Contact Number</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.mobile ? `+91 ${receiptData.mobile}` : 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Residential Address</label>
                      <p className="font-bold text-gray-800 text-[14px] leading-relaxed">{receiptData.address || 'Address not recorded'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[13px] font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Shield size={16} /> 2. Grievance Allocation Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Target Department</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.department || 'General Administration'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Scheme / Service</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.scheme || 'Not Specified'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Area Jurisdiction</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.district}, {receiptData.block}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Level</label>
                      <p className="font-bold text-gray-800 text-[14px]">{receiptData.level}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 p-6 mb-8">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-2">Subject / Description of Grievance</label>
                  <p className="text-[14px] font-medium text-gray-700 italic leading-relaxed">
                    "{receiptData.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-2 border-dashed border-gray-300">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-10">Digital Acknowledgment Sign</p>
                    <div className="inline-block border-b-2 border-gray-800 pb-1 px-4">
                      <span className="font-serif italic text-xl font-bold">IGMS Official</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 mt-2">Nodal Officer, IGMS Rajasthan</p>
                  </div>
                  <div className="bg-gray-100 p-4 border border-gray-200 flex items-start gap-3">
                    <Shield size={16} className="shrink-0 text-gray-300" />
                    <p className="text-[11px] text-gray-500 font-medium leading-normal">
                      {lang === 'hi'
                        ? 'कृपया भविष्य के संदर्भ के लिए इस पावती प्रति को सुरक्षित रखें। आप पोर्टल पर अपनी शिकायत संख्या का उपयोग करके स्थिति की जांच कर सकते हैं।'
                        : 'Please keep this acknowledgment copy for future reference. You can track the status of your grievance using the Case Number on the official portal.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="bg-gray-100 p-6 flex flex-col md:flex-row gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-[#002b5e] text-white py-3 font-black rounded-sm shadow-md hover:bg-[#001c3d] flex items-center justify-center gap-3 uppercase tracking-widest text-[13px]"
                >
                  <Printer size={18} /> {lang === 'hi' ? 'पावती प्रिंट करें' : 'Print Acknowledgment'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 font-bold rounded-sm hover:bg-gray-50 uppercase tracking-widest text-[12px]"
                >
                  {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
                </button>
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
              {/* Left Column - Officer Details Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#002b5e] text-white p-5 rounded-sm shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <User size={80} />
                  </div>
                  <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-2">
                    <Shield size={20} className="text-orange-400" />
                    <h2 className="font-bold text-[14px] uppercase tracking-widest">{lang === 'hi' ? 'प्रविष्टि अधिकारी' : 'Entry Officer'}</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter">Officer Name</label>
                      <p className="font-bold text-[15px]">{activeUser?.name || 'Nodal Officer'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter">Department / ID</label>
                      <p className="font-bold text-[13px] text-blue-50 tracking-wide">{activeUser?.department || 'Rural Development'} / {activeUser?.id || 'OFF-001'}</p>
                    </div>
                    <div className="pt-2">
                      <div className="bg-white/10 px-3 py-2 rounded-sm border border-white/10">
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <Clock size={14} className="text-orange-400" />
                          <span>Session Active: {new Date().toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                  <h3 className="font-bold text-[#002b5e] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <LayoutList size={16} /> {lang === 'hi' ? 'दिशानिर्देश' : 'Guidelines'}
                  </h3>
                  <ul className="space-y-2 text-[11px] text-gray-500 font-medium">
                    <li className="flex gap-2">
                      <span className="text-[#1976d2]">•</span>
                      <span>{lang === 'hi' ? 'सभी फ़ील्ड स्पष्ट अक्षरों में भरें।' : 'Fill all fields in clear block letters.'}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#1976d2]">•</span>
                      <span>{lang === 'hi' ? 'आधार या पहचान पत्र से नाम का मिलान करें।' : 'Verify name with ID proof if available.'}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#1976d2]">•</span>
                      <span>{lang === 'hi' ? 'मोबाइल नंबर पर OTP प्राप्त हो सकता है।' : 'Mobile number may receive OTP updates.'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Complainant Form */}
              <div className="lg:col-span-8">
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-200">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'परिवादी का नाम' : 'Complainant Name'} {requiredSpan}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={applicantData.name}
                            onChange={handleApplicantChange}
                            placeholder="Full Name"
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} {requiredSpan}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Smartphone size={16} />
                          </div>
                          <input
                            type="text"
                            name="mobile"
                            value={applicantData.mobile}
                            onChange={handleApplicantChange}
                            placeholder="10-digit mobile number"
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'परिवादी का पता' : 'Complainant Address'} {requiredSpan}</label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 pl-3 pointer-events-none text-gray-400">
                          <Home size={16} />
                        </div>
                        <textarea
                          name="address"
                          value={applicantData.address}
                          onChange={handleApplicantChange}
                          rows="3"
                          placeholder="Complete residential address"
                          className={`${inputClass} pl-10 pt-2`}
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                      <p className="text-[11px] text-gray-400 font-medium italic">
                        {lang === 'hi' ? '* सभी जानकारी सुरक्षित और गोपनीय है।' : '* All information is securely encrypted.'}
                      </p>
                      <button
                        onClick={handleProceed}
                        className="bg-[#002b5e] hover:bg-[#001c3d] text-white px-10 py-3 rounded-sm font-black uppercase tracking-widest text-[13px] shadow-lg transition-all flex items-center gap-3"
                      >
                        {lang === 'hi' ? 'अगला चरण' : 'Next Step'}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // --- STEP 2: GRIEVANCE DETAILS ---
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <h1 className="text-2xl font-bold text-[#002b5e]">
                    {lang === 'hi' ? 'शिकायत का विस्तृत विवरण' : 'Detailed Grievance Entry'}
                  </h1>
                </div>
                <div className="flex items-center gap-2 ml-10">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                    {lang === 'hi' ? 'परिवादी:' : 'Complainant:'} <span className="text-[#1976d2]">{applicantData.name || 'Anonymous'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {shortDraftId && (
                  <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-sm text-[11px] font-black border border-orange-200 flex items-center gap-2 uppercase tracking-tighter">
                    <Clock size={14} /> Draft Saved
                  </div>
                )}
                <div className="bg-[#e3f2fd] text-[#1976d2] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-[#bbdefb]">
                  Step 2 of 2
                </div>
              </div>
            </div>

            {/* OCR / Document Upload Section */}
            <div className="mb-8 bg-gradient-to-br from-[#002b5e] to-[#004d40] p-1 rounded-sm shadow-xl">
              <div className="bg-white p-6 rounded-sm">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Left: Upload Interface */}
                  <div className="w-full lg:w-1/2 space-y-5">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <FileSearch size={22} className="text-[#002b5e]" />
                      <h2 className="font-black text-[16px] text-gray-900 uppercase tracking-tight">{lang === 'hi' ? 'दस्तावेज़ विश्लेषण और संग्रह' : 'Document Analysis & Archive'}</h2>
                    </div>

                    <div className="relative group">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf,image/*"
                      />
                      <div className={`border-2 border-dashed rounded-md p-8 text-center transition-all ${ocrFile ? 'border-green-500 bg-green-50/30' : 'border-gray-300 group-hover:border-[#002b5e] bg-gray-50'}`}>
                        {ocrFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-green-100 p-3 rounded-full text-green-600 mb-2">
                              <CheckCircle size={32} />
                            </div>
                            <span className="font-black text-[14px] text-gray-900 truncate max-w-xs">{ocrFile.name}</span>
                            <span className="text-[10px] font-bold text-green-600 uppercase">File Attached Successfully</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-100 p-3 rounded-full text-gray-400 mb-2">
                              <UploadCloud size={32} />
                            </div>
                            <span className="font-bold text-[14px] text-gray-700">{lang === 'hi' ? 'शिकायत की प्रति अपलोड करें' : 'Upload Complaint Copy'}</span>
                            <span className="text-[11px] text-gray-400">PDF, JPG, PNG (Max 5MB)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleAutoFillScan}
                        disabled={!ocrFile || isUploading}
                        className={`flex-1 py-3 px-4 rounded-sm font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${!ocrFile || isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 active:scale-95'}`}
                      >
                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ScanLine size={18} />}
                        {lang === 'hi' ? 'स्वचालित प्रविष्टि (Auto-Fill)' : 'Run Smart Extraction'}
                      </button>

                      {ocrFile && (
                        <button
                          type="button"
                          onClick={() => { setOcrFile(null); setPreviewUrl(''); setAdvancedDocs(p => ({ ...p, complaintCopy: null })); }}
                          className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-sm hover:bg-red-100 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-sm">
                      <div className="flex gap-3">
                        <Activity size={16} className="text-blue-600 shrink-0 mt-1" />
                        <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                          {lang === 'hi'
                            ? 'स्मार्ट एक्सट्रैक्शन दस्तावेज़ से प्रकरण संख्या, तिथि और विभाग को स्वचालित रूप से पहचानने का प्रयास करेगा।'
                            : 'Smart Extraction will attempt to automatically identify Case ID, Date, and Department from the uploaded document.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Document Preview */}
                  <div className="w-full lg:w-1/2">
                    <div className="bg-gray-900 rounded-sm overflow-hidden shadow-inner h-[380px] flex items-center justify-center relative border-4 border-gray-800">
                      {previewUrl ? (
                        fileType === 'application/pdf' ? (
                          <iframe src={previewUrl} className="w-full h-full" title="PDF Preview"></iframe>
                        ) : (
                          <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        )
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-gray-700 mb-4 flex justify-center">
                            <EyeOff size={48} />
                          </div>
                          <p className="text-gray-500 font-bold text-[13px] uppercase tracking-widest">{lang === 'hi' ? 'दस्तावेज़ का पूर्वावलोकन यहाँ दिखाई देगा' : 'Document preview will appear here'}</p>
                          <p className="text-gray-600 text-[11px] mt-2 italic">{lang === 'hi' ? 'कृपया अपलोड करने के बाद "स्मार्ट एक्सट्रैक्शन" चलाएं।' : 'Please run "Smart Extraction" after uploading.'}</p>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                        Secure View
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
              {/* Core Case Information */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Database size={18} className="text-[#1976d2]" />
                  <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'मुख्य प्रकरण विवरण' : 'Core Case Information'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>{lang === 'hi' ? 'स्रोत (Source)' : 'Source'}</label>
                    <select name="source" value={formData.source} onChange={handleFormChange} className={inputClass}>
                      <option value="PR">PR (Panchayati Raj)</option>
                      <option value="CS">CS (Chief Secretary Office)</option>
                      <option value="MLA">MLA Reference</option>
                      <option value="MP">MP Reference</option>
                      <option value="Direct">Direct Portal</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'hi' ? 'सीरियल / रिफ क्र.' : 'Serial / Ref No.'} {requiredSpan}</label>
                    <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleFormChange} required placeholder="e.g. RJ-2026-001" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'hi' ? 'प्राप्त तिथि' : 'Date Received'} {requiredSpan}</label>
                    <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleFormChange} required className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-8">
                  {/* Geographic Location */}
                  <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
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
                            <option key={l._id} value={l.levelName}>{l.levelName}</option>
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

                    <div className="pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
                        className={`w-full py-3 px-4 rounded-sm font-bold text-[13px] flex items-center justify-center gap-3 transition-all border-2 ${showAdvancedDetails
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                          : 'bg-white text-orange-600 border-orange-600 hover:bg-orange-50'
                          }`}
                      >
                        {showAdvancedDetails ? <Minimize size={18} /> : <LayoutList size={18} />}
                        {showAdvancedDetails
                          ? (lang === 'hi' ? 'अतिरिक्त विवरण छिपाएं' : 'Hide Advanced Details')
                          : (lang === 'hi' ? 'अतिरिक्त विवरण (More Details)' : 'Show Advanced Details')}
                      </button>
                    </div>
                  </div>

                  {/* Advanced Case Details Modal */}
                  {showAdvancedDetails && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200">
                      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
                          <div className="flex items-center gap-3 text-orange-600">
                            <Activity size={22} className="animate-pulse" />
                            <div>
                              <h2 className="font-black text-[16px] text-gray-900 uppercase tracking-tight">{lang === 'hi' ? 'अग्रिम प्रशासनिक विवरण' : 'Advanced Administrative Details'}</h2>
                              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{lang === 'hi' ? 'गोपनीय प्रशासनिक पहुंच' : 'Confidential Administrative Access'}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAdvancedDetails(false)}
                            className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-colors border border-transparent hover:border-gray-100"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-grow p-6 overflow-y-auto no-scrollbar bg-gray-50/30">
                          <div className="space-y-8">
                            {/* Action Matrix Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: 'accountFreeze', label: 'Account Freeze Action', hi: 'खाता फ्रीज कार्रवाई' },
                                { id: 'firInstruction', label: 'FIR Instruction Issued', hi: 'FIR निर्देश जारी' },
                                { id: 'deptLetter', label: 'Dept Letter Issued', hi: 'विभागीय पत्र जारी' },
                                { id: 'showCauseNotice', label: 'Show Cause Issued', hi: 'कारण बताओ नोटिस' },
                                { id: 'suspensionOrdered', label: 'Suspension Ordered', hi: 'निलंबन आदेश' },
                                { id: 'terminationOrdered', label: 'Termination Ordered', hi: 'सेवा समाप्ति आदेश' },
                              ].map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-[14px] text-gray-800">{lang === 'hi' ? item.hi : item.label}</span>
                                    <div className="flex gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
                                      {['Yes', 'No'].map(opt => (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setFormData(prev => ({ ...prev, [item.id]: opt }))}
                                          className={`px-4 py-1.5 rounded-md font-black text-[10px] uppercase transition-all ${formData[item.id] === opt ? 'bg-orange-600 text-white shadow-sm' : 'bg-transparent text-gray-400'}`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-gray-50">
                                    {formData[item.id] === 'Yes' ? (
                                      <div className="animate-in slide-in-from-top-2 duration-300">
                                        {advancedDocs[item.id] ? (
                                          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                                            <div className="flex items-center gap-3">
                                              <CheckCircle size={18} className="text-green-600" />
                                              <div>
                                                <p className="text-[11px] font-black text-green-700 truncate max-w-[150px]">{advancedDocs[item.id]?.name || (typeof advancedDocs[item.id] === 'string' ? advancedDocs[item.id].split('/').pop() : 'Document')}</p>
                                                <p className="text-[9px] text-green-600/70 font-bold uppercase tracking-widest">Document Verified</p>
                                              </div>
                                            </div>
                                            <button type="button" onClick={() => setAdvancedDocs(prev => { const next = { ...prev }; delete next[item.id]; return next; })} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                              <X size={16} />
                                            </button>
                                          </div>
                                        ) : (
                                          <label className="cursor-pointer group block">
                                            <input
                                              type="file"
                                              className="hidden"
                                              accept=".pdf,.jpg,.jpeg,.png"
                                              onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setAdvancedDocs(prev => ({ ...prev, [item.id]: file }));
                                              }}
                                            />
                                            <div className="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-200 rounded-lg group-hover:border-orange-400 group-hover:bg-orange-50/50 transition-all">
                                              <UploadCloud size={18} className="text-gray-300 group-hover:text-orange-600" />
                                              <span className="text-[12px] font-bold text-gray-400 group-hover:text-orange-600 uppercase tracking-wide">{lang === 'hi' ? 'प्रमाण पत्र अपलोड करें' : 'Upload Support Doc'}</span>
                                            </div>
                                          </label>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-[10px] text-gray-400 italic">No document required for 'No' status.</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Quantitative Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Status & Legal</h4>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'जांच रिपोर्ट की स्थिति' : 'Enquiry Report Status'}</label>
                                    <select name="enquiryStatus" value={formData.enquiryStatus} onChange={handleFormChange} className={`${inputClass} !bg-gray-50 border-gray-200`}>
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">Completed</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'दर्ज FIR की संख्या' : 'Number of FIR Cases Filed'}</label>
                                    <input type="number" name="firCasesFiled" value={formData.firCasesFiled} onChange={handleFormChange} placeholder="e.g. 5" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Financial Recovery</h4>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'वसूली योग्य राशि' : 'Recoverable Amount (₹)'}</label>
                                    <input type="number" name="recoverableAmount" value={formData.recoverableAmount} onChange={handleFormChange} placeholder="Enter amount" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'वसूली की गई राशि' : 'Amount Recovered (₹)'}</label>
                                    <input type="number" name="amountRecovered" value={formData.amountRecovered} onChange={handleFormChange} placeholder="Enter amount" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAdvancedDetails(false)}
                            className="bg-[#002b5e] text-white px-10 py-3 rounded-lg font-black text-[14px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-[#001c3d] transition-all transform active:scale-95"
                          >
                            {lang === 'hi' ? 'सहेजें और बंद करें' : 'Done & Update'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="lg:col-span-7 space-y-6">
            {/* Case Specifics */}
            <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
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
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows="5" required placeholder="Enter exact details as written in the Excel sheet..." className={`${inputClass} bg-yellow-50/30 leading-relaxed mb-4`}></textarea>
                </div>
              </div>
            </div>

            {/* Enforcement & Status */}
            <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
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
            <button type="button" onClick={() => { setStep(1); window.scrollTo(0, 0); }} className="cursor-pointer flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 font-bold rounded-sm shadow-sm transition-colors text-[14px] flex items-center justify-center">
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
    </div >
  );
};

export default ComplainForm;