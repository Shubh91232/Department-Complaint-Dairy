import { URLS } from './urls';

export const fetchCaptchaImageAPI = async () => {
  try {
    const res = await fetch(URLS.AUTH.CAPTCHA);
    if (!res.ok) throw new Error('Failed to fetch captcha');
    
    // Read the JWT from the custom header
    const token = res.headers.get('x-captcha-jwt');
    
    // Read the raw image binary
    const blob = await res.blob();
    const image = URL.createObjectURL(blob);
    
    return { success: true, token, image };
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
      body: JSON.stringify({ captcha_jwt: token, captcha_code: code })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    throw error;
  }
};
