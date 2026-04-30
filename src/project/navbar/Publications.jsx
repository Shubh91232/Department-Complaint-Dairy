import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { Book, Download } from 'lucide-react';

const Publications = () => {
  const { lang, t } = useLanguage();

  const docs = [
    { id: '101', date: '2023-10-15', titleEn: 'Annual Report 2022-23', titleHi: 'वार्षिक रिपोर्ट 2022-23' },
    { id: '102', date: '2023-08-22', titleEn: 'New Guidelines for Grievance Handling', titleHi: 'शिकायत निवारण के लिए नए दिशानिर्देश' },
    { id: '103', date: '2023-05-10', titleEn: 'Departmental Circular No. 45', titleHi: 'विभागीय परिपत्र संख्या 45' },
    { id: '104', date: '2023-02-05', titleEn: 'Notification: Portal Upgrade', titleHi: 'अधिसूचना: पोर्टल अपग्रेड' },
    { id: '105', date: '2022-11-20', titleEn: 'RTI Compliance Document', titleHi: 'आरटीआई अनुपालन दस्तावेज' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex items-center gap-3 border-b-2 border-[#e65100] pb-2 mb-6">
            <Book className="text-[#002b5e]" size={24} />
            <h1 className="text-2xl font-bold text-[#002b5e]">
              {lang === 'hi' ? 'प्रकाशन एवं परिपत्र' : 'Publications & Circulars'}
            </h1>
          </div>
          
          <div className="overflow-x-auto shadow-sm">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#002b5e] text-white">
                  <th className="border border-gray-300 py-3 px-4 text-center w-16">S.No.</th>
                  <th className="border border-gray-300 py-3 px-4 text-center w-32">Date</th>
                  <th className="border border-gray-300 py-3 px-4 text-left">Title / Subject</th>
                  <th className="border border-gray-300 py-3 px-4 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="border border-gray-300 py-3 px-4 font-bold text-center">{idx + 1}</td>
                    <td className="border border-gray-300 py-3 px-4 text-gray-600 text-center font-mono">{doc.date}</td>
                    <td className="border border-gray-300 py-3 px-4 font-semibold text-[#002b5e]">
                      {lang === 'hi' ? doc.titleHi : doc.titleEn}
                    </td>
                    <td className="border border-gray-300 py-3 px-4 text-center">
                      <button className="text-blue-700 hover:text-white flex items-center justify-center gap-1 mx-auto bg-blue-100 hover:bg-blue-700 px-3 py-1.5 rounded-sm border border-blue-300 transition-colors font-bold text-[12px]">
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Publications;
