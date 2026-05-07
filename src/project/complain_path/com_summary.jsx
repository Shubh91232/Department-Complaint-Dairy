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
  Loader2
} from 'lucide-react';

const ComplainSummary = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { formData, apiDistricts, apiBlocks, apiGPs, deptData, categories } = location.state || {
    formData: {},
    apiDistricts: [],
    apiBlocks: [],
    apiGPs: [],
    deptData: null,
    categories: []
  };

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
    return allSchemes.find(s => (s._id || s.id) === id)?.scheme_name_en || id;
  };
  const getCategoryLabel = (id) => {
    if (typeof id === 'object') return id.name || id;
    const cat = categories.find(c => (c._id || c.id) === id);
    return cat ? (cat.name || cat) : id;
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
              onClick={() => navigate(-1)} 
              disabled={isSubmitting}
              className={`bg-white text-gray-600 px-4 py-2 border border-gray-300 font-bold text-[11px] flex items-center gap-2 transition-all uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              <ChevronLeft size={14} /> Edit Form
            </button>
            <button onClick={() => window.print()} className="bg-white text-gray-900 px-4 py-2 border border-gray-900 font-bold text-[11px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-wider">
              <Printer size={14} /> Print Receipt
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => {
                setIsSubmitting(true);
                navigate('/complain', { state: { ...location.state, confirmed: true } });
              }}
              className={`bg-blue-700 text-white px-6 py-2 font-black text-[11px] flex items-center gap-2 transition-all uppercase tracking-wider shadow-lg shadow-blue-100 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} 
              {isSubmitting ? 'Processing...' : 'Confirm & Submit'}
            </button>
          </div>
        </div>

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
                          const url = typeof file === 'string' ? `http://localhost:5000${file}` : URL.createObjectURL(file);
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
      ` }} />
    </div>
  );
};

export default ComplainSummary;