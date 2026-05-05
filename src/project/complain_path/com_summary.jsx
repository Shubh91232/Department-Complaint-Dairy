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
  ChevronRight,
  Brain,
  Sparkles,
  Zap,
  Target,
  Copy,
  AlertCircle,
  FileSearch,
  RefreshCw
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

  // Mock AI Analysis Data (Simulating a Duplicate Case)
  const aiStats = {
    matchScore: 85,
    duplicateProbability: 92,
    isUnique: false,
    duplicateCount: 3,
    sentiment: 'High Conflict',
    priority: 'Critical'
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Top Header & Actions */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              <Link to="/" className="hover:text-blue-600 transition-colors">Portal</Link>
              <ChevronRight size={12} className="mx-2" />
              <Link to="/complain" className="hover:text-blue-600 transition-colors">Registry</Link>
              <ChevronRight size={12} className="mx-2" />
              <span className="text-gray-900">Verification Hub</span>
            </div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <FileSearch className="text-blue-600" size={24} />
              {lang === 'hi' ? 'प्रविष्टि सारांश और एआई सत्यापन' : 'Entry Summary & AI Verification'}
            </h1>
          </div>
          
          <div className="flex gap-2">
             <button onClick={() => navigate(-1)} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
               <ChevronLeft size={16} /> {lang === 'hi' ? 'सुधारें' : 'Back'}
             </button>
             <button onClick={() => window.print()} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
               <Printer size={16} /> {lang === 'hi' ? 'प्रिंट' : 'Print'}
             </button>
             <button 
               onClick={() => navigate('/complain', { state: { ...location.state, confirmed: true } })}
               className="bg-[#002b5e] text-white px-8 py-2 rounded-lg font-black text-[12px] flex items-center gap-2 hover:bg-[#001c3d] transition-all shadow-lg shadow-blue-100 uppercase tracking-widest"
             >
               <Check size={16} /> {lang === 'hi' ? 'पुष्टि करें' : 'Confirm & Submit'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side: Structured Form Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  {lang === 'hi' ? 'आवेदक का विवरण' : 'Complainant Profile'}
                </h3>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">Verified Identity</span>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-[14px] font-bold text-gray-900">{applicantData.name || 'NOT PROVIDED'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Number</p>
                  <p className="text-[14px] font-bold text-gray-900">{applicantData.mobile || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Residential Address</p>
                  <p className="text-[13px] font-semibold text-gray-700 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">{applicantData.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
                <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Target size={16} className="text-orange-600" />
                  {lang === 'hi' ? 'प्रकरण का कार्यक्षेत्र' : 'Case Jurisdiction & Reference'}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Serial No.</span>
                      <span className="font-black text-blue-700 text-[14px]">{formData.serialNumber}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Fiscal Year</span>
                      <span className="font-bold text-gray-900">{formData.financialYear}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Registry Source</span>
                      <span className="font-bold text-gray-900">{formData.source}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">District</span>
                      <span className="font-bold text-gray-900">{getDistrictLabel(formData.district)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Block / GP</span>
                      <span className="font-bold text-gray-900">{getBlockLabel(formData.block)} / {formData.panchayat || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Admin Level</span>
                      <span className="font-bold text-gray-900">{formData.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
                <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-600" />
                  {lang === 'hi' ? 'शिकायत का विवरण' : 'Grievance Core Details'}
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Department</p>
                    <p className="font-bold text-gray-900">{formData.department}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Scheme</p>
                    <p className="font-bold text-gray-900">{formData.scheme}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Category Assignment</p>
                  <p className="font-black text-gray-900 bg-yellow-50 px-3 py-2 border-l-4 border-yellow-400 inline-block">{formData.complaintCategory}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Grievance Narrative</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-[14px] leading-relaxed text-gray-700 italic">
                    "{formData.description}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: AI Analysis & Verification */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Trust Score Card */}
            <div className="bg-[#002b5e] text-white rounded-xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] bg-white/10 w-40 h-40 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center backdrop-blur-md">
                      <Brain className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-[15px] uppercase tracking-tighter">AI Verification Hub</h3>
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Real-time Analysis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">{aiStats.matchScore}%</div>
                    <div className="text-[9px] font-bold text-blue-300 uppercase">Match Score</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Duplicate Check - High Alert Case */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Copy size={16} className="text-red-400" />
                        <span className="font-bold text-[12px] uppercase tracking-tighter">Duplicate Detection Alert</span>
                      </div>
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase animate-pulse">
                        Potential Duplicate
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[94%]"></div>
                    </div>
                    <p className="text-[11px] mt-3 text-red-200 font-bold italic tracking-tight">
                      WARNING: Found {aiStats.duplicateCount} similar records from the same applicant in current jurisdiction.
                    </p>

                    {/* Evidence: Similar Records List */}
                    <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                      <p className="text-[9px] font-black text-blue-300 uppercase mb-2 tracking-widest">Historical Evidence</p>
                      {[
                        { id: 'GP/2026/042', date: '12-Apr-2026', match: '94%', reason: 'Content Overlap' },
                        { id: 'GP/2026/089', date: '28-Apr-2026', match: '89%', reason: 'Same Subject' },
                        { id: 'GP/2026/115', date: '02-May-2026', match: '72%', reason: 'Partial Match' },
                      ].map((rec, i) => (
                        <div key={i} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5 transition-all hover:bg-black/30 group">
                           <div>
                             <span className="font-black text-white text-[11px] block">{rec.id}</span>
                             <span className="text-[9px] text-blue-300/60 uppercase">{rec.reason}</span>
                           </div>
                           <div className="text-right">
                             <span className="font-black text-red-400 text-[11px] block">{rec.match}</span>
                             <span className="text-[9px] text-gray-400">{rec.date}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Integrity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Zap size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Priority</span>
                      </div>
                      <div className="text-[16px] font-black text-white">{aiStats.priority}</div>
                      <p className="text-[9px] text-blue-300/70 mt-1">Based on category urgency</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Sentiment</span>
                      </div>
                      <div className="text-[16px] font-black text-white">{aiStats.sentiment}</div>
                      <p className="text-[9px] text-blue-300/70 mt-1">Natural Language processing</p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <RefreshCw size={14} className="text-blue-400 animate-spin-slow" />
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Analysis re-running on each edit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Flags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Safety & Compliance Flags</h4>
              <div className="space-y-3">
                {[
                  { label: 'OCR Consistency Check', status: 'Passed', icon: <Check size={14} />, color: 'text-green-600 bg-green-50' },
                  { label: 'Mobile Number Verification', status: 'Active', icon: <Zap size={14} />, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Panchayati Raj Sync', status: 'Success', icon: <Target size={14} />, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Potential Scheme Mismatch', status: 'None', icon: <AlertCircle size={14} />, color: 'text-gray-400 bg-gray-50' },
                ].map((flag, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${flag.color}`}>
                        {flag.icon}
                      </div>
                      <span className="font-bold text-gray-700 text-[12px]">{flag.label}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400">{flag.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Disclaimer */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
               <div className="flex gap-3">
                 <AlertCircle className="text-yellow-600 shrink-0" size={18} />
                 <p className="text-[11px] text-yellow-800 leading-relaxed font-medium">
                   <strong>Administrative Note:</strong> The AI scores provided above are for decision-support only. Final verification must be performed by the designated Investigating Officer ( {formData.responsibleOfficer} ).
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 print:hidden">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">End of Entry Summary • Rajasthan Public Grievance Portal</p>
          <div className="h-px w-20 bg-gray-200"></div>
        </div>

      </div>
      
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .flex-grow { padding: 0 !important; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default ComplainSummary;