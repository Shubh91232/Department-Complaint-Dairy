import React, { useState, useMemo } from 'react';
import { ShieldAlert, ChevronRight, Search } from 'lucide-react';

const CaseSpecifics = React.memo(({
  lang,
  formData,
  setFormData,
  handleFormChange,
  departments,
  currentSchemes,
  categories,
  selectedDept,
  labelClass,
  inputClass,
  requiredSpan,
  autoSelectCategory
}) => {
  const [deptSearch, setDeptSearch] = useState('');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showDeptOptions, setShowDeptOptions] = useState(false);
  const [showSchemeOptions, setShowSchemeOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  const filteredDepts = useMemo(() => departments.filter(d =>
    d.department_name_en.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.department_name_hi.includes(deptSearch)
  ), [departments, deptSearch]);

  const filteredSchemes = useMemo(() => currentSchemes.filter(s =>
    s.scheme_name_en.toLowerCase().includes(schemeSearch.toLowerCase()) ||
    s.scheme_name_hi.includes(schemeSearch)
  ), [currentSchemes, schemeSearch]);

  const filteredCategories = useMemo(() => categories.filter(c =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  ), [categories, categorySearch]);

  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <ShieldAlert size={18} className="text-[#2e7d32]" />
        <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'प्रकरण का विवरण' : 'Case Specifics'}</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'विभाग (Department)' : 'Department'} {requiredSpan}</label>
            <div className="relative">
              <div
                className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.department ? 'text-gray-400' : ''}`}
                onClick={() => setShowDeptOptions(!showDeptOptions)}
              >
                {selectedDept ? `${selectedDept.department_name_en} (${selectedDept.department_name_hi})` : (lang === 'hi' ? '-- विभाग चुनें --' : '-- Select Department --')}
                <ChevronRight size={16} className={`transform transition-transform ${showDeptOptions ? 'rotate-90' : ''}`} />
              </div>

              {showDeptOptions && (
                <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                  <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input
                        type="text"
                        placeholder={lang === 'hi' ? 'विभाग खोजें...' : 'Search department...'}
                        className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                        value={deptSearch}
                        onChange={(e) => setDeptSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredDepts.length > 0 ? filteredDepts.map(dept => (
                      <div
                        key={dept.department_id}
                        className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            case_information: {
                              ...prev.case_information,
                              department: dept.department_name_en,
                              scheme: ''
                            }
                          }));
                          setShowDeptOptions(false);
                          setDeptSearch('');
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{dept.department_name_en}</div>
                            <div className="text-[12px] text-gray-500 font-medium mt-0.5">{dept.department_name_hi}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase rounded border border-gray-200 tracking-tighter">
                            {dept.department_id}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Search size={24} className="opacity-20" />
                        <p className="text-[12px] italic">{lang === 'hi' ? 'कोई विभाग नहीं मिला' : 'No departments found'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>{lang === 'hi' ? 'योजना (Scheme)' : 'Scheme'} {requiredSpan}</label>
            <div className="relative">
              <div
                className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.scheme ? 'text-gray-400' : ''}`}
                onClick={() => setShowSchemeOptions(!showSchemeOptions)}
              >
                {formData.scheme || (lang === 'hi' ? '-- योजना चुनें --' : '-- Select Scheme --')}
                <ChevronRight size={16} className={`transform transition-transform ${showSchemeOptions ? 'rotate-90' : ''}`} />
              </div>

              {showSchemeOptions && (
                <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                  <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input
                        type="text"
                        placeholder={lang === 'hi' ? 'योजना खोजें...' : 'Search for a scheme...'}
                        className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                        value={schemeSearch}
                        onChange={(e) => setSchemeSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {filteredSchemes.length > 0 ? filteredSchemes.map((scheme, idx) => (
                      <div
                        key={idx}
                        className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            case_information: {
                              ...prev.case_information,
                              department: scheme.deptNameEn || prev.case_information.department,
                              scheme: scheme.scheme_name_en,
                              complaintCategory: autoSelectCategory(scheme.type)
                            }
                          }));
                          setShowSchemeOptions(false);
                          setSchemeSearch('');
                        }}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="font-bold text-[14px] text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                              {scheme.scheme_name_en}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black rounded border border-gray-200 uppercase tracking-tighter">
                                {scheme.fy || 'FY 24-25'}
                              </span>
                              {!selectedDept && (
                                <span className="px-2 py-0.5 bg-[#002b5e] text-white text-[9px] font-bold rounded-sm shadow-sm">
                                  {scheme.deptNameEn}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-gray-500 font-medium">{scheme.scheme_name_hi}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-blue-600 font-bold uppercase tracking-tight text-[10px]">
                              {scheme.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <Search size={32} className="opacity-20" />
                        <p className="text-[13px] font-medium italic">{lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No matching schemes found'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'शिकायत की श्रेणी' : 'Complaint Category'} {requiredSpan}</label>
          <div className="relative">
            <div
              className={`${inputClass} cursor-pointer flex justify-between items-center ${!formData.complaintCategory ? 'text-gray-400' : 'text-[#002b5e] font-semibold'}`}
              onClick={() => setShowCategoryOptions(!showCategoryOptions)}
            >
              <span>{formData.complaintCategory || (lang === 'hi' ? '-- श्रेणी चुनें --' : '-- Select Category --')}</span>
              <ChevronRight size={16} className={`transform transition-transform ${showCategoryOptions ? 'rotate-90' : ''}`} />
            </div>

            {showCategoryOptions && (
              <div className="absolute z-[70] mt-1 w-full bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'श्रेणी खोजें...' : 'Search category...'}
                      className="w-full pl-10 pr-3 py-2 text-[13px] border border-blue-100 rounded-md focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredCategories.length > 0 ? filteredCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer border-b border-gray-50 last:border-0 transition-all"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          case_information: {
                            ...prev.case_information,
                            complaintCategory: cat
                          }
                        }));
                        setShowCategoryOptions(false);
                        setCategorySearch('');
                      }}
                    >
                      <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{cat}</div>
                    </div>
                  )) : (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Search size={24} className="opacity-20" />
                      <p className="text-[12px] italic">{lang === 'hi' ? 'कोई श्रेणी नहीं मिली' : 'No categories found'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className={labelClass}>{lang === 'hi' ? 'शिकायत / प्रकरण का विवरण' : 'Complaint / Case Description'} {requiredSpan}</label>
          <textarea name="description" value={formData.description} onChange={handleFormChange} rows="5" required placeholder="Enter exact details as written in the Excel sheet..." className={`${inputClass} bg-yellow-50/30 leading-relaxed mb-4`}></textarea>
        </div>
      </div>
    </div>
  );
});

export default CaseSpecifics;
