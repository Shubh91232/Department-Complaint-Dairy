import React from 'react';
import { Activity } from 'lucide-react';

const EnforcementStatus = React.memo(({ lang, formData, handleFormChange, labelClass, inputClass, requiredSpan }) => {
  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Activity size={18} className="text-[#6a1b9a]" />
        <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'कार्रवाई और वर्तमान स्थिति' : 'Enforcement & Current Status'}</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'संबंधित अधिकारी का नाम/पद' : 'Investigating Officer'} {requiredSpan}</label>
            <input type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleFormChange} required placeholder="e.g. BDO, Sarpanch, Zila Parishad CEO" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'} {requiredSpan}</label>
            <select name="currentStatus" value={formData.currentStatus} onChange={handleFormChange} required className={`${inputClass} font-bold ${formData.currentStatus === 'Pending' ? 'text-red-600' :
              formData.currentStatus === 'Resolved' ? 'text-green-600' :
                'text-blue-600'
              }`}>
              <option value="Pending">{lang === 'hi' ? 'लंबित (Pending)' : 'Pending'}</option>
              <option value="In Progress">{lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress'}</option>
              <option value="Resolved">{lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved'}</option>
              <option value="Rejected">{lang === 'hi' ? 'अस्वीकृत (Rejected)' : 'Rejected'}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'विभागीय संदर्भ क्र.' : 'Dept Ref No.'}</label>
            <input type="text" name="departmentRef" value={formData.departmentRef} onChange={handleFormChange} placeholder="e.g. CS-2026-X" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'की गई कार्रवाई / अनुपालना' : 'Action Taken'}</label>
          <textarea name="actionTaken" value={formData.actionTaken} onChange={handleFormChange} rows="2" placeholder="Describe actions taken so far..." className={inputClass}></textarea>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'टिप्पणी' : 'Remarks'}</label>
          <input type="text" name="remarks" value={formData.remarks} onChange={handleFormChange} placeholder="Additional notes or remarks from the sheet" className={inputClass} />
        </div>
      </div>
    </div>
  );
});

export default EnforcementStatus;
