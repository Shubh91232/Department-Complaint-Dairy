import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import {
  ChevronLeft,
  Printer,
  Check,
  AlertCircle,
  ShieldCheck,
  FileText,
  Eye,
  Paperclip,
  Loader2,
  Home,
  RefreshCw
} from 'lucide-react';

import { SERVER_URL, checkDuplicateComplaintAPI, submitComplaintAPI, saveDuplicacyDetailsAPI } from '../../apiHandler/apis';
import Receipt from './com_form_components/Receipt';

const ComplainSummary = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [duplicacyResult, setDuplicacyResult] = React.useState(null);
  const [checkingDuplicacy, setCheckingDuplicacy] = React.useState(true);
  const [errorDuplicacy, setErrorDuplicacy] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState(null);
  
  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { formData, apiDistricts, apiBlocks, apiGPs, deptData, categories, advancedDocs, previewUrl } = location.state || {
    formData: {},
    apiDistricts: [],
    apiBlocks: [],
    apiGPs: [],
    deptData: null,
    categories: [],
    advancedDocs: {},
    previewUrl: null
  };

  const checkDuplicacy = async () => {
    if (!formData?.CoreCaseInfo?.serialNumber) {
      setCheckingDuplicacy(false);
      return;
    }
    
    setCheckingDuplicacy(true);
    setErrorDuplicacy(false);
    
    try {
      const res = await checkDuplicateComplaintAPI({
        geolocation: formData.geographic_information,
        case_specifics: formData.case_information,
        applicantData: formData.applicantData
      });
      if (res.success) {
        setDuplicacyResult(res);
      } else {
        setErrorDuplicacy(true);
      }
    } catch (err) {
      console.error("Duplicacy check failed", err);
      setErrorDuplicacy(true);
    } finally {
      setCheckingDuplicacy(false);
    }
  };

  React.useEffect(() => {
    checkDuplicacy();
  }, [formData]);

  if (!formData?.CoreCaseInfo?.serialNumber && !location.state) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 border border-gray-200 text-center max-w-md shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Summary Data Found</h2>
            <p className="text-gray-500 mb-6">Please fill out the complaint form first to view the summary.</p>
            <button
              onClick={() => navigate('/complain')}
              className="bg-gray-900 text-white px-8 py-2 font-bold hover:bg-black transition-all"
            >
              Go to Form
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getDistrictLabel = (val) => apiDistricts?.find(d => d.value == val)?.label || val;
  const getBlockLabel = (val) => apiBlocks?.find(b => b.value == val)?.label || val;
  const getGPLabel = (val) => apiGPs?.find(g => g.value == val)?.label || val;

  const departments = deptData?.departments || [];
  const getDeptLabel = (id) => departments.find(d => d.department_id === id)?.department_name_en || id;
  const getSchemeLabel = (id) => {
    const allSchemes = departments.flatMap(d => d.schemes || []);
    return allSchemes.find(s => s.scheme_id === id)?.scheme_name_en || id;
  };
  const getCategoryLabel = (id) => {
    if (typeof id === 'object') return id.name || id;
    const cat = categories.find(c => (c._id || c.id) === id);
    return cat ? (cat.name || cat) : id;
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting || checkingDuplicacy || errorDuplicacy) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // Helper to flatten nested formData into flat FormData keys (matching com_form.jsx)
      const appendFlattened = (obj) => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          if (value === null || value === undefined) return;

          if (typeof value === 'object' && !(value instanceof File) && !Array.isArray(value)) {
            appendFlattened(value);
          } else if (key !== 'media') { // media handled separately
            if (!data.has(key)) {
              data.append(key, value);
            }
          }
        });
      };

      appendFlattened(formData);
      
      if (formData.media && formData.media.length > 0) {
        formData.media.forEach((file) => {
          if (file instanceof File) data.append('media', file);
        });
      }

      const res = await submitComplaintAPI(data);
      
      if (res.success) {
        const finalComplainId = res.data?.complainId || `RD-${Date.now().toString().slice(-6)}`;
        
        if (duplicacyResult) {
          try {
            await saveDuplicacyDetailsAPI({
              complain_id: finalComplainId,
              duplicacy_score: duplicacyResult.duplicacy_score,
              duplicate_complains_ids: duplicacyResult.complains_list.map(m => m.complaint.complainId),
              IsFullDuplicate: duplicacyResult.isFullDuplicate
            });
          } catch (dupErr) {
            console.error("Failed to save duplicacy details", dupErr);
          }
        }

        setReceiptData({
          caseNumber: finalComplainId,
          submissionDate: new Date().toLocaleString(),
          applicantName: formData.applicantData?.name,
          mobile: formData.applicantData?.mobile,
          address: formData.applicantData?.address,
          department: getDeptLabel(formData.case_information?.department),
          scheme: getSchemeLabel(formData.case_information?.scheme),
          district: getDistrictLabel(formData.geographic_information?.district),
          block: getBlockLabel(formData.geographic_information?.block),
          level: formData.geographic_information?.level,
          description: formData.case_information?.description
        });

        setShowReceipt(true);
      } else {
        alert(res.message || "Submission Failed");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      const errorMsg = err.message.toLowerCase();
      if (errorMsg.includes('unauthorized') || errorMsg.includes('invalid token') || errorMsg.includes('401') || errorMsg.includes('jwt expired')) {
        alert(lang === 'hi' ? 'सत्र समाप्त हो गया है। कृपया फिर से लॉग इन करें।' : 'Session expired. Please log in again.');
        localStorage.clear();
        setTimeout(() => {
          navigate('/', { replace: true });
          window.location.reload();
        }, 500);
      } else {
        alert(err.message || "An unexpected error occurred during submission.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const DataItem = ({ label, value, className = "", bold = false, color = "" }) => (
    <div className={`py-2 flex flex-col ${className}`}>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-[12px] ${bold ? 'font-black' : 'font-semibold'} ${color ? color : 'text-gray-800'}`}>
        {value || '---'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        {showReceipt ? (
          <Receipt lang={lang} receiptData={receiptData} />
        ) : (
          <>
            {/* Actions Bar */}
            <div className="mb-8 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">Final Preview</h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receipt No: {formData.CoreCaseInfo?.serialNumber}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/complain', { state: { formData, apiDistricts, apiBlocks, apiGPs, deptData, categories, advancedDocs, previewUrl } })}
                  disabled={isSubmitting || checkingDuplicacy}
                  className={`bg-white text-gray-600 px-4 py-2 border border-gray-300 font-bold text-[11px] flex items-center gap-2 transition-all uppercase tracking-wider ${isSubmitting || checkingDuplicacy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <ChevronLeft size={14} /> Edit Form
                </button>
                <button onClick={() => window.print()} className="bg-white text-gray-900 px-4 py-2 border border-gray-900 font-bold text-[11px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-wider">
                  <Printer size={14} /> Print Receipt
                </button>
                <button
                  disabled={isSubmitting || checkingDuplicacy || errorDuplicacy}
                  onClick={handleConfirmSubmit}
                  className={`bg-blue-700 text-white px-6 py-2 font-black text-[11px] flex items-center gap-2 transition-all uppercase tracking-wider shadow-lg shadow-blue-100 ${isSubmitting || checkingDuplicacy || errorDuplicacy ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                >
                  {isSubmitting || checkingDuplicacy ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                  {checkingDuplicacy ? 'Checking Duplicates...' : errorDuplicacy ? 'Verification Failed' : isSubmitting ? 'Processing...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>

            {/* Duplicacy Alert Banner */}
            {duplicacyResult?.duplicacy_score > 60 && (
              <div className="mb-8 bg-orange-50 border-2 border-orange-200 p-6 rounded-sm flex items-start gap-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-orange-500 p-3 rounded-full text-white shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-black text-orange-800 uppercase tracking-tight leading-none">Potential Duplicate Detected</h2>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {duplicacyResult.duplicacy_score}% Similarity
                    </span>
                  </div>
                  <p className="text-[12px] text-orange-700 font-bold mb-4 leading-relaxed">
                    The system has found existing grievances with highly similar details. Please verify if this is a new case or a follow-up to avoid redundant entries.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block w-full mb-1">Matching Records:</span>
                    {duplicacyResult.complains_list.map((match, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => navigate('/track', { state: { query: match.complaint.complainId } })}
                        className="bg-white border border-orange-200 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-sm hover:bg-orange-50 hover:border-orange-400 transition-colors cursor-pointer group"
                        title="Click to track this grievance"
                      >
                        <span className="text-[11px] font-black text-orange-800 group-hover:text-orange-900">{match.complaint.complainId}</span>
                        <span className="text-[10px] font-bold text-orange-400">({match.score}%)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Paper Document */}
            <div className="bg-white border border-gray-300 p-16 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] print:border-none print:shadow-none print:p-0">

              {/* Document Header */}
              <div className="border-b-4 border-gray-900 pb-10 mb-12">
                <div className="flex justify-between items-end w-full">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Entry Source</span>
                    <span className="text-2xl font-black text-gray-900 uppercase tracking-tight">{formData.CoreCaseInfo?.source || '---'}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Date of Registration</span>
                    <span className="text-2xl font-black text-gray-900 uppercase tracking-tight">{formData.CoreCaseInfo?.dateReceived || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Duplicacy Analysis Summary Bar */}
              <div className="bg-gray-50/80 border-y border-gray-100 px-10 py-5 mb-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${checkingDuplicacy ? 'bg-orange-400 animate-pulse' : errorDuplicacy ? 'bg-gray-300' : (duplicacyResult?.duplicacy_score > 60 ? 'bg-red-500' : 'bg-green-500')}`}></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Integrity Scan Status</p>
                    <p className={`text-[12px] font-black uppercase tracking-tight ${checkingDuplicacy ? 'text-orange-500' : errorDuplicacy ? 'text-gray-500' : (duplicacyResult?.duplicacy_score > 60 ? 'text-red-600' : 'text-green-600')}`}>
                      {checkingDuplicacy ? 'Analyzing Global Records...' : errorDuplicacy ? 'Scan Failed: Not Verified' : (duplicacyResult?.duplicacy_score > 60 ? 'Duplicate Alert Detected' : 'Verified: Unique Entry')}
                    </p>
                  </div>
                </div>
                {!checkingDuplicacy && (
                  <div className="flex items-center gap-6">
                    {errorDuplicacy ? (
                      <button 
                        onClick={checkDuplicacy}
                        className="bg-gray-900 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> Retry Analysis
                      </button>
                    ) : (
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Reliability Score</p>
                        <p className="text-[16px] font-black text-gray-900 tracking-tighter">{(100 - (duplicacyResult?.duplicacy_score || 0))}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-16">

                {/* Section 1: Profiles & Jurisdiction */}
                <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Applicant Profile</h3>
                    <div className="grid grid-cols-1 gap-4 divide-y divide-gray-50">
                      <DataItem label="Full Name" value={formData.applicantData?.name} bold />
                      <DataItem label="Mobile Number" value={formData.applicantData?.mobile} />
                      <DataItem label="Communication Address" value={formData.applicantData?.address} />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Case Jurisdiction</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <DataItem label="District" value={getDistrictLabel(formData.geographic_information?.district)} bold />
                      <DataItem label="Block" value={getBlockLabel(formData.geographic_information?.block)} bold />
                      <DataItem label="Panchayat" value={getGPLabel(formData.geographic_information?.panchayat)} />
                      <DataItem label="Admin Level" value={formData.geographic_information?.level} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Core Complaint Info */}
                <div className="space-y-8">
                  <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Grievance Details</h3>
                  <div className="grid grid-cols-4 gap-8 mb-8 border border-gray-100 p-6 bg-gray-50/30">
                    <DataItem label="Department" value={getDeptLabel(formData.case_information?.department)} bold />
                    <DataItem label="Scheme" value={getSchemeLabel(formData.case_information?.scheme)} />
                    <DataItem label="Category" value={getCategoryLabel(formData.case_information?.complaintCategory)} bold />
                    <DataItem label="Financial Year" value={formData.CoreCaseInfo?.financialYear} />
                  </div>
                  <div className="border border-gray-200 p-8">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-2">Subject Description</span>
                    <p className="text-[14px] text-gray-700 leading-relaxed font-medium italic">"{formData.case_information?.description}"</p>
                  </div>
                </div>

                {/* Section 3: Enforcement & Investigation */}
                <div className="space-y-8">
                  <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Administrative Status</h3>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 grid grid-cols-2 gap-6 border border-gray-100 p-6">
                      <DataItem label="Responsible Officer" value={formData.EnforcementStatus?.responsibleOfficer} bold />
                      <DataItem label="Current Status" value={formData.EnforcementStatus?.caseStatus} bold color="text-blue-700" />
                      <DataItem label="Pending Level" value={formData.EnforcementStatus?.pendingLevel} />
                      <DataItem label="Enquiry Status" value={formData.AccountStatus?.enquiryStatus} />
                    </div>
                    <div className="bg-gray-200 text-gray-900 p-6 flex flex-col justify-between">
                      <DataItem label="Recoverable" value={`₹${formData.FinancialStatus?.recoverableAmount || 0}`} className="text-gray-900" bold />
                      <DataItem label="Recovered" value={`₹${formData.FinancialStatus?.amountRecovered || 0}`} className="text-gray-900" bold />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <DataItem label="Action Taken Remarks" value={formData.EnforcementStatus?.actionTaken} className="bg-gray-50 p-4 border border-gray-100" />
                    <DataItem label="Administrative Remarks" value={formData.EnforcementStatus?.remarks} className="bg-gray-50 p-4 border border-gray-100" />
                  </div>
                </div>

                {/* Section 4: Legal & Account Status */}
                <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Account Integrity</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <DataItem label="Account Freeze" value={formData.AccountStatus?.accountFreeze} bold color={formData.AccountStatus?.accountFreeze === 'Yes' ? 'text-red-600' : 'text-green-600'} />
                      <DataItem label="FIR Instruction" value={formData.AccountStatus?.firInstruction} bold color={formData.AccountStatus?.firInstruction === 'Yes' ? 'text-red-600' : 'text-gray-400'} />
                      <DataItem label="Dept Letter" value={formData.AccountStatus?.deptLetter} />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Legal Action Status</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <DataItem label="Show Cause Notice" value={formData.LegalActionStatus?.showCauseNotice} />
                      <DataItem label="Suspension Ordered" value={formData.LegalActionStatus?.suspensionOrdered} />
                      <DataItem label="Termination Ordered" value={formData.LegalActionStatus?.terminationOrdered} />
                      <DataItem label="FIR Cases Filed" value={formData.LegalActionStatus?.firCasesFiled} />
                    </div>
                  </div>
                </div>

                {/* Section 5: Attachments */}
                {formData.media && formData.media.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-4">Evidence Attachments</h3>
                    <div className="grid grid-cols-3 gap-6">
                      {formData.media.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <Paperclip size={14} className="text-gray-400" />
                            <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">
                              {typeof file === 'string' ? file.split('/').pop() : file.name || 'document'}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const url = typeof file === 'string' ? `${SERVER_URL}/${file}` : URL.createObjectURL(file);
                              window.open(url, '_blank');
                            }}
                            className="text-blue-700 hover:text-blue-900 font-black text-[9px] uppercase tracking-widest print:hidden"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Metadata */}
              <div className="mt-16 pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <p>System Generated Receipt • No Signature Required</p>
                <p>Generated: {new Date().toLocaleString()}</p>
              </div>

            </div>

            {/* Validation Note */}
            <div className="mt-12 flex items-center gap-6 bg-blue-50 border border-blue-100 p-8 print:hidden">
              <AlertCircle size={24} className="text-blue-600 shrink-0" />
              <p className="text-[12px] text-blue-800 font-medium leading-relaxed">
                <strong>Verification Required:</strong> Ensure all administrative and legal action flags accurately reflect the current case status before final confirmation.
              </p>
            </div>
          </>
        )}
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .flex-grow { padding: 0 !important; margin: 0 !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          @page { margin: 1.5cm; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.9); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite ease-in-out;
        }
      ` }} />

      {/* Full-screen Processing Animation */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500 animate-in fade-in">
          <div className="flex flex-col items-center gap-8 max-w-sm text-center">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-24 h-24 border-[3px] border-gray-100 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 w-24 h-24 border-[3px] border-transparent border-t-blue-700 rounded-full animate-spin"></div>
              {/* Inner Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-blue-700 animate-pulse-soft" size={32} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                {lang === 'hi' ? 'शिकायत जमा की जा रही है' : 'Securing Grievance'}
              </h2>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {lang === 'hi' ? 'डेटा एन्क्रिप्ट किया जा रहा है' : 'Encrypting Data Package'}
                </p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                  {lang === 'hi' ? 'कृपया प्रतीक्षा करें, हम आपका शिकायत रिकॉर्ड सुरक्षित कर रहे हैं' : 'Please wait while we finalize your formal government record...'}
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-blue-700 w-1/2 rounded-full animate-[progress_2s_infinite_ease-in-out]"></div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}} />
        </div>
      )}
    </div>
  );
};

export default ComplainSummary;