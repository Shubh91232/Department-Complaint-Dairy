import React from 'react';
import { Database, User, Shield, Printer, CheckCircle, ArrowRight, MapPin, FileText, Info, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Receipt = ({ lang, receiptData }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto pb-20">
      
      {/* Success Banner */}
      <div className="bg-green-600 rounded-sm p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row items-center gap-6 print:hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
          <CheckCircle size={40} className="text-white" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-1">
            {lang === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज की गई!' : 'Submission Successful!'}
          </h2>
          <p className="text-green-50 font-medium text-[14px]">
            {lang === 'hi' 
              ? 'आपका शिकायत विवरण सुरक्षित रूप से मास्टर डेटाबेस में दर्ज कर लिया गया है।' 
              : 'Your grievance has been successfully recorded in the Master Database and assigned to the nodal officer.'}
          </p>
        </div>
      </div>

      <div className="bg-white border-t-8 border-[#002b5e] shadow-2xl p-0 relative overflow-hidden print:border-0 print:shadow-none">

        {/* Official Header */}
        <div className="bg-[#f8f9fa] border-b border-gray-200 p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#002b5e] p-2 rounded-sm flex items-center justify-center">
              <img src="/rajasthan_logo.png" alt="Govt. Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#002b5e] uppercase tracking-tighter leading-none mb-1">Government of Rajasthan</h1>
              <h2 className="text-[14px] font-bold text-gray-700 uppercase tracking-wide">{lang === 'hi' ? 'ग्रामीण विकास एवं पंचायती राज विभाग' : 'Dept of Rural Development & PR'}</h2>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-1">Official Acknowledgment Receipt</p>
            </div>
          </div>
          <div className="text-right border-l border-gray-200 pl-6 hidden sm:block">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated On</div>
            <div className="text-[13px] font-black text-gray-900">{receiptData.submissionDate}</div>
          </div>
        </div>

        {/* Case ID Box */}
        <div className="bg-blue-50/50 px-8 py-8 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white p-4 rounded-md border border-blue-100 shadow-sm">
              <Database size={28} className="text-blue-700" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Grievance Case ID (Reference Only)</p>
              <h3 className="text-3xl font-black text-[#002b5e] tracking-tighter">{receiptData.caseNumber}</h3>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-black uppercase text-green-700 tracking-widest">Active Investigation</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status: PENDING ALLOCATION</span>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            
            {/* Applicant Details Card */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b-2 border-blue-700 pb-2 w-fit">
                <User size={16} className="text-blue-700" /> 1. Complainant Profile
              </h4>
              <div className="space-y-4">
                <DetailItem label="Full Name" value={receiptData.applicantName} />
                <DetailItem label="Contact" value={receiptData.mobile ? `+91 ${receiptData.mobile}` : 'N/A'} />
                <DetailItem label="Address" value={receiptData.address} isAddress />
              </div>
            </div>

            {/* Jurisdiction Card */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b-2 border-blue-700 pb-2 w-fit">
                <MapPin size={16} className="text-blue-700" /> 2. Jurisdiction & Allocation
              </h4>
              <div className="space-y-4">
                <DetailItem label="Department" value={receiptData.department} />
                <DetailItem label="Scheme" value={receiptData.scheme} />
                <DetailItem label="Location" value={`${receiptData.district}, ${receiptData.block}`} />
              </div>
            </div>
          </div>

          {/* Grievance Summary */}
          <div className="bg-gray-50 rounded-sm border border-gray-200 p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <FileText size={80} />
            </div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Case Subject Description</label>
            <p className="text-[15px] font-medium text-gray-800 italic leading-relaxed relative z-10">
              "{receiptData.description}"
            </p>
          </div>

          {/* What's Next Section */}
          <div className="border-t border-gray-100 pt-10 mb-10 print:hidden">
            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Info size={16} className="text-blue-700" /> What happens next?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NextStepStep 
                num="01" 
                title="Verification" 
                desc="A nodal officer will verify the authenticity of the records provided."
              />
              <NextStepStep 
                num="02" 
                title="Allocation" 
                desc="The case will be forwarded to the respective department head for action."
              />
              <NextStepStep 
                num="03" 
                title="Resolution" 
                desc="You will receive updates on your registered mobile regarding the status."
              />
            </div>
          </div>

          {/* Verification Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center py-8 border-y border-gray-100 gap-8">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8">Digital Signature (System Generated)</p>
              <div className="font-serif italic text-2xl text-gray-900 font-black border-b-2 border-gray-900 px-4 pb-1">
                IGMS Official
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-2">Authenticated by Rajasthan State Portal</p>
            </div>
            <div className="bg-blue-700 text-white p-6 rounded-sm flex items-start gap-4 max-w-xs shadow-xl">
              <Shield size={24} className="shrink-0 opacity-50" />
              <p className="text-[11px] font-medium leading-relaxed">
                {lang === 'hi'
                  ? 'यह एक कम्प्यूटर जनित पावती है। भविष्य के लिए इस शिकायत संख्या को सुरक्षित रखें।'
                  : 'This is a system-generated acknowledgment. Please use the Case ID for all future communications.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="bg-gray-50 p-8 flex flex-col md:flex-row gap-4 border-t border-gray-200 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-4 font-black hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[13px] shadow-sm"
          >
            <Printer size={18} /> {lang === 'hi' ? 'पावती प्रिंट करें' : 'Print Receipt'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#002b5e] text-white py-4 font-black shadow-lg hover:bg-[#001c3d] flex items-center justify-center gap-3 uppercase tracking-widest text-[13px]"
          >
            <Home size={18} /> {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isAddress = false }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</span>
    <p className={`font-bold text-gray-800 ${isAddress ? 'text-[12px] leading-tight' : 'text-[14px]'}`}>{value || '---'}</p>
  </div>
);

const NextStepStep = ({ num, title, desc }) => (
  <div className="bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
    <div className="text-[24px] font-black text-gray-100 group-hover:text-blue-50 transition-colors leading-none mb-2">{num}</div>
    <h5 className="text-[12px] font-black text-gray-900 uppercase tracking-tight mb-1">{title}</h5>
    <p className="text-[11px] text-gray-500 leading-normal font-medium">{desc}</p>
  </div>
);

export default Receipt;
