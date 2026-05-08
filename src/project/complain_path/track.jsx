import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { trackComplaintAPI, updateComplaintTrackAPI, fetchComplaintStatusesAPI } from '../../apiHandler/apis';
import {
  Home, ChevronRight, Search, CheckCircle, Clock, XCircle,
  AlertCircle, User, Calendar, MapPin, Building2, FileText,
  Layers, ArrowRight, Phone, Shield, RefreshCw, Printer, Download, ArrowLeft, Paperclip
} from 'lucide-react';

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
const mapResponseToData = (complaint, tracking) => {
  if (!complaint) return null;

  // If we have real tracking data from the DB, use it
  if (tracking) {
    return {
      grievanceId: complaint.complainId,
      serialNo: complaint.core_case_information?.serial_no || 'N/A',
      source: complaint.core_case_information?.source || 'Portal',
      applicantName: complaint.complain_profile?.complainer?.name || 'N/A',
      mobile: complaint.complain_profile?.complainer?.mobile || 'N/A',
      address: complaint.complain_profile?.complainer?.address || 'N/A',
      department: complaint.case_specifics?.department || 'N/A',
      scheme: complaint.case_specifics?.scheme || 'N/A',
      category: complaint.case_specifics?.complaint_category || 'N/A',
      subject: complaint.case_specifics?.complain_details || 'N/A',
      district: complaint.geographic_information?.district || 'N/A',
      block: complaint.geographic_information?.block || 'N/A',
      panchayat: complaint.geographic_information?.gram_panchayat || 'N/A',
      dateOfFiling: complaint.core_case_information?.date || (complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'),
      currentLevel: tracking.current_level || 1,
      currentStatus: tracking.current_status || 'Pending',
      stages: tracking.stages.map(s => ({
        level: s.level,
        name: s.name,
        officer: s.officer,
        designation: s.designation,
        location: s.location,
        date: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : null,
        remarks: s.remarks,
        status: s.status,
        actionTaken: s.actionTaken,
        attachment: s.attachment
      })),
    };
  }

  // Fallback if tracking model doesn't exist yet for this complaint
  let status = complaint.enforcement_status?.case_status || 'Pending';
  if (status === 'Approved') status = 'Resolved';

  return {
    grievanceId: complaint.complainId,
    serialNo: complaint.core_case_information?.serial_no || 'N/A',
    source: complaint.core_case_information?.source || 'Portal',
    applicantName: complaint.complain_profile?.complainer?.name || 'N/A',
    mobile: complaint.complain_profile?.complainer?.mobile || 'N/A',
    address: complaint.complain_profile?.complainer?.address || 'N/A',
    department: complaint.case_specifics?.department || 'N/A',
    scheme: complaint.case_specifics?.scheme || 'N/A',
    category: complaint.case_specifics?.complaint_category || 'N/A',
    subject: complaint.case_specifics?.complain_details || 'N/A',
    district: complaint.geographic_information?.district || 'N/A',
    block: complaint.geographic_information?.block || 'N/A',
    panchayat: complaint.geographic_information?.gram_panchayat || 'N/A',
    dateOfFiling: complaint.core_case_information?.date || (complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'),
    currentLevel: status === 'Pending' ? 1 : 2,
    currentStatus: status,
    stages: [
      {
        level: 1,
        name: 'Registration Level',
        officer: complaint.core_case_information?.entry_officer?.name || 'Portal User',
        designation: 'Entry Officer',
        location: `${complaint.geographic_information?.district || 'Rajasthan'}`,
        date: complaint.core_case_information?.date || (complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'),
        remarks: 'Complaint successfully registered on the portal.',
        status: 'Completed',
        actionTaken: 'Registered',
      },
      {
        level: 2,
        name: 'Processing Level',
        officer: complaint.enforcement_status?.responsible_officer || '—',
        designation: 'Designated Officer',
        location: complaint.geographic_information?.gram_panchayat || complaint.geographic_information?.block || 'Pending',
        date: complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleDateString() : null,
        remarks: complaint.enforcement_status?.remarks || (status === 'Pending' ? 'Assigned to the concerned department for verification.' : 'Action has been taken on the grievance.'),
        status: status === 'Pending' ? 'In Progress' : 'Completed',
        actionTaken: complaint.enforcement_status?.action_taken || (status === 'Pending' ? 'Under Review' : 'Processed'),
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
  const [trackingRaw, setTrackingRaw] = useState(null); // Keep original tracking for updates
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statuses, setStatuses] = useState([]);

  // Officer Update States
  const [isOfficer, setIsOfficer] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    currentLevel: 2,
    remarks: '',
    actionTaken: '',
    officer: '',
    designation: '',
    location: '',
    attachment: null
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('agentUserData') || '{}');
    if (userData.empId) setIsOfficer(true);
    
    // Fetch Dynamic Statuses
    const getStatuses = async () => {
      try {
        const res = await fetchComplaintStatusesAPI();
        if (res.success) setStatuses(res.data);
      } catch (err) {
        console.error('Error fetching statuses:', err);
      }
    };
    getStatuses();
  }, []);

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
        setTrackingRaw(response.tracking);
        setData(mapResponseToData(response.data, response.tracking));
        setDuplicates(response.duplicates || []);

        // Pre-fill update form
        setUpdateForm(prev => ({
          ...prev,
          status: response.tracking?.current_status || 'In Progress',
          currentLevel: response.tracking?.current_level || 2,
          officer: JSON.parse(localStorage.getItem('agentUserData') || '{}').name || '',
          designation: JSON.parse(localStorage.getItem('agentUserData') || '{}').department || '',
          location: response.data.geographic_information?.district || ''
        }));
      } else {
        setError(
          lang === 'hi'
            ? `"${trimmed}" के लिए कोई शिकायत रिकॉर्ड नहीं मिला। कृपया सही शिकायत आईडी / मोबाइल नंबर दर्ज करें।`
            : `No grievance tracking record found for "${trimmed}". Please check your Grievance ID / Mobile No. and try again.`
        );
      }
    } catch (err) {
      setError(
        lang === 'hi'
          ? `"${trimmed}" के लिए कोई शिकायत रिकॉर्ड नहीं मिला। कृपया सही शिकायत आईडी / मोबाइल नंबर दर्ज करें।`
          : `No grievance tracking record found for "${trimmed}". Please check your Grievance ID / Mobile No. and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrack = async (e) => {
    e.preventDefault();
    if (!updateForm.actionTaken) {
      alert('Please provide the action taken.');
      return;
    }

    setIsUpdating(true);
    try {
      const stageData = {
        level: updateForm.currentLevel,
        name: updateForm.currentLevel === 2 ? 'Processing Level' : updateForm.currentLevel === 3 ? 'District Level' : 'State Level',
        officer: updateForm.officer,
        designation: updateForm.designation,
        location: updateForm.location,
        status: updateForm.status === 'Resolved' || updateForm.status === 'Approved' ? 'Completed' : 'In Progress',
        remarks: updateForm.remarks,
        actionTaken: updateForm.actionTaken
      };

      const formData = new FormData();
      formData.append('complainId', data.grievanceId);
      formData.append('status', updateForm.status);
      formData.append('currentLevel', updateForm.currentLevel);
      formData.append('stage', JSON.stringify(stageData));

      if (updateForm.attachment) {
        formData.append('attachment', updateForm.attachment);
      }

      const res = await updateComplaintTrackAPI(formData);
      if (res.success) {
        handleSearch(data.grievanceId); // Refresh data
        alert('Tracking updated successfully!');
      }
    } catch (err) {
      alert('Failed to update tracking: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const completedCount = data ? data.stages.filter(s => s.status === 'Completed').length : 0;
  const totalStages = data ? data.stages.length : 0;
  const progressPct = data ? Math.round((completedCount / totalStages) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">

        {/* Breadcrumb & Back */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center text-[12px] font-semibold text-gray-500">
            <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#002b5e]">{lang === 'hi' ? 'शिकायत स्थिति' : 'Track Grievance'}</span>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-[#002b5e] transition-colors"
          >
            <ArrowLeft size={14} />
            {lang === 'hi' ? 'पीछे जाएं' : 'Go Back'}
          </button>
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
                <div className="flex items-center gap-3">
                  {duplicates && duplicates.length > 0 && (
                    <button
                      onClick={() => setShowDuplicatesModal(true)}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 hover:bg-red-100 transition-colors"
                    >
                      <AlertCircle size={12} /> {duplicates.length} Duplicates Detected
                    </button>
                  )}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${overallBadge[data.currentStatus] || overallBadge.Pending}`}>
                    {data.currentStatus === 'In Progress' ? <RefreshCw size={11} /> : data.currentStatus === 'Resolved' ? <CheckCircle size={11} /> : <Clock size={11} />}
                    {data.currentStatus}
                  </span>
                </div>
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

            {/* ── Update Status Form ── */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm mb-6 overflow-hidden">
              <div className="bg-[#f8fafc] border-b border-gray-200 px-5 py-3 font-bold text-[#002b5e] text-[13px] uppercase tracking-wide flex items-center gap-2">
                <Shield size={15} className="text-[#e65100]" /> {lang === 'hi' ? 'शिकायत स्थिति अपडेट करें' : 'Update Grievance Status'}
              </div>

              <form onSubmit={handleUpdateTrack} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Responsible Officer</label>
                    <input
                      type="text"
                      placeholder="Officer Name"
                      value={updateForm.officer}
                      onChange={e => setUpdateForm({ ...updateForm, officer: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-[13px] font-bold focus:border-[#002b5e] outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Optional Attachment</label>
                    <input
                      type="file"
                      onChange={e => setUpdateForm({ ...updateForm, attachment: e.target.files[0] })}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:border-[#002b5e] outline-none file:mr-3 file:py-1 file:px-3 file:border-0 file:text-[11px] file:font-bold file:bg-[#002b5e] file:text-white hover:file:bg-[#001f44] cursor-pointer transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Current Status</label>
                    <select
                      value={updateForm.status}
                      onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-[13px] font-bold focus:border-[#002b5e] outline-none bg-white transition-colors"
                    >
                      {statuses.length > 0 ? (
                        statuses.map(s => (
                          <option key={s._id} value={s.name}>{lang === 'hi' ? s.label_hi : s.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Approved">Approved</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Process Level</label>
                    <select
                      value={updateForm.currentLevel}
                      onChange={e => setUpdateForm({ ...updateForm, currentLevel: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-[13px] font-bold focus:border-[#002b5e] outline-none bg-white transition-colors"
                    >
                      <option value={2}>Level 2 (Processing)</option>
                      <option value={3}>Level 3 (District)</option>
                      <option value={4}>Level 4 (State)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Action Taken</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified with records, Physical Inspection done..."
                    value={updateForm.actionTaken}
                    onChange={e => setUpdateForm({ ...updateForm, actionTaken: e.target.value })}
                    className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-[13px] focus:border-[#002b5e] outline-none transition-colors"
                  />
                </div>


                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full sm:w-auto px-8 py-3 bg-[#002b5e] text-white rounded-sm text-[13px] font-bold uppercase hover:bg-[#001f44] flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70"
                  >
                    {isUpdating ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                    Submit Update
                  </button>
                </div>
              </form>
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
                    {[...data.stages].reverse().map((stage, idx) => {
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

                            {stage.attachment && (
                              <div className="mt-2 flex items-center">
                                <a href={`http://localhost:5000/media/${stage.attachment}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-[#002b5e] hover:text-[#e65100] hover:underline bg-white/60 px-2 py-1 rounded border border-gray-200 shadow-sm transition-colors">
                                  <Paperclip size={12} />
                                  {lang === 'hi' ? 'संलग्नक देखें' : 'View Attachment'}
                                </a>
                              </div>
                            )}
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

        {/* ── Duplicates Modal ── */}
        {showDuplicatesModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-5xl overflow-hidden border-t-4 border-red-500">
              <div className="bg-[#f8fafc] px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-black text-red-600 uppercase tracking-wider text-[14px] flex items-center gap-2">
                  <AlertCircle size={18} />
                  Duplicate Entries Detected
                </h3>
                <button onClick={() => setShowDuplicatesModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wider">
                      <th className="p-3 border-b border-gray-200">S.No.</th>
                      <th className="p-3 border-b border-gray-200">Registration ID / Serial</th>
                      <th className="p-3 border-b border-gray-200">Applicant Details</th>
                      <th className="p-3 border-b border-gray-200">Complaint / Grievance Subject</th>
                      <th className="p-3 border-b border-gray-200 text-center">Integrity Score</th>
                      <th className="p-3 border-b border-gray-200 text-center">Date of Filing</th>
                      <th className="p-3 border-b border-gray-200 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates.map((dup, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 text-[12px]">
                        <td className="p-3 font-bold text-gray-500">{dup.sno}</td>
                        <td className="p-3 font-bold text-[#002b5e]">{dup.complainId}</td>
                        <td className="p-3 font-semibold text-gray-700">{dup.applicantName}</td>
                        <td className="p-3 text-gray-600 max-w-xs truncate" title={dup.subject}>{dup.subject}</td>
                        <td className="p-3 text-center">
                          <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded text-[10px]">
                            {dup.integrityScore}% Match
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-500 font-semibold">{dup.dateOfFiling}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setShowDuplicatesModal(false);
                              setQuery(dup.complainId);
                              handleSearch(dup.complainId);
                            }}
                            className="bg-[#002b5e] text-white px-3 py-1.5 rounded-sm font-bold text-[10px] hover:bg-[#001f44] transition-colors border border-black/10 uppercase"
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default TrackGrievance;