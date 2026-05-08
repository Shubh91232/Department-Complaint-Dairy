import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { trackComplaintAPI } from '../../apiHandler/apis';
import {
  Home, ChevronRight, Search, CheckCircle, Clock, XCircle,
  AlertCircle, User, Calendar, MapPin, Building2, FileText,
  Layers, ArrowRight, Phone, Shield, RefreshCw, Printer, Download
} from 'lucide-react';

// ─── Mock data generator ─────────────────────────────────────────────────────
const generateMockData = (query) => ({
  grievanceId: `GRV/2024/${Math.floor(10000 + Math.random() * 90000)}`,
  serialNo: `RJ-${Math.floor(100000 + Math.random() * 900000)}`,
  applicantName: 'Ramesh Kumar Sharma',
  mobile: '98XXXXXX12',
  address: 'Ward No. 4, Gram Panchayat Bamanwas, Tehsil Lalsot, District Dausa, Rajasthan - 303503',
  department: 'Rural Development & Panchayati Raj',
  scheme: 'MNREGA – Job Card Issuance',
  subject: 'Delay in issuance of MNREGA Job Card despite applying 3 months ago.',
  dateOfFiling: '2024-02-14',
  currentLevel: 3,
  currentStatus: 'In Progress',
  stages: [
    {
      level: 1,
      name: 'Gram Panchayat Level',
      officer: 'Smt. Poonam Devi',
      designation: 'Gram Panchayat Sachiv',
      location: 'Gram Panchayat Bamanwas, Dausa',
      date: '2024-02-15',
      remarks: 'Complaint received and acknowledged. Forwarded to Panchayat Samiti level for action.',
      status: 'Completed',
      actionTaken: 'Acknowledged & Forwarded',
    },
    {
      level: 2,
      name: 'Panchayat Samiti Level',
      officer: 'Sh. Rajveer Singh Meena',
      designation: 'Block Development Officer (BDO)',
      location: 'Panchayat Samiti, Lalsot, Dausa',
      date: '2024-02-19',
      remarks: 'Case verified with local records. Escalated to district level as the delay involves department policy.',
      status: 'Completed',
      actionTaken: 'Verified & Escalated',
    },
    {
      level: 3,
      name: 'District Level',
      officer: 'Sh. Devendra Kumar Jain',
      designation: 'District Programme Coordinator (DPC)',
      location: 'Collectorate, Dausa',
      date: '2024-03-01',
      remarks: 'Under review. Supporting documents being verified. Expected resolution within 10 working days.',
      status: 'In Progress',
      actionTaken: 'Under Review',
    },
    {
      level: 4,
      name: 'State / Department Level',
      officer: '—',
      designation: 'Joint Secretary (Grievance Cell)',
      location: 'Secretariat, Jaipur',
      date: null,
      remarks: 'Pending — will be escalated if not resolved at district level.',
      status: 'Pending',
      actionTaken: null,
    },
  ],
});

// ─── Status config ─────────────────────────────────────────────────────────
const statusConfig = {
  Completed: { color: 'bg-green-500', light: 'bg-green-50  border-green-200', text: 'text-green-700', icon: <CheckCircle size={18} />, label: 'Completed' },
  'In Progress': { color: 'bg-blue-500', light: 'bg-blue-50   border-blue-200', text: 'text-blue-700', icon: <RefreshCw size={18} />, label: 'In Progress' },
  Pending: { color: 'bg-gray-300', light: 'bg-gray-50   border-gray-200', text: 'text-gray-500', icon: <Clock size={18} />, label: 'Pending' },
  Rejected: { color: 'bg-red-500', light: 'bg-red-50    border-red-200', text: 'text-red-700', icon: <XCircle size={18} />, label: 'Rejected' },
};

const overallBadge = {
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
  'Resolved': 'bg-green-100 text-green-700 border-green-300',
  'Approved': 'bg-green-100 text-green-700 border-green-300',
  'Rejected': 'bg-red-100 text-red-700 border-red-300',
  'Pending': 'bg-gray-100 text-gray-600 border-gray-300',
};

// ─── Real Data Mapper ────────────────────────────────────────────────────────
const mapRealToMock = (realData) => {
  // Determine status color/label
  let status = realData.enforcement_status?.case_status || 'Pending';
  if (status === 'Approved') status = 'Resolved'; // Standardize for UI
  
  return {
    grievanceId: realData.complainId,
    serialNo: realData.core_case_information?.serial_no || 'N/A',
    source: realData.core_case_information?.source || 'Portal',
    applicantName: realData.complain_profile?.complainer?.name || 'N/A',
    mobile: realData.complain_profile?.complainer?.mobile || 'N/A',
    address: realData.complain_profile?.complainer?.address || 'N/A',
    department: realData.case_specifics?.department || 'N/A',
    scheme: realData.case_specifics?.scheme || 'N/A',
    category: realData.case_specifics?.complaint_category || 'N/A',
    subject: realData.case_specifics?.complain_details || 'N/A',
    district: realData.geographic_information?.district || 'N/A',
    block: realData.geographic_information?.block || 'N/A',
    panchayat: realData.geographic_information?.gram_panchayat || 'N/A',
    dateOfFiling: realData.core_case_information?.date || (realData.createdAt ? realData.createdAt.split('T')[0] : 'N/A'),
    currentLevel: status === 'Pending' ? 1 : 2,
    currentStatus: status,
    stages: [
      {
        level: 1,
        name: 'Registration Level',
        officer: realData.core_case_information?.entry_officer?.name || 'Portal User',
        designation: 'Entry Officer',
        location: `${realData.geographic_information?.district || 'Rajasthan'}`,
        date: realData.core_case_information?.date || (realData.createdAt ? realData.createdAt.split('T')[0] : 'N/A'),
        remarks: 'Complaint successfully registered on the portal.',
        status: 'Completed',
        actionTaken: 'Registered',
      },
      {
        level: 2,
        name: 'Processing Level',
        officer: realData.enforcement_status?.responsible_officer || '—',
        designation: 'Designated Officer',
        location: realData.geographic_information?.gram_panchayat || realData.geographic_information?.block || realData.geographic_information?.district || 'Pending',
        date: realData.updatedAt ? realData.updatedAt.split('T')[0] : null,
        remarks: realData.enforcement_status?.remarks || (status === 'Pending' ? 'Assigned to the concerned department for verification.' : 'Action has been taken on the grievance.'),
        status: status === 'Pending' ? 'In Progress' : 'Completed',
        actionTaken: realData.enforcement_status?.action_taken || (status === 'Pending' ? 'Under Review' : 'Processed'),
      }
    ],
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
const TrackGrievance = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if query was passed from home page OR URL params
  useEffect(() => {
    const complainIdParam = searchParams.get('complain_id');
    if (complainIdParam) {
      setQuery(complainIdParam);
      handleSearch(complainIdParam);
    } else if (location.state?.query) {
      setQuery(location.state.query);
      handleSearch(location.state.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, location.state]);

  const handleSearch = async (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setError(lang === 'hi' ? 'कृपया शिकायत आईडी / मोबाइल नंबर दर्ज करें।' : 'Please enter Grievance ID / Mobile No.');
      return;
    }
    setError('');
    setData(null);
    setLoading(true);

    try {
      // 1. Try real API first
      const response = await trackComplaintAPI(trimmed);
      
      if (response.success && response.data) {
        setData(mapRealToMock(response.data));
      } else {
        // 2. Fallback to mock for ID "2210" (as requested by user previously)
        if (trimmed === '2210') {
          setData(generateMockData(trimmed));
        } else {
          setError(
            lang === 'hi'
              ? `"${trimmed}" के लिए कोई शिकायत रिकॉर्ड नहीं मिला। कृपया सही शिकायत आईडी / मोबाइल नंबर दर्ज करें।`
              : `No grievance tracking record found for "${trimmed}". Please check your Grievance ID / Mobile No. and try again.`
          );
        }
      }
    } catch (err) {
      // Fallback for mock 2210 even if API fails
      if (trimmed === '2210') {
        setData(generateMockData(trimmed));
      } else {
        setError(
          lang === 'hi'
            ? `"${trimmed}" के लिए कोई शिकायत रिकॉर्ड नहीं मिला। कृपया सही शिकायत आईडी / मोबाइल नंबर दर्ज करें।`
            : `No grievance tracking record found for "${trimmed}". Please check your Grievance ID / Mobile No. and try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const completedCount = data ? data.stages.filter(s => s.status === 'Completed').length : 0;
  const totalStages = data ? data.stages.length : 0;
  const progressPct = data ? Math.round((completedCount / totalStages) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">{lang === 'hi' ? 'शिकायत स्थिति' : 'Track Grievance'}</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-5 border-b-4 border-[#e65100] shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                <Search size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white uppercase tracking-wider">
                  {lang === 'hi' ? 'शिकायत / अपील स्थिति' : 'Track Grievance / Appeal Status'}
                </h1>
                <p className="text-blue-200 text-[12px]">
                  {lang === 'hi' ? 'अपनी शिकायत की वर्तमान स्थिति एवं प्रगति देखें' : 'View the current status and progress of your grievance'}
                </p>
              </div>
            </div>
            {data && (
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-sm text-[11px] font-bold hover:bg-white/20 transition flex items-center gap-1.5">
                  <Printer size={13} /> {lang === 'hi' ? 'प्रिंट' : 'Print'}
                </button>
                <button className="bg-[#1e7b34] text-white px-3 py-1.5 rounded-sm text-[11px] font-bold hover:bg-[#145a24] transition flex items-center gap-1.5">
                  <Download size={13} /> {lang === 'hi' ? 'डाउनलोड' : 'Download'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={lang === 'hi' ? 'शिकायत आईडी / मोबाइल नंबर दर्ज करें...' : 'Enter Grievance ID / Mobile No...'}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[#002b5e] text-[13px]"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-[#002b5e] text-white px-6 py-2.5 rounded-sm font-bold text-[13px] hover:bg-[#001f44] transition flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Search size={15} />}
            {lang === 'hi' ? 'स्थिति देखें' : 'View Status'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 flex items-center gap-2 font-semibold text-[13px]">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-sm"></div>
            <div className="h-16 bg-gray-200 rounded-sm"></div>
            <div className="h-64 bg-gray-200 rounded-sm"></div>
          </div>
        )}

        {/* Results */}
        {!loading && data && (
          <>
            {/* ── Application Summary Card ── */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm mb-6 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#002b5e] text-[13px] uppercase tracking-wide">
                  <FileText size={15} /> {lang === 'hi' ? 'आवेदन विवरण' : 'Application Summary'}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${overallBadge[data.currentStatus] || overallBadge.Pending}`}>
                  {data.currentStatus === 'In Progress' ? <RefreshCw size={11} /> : data.currentStatus === 'Resolved' ? <CheckCircle size={11} /> : <Clock size={11} />}
                  {data.currentStatus}
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[12px]">
                {[
                  { icon: <Shield size={14} />, label: lang === 'hi' ? 'शिकायत आईडी' : 'Grievance ID', val: data.grievanceId },
                  { icon: <FileText size={14} />, label: lang === 'hi' ? 'क्रमांक' : 'Serial No.', val: data.serialNo },
                  { icon: <Layers size={14} />, label: lang === 'hi' ? 'स्रोत' : 'Source', val: data.source },
                  { icon: <Calendar size={14} />, label: lang === 'hi' ? 'दर्ज तिथि' : 'Date of Filing', val: data.dateOfFiling },
                  { icon: <User size={14} />, label: lang === 'hi' ? 'आवेदक का नाम' : 'Applicant Name', val: data.applicantName },
                  { icon: <Phone size={14} />, label: lang === 'hi' ? 'मोबाइल' : 'Mobile', val: data.mobile },
                  { icon: <Building2 size={14} />, label: lang === 'hi' ? 'विभाग' : 'Department', val: data.department },
                  { icon: <Layers size={14} />, label: lang === 'hi' ? 'योजना' : 'Scheme', val: data.scheme },
                  { icon: <FileText size={14} />, label: lang === 'hi' ? 'श्रेणी' : 'Category', val: data.category },
                  { icon: <MapPin size={14} />, label: lang === 'hi' ? 'जिला' : 'District', val: data.district },
                  { icon: <MapPin size={14} />, label: lang === 'hi' ? 'ब्लॉक' : 'Block', val: data.block },
                  { icon: <MapPin size={14} />, label: lang === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat', val: data.panchayat },
                  { icon: <MapPin size={14} />, label: lang === 'hi' ? 'पता' : 'Address', val: data.address, span: true },
                ].map((f, i) => (
                  <div key={i} className={`flex items-start gap-2 ${f.span ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                    <div className="text-[#e65100] mt-0.5 shrink-0">{f.icon}</div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</p>
                      <p className="font-semibold text-gray-800 leading-snug">{f.val}</p>
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2 lg:col-span-3 mt-1 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{lang === 'hi' ? 'शिकायत का विषय' : 'Subject of Grievance'}</p>
                  <p className="font-semibold text-gray-700 italic">"{data.subject}"</p>
                </div>
              </div>
            </div>

            {/* ── Progress Bar ── */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm mb-6 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-[#002b5e] text-[13px] uppercase tracking-wide flex items-center gap-2">
                  <Layers size={15} /> {lang === 'hi' ? 'समग्र प्रगति' : 'Overall Progress'}
                </div>
                <span className="text-[13px] font-bold text-gray-700">
                  {completedCount} / {totalStages} {lang === 'hi' ? 'स्तर पूर्ण' : 'Levels Completed'} — <span className="text-[#002b5e]">{progressPct}%</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#002b5e] to-[#e65100] transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-semibold text-gray-400 uppercase">
                <span>{lang === 'hi' ? 'दर्ज' : 'Filed'}</span>
                <span>{lang === 'hi' ? 'राज्य स्तर' : 'State Level'}</span>
              </div>
            </div>

            {/* ── Stage Timeline ── */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm mb-6 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 font-bold text-[#002b5e] text-[13px] uppercase tracking-wide flex items-center gap-2">
                <Layers size={15} /> {lang === 'hi' ? 'सत्यापन चरण विवरण' : 'Verification Stage Details'}
              </div>

              <div className="p-5 md:p-8">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 md:left-7"></div>

                  <div className="space-y-8">
                    {data.stages.map((stage, idx) => {
                      const cfg = statusConfig[stage.status] || statusConfig.Pending;
                      const isActive = stage.level === data.currentLevel;
                      return (
                        <div key={idx} className="relative flex gap-5 md:gap-8">
                          {/* Circle Icon */}
                          <div className={`relative z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-2 text-white shadow-md ${cfg.color} ${isActive ? 'ring-4 ring-offset-2 ring-[#e65100]/40' : ''}`}>
                            <span className="text-white">{cfg.icon}</span>
                          </div>

                          {/* Content Card */}
                          <div className={`flex-1 border rounded-sm p-4 shadow-sm ${isActive ? 'border-[#e65100] bg-orange-50/30' : cfg.light}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-[#002b5e] text-white text-[10px] font-black px-2 py-0.5 rounded">
                                    {lang === 'hi' ? 'स्तर' : 'Level'} {stage.level}
                                  </span>
                                  {isActive && (
                                    <span className="bg-[#e65100] text-white text-[10px] font-black px-2 py-0.5 rounded animate-pulse">
                                      ▶ {lang === 'hi' ? 'वर्तमान' : 'Current'}
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.light} ${cfg.text}`}>
                                    {cfg.label}
                                  </span>
                                </div>
                                <h3 className="font-bold text-[#002b5e] text-[14px] mt-1">{stage.name}</h3>
                              </div>
                              {stage.date && (
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold shrink-0">
                                  <Calendar size={13} className="text-[#e65100]" />
                                  {stage.date}
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                              <div className="flex items-start gap-2">
                                <User size={13} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'hi' ? 'अधिकारी' : 'Officer'}</p>
                                  <p className="font-bold text-gray-800">{stage.officer}</p>
                                  <p className="text-[11px] text-gray-500">{stage.designation}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'hi' ? 'कार्यालय' : 'Office Location'}</p>
                                  <p className="font-semibold text-gray-700">{stage.location}</p>
                                </div>
                              </div>
                            </div>

                            {stage.actionTaken && (
                              <div className="mt-3 flex items-center gap-2">
                                <ArrowRight size={12} className="text-[#e65100] shrink-0" />
                                <span className="text-[11px] font-bold text-[#e65100] uppercase tracking-wide">{lang === 'hi' ? 'की गई कार्रवाई:' : 'Action Taken:'}</span>
                                <span className="text-[12px] font-semibold text-gray-700">{stage.actionTaken}</span>
                              </div>
                            )}

                            <div className="mt-2 bg-white/70 rounded-sm px-3 py-2 border border-white text-[12px] text-gray-600 italic leading-snug">
                              <span className="font-bold text-gray-500 not-italic text-[10px] uppercase">{lang === 'hi' ? 'टिप्पणी: ' : 'Remarks: '}</span>
                              {stage.remarks}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer Note ── */}
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start gap-3 text-[12px] text-amber-800">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p>
                {lang === 'hi'
                  ? 'यदि आपकी शिकायत का समाधान 30 दिनों के भीतर नहीं होता है, तो आप प्रथम अपील दर्ज कर सकते हैं। अपील के लिए होम पेज पर जाएं।'
                  : 'If your grievance is not resolved within 30 days, you may file a First Appeal. Visit the Home page to file an appeal.'}
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !data && !error && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm py-20 text-center">
            <Search size={52} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-semibold text-[15px]">
              {lang === 'hi' ? 'अपनी शिकायत की स्थिति जानने के लिए शिकायत आईडी या मोबाइल नंबर दर्ज करें।' : 'Enter your Grievance ID or Mobile No. to track status.'}
            </p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default TrackGrievance;