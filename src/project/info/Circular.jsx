import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { FileText, Home, ChevronRight, Download, Calendar, Tag } from 'lucide-react';

const circulars = [
  { id: 'CIR/2024/047', title: 'Mandatory Use of Raj NyaySetu Portal for All Grievance Registrations', date: '2024-04-28', dept: 'Rural Development', category: 'Portal', size: '245 KB' },
  { id: 'CIR/2024/039', title: 'Time-Bound Disposal of Pending Grievances – Special Drive Instructions', date: '2024-04-10', dept: 'Panchayati Raj', category: 'Compliance', size: '182 KB' },
  { id: 'CIR/2024/031', title: 'Updation of Officer Designations in Grievance Redressal System', date: '2024-03-22', dept: 'All Departments', category: 'Administration', size: '98 KB' },
  { id: 'CIR/2024/025', title: 'Integration of MNREGA Grievances with Raj NyaySetu Portal', date: '2024-03-08', dept: 'Rural Development', category: 'Integration', size: '310 KB' },
  { id: 'CIR/2024/018', title: 'Quarterly Review of Grievance Redressal Performance – Q4 FY 2023-24', date: '2024-02-15', dept: 'All Departments', category: 'Review', size: '156 KB' },
  { id: 'CIR/2023/112', title: 'Guidelines for Handling Sensitive and Anonymous Grievances', date: '2023-12-20', dept: 'Administration', category: 'Guidelines', size: '214 KB' },
  { id: 'CIR/2023/098', title: 'Annual Grievance Audit Report – FY 2022-23', date: '2023-11-10', dept: 'Finance', category: 'Report', size: '1.2 MB' },
  { id: 'CIR/2023/087', title: 'Appointment of District-Level Grievance Redressal Officers', date: '2023-10-05', dept: 'Rural Development', category: 'Appointments', size: '75 KB' },
];

const categoryColors = {
  'Portal': 'bg-blue-50 text-blue-700 border-blue-200',
  'Compliance': 'bg-orange-50 text-orange-700 border-orange-200',
  'Administration': 'bg-purple-50 text-purple-700 border-purple-200',
  'Integration': 'bg-teal-50 text-teal-700 border-teal-200',
  'Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Guidelines': 'bg-green-50 text-green-700 border-green-200',
  'Report': 'bg-red-50 text-red-700 border-red-200',
  'Appointments': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const Circular = () => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = circulars.filter(c =>
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())) &&
    (catFilter === 'All' || c.category === catFilter)
  );

  const categories = ['All', ...new Set(circulars.map(c => c.category))];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">Circulars</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg mb-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
              <FileText size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                {lang === 'hi' ? 'परिपत्र' : 'Circulars & Orders'}
              </h1>
              <p className="text-blue-200 text-[13px]">Official Circulars, Office Orders and Government Notifications</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 shadow-sm border-x border-gray-200 flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FileText size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search by title or circular number..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#002b5e]" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-gray-500" />
            <select className="border border-gray-300 rounded-sm px-3 py-2 text-gray-700 font-semibold focus:outline-none focus:border-[#002b5e]" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Circular Cards */}
        <div className="space-y-3">
          {filtered.length > 0 ? filtered.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 shadow-sm rounded-sm p-5 hover:border-[#002b5e] hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#002b5e] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{c.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${categoryColors[c.category] || 'bg-gray-100 text-gray-600'}`}>{c.category}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-[14px] leading-snug group-hover:text-[#002b5e] transition-colors">{c.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-gray-500 text-[11px] font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {c.date}</span>
                    <span className="flex items-center gap-1"><FileText size={12} /> {c.dept}</span>
                    <span className="text-gray-400">{c.size}</span>
                  </div>
                </div>
                <button className="bg-[#002b5e] text-white px-4 py-2 rounded-sm text-[12px] font-bold hover:bg-[#001f44] transition-colors flex items-center gap-2 shadow-sm shrink-0">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-white border border-gray-200 p-16 text-center text-gray-400 font-semibold rounded-sm">
              No circulars found matching your search.
            </div>
          )}
        </div>

        <div className="mt-4 text-gray-500 text-[11px] font-bold uppercase tracking-widest bg-white p-4 border border-gray-200">
          Showing {filtered.length} of {circulars.length} circulars
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Circular;
