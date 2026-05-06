import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { UserCheck, User, MapPin, Phone, Smartphone, ChevronRight, Home, Check, RefreshCw, Database, X, Activity, ShieldAlert, Calendar, LayoutList, UploadCloud, Loader2, Maximize, Minimize, Eye, EyeOff, Shield, CheckCircle, Search, Clock, Printer, FileUp, Trash2, ArrowRight, ArrowLeft, FileSearch, ScanLine } from 'lucide-react';
import userDetails from '../../assets/user_details.json';
import Captcha, { verifyCaptcha } from './captcha';
import { SERVER_URL, draftComplaintAPI, submitComplaintAPI, fetchDeptSchemesAPI, fetchComplaintCategoriesAPI, fetchLevelsAPI, fetchDistrictsAPI, fetchBlocksAPI, fetchGPsAPI, deleteDraftAPI, fetchDraftByIdAPI } from '../../apiHandler/apis';

import Step1Applicant from './com_form_components/Step1Applicant';
import AdvancedDetailsModal from './com_form_components/AdvancedDetailsModal';
import Receipt from './com_form_components/Receipt';
import DocumentArchive from './com_form_components/DocumentArchive';
import CoreCaseInfo from './com_form_components/CoreCaseInfo';
import GeographicLocation from './com_form_components/GeographicLocation';
import CaseSpecifics from './com_form_components/CaseSpecifics';
import EnforcementStatus from './com_form_components/EnforcementStatus';

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

  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiBlocks, setApiBlocks] = useState([]);
  const [apiGPs, setApiGPs] = useState([]);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [advancedDocs, setAdvancedDocs] = useState({});
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });
  const dataLoadedRef = React.useRef(false);

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

  // Step 2 State
  const [formData, setFormData] = useState({
    submittingOfficer: {
      id: activeUser?.id || '',
    },
    applicantData: {
      name: '',
      mobile: '',
      address: ''
    },
    CoreCaseInfo: {
      source: 'PR',
      serialNumber: '',
      departmentRef: '',
      financialYear: '2026-27',
      dateReceived: '',
    },
    geographic_information: {
      district: '',
      block: '',
      panchayat: '',
      level: 'District',
    },
    case_information: {
      department: '',
      scheme: '',
      complaintCategory: '',
      description: '',
    },
    EnforcementStatus: {
      responsibleOfficer: '',
      actionTaken: '',
      remarks: '',
      caseStatus: 'Pending',
      pendingLevel: '',
    },
    AccountStatus: {
      accountFreeze: 'No',
      firInstruction: 'No',
      enquiryStatus: 'Pending',
      deptLetter: 'No',
    },
    FinancialStatus: {
      recoverableAmount: '',
      amountRecovered: '',
    },
    LegalActionStatus: {
      showCauseNotice: 'No',
      suspensionOrdered: 'No',
      terminationOrdered: 'No',
      firCasesFiled: ''
    }
  });

  // Load from Draft if navigated via "Resume" or URL param
  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlDraftId = queryParams.get('draftId');

    if (location.state?.formData) {
      // Returning from Summary Page
      const restoredForm = location.state.formData;
      setFormData(restoredForm);
      
      if (location.state.apiDistricts) setApiDistricts(location.state.apiDistricts);
      if (location.state.apiBlocks) setApiBlocks(location.state.apiBlocks);
      if (location.state.apiGPs) setApiGPs(location.state.apiGPs);

      if (restoredForm.geographic_information?.district && (!location.state.apiBlocks || location.state.apiBlocks.length === 0)) {
        fetchBlocksAPI(restoredForm.geographic_information.district).then(res => res.success && setApiBlocks(res.data));
      }

      if (location.state.confirmed && !isSubmitting && !showReceipt) {
        confirmSubmit(restoredForm);
      }
    } else if (location.state?.draftData) {
      const draft = location.state.draftData;
      setDraftId(draft._id);
      setShortDraftId(draft.draftId || `D-${draft._id.slice(-6).toUpperCase()}`);
      loadDraftData(draft);
    } else if (urlDraftId && !dataLoadedRef.current) {
      // Fetch draft from API if we only have the ID in URL
      const loadDraft = async () => {
        try {
          dataLoadedRef.current = true;
          const res = await fetchDraftByIdAPI(urlDraftId);
          if (res.success) {
            setDraftId(urlDraftId);
            setShortDraftId(res.data.draftId || `D-${urlDraftId.slice(-6).toUpperCase()}`);
            loadDraftData(res.data);
          }
        } catch (err) {
          console.error("Failed to load draft from URL", err);
          showAlert(lang === 'hi' ? "ड्राफ्ट लोड करने में विफल।" : "Failed to load draft from link.", "error");
        }
      };
      loadDraft();
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

    setFormData(prev => ({
      ...prev,
      applicantData: {
        name: complainer.name || draft.applicantName || '',
        mobile: complainer.mobile || draft.mobile || '',
        address: complainer.address || draft.address || ''
      },
      CoreCaseInfo: {
        source: core.source || draft.source || 'PR',
        serialNumber: core.serial_no || draft.serialNumber || '',
        departmentRef: specifics.department_ref || draft.departmentRef || '',
        financialYear: core.fy || draft.financialYear || '2026-27',
        dateReceived: core.date || draft.dateReceived || '',
      },
      geographic_information: {
        district: geo.district || draft.district || '',
        block: geo.block || draft.block || '',
        panchayat: geo.gram_panchayat || draft.panchayat || '',
        level: geo.level || draft.level || 'District',
      },
      case_information: {
        department: specifics.department || draft.department || '',
        scheme: specifics.scheme || draft.scheme || '',
        complaintCategory: specifics.complaint_category || draft.complaintCategory || '',
        description: specifics.complain_details || draft.description || '',
      },
      EnforcementStatus: {
        responsibleOfficer: specifics.responsible_officer || draft.responsibleOfficer || '',
        actionTaken: specifics.action_taken || draft.actionTaken || '',
        remarks: specifics.remarks || draft.remarks || '',
        caseStatus: specifics.current_status || draft.currentStatus || 'Pending',
        pendingLevel: advanced.pending_level || draft.pendingLevel || '',
      },
      AccountStatus: {
        accountFreeze: advanced.account_freeze || draft.accountFreeze || 'No',
        firInstruction: advanced.fir_instruction || draft.firInstruction || 'No',
        enquiryStatus: advanced.enquiry_status || draft.enquiryStatus || 'Pending',
        deptLetter: advanced.dept_letter || draft.deptLetter || 'No',
      },
      FinancialStatus: {
        recoverableAmount: advanced.recoverable_amount || draft.recoverableAmount || '',
        amountRecovered: advanced.amount_recovered || draft.amountRecovered || '',
      },
      LegalActionStatus: {
        showCauseNotice: advanced.show_cause_notice || draft.showCauseNotice || 'No',
        suspensionOrdered: advanced.suspension_ordered || draft.suspensionOrdered || 'No',
        terminationOrdered: advanced.termination_ordered || draft.terminationOrdered || 'No',
        firCasesFiled: advanced.fir_cases_filed || draft.firCasesFiled || ''
      }
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

    // Fetch dependent location options
    if (geo.district) {
      fetchBlocksAPI(geo.district).then(res => {
        if (res.success) setApiBlocks(res.data);
      });
    }
    if (geo.block) {
      fetchGPsAPI(geo.block).then(res => {
        if (res.success) setApiGPs(res.data);
      });
    }

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

  const selectedDept = departments.find(d =>
    d.department_name_en === formData.case_information?.department ||
    d.department_name_hi === formData.case_information?.department
  );
  const currentSchemes = selectedDept ? selectedDept.schemes : allSchemes;



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

  const handleFormChange = React.useCallback(async (e, section) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev };

      if (section) {
        newData[section] = {
          ...prev[section],
          [name]: value
        };
      } else {
        newData[name] = value;
      }

      // Cascading logic
      if (section === 'case_information' && name === 'department') {
        newData.case_information.scheme = '';
      }
      if (section === 'geographic_information') {
        if (name === 'district') {
          newData.geographic_information.block = '';
          newData.geographic_information.panchayat = '';
        }
        if (name === 'block') {
          newData.geographic_information.panchayat = '';
        }
      }

      if (section === 'CoreCaseInfo' && name === 'dateReceived') {
        const date = new Date(value);
        if (!isNaN(date)) {
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // 1-12
          const fy = month >= 4 
            ? `${year}-${(year + 1).toString().slice(-2)}` 
            : `${year - 1}-${year.toString().slice(-2)}`;
          newData.CoreCaseInfo.financialYear = fy;
        }
      }

      return newData;
    });

    // Cascading Location Fetching (Visual only, state handled above)
    if (name === 'district' && value) {
      setApiBlocks([]);
      setApiGPs([]);
      try {
        const res = await fetchBlocksAPI(value);
        if (res.success) setApiBlocks(res.data);
      } catch (err) { console.error("Error fetching blocks:", err); }
    }

    if (name === 'block' && value) {
      setApiGPs([]);
      try {
        const res = await fetchGPsAPI(value);
        if (res.success) setApiGPs(res.data);
      } catch (err) { console.error("Error fetching GPs:", err); }
    }
  }, []);

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      applicantData: {
        ...prev.applicantData,
        [name]: value
      }
    }));
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
        CoreCaseInfo: {
          ...prev.CoreCaseInfo,
          source: randomCase.source,
          serialNumber: randomCase.serialNumber,
          departmentRef: randomCase.departmentRef,
          financialYear: randomCase.financialYear,
          dateReceived: randomCase.dateReceived,
        },
        geographic_information: {
          ...prev.geographic_information,
          district: randomCase.district,
          level: randomCase.level,
        },
        case_information: {
          ...prev.case_information,
          department: randomCase.department,
          scheme: randomCase.scheme,
          complaintCategory: randomCase.complaintCategory,
          description: randomCase.description,
        },
        EnforcementStatus: {
          ...prev.EnforcementStatus,
          responsibleOfficer: randomCase.responsibleOfficer,
          caseStatus: randomCase.currentStatus,
          actionTaken: randomCase.actionTaken,
          remarks: randomCase.remarks,
        }
      }));
      setIsUploading(false);
      showAlert(lang === 'hi' ? 'दस्तावेज़ से डेटा सफलतापूर्वक निकाला गया!' : 'Data successfully extracted from document!', 'success');
    }, 2000);
  };

  const saveAsDraft = async () => {
    setIsDrafting(true);
    try {
      const data = new FormData();

      // Recursive helper to flatten nested formData sections into flat FormData keys
      const appendFlattened = (obj) => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          
          // Skip null/undefined or specific complex objects handled separately
          if (value === null || value === undefined) return;

          if (typeof value === 'object' && !(value instanceof File) && !Array.isArray(value)) {
            appendFlattened(value);
          } else {
            // Check if key already exists to avoid duplicates if sections overlap
            if (!data.has(key)) {
              data.append(key, value);
            }
          }
        });
      };

      // Flatten the hierarchical state
      appendFlattened(formData);

      // Ensure applicant details are mapped to the keys expected by existing API/Backend
      if (formData.applicantData.name) data.set('applicantName', formData.applicantData.name);
      if (formData.applicantData.mobile) data.set('mobile', formData.applicantData.mobile);
      if (formData.applicantData.address) data.set('address', formData.applicantData.address);

      // Map internal state keys to legacy backend names if necessary
      if (formData.CoreCaseInfo.serialNumber) data.set('serial_no', formData.CoreCaseInfo.serialNumber);
      if (formData.CoreCaseInfo.departmentRef) data.set('department_ref', formData.CoreCaseInfo.departmentRef);
      if (formData.CoreCaseInfo.financialYear) data.set('fy', formData.CoreCaseInfo.financialYear);
      if (formData.CoreCaseInfo.dateReceived) data.set('date', formData.CoreCaseInfo.dateReceived);
      
      if (formData.geographic_information.panchayat) data.set('gram_panchayat', formData.geographic_information.panchayat);
      
      if (formData.case_information.department) data.set('department', formData.case_information.department);
      if (formData.case_information.scheme) data.set('scheme', formData.case_information.scheme);
      if (formData.case_information.complaintCategory) data.set('complaint_category', formData.case_information.complaintCategory);
      if (formData.case_information.description) data.set('complain_details', formData.case_information.description);

      if (formData.EnforcementStatus.responsibleOfficer) data.set('responsible_officer', formData.EnforcementStatus.responsibleOfficer);
      if (formData.EnforcementStatus.actionTaken) data.set('action_taken', formData.EnforcementStatus.actionTaken);
      if (formData.EnforcementStatus.caseStatus) data.set('current_status', formData.EnforcementStatus.caseStatus);
      if (formData.EnforcementStatus.remarks) data.set('remarks', formData.EnforcementStatus.remarks);

      // Draft Persistence: Send current draftId if we are updating an existing draft
      if (draftId) data.append('draftId', draftId);

      // Advanced Documents & Existing Paths
      Object.keys(advancedDocs).forEach(key => {
        const val = advancedDocs[key];
        if (val instanceof File) {
          data.append(key, val);
        } else if (typeof val === 'string') {
          data.append(`${key}Doc`, val);
        }
      });

      const res = await draftComplaintAPI(data);
      if (res.success) {
        const newId = res.data?._id;
        const shortId = res.data?.draftId || `D-${newId.slice(-6).toUpperCase()}`;
        setDraftId(newId);
        setShortDraftId(shortId);
        
        // Update URL to reflect the saved draft state
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
      !formData.CoreCaseInfo?.serialNumber ||
      !formData.CoreCaseInfo?.dateReceived ||
      !formData.geographic_information?.level ||
      !formData.geographic_information?.district ||
      !formData.case_information?.department ||
      !formData.case_information?.scheme ||
      !formData.case_information?.complaintCategory ||
      !formData.case_information?.description ||
      !formData.EnforcementStatus?.responsibleOfficer
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
        applicantData: formData.applicantData,
        formData: formData,
        apiDistricts,
        apiBlocks
      }
    });
  };

  const confirmSubmit = async (finalForm = formData) => {
    if (!finalForm.case_information?.scheme) {
      showAlert(lang === 'hi' ? 'योजना का चयन अनिवार्य है!' : 'Scheme selection is mandatory!', 'error');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();

      const appendFlattened = (obj) => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          if (value === null || value === undefined) return;

          if (typeof value === 'object' && !(value instanceof File) && !Array.isArray(value)) {
            appendFlattened(value);
          } else {
            if (!data.has(key)) {
              data.append(key, value);
            }
          }
        });
      };

      // Flatten hierarchical state
      appendFlattened(finalForm);

      // Explicitly map applicant info
      data.set('applicantName', finalForm.applicantData.name);
      data.set('mobile', finalForm.applicantData.mobile);
      data.set('address', finalForm.applicantData.address);

      // Map to backend keys
      data.set('serial_no', finalForm.CoreCaseInfo.serialNumber);
      data.set('department_ref', finalForm.CoreCaseInfo.departmentRef);
      data.set('fy', finalForm.CoreCaseInfo.financialYear);
      data.set('date', finalForm.CoreCaseInfo.dateReceived);

      data.set('district', finalForm.geographic_information.district);
      data.set('block', finalForm.geographic_information.block);
      data.set('gram_panchayat', finalForm.geographic_information.panchayat);
      data.set('level', finalForm.geographic_information.level);

      data.set('department', finalForm.case_information.department);
      data.set('scheme', finalForm.case_information.scheme);
      data.set('complaint_category', finalForm.case_information.complaintCategory);
      data.set('complain_details', finalForm.case_information.description);

      data.set('responsible_officer', finalForm.EnforcementStatus.responsibleOfficer);
      data.set('action_taken', finalForm.EnforcementStatus.actionTaken);
      data.set('current_status', finalForm.EnforcementStatus.caseStatus);
      data.set('remarks', finalForm.EnforcementStatus.remarks);

      // Link to draft for cleanup
      if (draftId) data.append('draftId', draftId);

      // Advanced Documents
      Object.keys(advancedDocs).forEach(key => {
        const val = advancedDocs[key];
        if (val instanceof File) {
          data.append(key, val);
        } else if (typeof val === 'string') {
          data.append(`${key}Doc`, val);
        }
      });

      const res = await submitComplaintAPI(data);
      if (res.success) {
        const finalReceiptData = {
          applicantName: finalForm.applicantData.name,
          mobile: finalForm.applicantData.mobile,
          address: finalForm.applicantData.address,
          district: finalForm.geographic_information.district,
          block: finalForm.geographic_information.block,
          department: finalForm.case_information.department,
          scheme: finalForm.case_information.scheme,
          description: finalForm.case_information.description,
          caseNumber: res.data?.complainId || res.data?.caseNumber || `RD-${Date.now().toString().slice(-6)}`,
          submissionDate: new Date().toLocaleString()
        };

        setReceiptData(finalReceiptData);
        setShowPreview(false);
        setShowReceipt(true);

        setDraftId(null);
        setShortDraftId(null);
        navigate('/complain', { replace: true, state: {} });

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

      <Header draf_btn={true} />

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
          <Receipt lang={lang} receiptData={receiptData} />
        ) : step === 1 ? (
          <Step1Applicant
            lang={lang}
            shortDraftId={shortDraftId}
            activeUser={activeUser}
            applicantData={formData.applicantData}
            handleApplicantChange={handleApplicantChange}
            handleProceed={handleProceed}
            labelClass={labelClass}
            inputClass={inputClass}
            requiredSpan={requiredSpan}
          />
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
                    {lang === 'hi' ? 'परिवादी:' : 'Complainant:'} <span className="text-[#1976d2]">{formData.applicantData.name || 'Anonymous'}</span>
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
            <DocumentArchive
              lang={lang}
              handleFileUpload={handleFileUpload}
              handleAutoFillScan={handleAutoFillScan}
              ocrFile={ocrFile}
              setOcrFile={setOcrFile}
              isUploading={isUploading}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              fileType={fileType}
              setAdvancedDocs={setAdvancedDocs}
            />

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
              {/* Core Case Information */}
              <CoreCaseInfo
                lang={lang}
                formData={formData.CoreCaseInfo}
                handleFormChange={(e) => handleFormChange(e, 'CoreCaseInfo')}
                labelClass={labelClass}
                inputClass={inputClass}
                requiredSpan={requiredSpan}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-8">
                  {/* Geographic Location */}
                  <GeographicLocation
                    lang={lang}
                    formData={formData.geographic_information}
                    handleFormChange={(e) => handleFormChange(e, 'geographic_information')}
                    levels={levels}
                    apiDistricts={apiDistricts}
                    apiBlocks={apiBlocks}
                    apiGPs={apiGPs}
                    showAdvancedDetails={showAdvancedDetails}
                    setShowAdvancedDetails={setShowAdvancedDetails}
                    labelClass={labelClass}
                    inputClass={inputClass}
                    requiredSpan={requiredSpan}
                  />

                  {/* Advanced Case Details Modal */}
                  <AdvancedDetailsModal
                    lang={lang}
                    showAdvancedDetails={showAdvancedDetails}
                    setShowAdvancedDetails={setShowAdvancedDetails}
                    formData={formData}
                    setFormData={setFormData}
                    advancedDocs={advancedDocs}
                    setAdvancedDocs={setAdvancedDocs}
                    handleFormChange={handleFormChange}
                    inputClass={inputClass}
                  />
                </div>


                <div className="lg:col-span-7 space-y-6">
                  {/* Case Specifics */}
                  <CaseSpecifics
                    lang={lang}
                    formData={formData.case_information}
                    setFormData={setFormData}
                    handleFormChange={(e) => handleFormChange(e, 'case_information')}
                    departments={departments}
                    currentSchemes={currentSchemes}
                    categories={categories}
                    selectedDept={selectedDept}
                    labelClass={labelClass}
                    inputClass={inputClass}
                    requiredSpan={requiredSpan}
                    autoSelectCategory={autoSelectCategory}
                  />

                  {/* Enforcement & Status */}
                  <EnforcementStatus
                    lang={lang}
                    formData={formData.EnforcementStatus}
                    handleFormChange={(e) => handleFormChange(e, 'EnforcementStatus')}
                    labelClass={labelClass}
                    inputClass={inputClass}
                    requiredSpan={requiredSpan}
                  />
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