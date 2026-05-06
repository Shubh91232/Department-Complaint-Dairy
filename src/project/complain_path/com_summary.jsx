import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  Paperclip
} from 'lucide-react';

const ComplainSummary = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const { applicantData, formData, apiDistricts, apiBlocks, apiGPs } = location.state || {
    applicantData: {},
    formData: {},
    apiDistricts: [],
    apiBlocks: [],
    apiGPs: []
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

  const DataItem = ({ label, value, className = "" }) => (
    <div className={`py-2 flex flex-col ${className}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-semibold text-gray-800">{value || '---'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-10 max-w-4xl">

        {/* Actions Bar */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">PREVIEW SUMMARY</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Case Ref: {formData.CoreCaseInfo?.serialNumber}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="bg-white text-gray-600 px-4 py-2 border border-gray-300 font-bold text-[11px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-wider">
              <ChevronLeft size={14} /> Back
            </button>
            <button onClick={() => window.print()} className="bg-white text-gray-900 px-4 py-2 border border-gray-900 font-bold text-[11px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-wider">
              <Printer size={14} /> Print
            </button>
            <button
              onClick={() => navigate('/complain', { state: { ...location.state, confirmed: true } })}
              className="bg-blue-700 text-white px-6 py-2 font-black text-[11px] flex items-center gap-2 hover:bg-blue-800 transition-all uppercase tracking-wider shadow-lg shadow-blue-100"
            >
              <Check size={14} /> Confirm Submission
            </button>
          </div>
        </div>

        {/* Paper Document */}
        <div className="bg-white border border-gray-300 p-12 relative overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] print:border-none print:shadow-none print:p-0">

          {/* Document Header */}
          {/* <div className="border-b-2 border-gray-900 pb-8 mb-8 flex justify-between items-end">
             <div>
                <p className="text-[12px] font-black text-blue-700 uppercase tracking-[.2em] mb-1">Grievance Portal</p>
                <h2 className="text-2xl font-black text-gray-900 uppercase">Provisional Receipt</h2>
                <p className="text-[11px] font-medium text-gray-500 mt-1 italic">Generated for Administrative Verification</p>
             </div>
             <div className="text-right">
                <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Entry ID</div>
                <div className="text-xl font-black font-mono text-gray-900">{formData.CoreCaseInfo?.serialNumber}</div>
             </div>
          </div> */}

          <div className="space-y-12">

            {/* Section 1: Basic Profiles */}
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Applicant Information</h3>
                <div className="divide-y divide-gray-100">
                  <DataItem label="Full Name" value={applicantData.name} />
                  <DataItem label="Phone Number" value={applicantData.mobile} />
                  <DataItem label="Permanent Address" value={applicantData.address} className="pt-2" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Case Jurisdiction</h3>
                <div className="grid grid-cols-2 gap-x-4 divide-y divide-gray-100">
                  <DataItem label="District" value={getDistrictLabel(formData.geographic_information?.district)} />
                  <DataItem label="Block" value={getBlockLabel(formData.geographic_information?.block)} />
                  <DataItem label="GP / Ward" value={getGPLabel(formData.geographic_information?.panchayat)} />
                  <DataItem label="Level" value={formData.geographic_information?.level} />
                </div>
              </div>
            </div>

            {/* Section 2: Case Details */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Grievance Narrative</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="border border-gray-200 p-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Department</span>
                  <span className="font-bold text-gray-800">{formData.case_information?.department}</span>
                </div>
                <div className="border border-gray-200 p-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Scheme</span>
                  <span className="font-bold text-gray-800">{formData.case_information?.scheme}</span>
                </div>
                <div className="border border-gray-200 p-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Category</span>
                  <span className="font-bold text-gray-800">{formData.case_information?.complaintCategory}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 border border-gray-100">
                <p className="text-[13px] text-gray-700 leading-relaxed font-medium italic">"{formData.case_information?.description}"</p>
              </div>
            </div>

            {/* Section 3: Enforcement & Status */}
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3 space-y-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Action & Investigation</h3>
                <div className="grid grid-cols-2 gap-6 border border-gray-100 p-6">
                  <DataItem label="Assigned Officer" value={formData.EnforcementStatus?.responsibleOfficer} />
                  <DataItem label="Initial Status" value={formData.EnforcementStatus?.caseStatus} />
                  <DataItem label="Action Taken" value={formData.EnforcementStatus?.actionTaken} className="col-span-2" />
                </div>
              </div>

              <div className="col-span-2 space-y-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Financial Flags</h3>
                <div className="border-2 border-gray-900 p-6 flex flex-col justify-between h-[140px]">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Recoverable</span>
                    <span className="text-xl font-black text-red-600">₹{formData.FinancialStatus?.recoverableAmount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Recovered</span>
                    <span className="text-xl font-black text-green-600">₹{formData.FinancialStatus?.amountRecovered || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Media Attachments */}
            {formData.media && formData.media.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-gray-900 pl-3">Attached Documentation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.media.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50">
                       <div className="flex items-center gap-3">
                          <Paperclip size={14} className="text-gray-400" />
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Attachment {idx + 1}</span>
                             <span className="text-[12px] font-semibold text-gray-700 truncate max-w-[200px]">
                                {typeof file === 'string' ? file.split('/').pop() : file.name || 'document.pdf'}
                             </span>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                           const url = typeof file === 'string' ? `http://localhost:5000${file}` : URL.createObjectURL(file);
                           window.open(url, '_blank');
                         }}
                         className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold text-[11px] uppercase tracking-wider print:hidden"
                       >
                          <Eye size={14} /> View
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}div>

            {/* Signatures Area */}
            <div className="mt-20 pt-16 flex justify-between items-start">
              <div className="text-center w-48">
                <div className="h-px bg-gray-400 w-full mb-2"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Portal Clerk Sign</p>
              </div>
              <div className="text-center w-64 border-2 border-dashed border-gray-100 p-6">
                <ShieldCheck size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">Digitally Verified</p>
              </div>
              <div className="text-center w-48">
                <div className="h-px bg-gray-400 w-full mb-2"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Applicant Sign</p>
              </div>
            </div>

          </div>

          {/* Document Footer */}
          <div className="mt-16 pt-6 border-t border-gray-100 flex justify-between items-center text-gray-400">
            <p className="text-[9px] font-bold uppercase tracking-widest">RAJASTHAN PUBLIC GRIEVANCE DEPARTMENT • v4.2</p>
            <p className="text-[9px] font-medium italic">Print Date: {new Date().toLocaleString()}</p>
          </div>

        </div>

        {/* Validation Alert */}
        <div className="mt-8 flex items-center gap-4 text-gray-500 bg-white border border-gray-200 p-6 print:hidden">
          <AlertCircle size={20} className="text-blue-600" />
          <p className="text-[11px] font-medium leading-relaxed">
            This is a system-generated provisional summary. Final registration will be processed upon confirmation.
            Please ensure all data points are verified as per the physical records.
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
          @page { margin: 2cm; }
        }
      ` }} />
    </div>
  );
};

export default ComplainSummary;