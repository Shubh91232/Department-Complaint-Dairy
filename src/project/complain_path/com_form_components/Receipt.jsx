import React from 'react';
import { Database, User, Shield, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Receipt = ({ lang, receiptData }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Receipt;
