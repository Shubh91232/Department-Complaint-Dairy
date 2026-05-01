import { URLS } from './urls';

export const fetchCaptchaImageAPI = async () => {
  try {
    const res = await fetch(URLS.AUTH.CAPTCHA);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching captcha:', error);
    throw error;
  }
};

export const verifyCaptchaCodeAPI = async (token, code) => {
  try {
    const res = await fetch(URLS.AUTH.VERIFY_CAPTCHA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, code })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    throw error;
  }
};
