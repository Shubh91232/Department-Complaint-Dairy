import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
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
  Activity
} from 'lucide-react';
import userDetails from '../../assets/user_details.json';
import { fetchDraftsAPI, fetchGrievanceHistoryAPI, deleteDraftAPI } from '../../apiHandler/apis';

const WorkHistory = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'drafts'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'error' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showAlert = (message, type = 'error') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load history from API
        const histRes = await fetchGrievanceHistoryAPI();
        if (histRes.success) {
          setHistory(histRes.data || []);
        }

        // Load drafts from API
        const draftRes = await fetchDraftsAPI();
        if (draftRes.success) {
          setDrafts(draftRes.data || []);
        }
      } catch (err) {
        console.error('Error loading history data:', err);
      }
    };
    loadData();
  }, []);

  const filteredHistory = history
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

  const handleDeleteRecord = (id) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000); // Reset after 3 seconds
      return;
    }

    const updatedHistory = history.filter(item => (item.id || item._id) !== id);
    setHistory(updatedHistory);
    localStorage.setItem('grievanceHistory', JSON.stringify(updatedHistory));
    setDeleteConfirmId(null);
    showAlert(lang === 'hi' ? 'रिकॉर्ड सफलतापूर्वक हटाया गया।' : 'Record successfully deleted.', 'success');
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
                {history.length}
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
                {drafts.length}
              </span>
           </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white p-4 shadow-sm border-x border-gray-200">
           <div className="text-center border-r border-gray-100 last:border-0">
              <span className="text-gray-500 text-[11px] font-bold uppercase block mb-1">Total Entries</span>
              <span className="text-2xl font-bold text-[#002b5e]">{history.length}</span>
           </div>
           <div className="text-center border-r border-gray-100 last:border-0">
              <span className="text-gray-500 text-[11px] font-bold uppercase block mb-1">Pending</span>
              <span className="text-2xl font-bold text-orange-600">
                {history.filter(i => (i.case_specifics?.current_status || i.currentStatus) === 'Pending').length}
              </span>
           </div>
           <div className="text-center border-r border-gray-100 last:border-0">
              <span className="text-gray-500 text-[11px] font-bold uppercase block mb-1">Resolved</span>
              <span className="text-2xl font-bold text-green-700">
                {history.filter(i => (i.case_specifics?.current_status || i.currentStatus) === 'Resolved').length}
              </span>
           </div>
           <div className="text-center">
              <span className="text-gray-500 text-[11px] font-bold uppercase block mb-1">Last Activity</span>
              <span className="text-sm font-bold text-gray-700">
                {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString() : 'N/A'}
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
        <div className="bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'history' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-[#002b5e] border-b border-gray-300 text-[12px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-4 w-12 text-center">#</th>
                    <th className="px-4 py-4 min-w-[120px]">Serial / ID</th>
                    <th className="px-4 py-4 min-w-[150px]">Applicant Info</th>
                    <th className="px-4 py-4 min-w-[180px]">Case Details</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-4 py-4 text-center">Date Filed</th>
                    <th className="px-4 py-4 text-center">Tracking</th>
                    <th className="px-4 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => (
                      <tr key={item._id || index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 py-4 text-center font-bold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-[#002b5e]">{item.core_case_information?.serial_no}</div>
                          <div className="text-[10px] text-blue-600 font-black tracking-tight uppercase">{item.complainId || `ID: ${item._id?.substring(0, 10)}`}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={14} className="text-gray-400" />
                            <span className="font-bold text-gray-800">{item.complain_profile?.complainer?.name || 'Unknown'}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 ml-5 font-medium">{item.complain_profile?.complainer?.mobile || 'No Mobile'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-700 text-[12px] mb-0.5">{item.case_specifics?.department}</div>
                          <div className="text-[11px] text-blue-600 font-bold mb-1">{item.case_specifics?.scheme}</div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 italic">"{item.case_specifics?.complain_details}"</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            (item.case_specifics?.current_status || item.currentStatus) === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            (item.case_specifics?.current_status || item.currentStatus) === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {(item.case_specifics?.current_status || item.currentStatus) === 'Pending' ? <Clock size={10} /> : 
                             (item.case_specifics?.current_status || item.currentStatus) === 'Resolved' ? <CheckCircle size={10} /> : 
                             <AlertCircle size={10} />}
                            {item.case_specifics?.current_status || item.currentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="font-bold text-gray-700 text-[12px]">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium uppercase">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button 
                            onClick={() => navigate('/track', { state: { query: '2210' } })}
                            className="bg-[#002b5e] text-white px-3 py-1.5 rounded-sm font-bold text-[10px] hover:bg-[#001f44] transition-colors flex items-center gap-1.5 shadow-sm uppercase mx-auto border border-[#001533]"
                          >
                            <Activity size={12} /> {lang === 'hi' ? 'ट्रैकिंग' : 'Track Status'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center gap-2">
                             {/* <button 
                               onClick={() => showAlert(lang === 'hi' ? 'विवरण देखने की सुविधा जल्द आ रही है!' : 'View details functionality coming soon!', 'info')}
                               className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-sm transition-colors"
                               title="View Details"
                             >
                               <MoreVertical size={18} />
                             </button> */}
                             <button 
                               onClick={() => handleDeleteRecord(item.id || item._id)}
                               className={`px-3 py-1.5 rounded-sm font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm uppercase border ${
                                 deleteConfirmId === (item.id || item._id) 
                                   ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                                   : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                               }`}
                               title="Delete Record"
                             >
                               <Trash2 size={14} />
                               {deleteConfirmId === (item.id || item._id) 
                                 ? (lang === 'hi' ? 'पुष्टि करें' : 'Confirm Delete') 
                                 : (lang === 'hi' ? 'हटाएं' : 'Delete')}
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <HistoryIcon size={48} className="text-gray-200" />
                          <p className="text-gray-500 font-bold text-lg">
                            {lang === 'hi' ? 'कोई रिकॉर्ड नहीं मिला।' : 'No records found.'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {lang === 'hi' ? 'अपनी पहली शिकायत प्रविष्टि अभी शुरू करें।' : 'Start your first grievance entry now.'}
                          </p>
                          <button 
                            onClick={() => navigate('/complain')}
                            className="mt-4 bg-[#e65100] text-white px-6 py-2 rounded-sm font-bold text-[13px] hover:bg-[#bf4300] transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
                          >
                            <FileText size={16} /> {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'Create New Complain'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // Drafts Table
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-[#e65100] border-b border-gray-300 text-[12px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-4 w-12 text-center">#</th>
                    <th className="px-4 py-4">Draft Information</th>
                    <th className="px-4 py-4">Progress</th>
                    <th className="px-4 py-4 text-center">Last Modified</th>
                    <th className="px-4 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.length > 0 ? (
                    drafts.map((draft, index) => (
                      <tr key={draft._id || index} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                        <td className="px-4 py-4 text-center font-bold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-[#e65100] text-[10px] uppercase tracking-tighter mb-1">{draft.draftId || `TEMP-ID: ${draft._id?.substring(0, 8)}`}</div>
                          <div className="font-bold text-gray-800">
                            {draft.complain_profile?.complainer?.name || (lang === 'hi' ? 'बिना नाम का ड्राफ्ट' : 'Untitled Draft')}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {draft.case_specifics?.department ? `${draft.case_specifics.department} - ${draft.case_specifics.scheme}` : (lang === 'hi' ? 'विभाग नहीं चुना गया' : 'No department selected')}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                 <div className="bg-orange-500 h-full" style={{ width: draft.case_specifics?.scheme ? '100%' : '50%' }}></div>
                              </div>
                              <span className="text-[11px] font-bold text-orange-600">{draft.case_specifics?.scheme ? 'Ready' : 'Incomplete'}</span>
                           </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="font-bold text-gray-700 text-[12px]">
                            {new Date(draft.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center gap-3">
                             <button 
                               onClick={() => handleResumeDraft(draft)}
                               className="bg-orange-600 text-white px-4 py-1.5 rounded-sm font-bold text-[11px] hover:bg-orange-700 transition-colors flex items-center gap-1 shadow-sm uppercase"
                               disabled={isDeleting}
                             >
                               <RefreshCw size={12} className={isDeleting ? 'animate-spin' : ''} /> {lang === 'hi' ? 'जारी रखें' : 'Resume'}
                             </button>
                             <button 
                               onClick={() => handleDeleteDraft(draft._id)}
                               className={`px-3 py-1.5 rounded-sm font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm uppercase border ${
                                 deleteConfirmId === draft._id 
                                   ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                                   : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                               }`}
                               disabled={isDeleting}
                               title="Delete Draft"
                             >
                               {isDeleting && deleteConfirmId === draft._id ? (
                                 <Loader2 size={12} className="animate-spin" />
                               ) : (
                                 <Trash2 size={12} />
                               )}
                               {deleteConfirmId === draft._id 
                                 ? (lang === 'hi' ? 'पुष्टि करें' : 'Confirm Delete') 
                                 : (lang === 'hi' ? 'हटाएं' : 'Delete')}
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Clock size={48} className="text-gray-200" />
                          <p className="text-gray-500 font-bold text-lg">
                            {lang === 'hi' ? 'कोई ड्राफ्ट नहीं मिला।' : 'No pending drafts found.'}
                          </p>
                          <button 
                            onClick={() => navigate('/complain')}
                            className="mt-4 bg-[#e65100] text-white px-6 py-2 rounded-sm font-bold text-[13px] hover:bg-[#bf4300] transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
                          >
                            <FileText size={16} /> {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'Create New Complain'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[11px] font-bold uppercase tracking-widest bg-white p-4 border border-gray-200">
           <div>{lang === 'hi' ? 'दिखा रहा है' : 'Showing'} {filteredHistory.length} {lang === 'hi' ? 'रिकॉर्ड' : 'records'}</div>
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