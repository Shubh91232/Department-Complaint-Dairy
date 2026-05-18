import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import {
  Search, Filter, Calendar, MapPin, Building2,
  ChevronRight, ArrowUpDown, Download, FileSpreadsheet,
  FileText, History, LayoutGrid, CheckCircle2, Clock, XCircle,
  AlertCircle
} from 'lucide-react';

import {
  fetchDistrictsAPI, fetchBlocksAPI, fetchGPsAPI,
  fetchDepartmentsAPI, fetchSchemesAPI, fetchComplaintStatusesAPI,
  searchComplaintsAPI, fetchFinancialYearsAPI, fetchSourcesAPI
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
    statuses: [],
    financialYears: [],
    sources: []
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
    integrity: '',
    fromDate: '',
    toDate: '',
    source: ''
  });

  // Initial Data Fetch
  React.useEffect(() => {
    window.scrollTo(0, 0); // Always start at the top
    const loadInitialData = async () => {
      try {
        const [distRes, deptRes, schemeRes, statusRes, fyRes, sourceRes] = await Promise.all([
          fetchDistrictsAPI(),
          fetchDepartmentsAPI(),
          fetchSchemesAPI(),
          fetchComplaintStatusesAPI(),
          fetchFinancialYearsAPI(),
          fetchSourcesAPI()
        ]);

        setMeta(prev => ({
          ...prev,
          districts: distRes.data || [],
          departments: deptRes.data || [],
          schemes: schemeRes.data || [],
          statuses: statusRes.data || [],
          financialYears: fyRes.data || [],
          sources: sourceRes.data || []
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
    // Prevent event object from being treated as page number
    const targetPage = (typeof page === 'number') ? page : 1;

    setIsLoading(true);
    try {
      const res = await searchComplaintsAPI({ ...filters, page: targetPage, limit: pagination.limit });
      if (res.success) {
        setGrievances(res.data || []);
        setStats(res.stats || { total: 0, resolved: 0, pending: 0 });
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        setShowData(true);
        if (targetPage === 1) window.scrollTo({ top: 600, behavior: 'smooth' });
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
      integrity: '',
      fromDate: '',
      toDate: '',
      source: ''
    });
    setShowData(false);
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
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Search Criteria Section */}
        <div className="bg-white shadow-md border border-gray-300 mb-8 rounded-sm">
          <div className="px-6 py-4 bg-[#1e3a8a] border-b-4 border-[#ea580c]">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <Search className="w-5 h-5 text-[#f97316]" />
                Search Criteria
              </h2>
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider mt-1">
                **All states are selected by default. Select up to five states without a passcode.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

              {/* Column 1: Organization */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Financial Year</label>
                  <select
                    name="fy"
                    value={filters.fy}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Financial Years</option>
                    {meta.financialYears.map((fy) => (
                      <option key={fy} value={fy}>{fy}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Department</label>
                  <select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Departments</option>
                    {meta.departments.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Scheme</label>
                  <select
                    name="scheme"
                    value={filters.scheme}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Schemes</option>
                    {meta.schemes.map(s => (
                      <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Source</label>
                  <select
                    name="source"
                    value={filters.source}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Sources</option>
                    {meta.sources.map(s => (
                      <option key={s.value} value={s.value}>{s.label_en || s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column 2: Location */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">District</label>
                  <select
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Districts</option>
                    {meta.districts.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Block</label>
                  <select
                    name="block"
                    value={filters.block}
                    onChange={handleFilterChange}
                    disabled={!filters.district}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">All Blocks</option>
                    {meta.blocks.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Gram Panchayat</label>
                  <select
                    name="gp"
                    value={filters.gp}
                    onChange={handleFilterChange}
                    disabled={!filters.block}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">All Gram Panchayats</option>
                    {meta.gps.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column 3: Status & Dates */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All Statuses</option>
                    {meta.statuses.map(s => (
                      <option key={s._id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">From Date</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">Data Integrity</label>
                  <select
                    name="integrity"
                    value={filters.integrity}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All (Unique & Duplicate)</option>
                    <option value="unique">Unique Only</option>
                    <option value="duplicate">Duplicates Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleApply}
                disabled={isLoading}
                className="bg-[#ea580c] text-white px-6 py-2.5 rounded-sm font-bold text-sm uppercase tracking-wide hover:bg-[#c2410c] transition-all flex items-center gap-2 shadow-sm border border-[#c2410c] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {isLoading ? 'Processing...' : 'Apply Filters'}
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-sm font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-all flex items-center gap-2 shadow-sm border border-gray-300"
              >
                <XCircle className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Quick Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-sm border-l-4 border-[#1e3a8a] shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a]">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Found</p>
                  <h4 className="text-xl font-bold text-gray-900">{stats.total.toLocaleString()}</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-sm border-l-4 border-[#16a34a] shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#16a34a]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resolved</p>
                  <h4 className="text-xl font-bold text-gray-900">{stats.resolved.toLocaleString()}</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-sm border-l-4 border-[#ea580c] shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#ea580c]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pending</p>
                  <h4 className="text-xl font-bold text-gray-900">{stats.pending.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-md border border-gray-300 rounded-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a8a] uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#ea580c]" />
                    Grievance Records
                  </h3>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Found {stats.total} entries matching criteria</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search within records..."
                      className="pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-[#1e3a8a] w-56 transition-all"
                    />
                  </div>
                  <button className="px-3 py-2 bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-green-700 transition-all flex items-center gap-2 shadow-sm border border-green-700">
                    <FileSpreadsheet size={14} />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1e3a8a] text-white">
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">ID</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">Location Info</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">Program Detail</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">Issue Description</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">Date</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960]">Source</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960] text-center">Data Integrity</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider border-r border-[#152960] text-center">Status</th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {grievances.length > 0 ? grievances.map((item, index) => (
                      <tr key={item._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-5 py-4 border-r border-gray-100">
                          <span className="text-xs font-bold text-gray-700">#{item.complainId?.slice(-6) || index + 1}</span>
                        </td>
                        <td className="px-5 py-4 border-r border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">{item.geographic_information?.district}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.geographic_information?.block}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 border-r border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-tight">{item.case_specifics?.scheme}</span>
                            <span className="text-[9px] text-[#ea580c] font-bold uppercase tracking-widest">{item.case_specifics?.department}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-[200px] border-r border-gray-100">
                          <p className="text-sm text-gray-600 font-medium truncate">{item.case_specifics?.complain_details}</p>
                        </td>
                        <td className="px-5 py-4 border-r border-gray-100">
                          <span className="text-xs font-semibold text-gray-700">{formatDate(item.core_case_information?.date || item.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4 border-r border-gray-100">
                          <span className="inline-flex px-2 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                            {item.core_case_information?.source || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center border-r border-gray-100">
                          {item.isDuplicate ? (
                            <span className="inline-flex px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                              {item.integrityScore}% Match
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                              Unique
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center border-r border-gray-100">
                          <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${
                              item.enforcement_status?.case_status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                              item.enforcement_status?.case_status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              item.enforcement_status?.case_status === 'Compliance Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              item.enforcement_status?.case_status === 'Pending' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {item.enforcement_status?.case_status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => navigate(`/track?complain_id=${item.complainId}`)}
                            className="text-xs font-bold text-[#1e3a8a] underline uppercase tracking-wider hover:text-orange-600 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="9" className="px-5 py-16 text-center text-gray-500 font-bold uppercase tracking-widest bg-gray-50">
                          No records found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center px-6">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 border border-gray-300 bg-white rounded-sm text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pg = i + 1;
                    if (pagination.totalPages > 5) {
                      if (pg !== 1 && pg !== pagination.totalPages && (pg < pagination.page - 1 || pg > pagination.page + 1)) {
                        if (pg === pagination.page - 2 || pg === pagination.page + 2) return <span key={pg} className="px-2 text-gray-400 self-end">...</span>;
                        return null;
                      }
                    }

                    return (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`px-3 py-1.5 border rounded-sm text-xs font-bold transition-colors ${pagination.page === pg
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                    className="px-3 py-1.5 border border-gray-300 bg-white rounded-sm text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aging Analytics Cards (Shown when no search results are active) */}
        {!showData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {[
              {
                label: '0-3 Months',
                desc: 'Quickly view pending grievances registered within the last quarter.',
                color: 'bg-[#16a34a] border-[#14532d]', // Formal Green
                icon: <Clock className="w-6 h-6" />,
                range: 'recent'
              },
              {
                label: '3-6 Months',
                desc: 'Analyze grievances pending for a significant duration (over 90 days).',
                color: 'bg-[#ea580c] border-[#9a3412]', // Formal Saffron
                icon: <History className="w-6 h-6" />,
                range: 'mid'
              },
              {
                label: '6+ Months',
                desc: 'Identify critical delays in grievances pending for more than half a year.',
                color: 'bg-[#dc2626] border-[#7f1d1d]', // Formal Red
                icon: <AlertCircle className="w-6 h-6" />,
                range: 'critical'
              }
            ].map((card, i) => (
              <button
                key={i}
                onClick={() => {
                  const today = new Date();
                  let from = '';
                  let to = today.toISOString().split('T')[0];

                  if (card.range === 'recent') {
                    const d = new Date();
                    d.setMonth(d.getMonth() - 3);
                    from = d.toISOString().split('T')[0];
                  } else if (card.range === 'mid') {
                    const dTo = new Date();
                    dTo.setMonth(dTo.getMonth() - 3);
                    to = dTo.toISOString().split('T')[0];
                    const dFrom = new Date();
                    dFrom.setMonth(dFrom.getMonth() - 6);
                    from = dFrom.toISOString().split('T')[0];
                  } else if (card.range === 'critical') {
                    const dTo = new Date();
                    dTo.setMonth(dTo.getMonth() - 6);
                    to = dTo.toISOString().split('T')[0];
                    from = '2000-01-01'; // Default far date
                  }

                  const newFilters = {
                    ...filters,
                    status: 'Pending',
                    fromDate: from,
                    toDate: to
                  };
                  setFilters(newFilters);
                  setIsLoading(true);
                  searchComplaintsAPI({ ...newFilters, page: 1, limit: pagination.limit }).then(res => {
                    if (res.success) {
                      setGrievances(res.data || []);
                      setStats(res.stats || { total: 0, resolved: 0, pending: 0 });
                      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
                      setShowData(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }
                    setIsLoading(false);
                  });
                }}
                className={`${card.color} border-b-4 rounded-sm p-6 text-white text-left shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[180px]`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-black/20 rounded-sm flex items-center justify-center border border-white/20">
                    {card.icon}
                  </div>
                  <ArrowUpDown className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{card.label}</h3>
                  <p className="text-white/90 text-xs font-medium leading-relaxed mb-4">
                    {card.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-white hover:text-gray-200 transition-colors">
                    View Pending <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
