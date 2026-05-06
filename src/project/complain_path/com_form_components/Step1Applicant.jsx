import { User, Database, Shield, Clock, Smartphone, Home, ArrowRight, Info, LayoutList } from 'lucide-react';

const Step1Applicant = ({
  lang,
  shortDraftId,
  activeUser,
  applicantData,
  handleApplicantChange,
  handleProceed,
  labelClass,
  inputClass,
  requiredSpan
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        {shortDraftId && (
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-sm text-[11px] font-bold ml-4 border border-orange-200">
            <Database size={12} />
            DRAFT: {shortDraftId}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Officer Details Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white text-black p-5 rounded-sm shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <User size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-2">
              <Shield size={20} className="text-orange-400" />
              <h2 className="font-bold text-[14px] uppercase tracking-widest">{lang === 'hi' ? 'प्रविष्टि अधिकारी' : 'Entry Officer'}</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Officer Name</label>
                <p className="font-bold text-[15px]">{activeUser?.name || 'Nodal Officer'}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Department / ID</label>
                <p className="font-bold text-[13px] text-gray-500 tracking-wide">{activeUser?.department || 'Rural Development'} / {activeUser?.id || 'OFF-001'}</p>
              </div>
              <div className="pt-2">
                <div className="bg-white/10 px-3 py-2 rounded-sm border border-white/10">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <Clock size={14} className="text-orange-400" />
                    <span>Session Active: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
            <h3 className="font-bold text-[#002b5e] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
              <LayoutList size={16} /> {lang === 'hi' ? 'दिशानिर्देश' : 'Guidelines'}
            </h3>
            <ul className="space-y-2 text-[11px] text-gray-500 font-medium">
              <li className="flex gap-2">
                <span className="text-[#1976d2]">•</span>
                <span>{lang === 'hi' ? 'सभी फ़ील्ड स्पष्ट अक्षरों में भरें।' : 'Fill all fields in clear block letters.'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1976d2]">•</span>
                <span>{lang === 'hi' ? 'आधार या पहचान पत्र से नाम का मिलान करें।' : 'Verify name with ID proof if available.'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1976d2]">•</span>
                <span>{lang === 'hi' ? 'मोबाइल नंबर पर OTP प्राप्त हो सकता है।' : 'Mobile number may receive OTP updates.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Complainant Form */}
        <div className="lg:col-span-8">

          <div className="bg-white p-6 md:p-6 rounded-sm shadow-sm border border-gray-200">

            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-gray-200 pb-4 mb-4">
                <div className="bg-blue-50 p-1.5 rounded-full text-[#1976d2]">
                  <Info size={18} strokeWidth={2.5} className='text-gray-500' />
                </div>
                <h3 className="text-[#002b5e] font-bold text-[14px]">
                  {lang === 'hi' ? 'कृपया परिवादी का विवरण दर्ज करें (यदि उपलब्ध हो)।' : 'Please enter the complainant details (if available).'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <label className={labelClass}>{lang === 'hi' ? 'परिवादी का नाम' : 'Complainant Name'} {requiredSpan}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={applicantData.name}
                      onChange={handleApplicantChange}
                      placeholder="Full Name"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} {requiredSpan}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Smartphone size={16} />
                    </div>
                    <input
                      type="text"
                      name="mobile"
                      value={applicantData.mobile}
                      onChange={handleApplicantChange}
                      placeholder="10-digit mobile number"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>{lang === 'hi' ? 'परिवादी का पता' : 'Complainant Address'} {requiredSpan}</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 pointer-events-none text-gray-400">
                    <Home size={16} />
                  </div>
                  <textarea
                    name="address"
                    value={applicantData.address}
                    onChange={handleApplicantChange}
                    rows="3"
                    placeholder="Complete residential address"
                    className={`${inputClass} pl-10 pt-2`}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <p className="text-[11px] text-gray-400 font-medium italic">
                  {lang === 'hi' ? '* सभी जानकारी सुरक्षित और गोपनीय है।' : '* All information is securely encrypted.'}
                </p>
                <button
                  onClick={handleProceed}
                  className="bg-[#002b5e] hover:bg-[#001c3d] text-white px-10 py-3 rounded-sm font-black uppercase tracking-widest text-[13px] shadow-lg transition-all flex items-center gap-3"
                >
                  {lang === 'hi' ? 'अगला चरण' : 'Next Step'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Applicant;
