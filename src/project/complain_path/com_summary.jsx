import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  ChevronLeft, 
  Printer, 
  Check,
  Home,
  ChevronRight
} from 'lucide-react';

const ComplainSummary = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data passed from ComplainForm
  const { applicantData, formData, apiDistricts, apiBlocks } = location.state || {
    applicantData: {},
    formData: {},
    apiDistricts: [],
    apiBlocks: []
  };

  // If no data, show a warning or redirect
  if (!formData.serialNumber && !location.state) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-sm shadow-md text-center max-w-md">
            <ShieldAlert size={48} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#002b5e] mb-2">No Summary Data Found</h2>
            <p className="text-gray-500 mb-6">Please fill out the complaint form first to view the summary.</p>
            <button 
              onClick={() => navigate('/complain')}
              className="bg-[#002b5e] text-white px-6 py-2 rounded-sm font-bold hover:bg-[#001c3d] transition-colors"
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

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center text-[12px] font-semibold text-gray-500">
            <Link to="/" className="hover:text-[#1976d2] transition-colors flex items-center gap-1">
              <Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/complain" className="hover:text-[#1976d2] transition-colors">
              {lang === 'hi' ? 'शिकायत दर्ज करें' : 'Lodge Complaint'}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#002b5e] font-semibold">{lang === 'hi' ? 'प्रविष्टि सारांश' : 'Entry Summary'}</span>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => navigate(-1)}
               className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-sm font-bold text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
             >
               <ChevronLeft size={16} /> {lang === 'hi' ? 'वापस जाएं' : 'Back'}
             </button>
             <button 
               onClick={() => window.print()}
               className="bg-[#002b5e] text-white px-5 py-2 rounded-sm font-bold text-[12px] flex items-center gap-2 hover:bg-[#001c3d] transition-colors shadow-md"
             >
               <Printer size={16} /> {lang === 'hi' ? 'प्रिंट करें' : 'Print Summary'}
             </button>
          </div>
        </div>

        {/* Main Document Content */}
        <div className="bg-white shadow-xl rounded-sm overflow-hidden mb-10 print:shadow-none print:border-0">
          <div className="p-8 md:p-16">
            <div className="border-[3px] border-double border-gray-800 p-8 md:p-12 relative bg-white">
              {/* Document Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gray-200 print:hidden"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gray-200 print:hidden"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gray-200 print:hidden"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gray-200 print:hidden"></div>

              {/* Official Header */}
              <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-16" />
                </div>
                <h1 className="text-2xl font-black uppercase text-gray-900 mb-1 tracking-tight">Government of Rajasthan</h1>
                <h2 className="text-xl font-bold text-gray-800 mb-2 uppercase">Department of Rural Development & Panchayati Raj</h2>
                <div className="h-1 w-24 bg-gray-900 mx-auto mb-6"></div>
                <h3 className="text-lg font-black bg-gray-100 py-2 inline-block px-8 border border-gray-300">
                  {lang === 'hi' ? 'शिकायत/मामला प्रविष्टि सारांश' : 'Grievance / Case Entry Summary'}
                </h3>
              </div>

              {/* Information Grid */}
              <div className="space-y-8 text-gray-900">
                
                {/* I. Complainant Information */}
                <div>
                  <h4 className="font-black border-b-2 border-gray-800 pb-1 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wide">
                    <User size={16} /> {lang === 'hi' ? 'I. आवेदक का विवरण' : 'I. Complainant Information'}
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 px-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Full Name</span> 
                      <span className="font-bold border-b border-gray-100 pb-1">{applicantData.name || 'NOT PROVIDED'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Mobile Number</span> 
                      <span className="font-bold border-b border-gray-100 pb-1">{applicantData.mobile || 'N/A'}</span>
                    </div>
                    <div className="col-span-2 flex flex-col">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Postal Address</span> 
                      <span className="font-semibold">{applicantData.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* II. Reference & Geographic Scope */}
                <div>
                  <h4 className="font-black border-b-2 border-gray-800 pb-1 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wide">
                    <Calendar size={16} /> {lang === 'hi' ? 'II. संदर्भ और भौगोलिक क्षेत्र' : 'II. Reference & Geographic Scope'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 px-2">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Source</span> 
                        <span className="font-bold">{formData.source}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Serial No</span> 
                        <span className="font-black text-blue-800">{formData.serialNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Fin. Year</span> 
                        <span className="font-bold">{formData.financialYear}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Received Date</span> 
                        <span className="font-bold">{formData.dateReceived}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Admin Level</span> 
                        <span className="font-bold">{formData.level}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">District</span> 
                        <span className="font-bold">{getDistrictLabel(formData.district)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Block</span> 
                        <span className="font-bold">{getBlockLabel(formData.block) || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">Gram Panchayat</span> 
                        <span className="font-bold">{formData.panchayat || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* III. Grievance Specifics */}
                <div>
                  <h4 className="font-black border-b-2 border-gray-800 pb-1 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wide">
                    <ShieldAlert size={16} /> {lang === 'hi' ? 'III. शिकायत का विवरण' : 'III. Grievance Specifics'}
                  </h4>
                  <div className="px-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-gray-500 uppercase">Department</span> 
                         <span className="font-bold">{formData.department}</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-gray-500 uppercase">Scheme Name</span> 
                         <span className="font-bold">{formData.scheme}</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Complaint Category</span> 
                      <span className="font-black text-gray-900 border-l-4 border-gray-800 pl-3 py-1 bg-gray-50 italic">
                        {formData.complaintCategory}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Detailed Description</span>
                      <div className="text-[14px] leading-relaxed italic bg-gray-50 p-4 border border-dashed border-gray-300">
                        "{formData.description}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* IV. Status & Enforcement Details */}
                <div>
                  <h4 className="font-black border-b-2 border-gray-800 pb-1 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wide">
                    <Activity size={16} /> {lang === 'hi' ? 'IV. स्थिति और प्रवर्तन विवरण' : 'IV. Status & Enforcement Details'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                     <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-gray-500 uppercase">Investigating Officer</span> 
                       <span className="font-bold">{formData.responsibleOfficer}</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-gray-500 uppercase">Current Case Status</span> 
                       <span className="font-black uppercase text-[#1976d2]">{formData.currentStatus}</span>
                     </div>
                  </div>
                  {formData.actionTaken && (
                    <div className="mt-4 px-2 flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Action Taken</span>
                      <span className="text-[13px] font-medium text-gray-700">{formData.actionTaken}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Official Seal / Signature Area */}
              <div className="mt-20 flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="text-[11px] text-gray-400 font-bold uppercase italic order-2 md:order-1">
                   Official Copy • Generated on {new Date().toLocaleDateString()}
                </div>
                <div className="text-center order-1 md:order-2">
                  <div className="w-56 h-16 border-b-2 border-gray-300 mb-2"></div>
                  <p className="text-[11px] font-black uppercase text-gray-500 tracking-wider">Authorized Officer Signature</p>
                  <p className="text-[9px] text-gray-400 font-medium">Digital Verification Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Sticky Bottom on Mobile) */}
        <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col md:flex-row justify-center gap-4 print:hidden">
          <button 
            onClick={() => navigate('/complain', { state: location.state })}
            className="px-10 py-3 bg-white border-2 border-[#002b5e] text-[#002b5e] font-black hover:bg-blue-50 transition-all rounded-sm uppercase tracking-widest text-[12px] flex items-center justify-center gap-2"
          >
            {lang === 'hi' ? 'सुधार करें' : 'Edit Information'}
          </button>
          <button 
            onClick={() => navigate('/complain', { state: { ...location.state, confirmed: true } })}
            className="px-12 py-3 bg-[#1e7b34] text-white font-black hover:bg-[#155a26] transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]"
          >
            <Check size={18} />
            {lang === 'hi' ? 'डेटा सबमिट करें' : 'Final Submit'}
          </button>
        </div>

      </div>
      
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:border-0 { border: 0 !important; }
          .print\\:shadow-none { shadow: none !important; }
          header, footer { display: none !important; }
          .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .flex-grow { padding: 0 !important; }
        }
      ` }} />
    </div>
  );
};

export default ComplainSummary;