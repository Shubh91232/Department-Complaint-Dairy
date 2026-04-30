import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { useLanguage } from '../LanguageContext';
import { FileText, Check, RefreshCw, Database, X, MapPin, Activity, ShieldAlert, Calendar, LayoutList } from 'lucide-react';

const ComplainForm = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState('8KFFV2');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    source: 'PR',
    serialNumber: '',
    departmentRef: '',
    financialYear: '2025-2026',
    dateReceived: '',
    district: '',
    block: '',
    panchayat: '',
    level: 'District',
    complaintCategory: '',
    description: '',
    responsibleOfficer: '',
    currentStatus: 'Pending',
    actionTaken: '',
    remarks: '',
    captchaInput: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.captchaInput !== captcha) {
      alert(lang === 'hi' ? 'अमान्य कैप्चा!' : 'Invalid Captcha!');
      generateCaptcha();
      return;
    }
    setShowPreview(true);
  };

  const confirmSubmit = () => {
    alert(lang === 'hi' ? 'रिकॉर्ड सफलतापूर्वक मास्टर सूची में सहेजा गया।' : 'Record successfully saved to Master List.');
    navigate('/');
  };

  // Mock Dropdown Data
  const districts = ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'];
  const blocks = formData.district ? ['Block 1', 'Block 2', 'Block 3'] : [];
  const panchayats = formData.block ? ['Panchayat 1', 'Panchayat 2', 'Panchayat 3'] : [];

  const inputClass = "w-full border border-gray-300 rounded-sm p-2 text-gray-800 focus:outline-none focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] transition-shadow bg-white";
  const labelClass = "block font-bold text-gray-700 text-[12px] mb-1 uppercase tracking-wide";
  const requiredSpan = <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans text-[13px] text-gray-800 flex flex-col relative">
      <Header />
      
      <div className="flex-grow flex justify-center py-10 px-4 md:px-8">
        
        <div className="w-full max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 border-b-2 border-[#1976d2] pb-4 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#002b5e] mb-2 flex items-center gap-3">
                <Database size={32} className="text-[#1976d2]" />
                {lang === 'hi' ? 'मास्टर शिकायत प्रविष्टि (Master Data Entry)' : 'Master Grievance Data Entry'}
              </h1>
              <p className="text-gray-600 text-[14px] font-medium">
                {lang === 'hi' ? 'विभागीय एक्सेल शीट से प्राप्त डेटा को पोर्टल में दर्ज करें।' : 'Digitize and enter offline departmental records into the central database.'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-bold text-[#1976d2] bg-blue-50 px-4 py-2 rounded-sm border border-blue-100">
               <LayoutList size={18}/>
               {lang === 'hi' ? 'रिकॉर्ड प्रारूप: मानक' : 'Record Format: Standard'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (Metadata & Location) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section 1: Record Origin */}
                <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#002b5e] border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <Calendar size={18} className="text-[#1976d2]" />
                    <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'मूल स्रोत और संदर्भ' : 'Origin & Reference'}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'प्राप्ति स्रोत' : 'Source'} {requiredSpan}</label>
                        <select name="source" value={formData.source} onChange={handleChange} required className={inputClass}>
                          <option value="PR">PR (Rural Dev Dept)</option>
                          <option value="CS">CS (Chief Secretary)</option>
                          <option value="HM">HM (Hon. Minister)</option>
                          <option value="Other">Other Meetings</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'वित्तीय वर्ष' : 'Financial Year'} {requiredSpan}</label>
                        <select name="financialYear" value={formData.financialYear} onChange={handleChange} required className={inputClass}>
                          <option value="2024-2025">2024-2025</option>
                          <option value="2025-2026">2025-2026</option>
                          <option value="2026-2027">2026-2027</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'क्र.स. (Serial No.)' : 'Serial No.'} {requiredSpan}</label>
                        <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required className={`${inputClass} bg-yellow-50/50`} />
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'विभागीय संदर्भ क्र.' : 'Dept Ref No.'}</label>
                        <input type="text" name="departmentRef" value={formData.departmentRef} onChange={handleChange} placeholder="e.g. CS-2026-X" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'प्राप्त तिथि' : 'Date Received'} {requiredSpan}</label>
                      <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleChange} required className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Location */}
                <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#e65100] border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <MapPin size={18} className="text-[#e65100]" />
                    <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'भौगोलिक स्थान' : 'Geographic Location'}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'स्तर (Level)' : 'Level'} {requiredSpan}</label>
                      <select name="level" value={formData.level} onChange={handleChange} required className={inputClass}>
                        <option value="State">State Level</option>
                        <option value="District">District Level</option>
                        <option value="Panchayat">Panchayat Level</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'ज़िला (District)' : 'District'} {requiredSpan}</label>
                        <select name="district" value={formData.district} onChange={handleChange} required className={inputClass}>
                          <option value="">-- Select --</option>
                          {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'ब्लॉक (Block)' : 'Block'}</label>
                        <select name="block" value={formData.block} onChange={handleChange} disabled={!formData.district} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                          <option value="">-- Select --</option>
                          {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}</label>
                      <select name="panchayat" value={formData.panchayat} onChange={handleChange} disabled={!formData.block} className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}>
                        <option value="">-- Select --</option>
                        {panchayats.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Case Specifics & Status) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section 3: Case Details */}
                <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#2e7d32] border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <ShieldAlert size={18} className="text-[#2e7d32]" />
                    <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'प्रकरण का विवरण' : 'Case Specifics'}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'शिकायत की श्रेणी' : 'Complaint Category'} {requiredSpan}</label>
                      <select name="complaintCategory" value={formData.complaintCategory} onChange={handleChange} required className={`${inputClass} font-semibold text-[#002b5e]`}>
                        <option value="">-- Select Category --</option>
                        <option value="Financial Irregularity">Financial Irregularity / Fund Misuse</option>
                        <option value="Operational Delay">Operational Delay in Work</option>
                        <option value="Section 38">Section 38 (Panchayati Raj Act 1994)</option>
                        <option value="Quality Issue">Quality Issue in Construction</option>
                        <option value="Payment Pending">Payment Pending / Wage Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'शिकायत / प्रकरण का विवरण' : 'Complaint / Case Description'} {requiredSpan}</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required placeholder="Enter exact details as written in the Excel sheet..." className={`${inputClass} bg-yellow-50/30 leading-relaxed`}></textarea>
                    </div>
                  </div>
                </div>

                {/* Section 4: Enforcement & Status */}
                <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 border-t-[#6a1b9a] border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <Activity size={18} className="text-[#6a1b9a]" />
                    <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'कार्रवाई और वर्तमान स्थिति' : 'Enforcement & Current Status'}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'संबंधित अधिकारी का नाम/पद' : 'Responsible Officer'} {requiredSpan}</label>
                        <input type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleChange} required placeholder="e.g. BDO, Sarpanch, Zila Parishad CEO" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'} {requiredSpan}</label>
                        <select name="currentStatus" value={formData.currentStatus} onChange={handleChange} required className={`${inputClass} font-bold ${
                            formData.currentStatus === 'Pending' ? 'text-red-600' :
                            formData.currentStatus === 'Resolved' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                          <option value="Pending">{lang === 'hi' ? 'लंबित (Pending)' : 'Pending'}</option>
                          <option value="In Progress">{lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress'}</option>
                          <option value="Resolved">{lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved'}</option>
                          <option value="Rejected">{lang === 'hi' ? 'अस्वीकृत (Rejected)' : 'Rejected'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'की गई कार्रवाई / अनुपालना' : 'Action Taken'}</label>
                      <textarea name="actionTaken" value={formData.actionTaken} onChange={handleChange} rows="2" placeholder="Describe actions taken so far..." className={inputClass}></textarea>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === 'hi' ? 'टिप्पणी' : 'Remarks'}</label>
                      <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Additional notes or remarks from the sheet" className={inputClass} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Submit Bar */}
            <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 font-mono tracking-widest font-bold text-[18px] select-none shadow-inner">
                  {captcha}
                </div>
                <button type="button" onClick={generateCaptcha} className="text-[#1976d2] hover:text-[#115293] transition-colors p-2 rounded-full hover:bg-blue-50" title="Refresh Captcha">
                  <RefreshCw size={20} />
                </button>
                <input 
                  type="text" 
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  required
                  placeholder="Enter Captcha"
                  className="border border-gray-300 px-4 py-2 w-40 focus:outline-none focus:border-[#1976d2] rounded-sm"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-[#002b5e] hover:bg-[#001c3d] text-white px-8 py-3 font-bold rounded-sm shadow-md transition-colors text-[14px] flex items-center gap-2 uppercase tracking-wide w-full md:w-auto justify-center"
              >
                <Database size={18} />
                {lang === 'hi' ? 'डेटा सत्यापित करें' : 'Verify Data Entry'}
              </button>
            </div>
          </form>

          {/* Preview Modal Overlay */}
          {showPreview && (
            <div className="fixed inset-0 bg-[#002b5e]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-md shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center z-10">
                  <h2 className="text-lg font-bold text-[#002b5e] flex items-center gap-2"><FileText size={20}/> {lang === 'hi' ? 'डेटा प्रविष्टि सारांश' : 'Data Entry Summary'}</h2>
                  <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
                
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow bg-gray-50">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[14px]">
                    <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                      <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><Calendar size={16} className="text-[#1976d2]"/> Metadata</h3>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium w-1/3">Source</th><td className="py-2 font-semibold">{formData.source}</td></tr>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Serial No</th><td className="py-2 font-semibold text-[#e65100]">{formData.serialNumber}</td></tr>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Fin. Year</th><td className="py-2 font-semibold">{formData.financialYear}</td></tr>
                          <tr><th className="py-2 text-gray-500 font-medium">Received Date</th><td className="py-2 font-semibold">{formData.dateReceived}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                      <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><MapPin size={16} className="text-[#e65100]"/> Location</h3>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium w-1/3">Level</th><td className="py-2 font-semibold">{formData.level}</td></tr>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">District</th><td className="py-2 font-semibold">{formData.district}</td></tr>
                          <tr className="border-b border-gray-50"><th className="py-2 text-gray-500 font-medium">Block</th><td className="py-2 font-semibold">{formData.block || '-'}</td></tr>
                          <tr><th className="py-2 text-gray-500 font-medium">Panchayat</th><td className="py-2 font-semibold">{formData.panchayat || '-'}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                    <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><ShieldAlert size={16} className="text-[#2e7d32]"/> Complaint Details</h3>
                    <div className="mb-4">
                      <span className="text-gray-500 font-medium block mb-1">Category</span>
                      <p className="font-semibold text-lg text-[#002b5e]">{formData.complaintCategory}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">Description</span>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-sm border border-gray-100 whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
                    <h3 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2"><Activity size={16} className="text-[#6a1b9a]"/> Enforcement</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-500 font-medium block mb-1">Responsible Officer</span>
                        <p className="font-semibold">{formData.responsibleOfficer}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium block mb-1">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${
                            formData.currentStatus === 'Pending' ? 'bg-red-100 text-red-800 border border-red-200' :
                            formData.currentStatus === 'Resolved' ? 'bg-green-100 text-green-800 border border-green-200' :
                            'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>{formData.currentStatus}</span>
                      </div>
                    </div>
                    {(formData.actionTaken || formData.remarks) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
                        {formData.actionTaken && (
                          <div>
                            <span className="text-gray-500 font-medium block mb-1">Action Taken</span>
                            <p className="text-gray-800">{formData.actionTaken}</p>
                          </div>
                        )}
                        {formData.remarks && (
                          <div>
                            <span className="text-gray-500 font-medium block mb-1">Remarks</span>
                            <p className="text-gray-800">{formData.remarks}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                </div>
                <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-4 shadow-md z-10">
                  <button onClick={() => setShowPreview(false)} className="px-6 py-2 border border-gray-300 hover:bg-gray-50 font-bold text-gray-700 transition-colors rounded-sm">
                    {lang === 'hi' ? 'संशोधन करें' : 'Edit Info'}
                  </button>
                  <button onClick={confirmSubmit} className="px-8 py-2 bg-[#1976d2] hover:bg-[#115293] font-bold text-white shadow-md flex items-center gap-2 transition-colors rounded-sm">
                    <Check size={18}/> {lang === 'hi' ? 'मास्टर सूची में सहेजें' : 'Save to Master List'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplainForm;