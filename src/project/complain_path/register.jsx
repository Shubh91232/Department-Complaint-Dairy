import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../head_foot/head';
import Footer from '../head_foot/foot';
import { User, Mail, Phone, Briefcase, MapPin, Building, CheckCircle, ArrowLeft, Shield, ChevronDown, Search } from 'lucide-react';
import Captcha, { verifyCaptcha } from './captcha';
import { fetchDepartmentsAPI } from '../../apiHandler/apis';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    department: '',
    designation: '',
    email: '',
    mobile: '',
    district: '',
    level: '',
    officeState: 'Rajasthan',
    officeDistrict: '',
    officeBlock: '',
    officeGp: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const captchaRef = React.useRef(null);
  const [captchaData, setCaptchaData] = useState({ code: '', token: '' });
  const [departments, setDepartments] = useState([]);
  
  // Custom Dropdown State
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');
  const deptDropdownRef = React.useRef(null);
  const fetchingDeptsRef = React.useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target)) {
        setIsDeptDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDepartments = React.useMemo(() => {
    return departments.filter(dept => 
      dept.label.toLowerCase().includes(deptSearchTerm.toLowerCase()) ||
      dept.value.toLowerCase().includes(deptSearchTerm.toLowerCase())
    );
  }, [departments, deptSearchTerm]);

  useEffect(() => {
    const loadDepartments = async () => {
      if (fetchingDeptsRef.current) return;
      fetchingDeptsRef.current = true;
      try {
        const response = await fetchDepartmentsAPI();
        if (response && response.success) {
          setDepartments(response.data);
        }
      } catch (err) {
        console.error('Failed to load departments');
      } finally {
        fetchingDeptsRef.current = false;
      }
    };
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaData.code) {
      alert("Please enter captcha code.");
      return;
    }
    const isValid = await verifyCaptcha(captchaData.token, captchaData.code);
    if (!isValid) {
      alert("Invalid Captcha code! Please try again.");
      captchaRef.current?.refresh();
      return;
    }
    // In a real app, send data to backend here.
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[13px] text-gray-800 flex flex-col relative">
      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center transform transition-all animate-bounce-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-green-200">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#002b5e] mb-2">Registration Submitted</h3>
            <p className="text-gray-600 text-[14px] mb-6">
              Your information has been sent to the admin. The department will approve your request in a few days.
            </p>
            <button 
              onClick={closeSuccess}
              className="w-full bg-[#1e7b34] text-white py-2.5 rounded-sm font-bold shadow-sm hover:bg-[#145a24] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <Header />

      <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="bg-white shadow-sm border border-gray-300 rounded-md max-w-2xl w-full overflow-hidden">
          <div className="bg-[#002b5e] text-white px-6 py-4 flex items-center justify-between border-b-[3px] border-[#e65100]">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide">Departmental User Registration</h2>
              <p className="text-blue-200 text-[12px]">Request access to the administrative portal</p>
            </div>
            <button onClick={() => navigate('/')} className="text-blue-200 hover:text-white transition-colors flex items-center gap-1 text-[12px] font-bold bg-white/10 px-3 py-1.5 rounded-sm border border-white/20">
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><User size={16} /></span>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>

              {/* Employee ID */}
              <div>
                <label htmlFor="empId" className="text-[12px] font-semibold text-gray-700 block mb-1.5">Employee ID (SSO) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Briefcase size={16} /></span>
                  <input required id="empId" type="text" name="empId" autoComplete="username" value={formData.empId} onChange={handleChange} placeholder="Enter Employee ID" className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white uppercase" />
                </div>
              </div>

              {/* Department */}
              <div ref={deptDropdownRef}>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Department <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div 
                    onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    className="w-full border border-gray-300 rounded-sm pl-9 pr-8 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 hover:bg-white cursor-pointer min-h-[38px] flex items-center"
                  >
                    <span className="absolute left-3 top-2.5 text-gray-400"><Building size={16} /></span>
                    <span className={`text-[13px] ${formData.department ? 'text-gray-800' : 'text-gray-500'}`}>
                      {formData.department ? departments.find(d => d.value === formData.department)?.label : 'Select Department'}
                    </span>
                    <span className="absolute right-3 top-3 text-gray-500 pointer-events-none"><ChevronDown size={14} /></span>
                  </div>

                  {isDeptDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg">
                      <div className="p-2 border-b border-gray-200 relative">
                        <span className="absolute left-4 top-4 text-gray-400"><Search size={14} /></span>
                        <input
                          type="text"
                          placeholder="Search department..."
                          className="w-full pl-8 pr-2 py-1.5 text-[12px] border border-gray-300 rounded-sm focus:outline-none focus:border-[#002b5e]"
                          value={deptSearchTerm}
                          onChange={(e) => setDeptSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((dept) => (
                            <div 
                              key={dept.id} 
                              className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-[#f0f4f8] transition-colors ${formData.department === dept.value ? 'bg-[#e6f0ff] font-semibold text-[#002b5e]' : 'text-gray-700'}`}
                              onClick={() => {
                                setFormData({ ...formData, department: dept.value });
                                setIsDeptDropdownOpen(false);
                                setDeptSearchTerm('');
                              }}
                            >
                              {dept.label}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-[12px] text-gray-500 text-center">No departments found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Designation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><User size={16} /></span>
                  <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Nodal Officer" className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Official Email ID <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Mail size={16} /></span>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@rajasthan.gov.in" className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Phone size={16} /></span>
                  <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile number" pattern="[0-9]{10}" maxLength="10" className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>

              {/* Access Level */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Access Role Level <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Shield size={16} /></span>
                  <select required name="level" value={formData.level} onChange={handleChange} className="w-full border border-gray-300 rounded-sm pl-9 pr-8 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                    <option value="">Select Level</option>
                    <option value="Level 1">Level 1 - State Admin</option>
                    <option value="Level 2">Level 2 - District Admin</option>
                    <option value="Level 3">Level 3 - Nodal Officer</option>
                    <option value="Level 4">Level 4 - Executive/Clerk</option>
                  </select>
                  <span className="absolute right-3 top-3 text-gray-500 pointer-events-none"><ChevronDown size={14} /></span>
                </div>
              </div>

              {/* Office Location Section Header */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-[14px] font-bold text-[#002b5e] border-b border-gray-200 pb-2 mb-1 flex items-center gap-2">
                  <Building size={16} className="text-[#e65100]" /> Current Office Address
                </h3>
              </div>

              {/* State (Fixed) */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">State <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><MapPin size={16} /></span>
                  <input required readOnly type="text" name="officeState" value={formData.officeState} className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 bg-gray-100 text-gray-600 font-semibold cursor-not-allowed" />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">District <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><MapPin size={16} /></span>
                  <select required name="officeDistrict" value={formData.officeDistrict} onChange={handleChange} className="w-full border border-gray-300 rounded-sm pl-9 pr-8 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                    <option value="">Select District</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Ajmer">Ajmer</option>
                  </select>
                  <span className="absolute right-3 top-3 text-gray-500 pointer-events-none"><ChevronDown size={14} /></span>
                </div>
              </div>

              {/* Block */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Block/Tehsil <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><MapPin size={16} /></span>
                  <select required name="officeBlock" value={formData.officeBlock} onChange={handleChange} className="w-full border border-gray-300 rounded-sm pl-9 pr-8 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                    <option value="">Select Block</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                  <span className="absolute right-3 top-3 text-gray-500 pointer-events-none"><ChevronDown size={14} /></span>
                </div>
              </div>

              {/* Gram Panchayat (GP) */}
              <div>
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Gram Panchayat (GP) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><MapPin size={16} /></span>
                  <select required name="officeGp" value={formData.officeGp} onChange={handleChange} className="w-full border border-gray-300 rounded-sm pl-9 pr-8 py-2 focus:outline-none focus:border-[#002b5e] focus:ring-1 focus:ring-[#002b5e] transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                    <option value="">Select GP</option>
                    <option value="GP 1">GP 1</option>
                    <option value="GP 2">GP 2</option>
                    <option value="GP 3">GP 3</option>
                  </select>
                  <span className="absolute right-3 top-3 text-gray-500 pointer-events-none"><ChevronDown size={14} /></span>
                </div>
              </div>

              {/* Captcha */}
              <div className="md:col-span-2 mt-2">
                <Captcha 
                  ref={captchaRef}
                  onCodeChange={(code, token) => setCaptchaData({ code, token })}
                />
              </div>

            </div>

            <div className="bg-[#fff8e1] border border-orange-200 p-4 rounded-sm text-[12px] text-gray-700 mt-2">
              <span className="font-bold text-[#e65100]">Note:</span> Registration requests are subject to approval by the central administration. Ensure all provided details exactly match your official departmental records to avoid rejection.
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/')} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-[#1e7b34] border border-[#145a24] text-white rounded-sm font-bold shadow-sm hover:bg-[#145a24] transition-colors flex items-center gap-2">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
      
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default Register;