import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Minimize, LayoutList, Search, Loader2, X } from 'lucide-react';
import { fetchSearchGPAPI, fetchBlocksAPI, fetchGPsAPI } from '../../../apiHandler/apis';

const GeographicLocation = React.memo(({
  lang,
  formData,
  handleFormChange,
  setFormData,
  levels,
  apiDistricts,
  apiBlocks,
  setApiBlocks,
  apiGPs,
  setApiGPs,
  showAdvancedDetails,
  setShowAdvancedDetails,
  labelClass,
  inputClass,
  requiredSpan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await fetchSearchGPAPI(query);
      if (res.success) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error("GP Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true); // Show loader immediately while waiting for debounce
    }
  };

  const selectGP = async (gp) => {
    // 1. Update form data for the hierarchy
    setFormData(prev => ({
      ...prev,
      geographic_information: {
        ...prev.geographic_information,
        district: gp.district_id,
        block: gp.block_id,
        panchayat: gp.gp_id
      }
    }));

    // 2. Fetch lists to sync dropdowns
    try {
      const bRes = await fetchBlocksAPI(gp.district_id);
      if (bRes.success) setApiBlocks(bRes.data);
      
      const gRes = await fetchGPsAPI(gp.block_id);
      if (gRes.success) setApiGPs(gRes.data);
    } catch (err) {
      console.error("Error syncing location lists:", err);
    }

    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#e65100]" />
          <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'भौगोलिक स्थान' : 'Geographic Location'}</h2>
        </div>
        
        {/* GP Search Bar */}
        <div className="relative w-64" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder={lang === 'hi' ? 'ग्राम पंचायत खोजें...' : 'Search GP by name...'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="w-full pl-8 pr-8 py-1.5 text-[12px] border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            {isSearching ? (
              <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" />
            ) : searchQuery && (
              <button onClick={() => {setSearchQuery(''); setShowResults(false);}} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-[12px] text-gray-500">Searching...</div>
              ) : (
                searchResults.map(gp => (
                  <button
                    key={gp.value}
                    onClick={() => selectGP(gp)}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <div className="font-bold text-[13px] text-gray-800">{gp.label}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <span className="bg-blue-50 text-blue-700 px-1 rounded">{gp.district_name}</span>
                      <span className="text-gray-300">/</span>
                      <span className="bg-gray-50 text-gray-600 px-1 rounded">{gp.block_name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'स्तर (Level)' : 'Level'} {requiredSpan}</label>
          <select name="level" value={formData.level} onChange={handleFormChange} required className={inputClass}>
            <option value="">-- Select Level --</option>
            {levels.map((l, idx) => (
              <option key={l.value || idx} value={l.value}>{l.label}</option>
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
              <option key={g.value} value={g.value}>{g.label}</option>
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
