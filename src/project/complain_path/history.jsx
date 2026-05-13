import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { 
  History as HistoryIcon, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Home, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreVertical,
  Calendar,
  User,
  ArrowUpDown,
  Landmark,
  RefreshCw,
  Trash2,
  X,
  Shield,
  Loader2,
  Activity,
  Edit
} from 'lucide-react';
import userDetails from '../../assets/user_details.json';
import { fetchDraftsAPI, fetchGrievanceHistoryAPI, deleteDraftAPI, deleteComplaintAPI } from '../../apiHandler/apis';

const WorkHistory = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'history'); // 'history' or 'drafts'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFetched = useRef(false);

  // Pagination states
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);
  const [draftsPage, setDraftsPage] = useState(1);
  const [draftsTotalPages, setDraftsTotalPages] = useState(1);
  const [draftsTotalItems, setDraftsTotalItems] = useState(0);
  const itemsPerPage = 10;

  const showAlert = (message, type = 'error') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const loadData = async (targetTab = activeTab, page = 1) => {
    setIsLoading(true);
    try {
      if (targetTab === 'history') {
        const histRes = await fetchGrievanceHistoryAPI(page, itemsPerPage);
        if (histRes.success) {
          setHistory(histRes.data || []);
          setHistoryPage(histRes.pagination?.page || 1);
          setHistoryTotalPages(histRes.pagination?.totalPages || 1);
          setHistoryTotalItems(histRes.pagination?.total || 0);
        } else {
          showAlert(histRes.message || 'Failed to load history', 'error');
        }
      } else {
        const draftRes = await fetchDraftsAPI(page, itemsPerPage);
        if (draftRes.success) {
          setDrafts(draftRes.data || []);
          setDraftsPage(draftRes.pagination?.page || 1);
          setDraftsTotalPages(draftRes.pagination?.totalPages || 1);
          setDraftsTotalItems(draftRes.pagination?.total || 0);
        } else {
          showAlert(draftRes.message || 'Failed to load drafts', 'error');
        }
      }
    } catch (err) {
      console.error('Error loading history data:', err);
      showAlert(lang === 'hi' ? 'डेटा लोड करने में विफल: ' + err.message : 'Failed to load data: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData('history', 1);
    loadData('drafts', 1);
  }, []);

  const handleRefresh = () => {
    loadData(activeTab, activeTab === 'history' ? historyPage : draftsPage);
  };

  const handlePageChange = (newPage) => {
    if (activeTab === 'history') {
      setHistoryPage(newPage);
      loadData('history', newPage);
    } else {
      setDraftsPage(newPage);
      loadData('drafts', newPage);
    }
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const filteredHistory = useMemo(() => {
    return history
      .filter(item => {
        const matchesSearch = 
          item.core_case_information?.serial_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.complain_profile?.complainer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.case_specifics?.complain_details?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'All' || item.case_specifics?.current_status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
  }, [history, searchTerm, filterStatus, sortOrder]);

  const handleDeleteRecord = async (id) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000); // Reset after 3 seconds
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteComplaintAPI(id);
      if (res.success) {
        const updatedHistory = history.filter(item => (item.id || item._id) !== id);
        setHistory(updatedHistory);
        localStorage.setItem('grievanceHistory', JSON.stringify(updatedHistory));
        setDeleteConfirmId(null);
        showAlert(lang === 'hi' ? 'रिकॉर्ड सफलतापूर्वक हटाया गया।' : 'Record successfully deleted.', 'success');
      }
    } catch (err) {
      showAlert(lang === 'hi' ? 'हटाने में विफल: ' + err.message : 'Failed to delete: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditRecord = (item) => {
    navigate('/complain', { state: { draftData: item, isEditingFinal: true } });
  };

  const handleResumeDraft = (draft) => {
    navigate('/complain', { state: { draftData: draft } });
  };

  const handleDeleteDraft = async (id) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000); // Reset after 3 seconds
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteDraftAPI(id);
      if (res.success) {
        const updatedDrafts = drafts.filter(d => d._id !== id);
        setDrafts(updatedDrafts);
        showAlert(lang === 'hi' ? 'ड्राफ्ट सफलतापूर्वक हटाया गया।' : 'Draft successfully deleted.', 'success');
      }
    } catch (err) {
      showAlert(lang === 'hi' ? 'ड्राफ्ट हटाने में विफल: ' + err.message : 'Failed to delete draft: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const exportToCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['ID', 'Serial No', 'Date', 'Applicant', 'Department', 'Scheme', 'Status'];
    const rows = history.map(item => [
      item.id,
      item.core_case_information?.serial_no,
      item.core_case_information?.date,
      item.complain_profile?.complainer?.name || 'N/A',
      item.case_specifics?.department,
      item.case_specifics?.scheme,
      item.case_specifics?.current_status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `work_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col relative">
      {/* Custom Alert Toast */}
      {customAlert.show && (
        <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-sm shadow-xl border-l-4 transform transition-all animate-slide-in-right ${customAlert.type === 'error' ? 'bg-white border-red-500 text-gray-800' : 'bg-white border-green-500 text-gray-800'}`}>
          {customAlert.type === 'error' ? <div className="text-red-500 bg-red-50 p-1 rounded-full"><Shield size={16} /></div> : <div className="text-green-500 bg-green-50 p-1 rounded-full"><CheckCircle size={16} /></div>}
          <p className="text-[13px] font-bold">{customAlert.message}</p>
          <button onClick={() => setCustomAlert(prev => ({ ...prev, show: false }))} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none text-xl leading-none">
            &times;
          </button>
        </div>
      )}

      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] transition-colors flex items-center gap-1">
            <Home size={14} /> {lang === 'hi' ? 'होम' : 'Home'}
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e] font-semibold">{lang === 'hi' ? 'कार्य इतिहास' : 'Work History'}</span>
        </div>

        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg mb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                <HistoryIcon size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {lang === 'hi' ? 'आपका कार्य इतिहास' : 'Your Work History'}
                </h1>
                <p className="text-blue-200 text-[13px] font-medium">
                  {lang === 'hi' 
                    ? `${userDetails.name} द्वारा दर्ज किए गए सभी शिकायतों का विवरण` 
                    : `Records of all grievances entered by ${userDetails.name}`}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-[#1976d2] text-white px-4 py-2 rounded-sm text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#115293] transition-all shadow-md disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> {lang === 'hi' ? 'ताज़ा करें' : 'Refresh'}
              </button>
              <button 
                onClick={exportToCSV}
                className="bg-[#1e7b34] text-white px-4 py-2 rounded-sm text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#145a24] transition-all shadow-md"
              >
                <Download size={16} /> {lang === 'hi' ? 'एक्सेल डाउनलोड' : 'Export CSV'}
              </button>
              <button 
                onClick={() => navigate('/complain')}
                className="bg-[#e65100] text-white px-4 py-2 rounded-sm text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#bf4300] transition-all shadow-md"
              >
                <FileText size={16} /> {lang === 'hi' ? 'नई प्रविष्टि' : 'New Entry'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white border-x border-gray-200 border-b shadow-sm overflow-hidden">
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-4 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${
               activeTab === 'history' ? 'bg-blue-50 text-[#002b5e] border-b-2 border-[#002b5e]' : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
              <HistoryIcon size={18} />
              {lang === 'hi' ? 'सफलतापूर्वक सहेजे गए' : 'Submitted Records'}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'history' ? 'bg-[#002b5e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {historyTotalItems}
              </span>
           </button>
           <button 
             onClick={() => setActiveTab('drafts')}
             className={`flex-1 py-4 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${
               activeTab === 'drafts' ? 'bg-orange-50 text-[#e65100] border-b-2 border-[#e65100]' : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
              <Clock size={18} />
              {lang === 'hi' ? 'अधूरे ड्राफ्ट' : 'Pending Drafts'}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'drafts' ? 'bg-[#e65100] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {draftsTotalItems}
              </span>
           </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-6 bg-white shadow-sm border border-gray-300 divide-x divide-gray-300 overflow-hidden rounded-sm">
           <div className="px-4 py-3 flex flex-col items-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Records</span>
              <span className="text-xl font-black text-[#002b5e] leading-none">{historyTotalItems}</span>
           </div>
           <div className="px-4 py-3 flex flex-col items-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Pending</span>
              <span className="text-xl font-black text-orange-600 leading-none">
                {history.filter(i => (i.case_specifics?.current_status || i.currentStatus) === 'Pending').length}
              </span>
           </div>
           <div className="px-4 py-3 flex flex-col items-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Resolved</span>
              <span className="text-xl font-black text-green-700 leading-none">
                {history.filter(i => (i.case_specifics?.current_status || i.currentStatus) === 'Resolved').length}
              </span>
           </div>
           <div className="px-4 py-3 flex flex-col items-center bg-gray-50">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Last Update</span>
              <span className="text-[13px] font-bold text-gray-700 leading-none">
                {history.length > 0 ? new Date(history[0].createdAt || history[0].timestamp).toLocaleDateString() : 'N/A'}
              </span>
           </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 text-gray-400"><Search size={16} /></span>
            <input 
              type="text" 
              placeholder={lang === 'hi' ? "खोजें (नाम, आईडी, विवरण)..." : "Search by name, ID, description..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#1976d2] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-sm px-3 py-2 bg-white text-gray-700 font-semibold focus:outline-none focus:border-[#1976d2]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-sm px-3 py-2 bg-white text-gray-700 font-semibold focus:outline-none focus:border-[#1976d2]"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white shadow-sm border border-gray-300 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'history' ? (
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-[#f1f5f9] text-[#002b5e] border-b border-gray-300 text-[11px] font-bold uppercase tracking-wider divide-x divide-gray-300">
                    <th className="px-3 py-3 w-10 text-center">S.No.</th>
                    <th className="px-3 py-3 w-40">Registration ID / Serial</th>
                    <th className="px-3 py-3 min-w-[200px]">Applicant Details</th>
                    <th className="px-3 py-3 min-w-[250px]">Complaint / Grievance Subject</th>
                    <th className="px-3 py-3 w-28 text-center">Integrity Score</th>
                    <th className="px-3 py-3 w-32 text-center">Current Status</th>
                    <th className="px-3 py-3 w-32 text-center">Date of Filing</th>
                    <th className="px-3 py-3 w-32 text-center">Office Action</th>
                    <th className="px-3 py-3 w-28 text-center">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => (
                      <tr key={item._id || index} className="even:bg-gray-50/50 hover:bg-[#f0f7ff] transition-colors divide-x divide-gray-300 text-[12px]">
                        <td className="px-3 py-3 text-center font-bold text-gray-500 bg-gray-100/30">
                          {((historyPage - 1) * itemsPerPage) + index + 1}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-[#002b5e] mb-0.5 tracking-tight">{item.core_case_information?.serial_no}</div>
                          <div className="text-[10px] text-blue-600 font-bold border border-blue-100 bg-blue-50 px-1 py-0.5 rounded-sm inline-block">{item.complainId || `ID: ${item._id?.substring(0, 8).toUpperCase()}`}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-800 uppercase leading-none mb-1">{item.complain_profile?.complainer?.name || 'N/A'}</span>
                            <span className="text-[11px] text-gray-500 font-medium italic">{item.complain_profile?.complainer?.mobile || 'No Contact Info'}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-gray-700 mb-0.5">{item.case_specifics?.department}</div>
                          <div className="text-[10px] text-blue-700 font-black uppercase mb-1">{item.case_specifics?.scheme}</div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 leading-tight border-l-2 border-gray-200 pl-2">
                            {item.case_specifics?.complain_details}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className={`inline-block px-2 py-1 rounded-sm text-[11px] font-black border ${
                            (item.duplicacy_score || 0) > 70 ? 'bg-red-50 border-red-200 text-red-600' : 
                            (item.duplicacy_score || 0) > 40 ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                            'bg-green-50 border-green-200 text-green-600'
                          }`}>
                            {(item.duplicacy_score || 0)}%
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-sm text-[10px] font-black uppercase border leading-none ${
                            (item.enforcement_status?.case_status || item.case_specifics?.current_status || 'Pending') === 'Pending' ? 'bg-[#fff7ed] text-[#9a3412] border-[#fdba74]' :
                            (item.enforcement_status?.case_status || item.case_specifics?.current_status) === 'Resolved' ? 'bg-[#f0fdf4] text-[#166534] border-[#86efac]' :
                            'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                          }`}>
                            {item.enforcement_status?.case_status || item.case_specifics?.current_status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="font-bold text-gray-700">{formatDate(item.core_case_information?.date || item.createdAt || item.timestamp)}</div>
                          <div className="text-[10px] text-gray-400 font-bold">{new Date(item.createdAt || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button 
                            onClick={() => navigate('/track', { state: { query: item.complainId } })}
                            className="bg-[#002b5e] text-white px-3 py-1.5 rounded-sm font-bold text-[10px] hover:bg-[#001f44] transition-colors border border-black/10 uppercase"
                          >
                            Track
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex justify-center gap-2">
                             <button 
                               onClick={() => handleEditRecord(item)}
                               className="p-2 rounded-sm transition-all border bg-white text-blue-600 border-blue-100 hover:bg-blue-50"
                               title="Edit"
                               disabled={isDeleting}
                             >
                               <Edit size={14} />
                             </button>
                             <button 
                               onClick={() => handleDeleteRecord(item.id || item._id)}
                               className={`p-2 rounded-sm transition-all border ${
                                 deleteConfirmId === (item.id || item._id) 
                                   ? 'bg-red-600 text-white border-red-700' 
                                   : 'bg-white text-red-600 border-red-100 hover:bg-red-50'
                               }`}
                               title="Delete"
                               disabled={isDeleting}
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <HistoryIcon size={48} className="text-gray-200" />
                          <p className="text-gray-500 font-bold text-lg">No records found.</p>
                          <button 
                            onClick={() => navigate('/complain')}
                            className="mt-4 bg-[#e65100] text-white px-6 py-2 rounded-sm font-bold text-[13px] hover:bg-[#bf4300] shadow-md flex items-center gap-2 uppercase"
                          >
                            <FileText size={16} /> Create New
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // Drafts Table
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-[#fff7ed] text-[#e65100] border-b border-gray-300 text-[11px] font-bold uppercase tracking-wider divide-x divide-gray-300">
                    <th className="px-3 py-3 w-10 text-center">S.No.</th>
                    <th className="px-3 py-3 min-w-[200px]">Temporary Draft ID</th>
                    <th className="px-3 py-3 min-w-[250px]">Applicant / Subject Info</th>
                    <th className="px-3 py-3 w-40 text-center">Form Progress</th>
                    <th className="px-3 py-3 w-32 text-center">Last Modified</th>
                    <th className="px-3 py-3 w-48 text-center">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {drafts.length > 0 ? (
                    drafts.map((draft, index) => (
                      <tr key={draft._id || index} className="even:bg-gray-50/50 hover:bg-[#fff7ed]/50 transition-colors divide-x divide-gray-300 text-[12px]">
                        <td className="px-3 py-3 text-center font-bold text-gray-500 bg-gray-100/30">
                          {((draftsPage - 1) * itemsPerPage) + index + 1}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-black text-[#e65100] border border-orange-100 bg-orange-50 px-2 py-0.5 rounded-sm inline-block">
                            {draft.draftId || `TEMP-${draft._id?.substring(0, 8).toUpperCase()}`}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-black text-gray-800 uppercase mb-1 leading-none">{draft.complain_profile?.complainer?.name || 'Untitled Draft'}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">
                            {draft.case_specifics?.department ? `${draft.case_specifics.department}` : 'Department Not Selected'}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-orange-500 h-full" style={{ width: draft.case_specifics?.scheme ? '100%' : '50%' }}></div>
                              </div>
                              <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">
                                {draft.case_specifics?.scheme ? 'Complete' : 'Partially Saved'}
                              </span>
                           </div>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-gray-600">
                           {new Date(draft.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex justify-center gap-2">
                             <button 
                               onClick={() => handleResumeDraft(draft)}
                               className="bg-orange-600 text-white px-3 py-1.5 rounded-sm font-bold text-[10px] hover:bg-orange-700 transition-colors uppercase flex items-center gap-1"
                               disabled={isDeleting}
                             >
                               <RefreshCw size={12} /> Resume
                             </button>
                             <button 
                               onClick={() => handleDeleteDraft(draft._id)}
                               className={`p-1.5 rounded-sm transition-all border ${
                                 deleteConfirmId === draft._id 
                                   ? 'bg-red-600 text-white border-red-700' 
                                   : 'bg-white text-red-600 border-red-100 hover:bg-red-50'
                               }`}
                               disabled={isDeleting}
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Clock size={48} className="text-gray-200" />
                          <p className="text-gray-500 font-bold text-lg">No pending drafts found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination Bar - Goverment Excel Style */}
          <div className="bg-[#f8fafc] border-t border-gray-300 px-4 py-3 flex items-center justify-between">
             <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
               Page <span className="text-[#002b5e]">{activeTab === 'history' ? historyPage : draftsPage}</span> of <span className="text-[#002b5e]">{activeTab === 'history' ? historyTotalPages : draftsTotalPages}</span>
             </div>
             <div className="flex gap-1">
                <button 
                  disabled={(activeTab === 'history' ? historyPage : draftsPage) === 1 || isLoading}
                  onClick={() => handlePageChange((activeTab === 'history' ? historyPage : draftsPage) - 1)}
                  className="px-3 py-1.5 border border-gray-300 bg-white text-[11px] font-bold uppercase rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1 mx-2">
                   {[...Array(activeTab === 'history' ? historyTotalPages : draftsTotalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const currentPage = activeTab === 'history' ? historyPage : draftsPage;
                      // Show only 5 pages around current page
                      if (historyTotalPages > 5 && (pageNum < currentPage - 2 || pageNum > currentPage + 2)) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold border rounded-sm transition-colors ${
                            currentPage === pageNum 
                              ? 'bg-[#002b5e] text-white border-[#002b5e]' 
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                   })}
                </div>
                <button 
                  disabled={(activeTab === 'history' ? historyPage : draftsPage) === (activeTab === 'history' ? historyTotalPages : draftsTotalPages) || isLoading}
                  onClick={() => handlePageChange((activeTab === 'history' ? historyPage : draftsPage) + 1)}
                  className="px-3 py-1.5 border border-gray-300 bg-white text-[11px] font-bold uppercase rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                >
                  Next
                </button>
             </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[11px] font-bold uppercase tracking-widest bg-white p-4 border border-gray-200">
           <div>{lang === 'hi' ? 'दिखा रहा है' : 'Showing'} {activeTab === 'history' ? history.length : drafts.length} {lang === 'hi' ? 'में से' : 'of'} {activeTab === 'history' ? historyTotalItems : draftsTotalItems} {lang === 'hi' ? 'रिकॉर्ड' : 'records'}</div>
           <div className="flex items-center gap-2">
              <Landmark size={14} className="text-[#e65100]" />
              {lang === 'hi' ? 'ग्रामीण विकास एवं पंचायती राज विभाग, राजस्थान सरकार' : 'Rural Development & Panchayati Raj Dept, Govt of Rajasthan'}
           </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slide-in-right {
            0% { transform: translateX(100%); opacity: 0; }
            10% { transform: translateX(-5%); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.4s ease-out forwards;
          }
        ` }} />
      </div>
      <Footer />
    </div>
  );
};

export default WorkHistory;