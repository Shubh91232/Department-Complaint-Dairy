import React from 'react';
import { Database } from 'lucide-react';

const CoreCaseInfo = React.memo(({
  lang,
  formData,
  handleFormChange,
  sources = [],
  labelClass,
  inputClass,
  requiredSpan
}) => {
  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Database size={18} className="text-[#1976d2]" />
        <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'मुख्य प्रकरण विवरण' : 'Core Case Information'}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'स्रोत (Source)' : 'Source'}</label>
          <select name="source" value={formData.source} onChange={handleFormChange} className={inputClass}>
            <option value="">-- Select Source --</option>
            {sources.map(s => (
              <option key={s.value} value={s.value}>
                {lang === 'hi' ? s.label_hi : s.label_en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'सीरियल / रिफ क्र.' : 'Serial / Ref No.'} {requiredSpan}</label>
          <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleFormChange} required placeholder="e.g. RJ-2026-001" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'विभागीय संदर्भ क्र.' : 'Dept Ref No.'}</label>
          <input type="text" name="departmentRef" value={formData.departmentRef} onChange={handleFormChange} placeholder="e.g. CS-2026-X" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'प्राप्त तिथि' : 'Date Received'} {requiredSpan}</label>
          <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleFormChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'वित्तीय वर्ष' : 'Financial Year'}</label>
          <input 
            type="text" 
            name="financialYear" 
            value={formData.financialYear} 
            readOnly 
            placeholder="Auto-calculated" 
            className={`${inputClass} bg-gray-50 font-bold text-[#1976d2] border-blue-100`} 
          />
        </div>
      </div>
    </div>
  );
});

export default CoreCaseInfo;
