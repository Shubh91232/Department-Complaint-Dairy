import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { FileText, CheckCircle, RefreshCw, BarChart2, Download, Filter, History } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [filterDist, setFilterDist] = useState('All');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterGp, setFilterGp] = useState('All');
  const [filterFy, setFilterFy] = useState('All');
  const [filterScheme, setFilterScheme] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('agewise');
  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleApplyFilters = () => {
    const active = [];
    if (filterScheme !== 'All') active.push(`Scheme: ${filterScheme}`);
    if (filterFy !== 'All') active.push(`FY: ${filterFy}`);
    if (filterStatus !== 'All') active.push(`Status: ${filterStatus}`);
    if (filterDist !== 'All') active.push(`Dist: ${filterDist}`);
    if (filterBlock !== 'All') active.push(`Block: ${filterBlock}`);
    if (filterGp !== 'All') active.push(`GP: ${filterGp}`);
    if (dateFrom || dateTo) active.push(`Date: ${dateFrom || 'Any'} to ${dateTo || 'Any'}`);
    
    if (active.length === 0) active.push("Showing All Data");
    
    setAppliedFilters(active);
  };

  const handleDownloadExcel = () => {
    // Generate Excel/CSV report logic based on filters
    const csvContent = "data:text/csv;charset=utf-8,FinancialYear,District,Block,GP,Status,DateFrom,DateTo\n" + 
                       `${filterFy},${filterDist},${filterBlock},${filterGp},${filterStatus},${dateFrom},${dateTo}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admin_Dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    alert(`Generating styled PDF report (${reportType}) with current filters...`);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Massive Statistics Dashboard (Formalized) */}
        <div className="bg-[#002b5e] py-10 border-y border-[#001f44]">
          <div className="container mx-auto px-4">
            
            <div className="text-center mb-8 relative flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Public Grievance Dashboard</h2>
              <div className="w-16 h-1 bg-[#e65100] mx-auto mb-3"></div>
              <p className="text-blue-200 text-[13px]">Monitoring and analytics of public grievances to ensure transparent governance.</p>
            </div>

            {/* Admin Filter Section */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-md mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                
                {/* Report Type */}
                <div className="md:col-span-4 lg:col-span-1 border-b border-white/10 pb-4 md:border-none md:pb-0">
                  <label className="text-[11px] font-bold text-yellow-400 block mb-1 uppercase tracking-wider">Report Format</label>
                  <select className="w-full bg-yellow-400 text-[#002b5e] font-bold border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-white" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="detailed">Detailed Dataset (All Columns)</option>
                    <option value="agewise">District-wise Agewise Pending</option>
                  </select>
                </div>
                
                {/* Scheme */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Scheme / Project</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterScheme} onChange={(e) => setFilterScheme(e.target.value)}>
                    <option value="All">All Schemes</option>
                    <option value="Hariyalo Rajasthan">Hariyalo Rajasthan</option>
                    <option value="Mission Amrit Sarovar">Mission Amrit Sarovar</option>
                    <option value="Rural Infrastructure">Rural Infrastructure</option>
                    <option value="MGNREGA">MGNREGA</option>
                    <option value="PM Awas Yojana">PM Awas Yojana</option>
                    <option value="Jal Jeevan Mission">Jal Jeevan Mission</option>
                  </select>
                </div>

                {/* Financial Year */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Financial Year</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterFy} onChange={(e) => setFilterFy(e.target.value)}>
                    <option value="All">All Years</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Status</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Date Range (From - To)</label>
                  <div className="flex gap-2">
                    <input type="date" className="w-1/2 bg-white text-gray-800 border border-transparent rounded-sm px-2 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <input type="date" className="w-1/2 bg-white text-gray-800 border border-transparent rounded-sm px-2 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">District</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterDist} onChange={(e) => setFilterDist(e.target.value)}>
                    <option value="All">All Districts</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Ajmer">Ajmer</option>
                  </select>
                </div>

                {/* Block / Tehsil */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Block / Tehsil</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)}>
                    <option value="All">All Blocks</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                  </select>
                </div>

                {/* Gram Panchayat */}
                <div>
                  <label className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">Gram Panchayat</label>
                  <select className="w-full bg-white text-gray-800 border border-transparent rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#e65100]" value={filterGp} onChange={(e) => setFilterGp(e.target.value)}>
                    <option value="All">All GPs</option>
                    <option value="GP 1">GP 1</option>
                    <option value="GP 2">GP 2</option>
                  </select>
                </div>

                {/* Apply Button */}
                <div className="flex gap-2 items-end">
                  <button onClick={handleApplyFilters} className="cursor-pointer bg-blue-600 text-white w-full py-2 font-bold text-[13px] rounded-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                    <Filter size={16} /> Apply Filters
                  </button>
                </div>

              </div>

              {/* Download Buttons Row */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button onClick={handleDownloadExcel} className="cursor-pointer bg-[#1e7b34] text-white border border-[#145a24] px-4 py-2 font-bold text-[13px] rounded-sm hover:bg-[#145a24] transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                  <Download size={16} /> Download Excel
                </button>
                <button onClick={handleDownloadPdf} className="cursor-pointer bg-[#d32f2f] text-white border border-[#b71c1c] px-4 py-2 font-bold text-[13px] rounded-sm hover:bg-[#b71c1c] transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                  <FileText size={16} /> Download PDF
                </button>
                <button onClick={() => navigate('/history')} className="cursor-pointer bg-[#002b5e] text-white border border-[#001f44] px-4 py-2 font-bold text-[13px] rounded-sm hover:bg-[#001f44] transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                  <History size={16} /> View Work History
                </button>
              </div>

              {/* Applied Filters Display */}
              {appliedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10 mt-4">
                  <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Active Filters:</span>
                  {appliedFilters.map((filter, idx) => (
                    <span key={idx} className="bg-blue-800/50 text-blue-100 border border-blue-500/30 px-2.5 py-1 rounded-sm text-[11px] font-semibold flex items-center gap-1 shadow-inner">
                      {filter}
                    </span>
                  ))}
                  <button onClick={() => {
                    setFilterScheme('All'); setFilterFy('All'); setFilterStatus('All'); 
                    setFilterDist('All'); setFilterBlock('All'); setFilterGp('All'); 
                    setDateFrom(''); setDateTo(''); setAppliedFilters([]);
                  }} className="text-[11px] text-blue-300 hover:text-white underline ml-2 transition-colors cursor-pointer">
                    Clear All
                  </button>
                </div>
              )}



              
            {/* Conditional Reports */}
            {reportType === 'agewise' ? (
              <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200 mt-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="font-bold text-[#002b5e] text-[16px]">District-wise Agewise Pending Complaints</h3>
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">As per standard meeting report format</p>
                  </div>
                  <button onClick={handleDownloadExcel} className="bg-[#1e7b34] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-sm hover:bg-[#145a24] transition-colors flex items-center gap-1 shadow-sm">
                    <Download size={14} /> Export Table Data
                  </button>
                </div>
                
                <table className="w-full text-[12px] border-collapse text-center">
                  <thead>
                    <tr className="bg-gray-100 text-[#002b5e] font-bold text-[13px]">
                      <th className="border border-gray-300 px-2 py-2.5 w-12">S.NO.</th>
                      <th className="border border-gray-300 px-2 py-2.5 text-left min-w-[120px]">District Name</th>
                      <th className="border border-gray-300 px-2 py-2.5">Total complaint</th>
                      <th className="border border-gray-300 px-2 py-2.5">Disposed</th>
                      <th className="border border-gray-300 px-2 py-2.5">Pending at district level</th>
                      <th className="border border-gray-300 px-2 py-2.5" colSpan="3">Agewise Pending complaints</th>
                    </tr>
                    <tr className="bg-gray-50 text-gray-700 font-bold text-[11px]">
                      <th className="border border-gray-300 px-2 py-1.5">1</th>
                      <th className="border border-gray-300 px-2 py-1.5 text-left">2</th>
                      <th className="border border-gray-300 px-2 py-1.5">3</th>
                      <th className="border border-gray-300 px-2 py-1.5">4</th>
                      <th className="border border-gray-300 px-2 py-1.5 bg-orange-50 text-orange-800">5 (6+7+8)</th>
                      <th className="border border-gray-300 px-2 py-1.5">0-3 month</th>
                      <th className="border border-gray-300 px-2 py-1.5">3-6 month</th>
                      <th className="border border-gray-300 px-2 py-1.5">above 6 month</th>
                    </tr>
                    <tr className="bg-gray-100 text-gray-500 font-semibold text-[10px]">
                      <th className="border border-gray-300 px-2 py-1"></th>
                      <th className="border border-gray-300 px-2 py-1"></th>
                      <th className="border border-gray-300 px-2 py-1"></th>
                      <th className="border border-gray-300 px-2 py-1"></th>
                      <th className="border border-gray-300 px-2 py-1 bg-orange-50"></th>
                      <th className="border border-gray-300 px-2 py-1">6</th>
                      <th className="border border-gray-300 px-2 py-1">7</th>
                      <th className="border border-gray-300 px-2 py-1">8</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: 1, name: 'Jaisalmer', t: 5, d: 2, p: 3, p1: 2, p2: 0, p3: 1 },
                      { s: 2, name: 'Bikaner', t: 6, d: 5, p: 1, p1: 0, p2: 0, p3: 1 },
                      { s: 3, name: 'Alwar', t: 12, d: 10, p: 2, p1: 1, p2: 1, p3: 0 },
                      { s: 4, name: 'Bharatpur', t: 5, d: 3, p: 2, p1: 0, p2: 0, p3: 2 },
                      { s: 5, name: 'Jaipur', t: 7, d: 5, p: 2, p1: 1, p2: 1, p3: 0 },
                      { s: 6, name: 'Bhilwara', t: 5, d: 4, p: 1, p1: 0, p2: 0, p3: 1 },
                      { s: 7, name: 'Ajmer', t: 7, d: 6, p: 1, p1: 1, p2: 0, p3: 0 },
                      { s: 8, name: 'Banswara', t: 1, d: 0, p: 1, p1: 0, p2: 0, p3: 1 },
                      { s: 9, name: 'Baran', t: 2, d: 2, p: 0, p1: 0, p2: 0, p3: 0 },
                      { s: 10, name: 'Barmer', t: 4, d: 4, p: 0, p1: 0, p2: 0, p3: 0 },
                      { s: 11, name: 'Dausa', t: 4, d: 3, p: 1, p1: 1, p2: 0, p3: 0 },
                      { s: 12, name: 'Dholpur', t: 2, d: 1, p: 1, p1: 0, p2: 1, p3: 0 },
                      { s: 13, name: 'Hanumangarh', t: 5, d: 4, p: 1, p1: 1, p2: 0, p3: 0 },
                      { s: 14, name: 'Jodhpur', t: 5, d: 5, p: 0, p1: 0, p2: 0, p3: 0 },
                    ]
                    .filter(row => filterDist === 'All' || row.name === filterDist)
                    .map((row, index) => (
                      <tr key={row.s} className="hover:bg-blue-50 text-gray-800 font-semibold border-b border-gray-200 transition-colors">
                        <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-2 text-left">{row.name}</td>
                        <td className="border border-gray-300 px-2 py-2 bg-gray-50">{row.t}</td>
                        <td className="border border-gray-300 px-2 py-2 text-green-700">{row.d}</td>
                        <td className="border border-gray-300 px-2 py-2 bg-orange-50 text-red-600 font-bold">{row.p}</td>
                        <td className="border border-gray-300 px-2 py-2">{row.p1}</td>
                        <td className="border border-gray-300 px-2 py-2">{row.p2}</td>
                        <td className="border border-gray-300 px-2 py-2 font-bold">{row.p3 > 0 ? <span className="text-red-500">{row.p3}</span> : row.p3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200 mt-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="font-bold text-[#002b5e] text-[16px]">Detailed Grievance Dataset</h3>
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Comprehensive list of all registered complaints</p>
                  </div>
                  <button onClick={handleDownloadExcel} className="bg-[#1e7b34] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-sm hover:bg-[#145a24] transition-colors flex items-center gap-1 shadow-sm">
                    <Download size={14} /> Export Dataset
                  </button>
                </div>
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-[#002b5e] font-bold">
                      <th className="border border-gray-300 px-3 py-2 text-center">S.No</th>
                      <th className="border border-gray-300 px-3 py-2">District</th>
                      <th className="border border-gray-300 px-3 py-2">Block</th>
                      <th className="border border-gray-300 px-3 py-2">Panchayat</th>
                      <th className="border border-gray-300 px-3 py-2">FY</th>
                      <th className="border border-gray-300 px-3 py-2">Complaint Description</th>
                      <th className="border border-gray-300 px-3 py-2">Date</th>
                      <th className="border border-gray-300 px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: 1, dist: 'Jaipur', block: 'Amber', gp: 'GP-1', fy: '2025-26', dept: 'Panchayati Raj', scheme: 'MGNREGA', desc: 'Delay in MNREGA payments', date: '2026-01-15', status: 'Pending' },
                      { s: 2, dist: 'Jodhpur', block: 'Luni', gp: 'GP-4', fy: '2025-26', dept: 'PHED', scheme: 'Jal Jeevan Mission', desc: 'Quality of road construction', date: '2026-01-18', status: 'Resolved' },
                      { s: 3, dist: 'Udaipur', block: 'Girwa', gp: 'GP-2', fy: '2024-25', dept: 'Revenue', scheme: 'Rural Infrastructure', desc: 'Water supply issue in village', date: '2025-12-05', status: 'Pending' },
                      { s: 4, dist: 'Ajmer', block: 'Arain', gp: 'GP-7', fy: '2025-26', dept: 'Medical', scheme: 'Hariyalo Rajasthan', desc: 'Illegal encroachment on public land', date: '2026-02-01', status: 'Rejected' },
                      { s: 5, dist: 'Bikaner', block: 'Lunkaransar', gp: 'GP-12', fy: '2025-26', dept: 'Panchayati Raj', scheme: 'PM Awas Yojana', desc: 'Issues with pension scheme', date: '2026-01-20', status: 'Resolved' },
                      { s: 6, dist: 'Jaipur', block: 'Amber', gp: 'GP-2', fy: '2025-26', dept: 'Medical', scheme: 'Mission Amrit Sarovar', desc: 'Medicine shortage in PHC', date: '2026-02-10', status: 'Pending' },
                      { s: 7, dist: 'Jaipur', block: 'Phagi', gp: 'GP-1', fy: '2025-26', dept: 'Revenue', scheme: 'Rural Infrastructure', desc: 'Land record dispute', date: '2026-02-12', status: 'Resolved' },
                    ]
                    .filter(row => (
                      (filterScheme === 'All' || row.scheme === filterScheme) &&
                      (filterDist === 'All' || row.dist === filterDist) &&
                      (filterFy === 'All' || row.fy === filterFy) &&
                      (filterStatus === 'All' || row.status === filterStatus)
                    ))
                    .map((row, index) => (
                      <tr key={row.s} className="hover:bg-blue-50 text-gray-700 border-b border-gray-200 transition-colors">
                        <td className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-500">{index + 1}</td>
                        <td className="border border-gray-300 px-3 py-2 font-semibold">{row.dist}</td>
                        <td className="border border-gray-300 px-3 py-2">{row.block}</td>
                        <td className="border border-gray-300 px-3 py-2">{row.gp}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{row.fy}</td>
                        <td className="border border-gray-300 px-3 py-2 max-w-xs truncate">{row.desc}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{row.date}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            row.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                            row.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Stat Cards */}
              <div className="bg-white border-t-4 border-blue-600 p-5 rounded-sm text-center shadow-sm">
                <div className="w-8 h-8 mx-auto bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-2">
                  <FileText size={16} />
                </div>
                <div className="text-gray-500 mb-1 font-semibold uppercase text-[10px]">Total Received</div>
                <div className="text-2xl font-bold text-[#002b5e]">2,450,192</div>
              </div>
              
              <div className="bg-white border-t-4 border-green-600 p-5 rounded-sm text-center shadow-sm">
                <div className="w-8 h-8 mx-auto bg-green-50 text-green-700 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle size={16} />
                </div>
                <div className="text-gray-500 mb-1 font-semibold uppercase text-[10px]">Total Disposed</div>
                <div className="text-2xl font-bold text-green-700">2,380,441</div>
              </div>

              <div className="bg-white border-t-4 border-orange-500 p-5 rounded-sm text-center shadow-sm">
                <div className="w-8 h-8 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-2">
                  <RefreshCw size={16} />
                </div>
                <div className="text-gray-500 mb-1 font-semibold uppercase text-[10px]">Pending Cases</div>
                <div className="text-2xl font-bold text-orange-600">45,337</div>
              </div>

              <div className="bg-white border-t-4 border-purple-600 p-5 rounded-sm text-center shadow-sm">
                <div className="w-8 h-8 mx-auto bg-purple-50 text-purple-700 rounded-full flex items-center justify-center mb-2">
                  <BarChart2 size={16} />
                </div>
                <div className="text-gray-500 mb-1 font-semibold uppercase text-[10px]">Avg. Resolution</div>
                <div className="text-2xl font-bold text-purple-700">14 Days</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Donut Chart Block */}
              <div className="bg-white rounded-md p-6 shadow-sm flex flex-col items-center justify-center border border-gray-200">
                <h3 className="font-bold text-[#002b5e] text-[15px] mb-6 self-start border-b border-gray-200 w-full pb-2">Disposal Breakdown</h3>
                <div className="w-40 h-40 rounded-full relative shadow-inner mb-6 border border-gray-100" style={{ background: 'conic-gradient(#1e88e5 0% 63.5%, #43a047 63.5% 83.5%, #fb8c00 83.5% 100%)' }}>
                  <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                     <span className="text-2xl font-bold text-gray-800">97%</span>
                     <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Disposed</span>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-2 text-[12px] font-medium px-2">
                   <div className="flex justify-between items-center border-b border-gray-50 pb-1"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1e88e5]"></div><span className="text-gray-700">Accepted</span></div><span className="text-[#002b5e] font-bold">63.5%</span></div>
                   <div className="flex justify-between items-center border-b border-gray-50 pb-1"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#43a047]"></div><span className="text-gray-700">Alternate</span></div><span className="text-[#002b5e] font-bold">20.0%</span></div>
                   <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fb8c00]"></div><span className="text-gray-700">Rejected</span></div><span className="text-[#002b5e] font-bold">16.5%</span></div>
                </div>
              </div>

              {/* Department Performance Bar Chart */}
              <div className="bg-white rounded-md p-6 shadow-sm md:col-span-2 border border-gray-200">
                <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                  <h3 className="font-bold text-[#002b5e] text-[15px]">Top Performing Departments</h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-gray-400 rounded-sm"></div><span className="text-gray-600">Total</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div><span className="text-green-700">Resolved</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div><span className="text-red-600">Rejected</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-400 rounded-sm"></div><span className="text-orange-600">Pending</span></div>
                  </div>
                </div>
                <div className="space-y-6">
                   {[
                     {name: 'Panchayati Raj & Rural Development', total: 12450, resolved: 12201, rejected: 150, pending: 99, color: 'bg-[#1e7b34]', textColor: 'text-[#1e7b34]'},
                     {name: 'Public Health Engineering (PHED)', total: 8920, resolved: 8384, rejected: 310, pending: 226, color: 'bg-[#0059b3]', textColor: 'text-[#0059b3]'},
                     {name: 'Revenue & Colonization Department', total: 15600, resolved: 13884, rejected: 980, pending: 736, color: 'bg-[#002b5e]', textColor: 'text-[#002b5e]'},
                     {name: 'Medical & Health Services', total: 6420, resolved: 5521, rejected: 400, pending: 499, color: 'bg-[#e65100]', textColor: 'text-[#e65100]'},
                   ].map((dept, i) => {
                     const resolvePercent = ((dept.resolved / dept.total) * 100).toFixed(1);
                     return (
                       <div key={i}>
                         <div className="flex justify-between items-end text-[12px] font-bold text-gray-800 mb-1.5">
                           <span>{dept.name}</span>
                           <span className={`${dept.textColor} font-bold text-[13px]`}>{resolvePercent}% Resolved</span>
                         </div>
                         <div className="w-full bg-gray-100 h-2.5 rounded-sm overflow-hidden mb-2 flex">
                           <div className="bg-green-500 h-full" style={{width: `${(dept.resolved / dept.total) * 100}%`}} title={`Resolved: ${dept.resolved}`}></div>
                           <div className="bg-red-500 h-full" style={{width: `${(dept.rejected / dept.total) * 100}%`}} title={`Rejected: ${dept.rejected}`}></div>
                           <div className="bg-orange-400 h-full" style={{width: `${(dept.pending / dept.total) * 100}%`}} title={`Pending: ${dept.pending}`}></div>
                         </div>
                         <div className="grid grid-cols-4 gap-2 text-[12px] font-bold text-center pt-1">
                            <div className="text-gray-600">{dept.total.toLocaleString()}</div>
                            <div className="text-green-600">{dept.resolved.toLocaleString()}</div>
                            <div className="text-red-500">{dept.rejected.toLocaleString()}</div>
                            <div className="text-orange-500">{dept.pending.toLocaleString()}</div>
                         </div>
                       </div>
                     );
                   })}
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;