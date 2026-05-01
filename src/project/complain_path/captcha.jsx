import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchCaptchaImageAPI, verifyCaptchaCodeAPI } from '../../apiHandler/apis';

export const verifyCaptcha = async (token, code) => {
  try {
    const data = await verifyCaptchaCodeAPI(token, code);
    return data.success;
  } catch (e) {
    return false;
  }
};

const Captcha = forwardRef(({ onCodeChange }, ref) => {
  const [captchaData, setCaptchaData] = useState({ token: '', image: '' });
  const [inputValue, setInputValue] = useState('');

  const fetchCaptcha = async () => {
    try {
      const data = await fetchCaptchaImageAPI();
      if (data.success) {
        setCaptchaData({ token: data.token, image: data.image });
        setInputValue('');
        if (onCodeChange) onCodeChange('', data.token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchCaptcha,
    getToken: () => captchaData.token
  }));

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInputValue(val);
    if (onCodeChange) onCodeChange(val, captchaData.token);
  };

  return (
    <div className="w-full">
      <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Security Code / Captcha <span className="text-red-500">*</span></label>
      <div className="flex gap-2 items-stretch max-w-sm">
        <div className="border border-gray-300 rounded-sm bg-gray-50 flex items-center justify-center p-0.5 w-24 overflow-hidden h-[34px]">
          {captchaData.image ? <img src={captchaData.image} alt="captcha" className="h-full mix-blend-multiply" /> : '...'}
        </div>
        <button type="button" onClick={fetchCaptcha} className="bg-white border border-gray-300 rounded-sm hover:bg-gray-100 px-2 text-gray-600 transition-colors cursor-pointer h-[34px]">
          <RefreshCw size={14} />
        </button>
        <input
          required
          type="text"
          placeholder="Enter Code"
          className="flex-1 border border-gray-300 rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#002b5e] uppercase transition-colors h-[34px]"
          value={inputValue}
          onChange={handleChange}
          maxLength={6}
        />
      </div>
    </div>
  );
});

export default Captcha;