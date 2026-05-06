import React from 'react';
import { Activity, X, CheckCircle, UploadCloud } from 'lucide-react';

const AdvancedDetailsModal = ({
  lang,
  showAdvancedDetails,
  setShowAdvancedDetails,
  formData,
  setFormData,
  advancedDocs,
  setAdvancedDocs,
  handleFormChange,
  inputClass
}) => {
  if (!showAdvancedDetails) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-3 text-orange-600">
            <Activity size={22} className="animate-pulse" />
            <div>
              <h2 className="font-black text-[16px] text-gray-900 uppercase tracking-tight">{lang === 'hi' ? 'अग्रिम प्रशासनिक विवरण' : 'Advanced Administrative Details'}</h2>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{lang === 'hi' ? 'गोपनीय प्रशासनिक पहुंच' : 'Confidential Administrative Access'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedDetails(false)}
            className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-colors border border-transparent hover:border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-grow p-6 overflow-y-auto no-scrollbar bg-gray-50/30">
          <div className="space-y-8">
            {/* Action Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'accountFreeze', label: 'Account Freeze Action', hi: 'खाता फ्रीज कार्रवाई' },
                { id: 'firInstruction', label: 'FIR Instruction Issued', hi: 'FIR निर्देश जारी' },
                { id: 'deptLetter', label: 'Dept Letter Issued', hi: 'विभागीय पत्र जारी' },
                { id: 'showCauseNotice', label: 'Show Cause Issued', hi: 'कारण बताओ नोटिस' },
                { id: 'suspensionOrdered', label: 'Suspension Ordered', hi: 'निलंबन आदेश' },
                { id: 'terminationOrdered', label: 'Termination Ordered', hi: 'सेवा समाप्ति आदेश' },
              ].map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[14px] text-gray-800">{lang === 'hi' ? item.hi : item.label}</span>
                    <div className="flex gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
                      {['Yes', 'No'].map(opt => {
                        const section = ['accountFreeze', 'firInstruction', 'deptLetter'].includes(item.id) ? 'AccountStatus' : 'LegalActionStatus';
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              [section]: {
                                ...prev[section],
                                [item.id]: opt
                              }
                            }))}
                            className={`px-4 py-1.5 rounded-md font-black text-[10px] uppercase transition-all ${formData[section][item.id] === opt ? 'bg-orange-600 text-white shadow-sm' : 'bg-transparent text-gray-400'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-50">
                    {(() => {
                      const section = ['accountFreeze', 'firInstruction', 'deptLetter'].includes(item.id) ? 'AccountStatus' : 'LegalActionStatus';
                      if (formData[section][item.id] === 'Yes') {
                        return (
                          <div className="animate-in slide-in-from-top-2 duration-300">
                            {advancedDocs[item.id] ? (
                              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3">
                                  <CheckCircle size={18} className="text-green-600" />
                                  <div>
                                    <p className="text-[11px] font-black text-green-700 truncate max-w-[150px]">{advancedDocs[item.id]?.name || (typeof advancedDocs[item.id] === 'string' ? advancedDocs[item.id].split('/').pop() : 'Document')}</p>
                                    <p className="text-[9px] text-green-600/70 font-bold uppercase tracking-widest">Document Verified</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => setAdvancedDocs(prev => { const next = { ...prev }; delete next[item.id]; return next; })} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer group block">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setAdvancedDocs(prev => ({ ...prev, [item.id]: file }));
                                  }}
                                />
                                <div className="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-200 rounded-lg group-hover:border-orange-400 group-hover:bg-orange-50/50 transition-all">
                                  <UploadCloud size={18} className="text-gray-300 group-hover:text-orange-600" />
                                  <span className="text-[12px] font-bold text-gray-400 group-hover:text-orange-600 uppercase tracking-wide">{lang === 'hi' ? 'प्रमाण पत्र अपलोड करें' : 'Upload Support Doc'}</span>
                                </div>
                              </label>
                            )}
                          </div>
                        );
                      }
                      return <p className="text-[10px] text-gray-400 italic">No document required for 'No' status.</p>;
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantitative Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Status & Legal</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'जांच रिपोर्ट की स्थिति' : 'Enquiry Report Status'}</label>
                    <select name="enquiryStatus" value={formData.AccountStatus.enquiryStatus} onChange={(e) => handleFormChange(e, 'AccountStatus')} className={`${inputClass} !bg-gray-50 border-gray-200`}>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'दर्ज FIR की संख्या' : 'Number of FIR Cases Filed'}</label>
                    <input type="number" name="firCasesFiled" value={formData.LegalActionStatus.firCasesFiled} onChange={(e) => handleFormChange(e, 'LegalActionStatus')} placeholder="e.g. 5" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Financial Recovery</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'वसूली योग्य राशि' : 'Recoverable Amount (₹)'}</label>
                    <input type="number" name="recoverableAmount" value={formData.FinancialStatus.recoverableAmount} onChange={(e) => handleFormChange(e, 'FinancialStatus')} placeholder="Enter amount" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">{lang === 'hi' ? 'वसूली की गई राशि' : 'Amount Recovered (₹)'}</label>
                    <input type="number" name="amountRecovered" value={formData.FinancialStatus.amountRecovered} onChange={(e) => handleFormChange(e, 'FinancialStatus')} placeholder="Enter amount" className={`${inputClass} !bg-gray-50 border-gray-200`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
          <button
            type="button"
            onClick={() => setShowAdvancedDetails(false)}
            className="bg-[#002b5e] text-white px-10 py-3 rounded-lg font-black text-[14px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-[#001c3d] transition-all transform active:scale-95"
          >
            {lang === 'hi' ? 'सहेजें और बंद करें' : 'Done & Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDetailsModal;
