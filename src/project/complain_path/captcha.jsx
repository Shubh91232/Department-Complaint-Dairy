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
  const [error, setError] = useState(false);
  const isFetchingRef = React.useRef(false);
  const onCodeChangeRef = React.useRef(onCodeChange);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  const fetchCaptcha = React.useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      setError(false);
      const data = await fetchCaptchaImageAPI();
      if (data && data.success) {
        setCaptchaData({ token: data.token, image: data.image });
        setInputValue('');
        if (onCodeChangeRef.current) onCodeChangeRef.current('', data.token);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchCaptcha,
    getToken: () => captchaData.token
  }));

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInputValue(val);
    if (onCodeChange) onCodeChange(val, captchaData.token);
  };

  return (
    <div className="w-full">
      <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Security Code / Captcha <span className="text-red-500">*</span></label>
      <div className="flex gap-2 items-stretch flex-wrap sm:flex-nowrap">
        <div className="flex gap-2 shrink-0">
          <div className="border border-gray-300 rounded-sm bg-gray-50 flex items-center justify-center w-[110px] overflow-hidden h-[38px]">
            {error ? (
              <span className="text-[10px] text-red-500 font-bold text-center leading-tight">Load Error</span>
            ) : captchaData.image ? (
              <img src={captchaData.image} alt="captcha" className="w-full h-full object-cover mix-blend-multiply" />
            ) : (
              <span className="text-gray-400 text-xs">...</span>
            )}
          </div>
          <button type="button" onClick={fetchCaptcha} className="bg-white border border-gray-300 rounded-sm hover:bg-gray-100 px-2.5 text-gray-600 transition-colors cursor-pointer h-[38px]">
            <RefreshCw size={16} />
          </button>
        </div>
        <input
          required
          type="text"
          placeholder="ENTER CODE"
          className="flex-1 min-w-0 w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:border-[#002b5e] uppercase transition-colors h-[38px]"
          value={inputValue}
          onChange={handleChange}
          maxLength={6}
        />
      </div>
    </div>
  );
});

export default Captcha;