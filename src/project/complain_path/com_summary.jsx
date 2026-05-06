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
  Paperclip,
  Calendar,
  Hash,
  Scale,
  Flag
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

  const DataItem = ({ label, value, className = "", bold = false }) => (
    <div className={`py-2 flex flex-col ${className}`}>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-[12px] ${bold ? 'font-black text-gray-900' : 'font-semibold text-gray-800'}`}>{value || '---'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-10 max-w-5xl">

        {/* Actions Bar */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight tracking-tight uppercase">Draft Review Summary</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Serial: {formData.CoreCaseInfo?.serialNumber}</p>
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
              <Check size={14} /> Submit Complaint
            </button>
          </div>
        </div>

        {/* Paper Document */}
        <div className="bg-white border border-gray-300 p-16 relative overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] print:border-none print:shadow-none print:p-0">

          {/* Document Header */}
          <div className="border-b-4 border-gray-900 pb-10 mb-12 flex justify-between items-start">
            <div className="max-w-lg">
              <p className="text-[11px] font-black text-blue-700 uppercase tracking-[.3em] mb-2">Government of Rajasthan</p>
              <h2 className="text-3xl font-black text-gray-900 leading-none uppercase mb-2">Public Grievance Record</h2>
              <p className="text-[12px] font-semibold text-gray-500 max-w-sm italic">Provisional summary of entry recorded in the Department Complaint Dairy system.</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div className="bg-gray-900 text-white px-4 py-2 flex flex-col items-end">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Registration ID</span>
                <span className="text-xl font-black font-mono tracking-tighter">{formData.CoreCaseInfo?.serialNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-gray-400 uppercase block">Dept Ref No</span>
                <span className="text-[13px] font-bold text-gray-800">{formData.CoreCaseInfo?.deptRefNo || '---'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-16">

            {/* Section 1: Applicant Details */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">01. Applicant Information</h3>
              <div className="grid grid-cols-4 gap-8">
                <DataItem label="Full Name" value={applicantData.name} bold className="col-span-1" />
                <DataItem label="Father/Husband Name" value={applicantData.fatherName} className="col-span-1" />
                <DataItem label="Gender / Age" value={`${applicantData.gender || 'N/A'} / ${applicantData.age || 'N/A'} Yrs`} className="col-span-1" />
                <DataItem label="Aadhaar / ID" value={applicantData.aadhaar} className="col-span-1 font-mono" />

                <DataItem label="Phone Number" value={applicantData.mobile} bold className="col-span-1" />
                <DataItem label="Email Address" value={applicantData.email} className="col-span-1" />
                <DataItem label="Residential Address" value={applicantData.address} className="col-span-2" />
              </div>
            </div>

            {/* Section 2: Geographic & Jurisdiction */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">02. Incident Jurisdiction</h3>
              <div className="grid grid-cols-5 gap-8 border border-gray-100 p-8">
                <DataItem label="District" value={getDistrictLabel(formData.geographic_information?.district)} bold />
                <DataItem label="Block / Tahsil" value={getBlockLabel(formData.geographic_information?.block)} bold />
                <DataItem label="GP / Panchayat" value={getGPLabel(formData.geographic_information?.panchayat)} />
                <DataItem label="Village / Town" value={formData.geographic_information?.village} />
                <DataItem label="Ward No" value={formData.geographic_information?.wardNo} />

                <DataItem label="Admin Level" value={formData.geographic_information?.level} className="pt-4 border-t border-gray-50" />
                <DataItem label="Date Received" value={formData.CoreCaseInfo?.dateReceived} className="pt-4 border-t border-gray-50" />
              </div>
            </div>

            {/* Section 3: Grievance Content */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">03. Grievance Content</h3>
              <div className="grid grid-cols-3 gap-8">
                <DataItem label="Target Department" value={formData.case_information?.department} bold />
                <DataItem label="Scheme / Program" value={formData.case_information?.scheme} />
                <DataItem label="Complaint Category" value={formData.case_information?.complaintCategory} bold />

                <DataItem label="Complaint Title" value={formData.case_information?.complaintName} className="col-span-3 pt-4 border-t border-gray-50" />

                <div className="col-span-3 bg-gray-50 p-8 border-l-4 border-gray-200">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Matter Description / Narrative</span>
                  <p className="text-[14px] text-gray-800 leading-relaxed font-medium italic font-serif">"{formData.case_information?.description}"</p>
                </div>
              </div>
            </div>

            {/* Section 4: Administrative Status & Enforcement */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">04. Administrative & Enforcement</h3>
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6">
                    <DataItem label="Responsible Officer" value={formData.EnforcementStatus?.responsibleOfficer} bold />
                    <DataItem label="Investigation Date" value={formData.EnforcementStatus?.investigationDate} />
                    <DataItem label="Current Case Status" value={formData.EnforcementStatus?.caseStatus} bold className="text-blue-700" />
                    <DataItem label="Priority Level" value={formData.EnforcementStatus?.priorityLevel} />
                  </div>
                  <div className="p-6 border border-gray-100">
                    <DataItem label="Action Taken Remarks" value={formData.EnforcementStatus?.actionTaken} />
                  </div>
                </div>

                <div className="col-span-2 space-y-6">
                  <div className="border border-gray-200 p-6 grid grid-cols-2 gap-y-6">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">FIR Instruction</span>
                      <span className={`text-[12px] font-black ${formData.AccountStatus?.firInstruction === 'Yes' ? 'text-red-600' : 'text-gray-400'}`}>
                        {formData.AccountStatus?.firInstruction || 'No'}
                      </span>
                    </div>
                    <DataItem label="FIR Date / No" value={formData.AccountStatus?.firDate ? `${formData.AccountStatus.firDate} / ${formData.AccountStatus.firNumber || 'N/A'}` : '---'} />

                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Account Freeze</span>
                      <span className={`text-[12px] font-black ${formData.AccountStatus?.accountFreeze === 'Yes' ? 'text-red-600' : 'text-gray-400'}`}>
                        {formData.AccountStatus?.accountFreeze || 'No'}
                      </span>
                    </div>
                    <DataItem label="Freeze Date" value={formData.AccountStatus?.freezeDate} />

                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Legal Action</span>
                      <span className={`text-[12px] font-black ${formData.AccountStatus?.legalAction === 'Yes' ? 'text-orange-600' : 'text-gray-400'}`}>
                        {formData.AccountStatus?.legalAction || 'No'}
                      </span>
                    </div>
                    <DataItem label="Legal Case No" value={formData.AccountStatus?.legalCaseNo} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Financial Recovery Status */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">05. Financial Recovery Information</h3>
              <div className="grid grid-cols-4 gap-8 bg-gray-900 text-white p-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Recoverable</span>
                  <span className="text-3xl font-black">₹{formData.FinancialStatus?.recoverableAmount || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount Recovered</span>
                  <span className="text-3xl font-black text-green-400">₹{formData.FinancialStatus?.amountRecovered || 0}</span>
                </div>
                <DataItem label="Refund Processed" value={formData.FinancialStatus?.refundStatus} className="text-white" />
                <DataItem label="Recovery Date" value={formData.FinancialStatus?.recoveryDate} className="text-white" />
              </div>
            </div>

            {/* Section 6: Attachments */}
            {formData.media && formData.media.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-widest border-l-8 border-gray-900 pl-4 bg-gray-50 py-2 pr-4 inline-block">06. Evidence Documentation</h3>
                <div className="grid grid-cols-3 gap-6">
                  {formData.media.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 border border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <Paperclip size={16} className="text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Document {idx + 1}</span>
                          <span className="text-[13px] font-bold text-gray-700 truncate max-w-[180px]">
                            {typeof file === 'string' ? file.split('/').pop() : file.name || 'attachment.pdf'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const url = typeof file === 'string' ? `http://localhost:5000${file}` : URL.createObjectURL(file);
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-black text-[10px] uppercase tracking-widest print:hidden"
                      >
                        <Eye size={16} /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatures & Stamps */}
            <div className="mt-32 pt-20 border-t border-gray-100 flex justify-between items-end">
              <div className="text-center w-64">
                <div className="h-px bg-gray-300 w-full mb-4"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Authorized Portal Clerk</p>
                <p className="text-[9px] text-gray-400 italic mt-1">Sign & Stamp</p>
              </div>

              <div className="relative group text-center mb-[-20px]">
                <div className="w-40 h-40 border-8 border-double border-gray-100 flex flex-col items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity rotate-12">
                  <ShieldCheck size={64} className="text-gray-200" />
                  <p className="text-[8px] font-black text-gray-300 uppercase mt-2">Verified</p>
                </div>
              </div>

              <div className="text-center w-64">
                <div className="h-px bg-gray-300 w-full mb-4"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Applicant / Grievant</p>
                <p className="text-[9px] text-gray-400 italic mt-1">Full Signature</p>
              </div>
            </div>

          </div>

          {/* Document Footer */}
          <div className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest">Digital Footprint</span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[9px] font-mono">{new Date().getTime().toString(16).toUpperCase()}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest italic">Generated via Rajasthan Public Grievance Portal • Official Version</p>
          </div>

        </div>

        {/* Validation Alert */}
        <div className="mt-12 flex items-center gap-6 text-gray-500 bg-white border border-gray-200 p-10 print:hidden">
          <AlertCircle size={32} className="text-blue-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[12px] font-black text-gray-900 uppercase">Provisional Verification Required</h4>
            <p className="text-[11px] font-medium leading-relaxed">
              Please conduct a final review of all administrative flags, financial amounts, and jurisdictional data points.
              This summary serves as the official receiving copy until the system generates a permanent Registration ID.
            </p>
          </div>
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

export default ComplainSummary; mmary;