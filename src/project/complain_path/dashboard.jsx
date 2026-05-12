import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { 
  Search, Filter, Calendar, MapPin, Building2, 
  ChevronRight, ArrowUpDown, Download, FileSpreadsheet, 
  FileText, History, LayoutGrid, CheckCircle2, Clock, XCircle
} from 'lucide-react';

import { 
  fetchDistrictsAPI, fetchBlocksAPI, fetchGPsAPI, 
  fetchDepartmentsAPI, fetchSchemesAPI, fetchComplaintStatusesAPI,
  searchComplaintsAPI 
} from '../../apiHandler/apis';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filter Data States
  const [meta, setMeta] = useState({
    districts: [],
    blocks: [],
    gps: [],
    departments: [],
    schemes: [],
    statuses: []
  });

  // Selected Filters State
  const [filters, setFilters] = useState({
    fy: '',
    department: '',
    scheme: '',
    district: '',
    block: '',
    gp: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  // Initial Data Fetch
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [distRes, deptRes, schemeRes, statusRes] = await Promise.all([
          fetchDistrictsAPI(),
          fetchDepartmentsAPI(),
          fetchSchemesAPI(),
          fetchComplaintStatusesAPI()
        ]);

        setMeta(prev => ({
          ...prev,
          districts: distRes.data || [],
          departments: deptRes.data || [],
          schemes: schemeRes.data || [],
          statuses: statusRes.data || []
        }));
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };
    loadInitialData();
  }, []);

  // Cascading Fetch: District -> Blocks
  React.useEffect(() => {
    if (filters.district) {
      fetchBlocksAPI(filters.district).then(res => {
        setMeta(prev => ({ ...prev, blocks: res.data || [], gps: [] }));
        setFilters(prev => ({ ...prev, block: '', gp: '' }));
      });
    }
  }, [filters.district]);

  // Cascading Fetch: Block -> GPs
  React.useEffect(() => {
    if (filters.block) {
      fetchGPsAPI(filters.block).then(res => {
        setMeta(prev => ({ ...prev, gps: res.data || [] }));
        setFilters(prev => ({ ...prev, gp: '' }));
      });
    }
  }, [filters.block]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await searchComplaintsAPI({ ...filters, page, limit: pagination.limit });
      if (res.success) {
        setGrievances(res.data || []);
        setStats(res.stats || { total: 0, resolved: 0, pending: 0 });
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        setShowData(true);
        if (page === 1) window.scrollTo({ top: 600, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      handleApply(newPage);
    }
  };

  const handleClear = () => {
    setFilters({
      fy: '',
      department: '',
      scheme: '',
      district: '',
      block: '',
      gp: '',
      status: '',
      fromDate: '',
      toDate: ''
    });
    setShowData(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Search Criteria Section */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-8 transition-all hover:shadow-slate-300/50">
          <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-teal-600 rounded-full"></div>
                Search Criteria
              </h2>
              <p className="text-[11px] text-rose-600 font-bold uppercase tracking-wider mt-1 px-5">
                **All states are selected by default. You may select up to five states without a passcode.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
              
              {/* Column 1: Organization */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Financial Year</label>
                  <select 
                    name="fy"
                    value={filters.fy}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Financial Years</option>
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Department</label>
                  <select 
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Departments</option>
                    {meta.departments.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Scheme</label>
                  <select 
                    name="scheme"
                    value={filters.scheme}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Schemes</option>
                    {meta.schemes.map(s => (
                      <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_name_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column 2: Location */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">District</label>
                  <select 
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Districts</option>
                    {meta.districts.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Block</label>
                  <select 
                    name="block"
                    value={filters.block}
                    onChange={handleFilterChange}
                    disabled={!filters.district}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All Blocks</option>
                    {meta.blocks.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Gram Panchayat</label>
                  <select 
                    name="gp"
                    value={filters.gp}
                    onChange={handleFilterChange}
                    disabled={!filters.block}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All Gram Panchayats</option>
                    {meta.gps.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column 3: Status & Dates */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Status</label>
                  <select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Statuses</option>
                    {meta.statuses.map(s => (
                      <option key={s._id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">From Date</label>
                    <input 
                      type="date" 
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">To Date</label>
                    <input 
                      type="date" 
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:border-teal-600 transition-all cursor-pointer shadow-sm" 
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap justify-end gap-3 mt-12 pt-8 border-t border-slate-100">
              <button 
                onClick={handleApply}
                disabled={isLoading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="text-lg">⚡</span>
                )} 
                {isLoading ? 'Processing...' : 'Apply Filters'}
              </button>
              <button 
                onClick={handleClear}
                className="bg-amber-400 text-amber-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>🗑️</span> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Quick Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Found</p>
                  <h4 className="text-xl font-black text-slate-900">{stats.total.toLocaleString()}</h4>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
                  <h4 className="text-xl font-black text-slate-900">{stats.resolved.toLocaleString()}</h4>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                  <h4 className="text-xl font-black text-slate-900">{stats.pending.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Grievance Records
                    <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Live</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Found {stats.total} entries matching criteria</p>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600/20 w-64 transition-all"
                      />
                   </div>
                   <button className="p-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm">
                      <Download size={18} />
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location Info</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program Detail</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Issue Description</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {grievances.length > 0 ? grievances.map((item, index) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-300">#{item.complainId?.slice(-6) || index + 1}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 leading-tight">{item.geographic_information?.district}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.geographic_information?.block}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 leading-tight">{item.case_specifics?.scheme}</span>
                            <span className="text-[9px] text-teal-600 font-black uppercase tracking-tighter">{item.case_specifics?.department}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 max-w-[200px]">
                          <p className="text-sm text-slate-500 font-medium truncate">{item.case_specifics?.complain_details}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[11px] font-bold text-slate-600">{new Date(item.core_case_information?.date || item.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            item.enforcement_status?.case_status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            item.enforcement_status?.case_status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {item.enforcement_status?.case_status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => navigate(`/track?complain_id=${item.complainId}`)}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-all cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                          No records found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center px-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pg = i + 1;
                    // Show only around current page if there are many pages
                    if (pagination.totalPages > 5) {
                        if (pg !== 1 && pg !== pagination.totalPages && (pg < pagination.page - 1 || pg > pagination.page + 1)) {
                            if (pg === pagination.page - 2 || pg === pagination.page + 2) return <span key={pg} className="px-2 text-slate-400">...</span>;
                            return null;
                        }
                    }
                    
                    return (
                      <button 
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          pagination.page === pg 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'border border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Card (Placeholder when no data is shown) */}
        {!showData && (
          <div className="bg-teal-600 rounded-[2rem] p-12 text-white shadow-2xl shadow-teal-200 relative overflow-hidden group animate-in fade-in duration-1000">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 tracking-tight">System Status</h3>
              <p className="text-teal-50 opacity-90 max-w-xl font-medium leading-relaxed mb-6">
                Use the filters above to analyze specific grievance data and scheme performance. All systems are currently operational and synchronized with the central RDP server.
              </p>
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 font-bold text-sm tracking-wide">
                <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                Live Monitoring Active
              </div>
            </div>
          </div>
        )}
      </main>


      <Footer />
    </div>
  );
};

export default Dashboard;