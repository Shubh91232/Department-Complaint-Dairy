import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Book, Home, ChevronRight, Download, Search } from 'lucide-react';

const manualSections = [
  {
    chapter: 'Chapter 1',
    title: 'Introduction to Raj NyaySetu Portal',
    icon: '01',
    content: `1.1 Overview\nThe Raj NyaySetu Portal is a comprehensive digital platform developed by the Rural Development & Panchayati Raj Department, Government of Rajasthan, to streamline the registration, tracking, and resolution of public grievances.\n\n1.2 Objectives\n• Provide a transparent mechanism for citizens to lodge grievances\n• Ensure time-bound resolution by designated officers\n• Enable real-time tracking of complaint status\n• Maintain digital records for audit and accountability\n\n1.3 Scope\nThis manual is intended for Department Officers authorized to access the portal for registering and managing grievances on behalf of citizens.`
  },
  {
    chapter: 'Chapter 2',
    title: 'System Requirements & Login',
    icon: '02',
    content: `2.1 System Requirements\n• Modern web browser (Chrome 90+, Firefox 85+, Edge 90+)\n• Stable internet connection (minimum 2 Mbps)\n• Screen resolution: 1280x720 or higher\n\n2.2 Accessing the Portal\nNavigate to the official portal URL. The portal is accessible 24x7 except during scheduled maintenance windows.\n\n2.3 Login Procedure\n• Enter your Employee ID (Department-assigned)\n• Enter your password\n• Complete the CAPTCHA verification\n• Click "Login" to access your dashboard\n\n2.4 First-Time Login\nFor first-time login, use the temporary password provided by your department administrator. You must change this password upon first login.`
  },
  {
    chapter: 'Chapter 3',
    title: 'Registering a New Grievance',
    icon: '03',
    content: `3.1 Master Entry\nTo register a new grievance, navigate to "New Master Entry" from the dashboard or home screen.\n\n3.2 Step 1 – Basic Information\n• Select Department from the dropdown\n• Select Scheme/Project\n• Enter District and Block information\n• Select the nature of grievance\n\n3.3 Step 2 – Applicant Details\n• Enter applicant's full name\n• Mobile number (mandatory for SMS alerts)\n• Aadhaar number (optional)\n• Address details\n\n3.4 Step 3 – Grievance Description\n• Describe the grievance in detail\n• Attach supporting documents (PDF, JPG, PNG – max 5MB each)\n• Use OCR to auto-fill from scanned documents\n\n3.5 Save as Draft\nYou may save incomplete forms as drafts and resume later from "Work History > Pending Drafts".`
  },
  {
    chapter: 'Chapter 4',
    title: 'Tracking & Managing Grievances',
    icon: '04',
    content: `4.1 Work History Dashboard\nAll submitted grievances are available under "Work History". You can:\n• Search by Serial No., Applicant Name, or description\n• Filter by status (Pending / Resolved / Rejected)\n• Sort by date (newest/oldest first)\n• Export records to CSV\n\n4.2 Status Definitions\n• Pending: Grievance received, under review\n• In Progress: Assigned to officer, action being taken\n• Resolved: Grievance addressed satisfactorily\n• Rejected: Grievance found invalid or out of scope\n\n4.3 Deleting Records\nRecords can be deleted from the Work History page. Note: Deletion is permanent and cannot be undone.`
  },
  {
    chapter: 'Chapter 5',
    title: 'Reports & Exports',
    icon: '05',
    content: `5.1 Export to CSV\nClick the "Export CSV" button on the Work History page to download all records in a spreadsheet format suitable for Excel or Google Sheets.\n\n5.2 Dashboard Analytics\nThe Department Dashboard provides:\n• Total grievance counts by status\n• Department-wise performance charts\n• District-wise heat maps\n• Monthly trend analysis\n\n5.3 Printing\nUse the browser's print function (Ctrl+P) to print any page. Reports are print-optimized.`
  }
];

const Manual = () => {
  const { lang } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = manualSections.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">User Manual</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
                <Book size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {lang === 'hi' ? 'उपयोगकर्ता पुस्तिका' : 'User Manual'}
                </h1>
                <p className="text-blue-200 text-[13px]">Raj NyaySetu Portal – Official User Guide for Department Officers</p>
              </div>
            </div>
            <button className="bg-[#1e7b34] text-white px-4 py-2 rounded-sm text-[12px] font-bold uppercase flex items-center gap-2 hover:bg-[#145a24] transition-all shadow-md">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden sticky top-4">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 font-bold text-[#002b5e] text-[12px] uppercase tracking-wider flex items-center gap-2">
                <Book size={14} /> Contents
              </div>
              <div className="mb-3 p-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input type="text" placeholder="Search manual..." className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-sm text-[12px] focus:outline-none focus:border-[#002b5e]" value={search} onChange={e => { setSearch(e.target.value); setActiveChapter(-1); }} />
                </div>
              </div>
              {manualSections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveChapter(idx); setSearch(''); }}
                  className={`w-full text-left px-4 py-3 text-[12px] font-semibold border-b border-gray-100 flex items-center gap-3 transition-colors last:border-0 ${activeChapter === idx && !search ? 'bg-blue-50 text-[#002b5e] border-l-2 border-l-[#002b5e]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span className="w-6 h-6 bg-[#002b5e] text-white text-[10px] font-black rounded-sm flex items-center justify-center shrink-0">{sec.icon}</span>
                  <span className="leading-tight">{sec.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {(search ? filtered : [manualSections[activeChapter] || manualSections[0]]).map((sec, idx) => (
              <div key={idx} className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <span className="w-10 h-10 bg-[#002b5e] text-white text-[14px] font-black rounded-sm flex items-center justify-center">{sec.icon}</span>
                  <div>
                    <p className="text-[11px] text-[#e65100] font-bold uppercase tracking-wider">{sec.chapter}</p>
                    <h2 className="text-lg font-bold text-[#002b5e] leading-tight">{sec.title}</h2>
                  </div>
                </div>
                <div className="text-[13px] text-gray-700 leading-loose whitespace-pre-line">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Manual;
