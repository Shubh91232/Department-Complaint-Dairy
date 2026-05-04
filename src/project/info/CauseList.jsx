import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { PieChart, Home, ChevronRight, Search, Calendar, Download } from 'lucide-react';

const causeData = [
  { sno: 1, caseNo: 'GRV/2024/001234', petitioner: 'Ram Lal Sharma', department: 'Panchayati Raj', date: '2024-05-10', court: 'District Court, Jaipur', status: 'Listed' },
  { sno: 2, caseNo: 'GRV/2024/002891', petitioner: 'Sunita Devi', department: 'Public Health Engineering', date: '2024-05-10', court: 'High Court, Jodhpur', status: 'Adjourned' },
  { sno: 3, caseNo: 'GRV/2024/003120', petitioner: 'Mohan Singh', department: 'Revenue & Colonization', date: '2024-05-10', court: 'District Court, Udaipur', status: 'Listed' },
  { sno: 4, caseNo: 'GRV/2024/004567', petitioner: 'Geeta Kumari', department: 'Medical & Health', date: '2024-05-11', court: 'District Court, Kota', status: 'Disposed' },
  { sno: 5, caseNo: 'GRV/2024/005890', petitioner: 'Rajesh Kumar Gupta', department: 'Rural Development', date: '2024-05-11', court: 'High Court, Jaipur', status: 'Listed' },
  { sno: 6, caseNo: 'GRV/2024/006234', petitioner: 'Priya Sharma', department: 'Education Department', date: '2024-05-12', court: 'District Court, Bikaner', status: 'Adjourned' },
  { sno: 7, caseNo: 'GRV/2024/007891', petitioner: 'Vikram Singh Rathore', department: 'Agriculture', date: '2024-05-12', court: 'District Court, Ajmer', status: 'Listed' },
];

const CauseList = () => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = causeData.filter(c =>
    (c.caseNo.toLowerCase().includes(search.toLowerCase()) ||
     c.petitioner.toLowerCase().includes(search.toLowerCase()) ||
     c.department.toLowerCase().includes(search.toLowerCase())) &&
    (dateFilter === '' || c.date === dateFilter)
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">Cause List</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                <PieChart size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {lang === 'hi' ? 'कारण सूची' : 'Cause List'}
                </h1>
                <p className="text-blue-200 text-[13px]">Scheduled hearing cases for Rural Development & Panchayati Raj Dept.</p>
              </div>
            </div>
            <button className="bg-[#1e7b34] text-white px-4 py-2 rounded-sm text-[12px] font-bold uppercase flex items-center gap-2 hover:bg-[#145a24] transition-all shadow-md">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 shadow-sm border-x border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search by Case No., Petitioner, Department..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#002b5e]" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-500" />
            <input type="date" className="border border-gray-300 rounded-sm px-3 py-2 text-gray-700 focus:outline-none focus:border-[#002b5e]" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-[#002b5e] border-b border-gray-300 text-[12px] font-bold uppercase tracking-wider">
                <th className="px-4 py-4 text-center">#</th>
                <th className="px-4 py-4">Case No.</th>
                <th className="px-4 py-4">Petitioner</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4 text-center">Date</th>
                <th className="px-4 py-4">Court / Forum</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((row) => (
                <tr key={row.sno} className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-4 text-center font-bold text-gray-400">{row.sno}</td>
                  <td className="px-4 py-4 font-bold text-[#002b5e] font-mono text-[12px]">{row.caseNo}</td>
                  <td className="px-4 py-4 font-semibold text-gray-800">{row.petitioner}</td>
                  <td className="px-4 py-4 text-gray-600">{row.department}</td>
                  <td className="px-4 py-4 text-center text-gray-700 font-bold">{row.date}</td>
                  <td className="px-4 py-4 text-gray-600">{row.court}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      row.status === 'Listed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      row.status === 'Disposed' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>{row.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-4 py-16 text-center text-gray-400 font-semibold">No records found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-gray-500 text-[11px] font-bold uppercase tracking-widest bg-white p-4 border border-gray-200">
          Showing {filtered.length} of {causeData.length} records
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CauseList;
