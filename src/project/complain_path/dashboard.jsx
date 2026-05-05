import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { 
  FileText, CheckCircle, RefreshCw, BarChart2, Download, 
  Filter, History, MapPin, Search, Calendar, ChevronDown, 
  FileSpreadsheet, FileJson, X, LayoutGrid, Users, Building2, Map as MapIcon
} from 'lucide-react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = () => {
  const navigate = useNavigate();
  const [filterDist, setFilterDist] = useState('All');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterGp, setFilterGp] = useState('All');
  const [filterFy, setFilterFy] = useState('2026-27');
  const [filterScheme, setFilterScheme] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRecordType, setFilterRecordType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('detailed');
  const [appliedFilters, setAppliedFilters] = useState([]);

  const getDynamicDataPoints = () => {
    let factor = 1.0;
    // Simulate data change based on filters
    if (filterDist !== 'All') factor *= 0.75;
    if (filterFy === '2024-25') factor *= 0.6;
    if (filterScheme !== 'All') factor *= 0.9;
    
    const baseData = [
      { y: 13.01, label: "MGNREGA", color: "#8E7DA0" },
      { y: 8.2, label: "PM Awas Yojana", color: "#45B39D" },
      { y: 6.73, label: "Jal Jeevan Mission", color: "#E67E22" },
      { y: 6.26, label: "Hariyalo Rajasthan", color: "#85C1E9" },
      { y: 6.02, label: "Mission Amrit Sarovar", color: "#D4E157" },
      { y: 5.94, label: "Swachh Bharat Mission", color: "#AD1457" },
      { y: 5.36, label: "Rural Infrastructure", color: "#00897B" },
      { y: 5.36, label: "Digital Rajasthan", color: "#E57373" },
      { y: 4.96, label: "Skill Development", color: "#26A69A" },
      { y: 4.91, label: "Solar Power Project", color: "#5C6BC0" }
    ];

    return baseData.map(dp => ({
      ...dp,
      y: parseFloat((dp.y * factor).toFixed(2))
    }));
  };

  const chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Top 10 Schemes by Grievance Volume",
      fontFamily: "Inter, sans-serif",
      fontWeight: "900",
      fontSize: 18,
      padding: 20
    },
    axisX: {
      title: "Department",
      reversed: true,
      labelFontFamily: "Inter",
      labelFontWeight: "bold",
      labelFontSize: 12
    },
    axisY: {
      title: "Volume (in thousands)",
      includeZero: true,
      gridThickness: 1,
      labelFormatter: (e) => e.value + "k",
      labelFontFamily: "Inter",
      labelFontSize: 12
    },
    data: [{
      type: "bar",
      dataPoints: getDynamicDataPoints()
    }]
  };

  const handleApplyFilters = () => {
    const active = [];
    if (filterScheme !== 'All') active.push(`Scheme: ${filterScheme}`);
    if (filterDist !== 'All') active.push(`Dist: ${filterDist}`);
    if (filterStatus !== 'All') active.push(`Status: ${filterStatus}`);
    if (dateFrom || dateTo) active.push(`Date: ${dateFrom || 'Any'} to ${dateTo || 'Any'}`);
    
    setAppliedFilters(active);
  };

  const clearFilters = () => {
    setFilterDist('All');
    setFilterBlock('All');
    setFilterGp('All');
    setFilterFy('2026-27');
    setFilterScheme('All');
    setFilterStatus('All');
    setFilterRecordType('All');
    setDateFrom('');
    setDateTo('');
    setAppliedFilters([]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-4">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-[#002b5e] rounded-md flex items-center justify-center text-white">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Today</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-xl font-black text-gray-900">+124</h3>
                  <span className="text-green-500 text-[10px] font-bold">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-[#002b5e] rounded-md flex items-center justify-center text-white">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Disposed</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-xl font-black text-gray-900">45,214</h3>
                  <span className="text-blue-500 text-[10px] font-bold">92% rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-orange-600 rounded-md flex items-center justify-center text-white">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pending</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-xl font-black text-gray-900">2,337</h3>
                  <span className="text-orange-500 text-[10px] font-bold">-4.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-[#e65100] rounded-md flex items-center justify-center text-white">
                <BarChart2 size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Resolution</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-xl font-black text-gray-900">14 Days</h3>
                  <span className="text-purple-500 text-[10px] font-bold">Tgt: 15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          
          {/* Left: Rajasthan Map */}
          <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MapIcon className="text-teal-600" size={18} />
                  Distribution
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rajasthan Map</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="bg-orange-400 h-full w-[30%]"></div>
                    <div className="bg-yellow-400 h-full w-[40%]"></div>
                    <div className="bg-green-500 h-full w-[30%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-gray-300 mt-0.5 uppercase tracking-tighter">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow bg-gray-50/50 rounded-xl border border-dashed border-gray-200 relative overflow-hidden min-h-[360px] flex items-center justify-center">
              {/* Map Placeholder */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rajasthan_district_map.svg/800px-Rajasthan_district_map.svg.png" 
                alt="Rajasthan Map" 
                className="max-h-[320px] opacity-80 hover:opacity-100 transition-opacity cursor-pointer p-2"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-lg border border-gray-100 shadow-sm text-[8px] font-black uppercase tracking-widest space-y-0.5">
                <div className="flex items-center gap-1.5 text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Critical</div>
                <div className="flex items-center gap-1.5 text-orange-500"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> High</div>
                <div className="flex items-center gap-1.5 text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-600"></div> Normal</div>
              </div>
            </div>
          </div>

          {/* Right: Filter Panel */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">

              <div className="p-4 flex-grow flex flex-col gap-3 overflow-y-auto max-h-[480px] no-scrollbar">
                
                {/* Financial & Org Filters */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Financial Year</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                        value={filterFy}
                        onChange={(e) => setFilterFy(e.target.value)}
                      >
                        <option value="All">All Years</option>
                        <option value="2027-28">2027-28</option>
                        <option value="2026-27">2026-27</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2024-25">2024-25</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2022-23">2022-23</option>
                        <option value="2021-22">2021-22</option>
                        <option value="2020-21">2020-21</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Department</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                        value={filterScheme}
                        onChange={(e) => setFilterScheme(e.target.value)}
                      >
                        <option value="All">All Departments</option>
                        <option value="Panchayati Raj">Panchayati Raj</option>
                        <option value="Medical">Medical & Health</option>
                        <option value="Revenue">Revenue</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Scheme Filter */}
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Scheme</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Schemes</option>
                        <option value="MGNREGA">MGNREGA</option>
                        <option value="PM Awas Yojana">PM Awas Yojana</option>
                        <option value="Jal Jeevan Mission">Jal Jeevan Mission</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Record Type Filter */}
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Record Type</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                        value={filterRecordType}
                        onChange={(e) => setFilterRecordType(e.target.value)}
                      >
                        <option value="All">All Records</option>
                        <option value="Unique">Unique Only</option>
                        <option value="Duplicate">Duplicates</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location Filters */}
                <div className="space-y-3 pt-2 border-t border-gray-50">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Selection</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">District</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                          value={filterDist}
                          onChange={(e) => setFilterDist(e.target.value)}
                        >
                          <option value="All">All Districts</option>
                          <option value="Jaipur">Jaipur</option>
                          <option value="Jodhpur">Jodhpur</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Block</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                          value={filterBlock}
                          onChange={(e) => setFilterBlock(e.target.value)}
                        >
                          <option value="All">All Blocks</option>
                          <option value="Amber">Amber</option>
                          <option value="Luni">Luni</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">Gram Panchayat</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none transition-all"
                        value={filterGp}
                        onChange={(e) => setFilterGp(e.target.value)}
                      >
                        <option value="All">All GPs</option>
                        <option value="GP-1">GP-1</option>
                        <option value="GP-2">GP-2</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">From Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-1">To Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                  <button 
                    onClick={handleApplyFilters}
                    className="flex-[2] bg-teal-700 text-white rounded-xl py-2.5 font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-teal-100 hover:bg-teal-800 transition-all active:scale-95"
                  >
                    <Filter size={12} /> Apply
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-700 rounded-xl py-2 border border-gray-200 font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white transition-all whitespace-nowrap">
                    <FileSpreadsheet size={13} className="text-green-600" /> Excel
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-700 rounded-xl py-2 border border-gray-200 font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white transition-all whitespace-nowrap">
                    <FileText size={13} className="text-red-600" /> PDF
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="flex-none px-3 border border-gray-200 text-gray-500 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Analytics Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Performance</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Grievance Trends</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
               <select className="bg-white border-none rounded-lg px-2 py-1 text-[10px] font-bold text-teal-700 focus:outline-none shadow-sm cursor-pointer">
                  <option>Volume</option>
                  <option>Resolution</option>
               </select>
               <select className="bg-transparent border-none px-2 py-1 text-[10px] font-bold text-gray-400 focus:outline-none cursor-pointer">
                  <option>Descending</option>
                  <option>Ascending</option>
               </select>
            </div>
          </div>

          {/* New Horizontal Sub-Filters for Chart */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-2.5 bg-teal-50/20 rounded-xl border border-teal-100/30">
            <div className="space-y-0.5">
              <label className="text-[8px] font-black text-teal-700 uppercase tracking-tighter flex items-center gap-1">
                <MapPin size={8} /> Location
              </label>
              <select 
                className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-600 focus:outline-none shadow-sm"
                value={filterDist}
                onChange={(e) => setFilterDist(e.target.value)}
              >
                <option value="All">All Districts</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Jodhpur">Jodhpur</option>
              </select>
            </div>
            <div className="space-y-0.5">
              <label className="text-[8px] font-black text-teal-700 uppercase tracking-tighter flex items-center gap-1">
                <Building2 size={8} /> Dept
              </label>
              <select 
                className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-600 focus:outline-none shadow-sm"
                value={filterScheme}
                onChange={(e) => setFilterScheme(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Panchayati Raj">Panchayati Raj</option>
                <option value="Medical">Medical</option>
              </select>
            </div>
            <div className="space-y-0.5">
              <label className="text-[8px] font-black text-teal-700 uppercase tracking-tighter flex items-center gap-1">
                <LayoutGrid size={8} /> Scheme
              </label>
              <select 
                className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-600 focus:outline-none shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Schemes</option>
                <option value="MGNREGA">MGNREGA</option>
                <option value="PM Awas">PM Awas</option>
              </select>
            </div>
            <div className="space-y-0.5">
              <label className="text-[8px] font-black text-teal-700 uppercase tracking-tighter flex items-center gap-1">
                <Calendar size={8} /> Year
              </label>
              <select 
                className="w-full bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-600 focus:outline-none shadow-sm"
                value={filterFy}
                onChange={(e) => setFilterFy(e.target.value)}
              >
                <option value="All">All Years</option>
                <option value="2027-28">2027-28</option>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
                <option value="2021-22">2021-22</option>
                <option value="2020-21">2020-21</option>
              </select>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <CanvasJSChart options={chartOptions} />
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-gray-900">Grievance Records</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live Complaints Feed</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 w-full sm:w-48"
                />
              </div>
              <button 
                onClick={() => navigate('/history')}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
              >
                <History size={14} /> History
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-5 py-3">S.No</th>
                  <th className="px-5 py-3">District</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Status</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-[12px] font-semibold text-gray-700">
                {[
                  { s: 1, dist: 'Jaipur', block: 'Amber', dept: 'Panchayati Raj', desc: 'Delay in MNREGA payments', status: 'Pending' },
                  { s: 2, dist: 'Jodhpur', block: 'Luni', dept: 'PHED', desc: 'Water quality issue in ward 4', status: 'Resolved' },
                  { s: 3, dist: 'Udaipur', block: 'Girwa', dept: 'Revenue', desc: 'Land record dispute at tehsil', status: 'Pending' },
                  { s: 4, dist: 'Ajmer', block: 'Arain', dept: 'Medical', desc: 'Shortage of essential medicines', status: 'Rejected' },
                  { s: 5, dist: 'Bikaner', block: 'Lunkaransar', dept: 'PHED', desc: 'Pipeline leakage in main road', status: 'Resolved' },
                ].map((row, idx) => (
                  <tr key={row.s} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3 text-gray-400 font-bold">{row.s}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-gray-900 leading-tight">{row.dist}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">{row.block}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase">{row.dept}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="max-w-[200px] truncate text-gray-500">{row.desc}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        row.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                        row.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="text-teal-600 hover:text-teal-800 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">2.4M Records</span>
             <div className="flex gap-1.5">
                <button className="px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all">Prev</button>
                <button className="px-2.5 py-1 bg-teal-700 text-white rounded-lg text-[10px] font-bold shadow-sm shadow-teal-100">1</button>
                <button className="px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all">Next</button>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;