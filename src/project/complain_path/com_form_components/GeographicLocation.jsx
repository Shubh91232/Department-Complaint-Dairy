import React from 'react';
import { MapPin, Minimize, LayoutList } from 'lucide-react';

const GeographicLocation = React.memo(({
  lang,
  formData,
  handleFormChange,
  levels,
  apiDistricts,
  apiBlocks,
  apiGPs,
  showAdvancedDetails,
  setShowAdvancedDetails,
  labelClass,
  inputClass,
  requiredSpan
}) => {
  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <MapPin size={18} className="text-[#e65100]" />
        <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'भौगोलिक स्थान' : 'Geographic Location'}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'स्तर (Level)' : 'Level'} {requiredSpan}</label>
          <select name="level" value={formData.level} onChange={handleFormChange} required className={inputClass}>
            <option value="">-- Select Level --</option>
            {levels.map(l => (
              <option key={l._id} value={l.levelName}>{l.levelName}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'ज़िला (District)' : 'District'} {requiredSpan}</label>
            <select name="district" value={formData.district} onChange={handleFormChange} required className={inputClass}>
              <option value="">-- Select District --</option>
              {apiDistricts.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'ब्लॉक (Block)' : 'Block'}</label>
            <select name="block" value={formData.block} onChange={handleFormChange} disabled={!formData.district} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
              <option value="">-- Select Block --</option>
              {apiBlocks.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}</label>
          <select name="panchayat" value={formData.panchayat} onChange={handleFormChange} disabled={!formData.block} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
            <option value="">-- Select GP --</option>
            {apiGPs.map(g => (
              <option key={g.value} value={g.label}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 mt-2">
        <button
          type="button"
          onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
          className={`w-full py-3 px-4 rounded-sm font-bold text-[13px] flex items-center justify-center gap-3 transition-all border-2 ${showAdvancedDetails
            ? 'bg-orange-600 text-white border-orange-600 shadow-md'
            : 'bg-white text-orange-600 border-orange-600 hover:bg-orange-50'
            }`}
        >
          {showAdvancedDetails ? <Minimize size={18} /> : <LayoutList size={18} />}
          {showAdvancedDetails
            ? (lang === 'hi' ? 'अतिरिक्त विवरण छिपाएं' : 'Hide Advanced Details')
            : (lang === 'hi' ? 'अतिरिक्त विवरण (More Details)' : 'Show Advanced Details')}
        </button>
      </div>
    </div>
  );
});

export default GeographicLocation;
