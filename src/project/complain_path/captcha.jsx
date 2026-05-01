import React from 'react';
import { RefreshCw } from 'lucide-react';

export const generateCaptchaString = () => {
  // Removed lowercase letters to avoid confusion with the uppercase input field
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const Captcha = ({ captcha, onRefresh, value, onChange }) => {
  return (
    <div className="w-full">
      <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Security Code / Captcha <span className="text-red-500">*</span></label>
      <div className="flex gap-2 items-stretch max-w-sm">
        <div className="border border-gray-300 rounded-sm bg-gray-50 text-gray-800 px-3 py-1.5 text-[14px] font-mono tracking-widest w-24 text-center select-none shadow-inner" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 L100 30 M0 30 L100 10\' stroke=\'rgba(0,0,0,0.1)\' stroke-width=\'2\'/%3E%3C/svg%3E")' }}>
          {captcha}
        </div>
        <button type="button" onClick={onRefresh} className="bg-white border border-gray-300 rounded-sm hover:bg-gray-100 px-2 text-gray-600 transition-colors cursor-pointer">
          <RefreshCw size={14} />
        </button>
        <input
          required
          type="text"
          placeholder="Enter Code"
          className="flex-1 border border-gray-300 rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#002b5e] uppercase transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          maxLength={5}
        />
      </div>
    </div>
  );
};

export default Captcha;