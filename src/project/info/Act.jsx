import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Scale, Home, ChevronRight, ChevronDown } from 'lucide-react';

const sections = [
  {
    title: 'The Rajasthan Public Grievances Act, 2012',
    content: `The Rajasthan Public Grievances Act, 2012 was enacted to provide an effective mechanism for the redressal of public grievances relating to rendering of public services by the government departments and agencies. It establishes a time-bound and transparent system for addressing citizen complaints.`
  },
  {
    title: 'Chapter I – Preliminary',
    content: `1. Short title, extent and commencement – This Act may be called the Rajasthan Public Grievances Act, 2012. It extends to the whole of the State of Rajasthan.
    
2. Definitions – In this Act, unless the context otherwise requires:
   (a) "Competent Authority" means the head of the department or any other officer authorized by the State Government.
   (b) "Grievance" means a complaint filed by a citizen regarding denial or non-delivery of a public service.
   (c) "Public Authority" means any Government department or agency providing services to citizens.`
  },
  {
    title: 'Chapter II – Grievance Redressal Mechanism',
    content: `3. Filing of Grievance – Any citizen who has a grievance regarding any public service may file a complaint with the designated Grievance Redressal Officer (GRO) of the concerned department.

4. Acknowledgment – Upon receipt of a grievance, the GRO shall issue an acknowledgment within 2 working days.

5. Time Limit for Redressal – The competent authority shall dispose of the grievance within 30 days from the date of filing. In exceptional circumstances, this may be extended by another 15 days with due intimation to the complainant.`
  },
  {
    title: 'Chapter III – Appeals',
    content: `6. First Appeal – Any aggrieved citizen who is not satisfied with the redressal may file a first appeal with the Appellate Authority within 30 days of receiving the decision.

7. Second Appeal – If the citizen remains unsatisfied, a second appeal may be filed with the State Public Grievance Redressal Commission within 60 days.

8. Powers of Appellate Authority – The Appellate Authority shall have the power to call for records, summon officers, and pass appropriate orders.`
  },
  {
    title: 'Chapter IV – Penalties & Enforcement',
    content: `9. Penalty for Non-compliance – Any officer who fails to dispose of a grievance within the stipulated time without sufficient cause shall be liable for disciplinary action as per service rules.

10. Compensation – Where a citizen has suffered loss due to willful non-redressal of a valid grievance, the competent authority may direct payment of reasonable compensation.`
  },
  {
    title: 'Schedule – List of Notified Services',
    content: `The following services are notified under this Act:
    1. Issuance of Income/Caste/Domicile Certificates
    2. Registration of Birth/Death
    3. Ration Card Services
    4. Land Record Corrections
    5. Water & Electricity Connections
    6. MNREGA Job Card Issuance
    7. Old Age/Widow Pension
    8. Housing under PMAY-G`
  }
];

const Act = () => {
  const { lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-[12px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#1976d2] flex items-center gap-1"><Home size={14} /> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#002b5e]">About the Act</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#002b5e] rounded-t-md p-6 border-b-4 border-[#e65100] shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20">
              <Scale size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                {lang === 'hi' ? 'अधिनियम के बारे में' : 'About the Act'}
              </h1>
              <p className="text-blue-200 text-[13px]">Rajasthan Public Grievances Act, 2012 – Full Text & Provisions</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 mb-6 flex gap-3 items-start">
          <Scale size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-800 text-[13px] font-medium leading-relaxed">
            This page contains the official text of the Rajasthan Public Grievances Act, 2012. For legal references, please refer to the Rajasthan Government Gazette official copy.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {sections.map((sec, idx) => (
            <div key={idx} className={`bg-white border rounded-sm shadow-sm overflow-hidden transition-all ${openIdx === idx ? 'border-[#002b5e]' : 'border-gray-200'}`}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full text-left px-5 py-4 font-bold text-[14px] flex justify-between items-center text-[#002b5e] hover:bg-gray-50 transition-colors"
              >
                <span>{sec.title}</span>
                <ChevronDown size={18} className={`transition-transform text-gray-500 ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIdx === idx ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 pb-5 pt-1 text-[13px] text-gray-700 leading-relaxed border-t border-gray-200 whitespace-pre-line">
                  {sec.content}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Act;
