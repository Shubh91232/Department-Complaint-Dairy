import React, { useState, useEffect } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';

const EnforcementStatus = React.memo(({ lang, formData, handleFormChange, labelClass, inputClass, requiredSpan }) => {
  const [stateInvestigators, setStateInvestigators] = useState([{ name: '', post: '', phone: '' }]);
  const [districtMails, setDistrictMails] = useState([{ mail: '' }]);
  const [departments, setDepartments] = useState([{ type: '', mail: '' }]);

  // Sync to formData when local state changes (optional, but good for completeness)
  useEffect(() => {
    handleFormChange({ target: { name: 'stateInvestigators', value: JSON.stringify(stateInvestigators) } });
  }, [stateInvestigators]);

  useEffect(() => {
    handleFormChange({ target: { name: 'districtMails', value: JSON.stringify(districtMails) } });
  }, [districtMails]);

  useEffect(() => {
    handleFormChange({ target: { name: 'departments', value: JSON.stringify(departments) } });
  }, [departments]);

  const addStateInvestigator = () => setStateInvestigators([...stateInvestigators, { name: '', post: '', phone: '' }]);
  const removeStateInvestigator = (idx) => setStateInvestigators(stateInvestigators.filter((_, i) => i !== idx));
  const updateStateInvestigator = (idx, field, val) => {
    const arr = [...stateInvestigators];
    arr[idx][field] = val;
    setStateInvestigators(arr);
  };

  const addDistrictMail = () => setDistrictMails([...districtMails, { mail: '' }]);
  const removeDistrictMail = (idx) => setDistrictMails(districtMails.filter((_, i) => i !== idx));
  const updateDistrictMail = (idx, val) => {
    const arr = [...districtMails];
    arr[idx].mail = val;
    setDistrictMails(arr);
  };

  const addDepartment = () => setDepartments([...departments, { type: '', mail: '' }]);
  const removeDepartment = (idx) => setDepartments(departments.filter((_, i) => i !== idx));
  const updateDepartment = (idx, field, val) => {
    const arr = [...departments];
    arr[idx][field] = val;
    setDepartments(arr);
  };

  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Activity size={18} className="text-[#6a1b9a]" />
        <h2 className="font-bold text-[15px] text-[#002b5e]">{lang === 'hi' ? 'कार्रवाई और वर्तमान स्थिति' : 'Enforcement & Current Status'}</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'जांच स्तर' : 'Investigating Level'}</label>
            <select name="investigatingType" value={formData.investigatingType || ''} onChange={handleFormChange} className={inputClass}>
              <option value="">{lang === 'hi' ? 'चयन करें...' : 'Select...'}</option>
              <option value="State">{lang === 'hi' ? 'राज्य' : 'State'}</option>
              <option value="District">{lang === 'hi' ? 'जिला' : 'District'}</option>
              <option value="Department">{lang === 'hi' ? 'विभाग स्तर' : 'Department Level'}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'संबंधित अधिकारी का नाम/पद' : 'Investigating Officer'} {requiredSpan}</label>
            <input type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleFormChange} required placeholder="e.g. BDO, Sarpanch, Zila Parishad CEO" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{lang === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'} {requiredSpan}</label>
            <select name="caseStatus" value={formData.caseStatus} onChange={handleFormChange} required className={`${inputClass} font-bold ${formData.caseStatus === 'Pending' ? 'text-red-600' :
              formData.caseStatus === 'Resolved' ? 'text-green-600' :
                'text-blue-600'
              }`}>
              <option value="Pending">{lang === 'hi' ? 'लंबित (Pending)' : 'Pending'}</option>
              <option value="In Progress">{lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress'}</option>
              <option value="Resolved">{lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved'}</option>
              <option value="Rejected">{lang === 'hi' ? 'अस्वीकृत (Rejected)' : 'Rejected'}</option>
            </select>
          </div>
        </div>

        {formData.investigatingType === 'State' && (
          <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
            {stateInvestigators.map((investigator, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'व्यक्ति का नाम' : 'People Name'}</label>
                  <input type="text" value={investigator.name} onChange={(e) => updateStateInvestigator(idx, 'name', e.target.value)} placeholder="Enter name" className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'पद' : 'Post'}</label>
                  <input type="text" value={investigator.post} onChange={(e) => updateStateInvestigator(idx, 'post', e.target.value)} placeholder="Enter post" className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}</label>
                  <input type="text" value={investigator.phone} onChange={(e) => updateStateInvestigator(idx, 'phone', e.target.value)} placeholder="Enter phone number" className={inputClass} />
                </div>
                {stateInvestigators.length > 1 && (
                  <button type="button" onClick={() => removeStateInvestigator(idx)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 mb-[2px]">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStateInvestigator} className="flex items-center gap-1 text-[#1976d2] font-bold text-[13px] hover:underline mt-2">
              <Plus size={16} /> {lang === 'hi' ? 'और जोड़ें' : 'Add More'}
            </button>
          </div>
        )}

        {formData.investigatingType === 'District' && (
          <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
            {districtMails.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 items-end w-full md:w-1/2">
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'सीओ ईमेल' : 'CO Mail'}</label>
                  <input type="email" value={item.mail} onChange={(e) => updateDistrictMail(idx, e.target.value)} placeholder="Enter CO mail" className={inputClass} />
                </div>
                {districtMails.length > 1 && (
                  <button type="button" onClick={() => removeDistrictMail(idx)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 mb-[2px]">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDistrictMail} className="flex items-center gap-1 text-[#1976d2] font-bold text-[13px] hover:underline mt-2">
              <Plus size={16} /> {lang === 'hi' ? 'और जोड़ें' : 'Add More'}
            </button>
          </div>
        )}

        {formData.investigatingType === 'Department' && (
          <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
            {departments.map((dept, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'विभाग प्रकार' : 'Department Type'}</label>
                  <select value={dept.type} onChange={(e) => updateDepartment(idx, 'type', e.target.value)} className={inputClass}>
                    <option value="">{lang === 'hi' ? 'चयन करें...' : 'Select Type...'}</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Technical">Technical</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className={labelClass}>{lang === 'hi' ? 'विभागीय ईमेल' : 'Dept Mail'}</label>
                  <input type="email" value={dept.mail} onChange={(e) => updateDepartment(idx, 'mail', e.target.value)} placeholder="Enter department mail" className={inputClass} />
                </div>
                {departments.length > 1 && (
                  <button type="button" onClick={() => removeDepartment(idx)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 mb-[2px]">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addDepartment} className="flex items-center gap-1 text-[#1976d2] font-bold text-[13px] hover:underline mt-2">
              <Plus size={16} /> {lang === 'hi' ? 'और जोड़ें' : 'Add More'}
            </button>
          </div>
        )}

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
