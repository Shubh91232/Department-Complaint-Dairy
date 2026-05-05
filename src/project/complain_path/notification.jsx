import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Bell, Eye, Share2, CheckCircle, X, ArrowRight, Filter, Search, Building2, User, Clock, FileText, ChevronRight } from 'lucide-react';

const Notification = () => {
  const { lang, t } = useLanguage();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [referring, setReferring] = useState(null);
  const [referDept, setReferDept] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    scheme: 'All Schemes',
    project: 'All Projects',
    finYear: '2026-27',
    status: 'All Statuses',
    fromDate: '',
    toDate: '',
    district: 'All Districts',
    block: 'All Blocks',
    panchayat: 'All GPs'
  });

  const [hasApplied, setHasApplied] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  // Mock data for complaints
  const [complaints, setComplaints] = useState([
    {
      id: "G-2026-001",
      name: "Ram Prasad",
      department: "MGNREGA",
      scheme: "Wage Payment Issue",
      date: "2026-05-01",
      status: "New",
      details: "Payment of Rs. 1500 pending for 14 days of work in Gram Panchayat Sanganer. No response from BDO office.",
      district: "Jaipur",
      block: "Sanganer",
      panchayat: "Sanganer",
      mobile: "9876543210",
      category: "Payment Pending",
      finYear: "2025-2026",
      source: "Public Registry",
      attachment: "grievance_doc_001.pdf"
    },
    {
      id: "G-2026-002",
      name: "Sita Devi",
      department: "Rajveeka",
      scheme: "SHG Formation",
      date: "2026-05-02",
      status: "New",
      details: "Facing issues with registration of our Self Help Group in Tonk district. Documentation submitted twice but no action taken.",
      district: "Tonk",
      block: "Deoli",
      panchayat: "Deoli",
      mobile: "9123456789",
      category: "Operational Delay",
      finYear: "2026-2027",
      source: "Jan Sampark",
      attachment: "shg_reg_form.pdf"
    },
    {
      id: "G-2026-003",
      name: "Arjun Singh",
      department: "Rural Development",
      scheme: "PMAY-G (Awas)",
      date: "2026-04-30",
      status: "Processing",
      details: "House construction under PMAY-G stalled due to non-disbursement of the second installment. Foundational work completed in Jan 2026.",
      district: "Alwar",
      block: "Thanagazi",
      panchayat: "Thanagazi",
      mobile: "9988776655",
      category: "Financial Irregularity",
      finYear: "2025-2026",
      source: "Offline Post",
      attachment: "awas_installment_proof.png"
    }
  ]);

  const departments = [
    "Rajveeka", 
    "Rural Development", 
    "MGNREGA", 
    "Panchayati Raj", 
    "Hariyalo Rajasthan", 
    "Social Welfare", 
    "Water Resources"
  ];

  const handleRefer = (e) => {
    e.preventDefault();
    if (!referDept) return;
    
    // Simulate referral
    setComplaints(prev => prev.map(c => 
      c.id === referring.id ? { ...c, department: referDept, status: "Referred" } : c
    ));
    
    setShowSuccess(true);
    setReferring(null);
    setReferDept("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setHasApplied(true);
  };

  const filteredComplaints = hasApplied ? complaints.filter(c => {
    const criteria = appliedFilters || filters;
    const matchStatus = criteria.status === 'All Statuses' || c.status === criteria.status;
    const matchDistrict = criteria.district === 'All Districts' || c.district === criteria.district;
    const matchFinYear = criteria.finYear === 'All Years' || c.finYear === criteria.finYear;
    const matchScheme = criteria.scheme === 'All Schemes' || c.department === criteria.scheme;
    const matchProject = criteria.project === 'All Projects' || c.scheme === criteria.project;
    const matchBlock = criteria.block === 'All Blocks' || c.block === criteria.block;
    const matchPanchayat = criteria.panchayat === 'All GPs' || c.panchayat === criteria.panchayat;
    
    return matchStatus && matchDistrict && matchFinYear && matchScheme && matchProject && matchBlock && matchPanchayat;
  }) : [];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-8xl">
        <div className="bg-white p-6 shadow-sm border border-gray-300 rounded-sm">
          
          {/* Page Title */}
          <div className="flex items-center justify-between border-b-2 border-[#e65100] pb-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#002b5e] p-2 rounded-full text-white">
                <Bell size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#002b5e]">
                  {lang === 'hi' ? 'शिकायत सूचना केंद्र' : 'Grievance Notification Hub'}
                </h1>
                <p className="text-gray-500 text-[12px] font-medium">
                  {lang === 'hi' ? 'नई शिकायतों की समीक्षा करें और संबंधित विभागों को भेजें' : 'Review new complaints and refer to appropriate departments'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={lang === 'hi' ? 'शिकायत खोजें...' : 'Search complaints...'} 
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#1976d2] text-[12px] w-64"
                />
              </div>
              <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-sm transition-colors font-bold ${isFilterVisible ? 'bg-[#002b5e] text-white border-[#002b5e]' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
              >
                <Filter size={16} />
                <span>{lang === 'hi' ? 'फ़िल्टर' : 'Filters'}</span>
              </button>
            </div>
          </div>

          {/* Advanced Multi-Filter Panel */}
          {/* Optimized Advanced Multi-Filter Panel */}
          {isFilterVisible && (
            <div className="bg-[#002b5e] p-7 rounded-sm mb-8 text-white shadow-2xl border-t-4 border-[#e65100] animate-in slide-in-from-top-4 duration-500">
              <div className="space-y-8">
                {/* Administrative Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <Building2 size={16} className="text-yellow-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Administrative Filters</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Scheme</label>
                      <select name="scheme" value={filters.scheme} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Schemes</option>
                        <option className="text-gray-900">MGNREGA</option>
                        <option className="text-gray-900">Rajveeka</option>
                        <option className="text-gray-900">PMAY-G</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Project</label>
                      <select name="project" value={filters.project} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Projects</option>
                        <option className="text-gray-900">Digital Rajasthan</option>
                        <option className="text-gray-900">Solar Mission</option>
                        <option className="text-gray-900">Smart City</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Financial Year</label>
                      <select name="finYear" value={filters.finYear} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Years</option>
                        <option className="text-gray-900">2027-28</option>
                        <option className="text-gray-900">2026-27</option>
                        <option className="text-gray-900">2025-26</option>
                        <option className="text-gray-900">2024-25</option>
                        <option className="text-gray-900">2023-24</option>
                        <option className="text-gray-900">2022-23</option>
                        <option className="text-gray-900">2021-22</option>
                        <option className="text-gray-900">2020-21</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Status</label>
                      <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Statuses</option>
                        <option className="text-gray-900">New</option>
                        <option className="text-gray-900">Processing</option>
                        <option className="text-gray-900">Referred</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Geography & Time Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Location & Temporal Filters</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Date Range (From - To)</label>
                      <div className="flex gap-2">
                        <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="w-1/2 bg-white/10 border border-white/20 text-white px-2 py-2 rounded-sm text-[11px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all" />
                        <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="w-1/2 bg-white/10 border border-white/20 text-white px-2 py-2 rounded-sm text-[11px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">District</label>
                      <select name="district" value={filters.district} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Districts</option>
                        <option className="text-gray-900">Jaipur</option>
                        <option className="text-gray-900">Tonk</option>
                        <option className="text-gray-900">Alwar</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Block / Tehsil</label>
                      <select name="block" value={filters.block} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All Blocks</option>
                        <option className="text-gray-900">Sanganer</option>
                        <option className="text-gray-900">Deoli</option>
                        <option className="text-gray-900">Thanagazi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Gram Panchayat</label>
                      <select name="panchayat" value={filters.panchayat} onChange={handleFilterChange} className="w-full bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-sm text-[12px] focus:outline-none focus:bg-white focus:text-gray-900 transition-all cursor-pointer">
                        <option className="text-gray-900">All GPs</option>
                        <option className="text-gray-900">Sanganer</option>
                        <option className="text-gray-900">Deoli</option>
                        <option className="text-gray-900">Thanagazi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <p className="text-[11px] text-gray-400 font-medium">
                  {lang === 'hi' ? 'परिणाम देखने के लिए कृपया फिल्टर लागू करें।' : 'Please apply administrative and geographic filters to generate the report.'}
                </p>
                <button 
                  onClick={handleApplyFilters}
                  className="bg-[#e65100] hover:bg-[#cc4800] text-white px-10 py-3 rounded-sm font-bold text-[13px] flex items-center gap-3 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                >
                  <Filter size={18} /> {lang === 'hi' ? 'फिल्टर लागू करें' : 'Apply Master Filters'}
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-sm flex items-center gap-3 text-green-800 animate-in fade-in duration-300">
              <CheckCircle className="text-green-600" size={20} />
              <p className="font-bold">{lang === 'hi' ? 'शिकायत सफलतापूर्वक अनुशंसित की गई!' : 'Complaint successfully referred to new department!'}</p>
            </div>
          )}

          {/* Complaint List (Conditional) */}
          {hasApplied ? (
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'शिकायत आईडी' : 'complient -id'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'परिवादी' : 'Complainant'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'दिनांक' : 'date'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'स्थिति' : 'status'}</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'कार्रवाई' : 'actions'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'जिला' : 'district'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'ब्लॉक' : 'block'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'जीपी' : 'gp'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'विभाग' : 'dept'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-[11px]">{lang === 'hi' ? 'योजना' : 'scheme'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.length > 0 ? filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-4 font-mono font-bold text-[#1976d2] whitespace-nowrap">{complaint.id}</td>
                      <td className="px-4 py-4 font-bold text-gray-800 whitespace-nowrap">{complaint.name}</td>
                      <td className="px-4 py-4 text-gray-500 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {complaint.date}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${
                          complaint.status === 'New' ? 'bg-red-50 text-red-700 border-red-100' : 
                          complaint.status === 'Referred' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedComplaint(complaint)}
                            className="p-2 text-gray-600 hover:text-[#002b5e] hover:bg-white rounded-full shadow-sm border border-transparent hover:border-gray-200 transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => setReferring(complaint)}
                            className="p-2 text-gray-600 hover:text-[#e65100] hover:bg-white rounded-full shadow-sm border border-transparent hover:border-gray-200 transition-all"
                            title="Refer to Dept"
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 font-medium whitespace-nowrap">{complaint.district}</td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{complaint.block}</td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{complaint.panchayat}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-semibold text-[#002b5e] whitespace-nowrap">
                          <Building2 size={14} className="text-gray-400" />
                          {complaint.department}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[11px] text-[#e65100] font-bold whitespace-nowrap">{complaint.scheme}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="px-4 py-12 text-center text-gray-500 italic font-medium">
                        No grievances found matching your selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-sm bg-gray-50/50">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-gray-100 text-[#002b5e]/20">
                <FileText size={64} />
              </div>
              <h3 className="text-xl font-bold text-[#002b5e]">
                {lang === 'hi' ? 'रिपोर्ट तैयार करने के लिए तैयार है' : 'Ready to Generate Report'}
              </h3>
              <p className="text-gray-500 mt-2 text-center max-w-md">
                {lang === 'hi' 
                  ? 'कृपया ऊपर दिए गए विकल्पों का चयन करें और शिकायत डेटा देखने के लिए "फिल्टर लागू करें" बटन पर क्लिक करें।' 
                  : 'Please select your desired criteria above and click "Apply Master Filters" to view the grievance data.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002b5e]/90 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col max-h-[95vh]">
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-300">
              <h3 className="font-extrabold text-[#002b5e] flex items-center gap-2 text-lg">
                <FileText size={22} className="text-[#e65100]" />
                {lang === 'hi' ? 'शिकायत का विस्तृत विवरण' : 'Detailed Complaint Dossier'} - <span className="text-[#e65100]">{selectedComplaint.id}</span>
              </h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto bg-gray-50 flex-grow">
              <div className="p-8 space-y-8">
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block mb-2">Complainant</span>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-700"><User size={18}/></div>
                      <div>
                        <p className="font-bold text-[15px] text-[#002b5e]">{selectedComplaint.name}</p>
                        <p className="text-gray-600 font-medium">{selectedComplaint.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block mb-2">Administrative Info</span>
                    <div className="space-y-1 text-[13px]">
                      <p className="flex justify-between"><span className="text-gray-500">Source:</span> <span className="font-bold">{selectedComplaint.source}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">Fin. Year:</span> <span className="font-bold text-blue-600">{selectedComplaint.finYear}</span></p>
                    </div>
                  </div>
                  <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block mb-2">Geographic Info</span>
                    <div className="space-y-1 text-[13px]">
                      <p className="flex justify-between"><span className="text-gray-500">District:</span> <span className="font-bold">{selectedComplaint.district}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">Block:</span> <span className="font-bold">{selectedComplaint.block}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">Panchayat:</span> <span className="font-bold">{selectedComplaint.panchayat}</span></p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Department Details */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                  <div className="bg-[#002b5e] text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest flex justify-between">
                    <span>Departmental Assignment</span>
                    <span>Status: {selectedComplaint.status}</span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Assigned Department</label>
                      <p className="text-lg font-bold text-[#002b5e] flex items-center gap-2 italic">
                         <Building2 size={18} className="text-[#e65100]" />
                         {selectedComplaint.department}
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">Target Scheme</label>
                      <p className="text-lg font-bold text-[#e65100] underline decoration-blue-200 underline-offset-4">
                        {selectedComplaint.scheme}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Grievance Body */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 relative">
                  <div className="absolute top-4 right-6 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold border border-red-100">
                    Category: {selectedComplaint.category}
                  </div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 border-b border-gray-100 pb-1">Detailed Grievance Description</label>
                  <div className="bg-gray-50 p-5 rounded-sm border border-gray-100 leading-relaxed text-[14px] font-medium text-gray-700 italic">
                    "{selectedComplaint.details}"
                  </div>
                </div>

                {/* Section 4: Attachments */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-4">Evidence & Attachments (1)</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 border border-dashed border-gray-300 rounded-sm hover:border-[#1976d2] transition-colors cursor-pointer group">
                    <div className="bg-red-100 p-3 rounded-sm text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#002b5e]">{selectedComplaint.attachment}</p>
                      <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">PDF Document • 1.2 MB</p>
                    </div>
                    <button 
                      onClick={() => alert('Opening ' + selectedComplaint.attachment + '...')}
                      className="bg-white text-[#1976d2] border border-[#1976d2] px-4 py-2 text-[12px] font-bold rounded-sm hover:bg-[#1976d2] hover:text-white transition-all shadow-sm"
                    >
                      View Document
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 px-8 py-5 flex justify-end gap-4 border-t border-gray-200">
              <button 
                onClick={() => { setSelectedComplaint(null); setReferring(selectedComplaint); }}
                className="bg-[#e65100] text-white px-8 py-3 font-bold rounded-sm shadow-lg hover:bg-[#cc4800] transition-transform active:scale-95 flex items-center gap-2 text-[14px]"
              >
                <Share2 size={20} />
                {lang === 'hi' ? 'विभाग को रेफर करें' : 'Refer to Dept'}
              </button>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="bg-white text-gray-700 px-8 py-3 font-bold rounded-sm border border-gray-300 hover:bg-gray-50 transition-colors text-[14px]"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {referring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002b5e]/90 p-4 backdrop-blur-sm animate-in zoom-in duration-200">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6 text-[#e65100]">
              <Share2 size={24} />
              <h3 className="text-xl font-bold">{lang === 'hi' ? 'विभाग अनुदेश' : 'Department Referral'}</h3>
            </div>
            
            <p className="text-gray-600 mb-6 text-[14px]">
              {lang === 'hi' 
                ? `शिकायत ID ${referring.id} को दूसरे विभाग में स्थानांतरित करें।` 
                : `Transfer Complaint ID ${referring.id} to another executive department.`}
            </p>

            <form onSubmit={handleRefer} className="space-y-6">
              <div>
                <label className="text-[12px] font-bold text-gray-500 mb-2 block uppercase tracking-wider">{lang === 'hi' ? 'लक्ष्य विभाग चुनें' : 'Select Target Department'}</label>
                <select 
                  required
                  value={referDept}
                  onChange={(e) => setReferDept(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-[14px] focus:outline-none focus:border-[#e65100] outline-none transition-all"
                >
                  <option value="">-- {lang === 'hi' ? 'विभाग का चयन करें' : 'Choose Department'} --</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="submit"
                  disabled={!referDept}
                  className="flex-1 bg-[#002b5e] text-white py-3 font-bold rounded-sm shadow-lg hover:bg-[#001f44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowRight size={18} />
                  {lang === 'hi' ? 'स्थानांतरण सुनिश्चित करें' : 'Confirm Transfer'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setReferring(null); setReferDept(""); }}
                  className="px-6 py-3 border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 rounded-sm transition-colors"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Notification;