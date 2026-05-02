export const BASE_URL = 'http://localhost:5000/api';

export const URLS = {
  AUTH: {
    CAPTCHA: `${BASE_URL}/auth/captcha/generate`,
    VERIFY_CAPTCHA: `${BASE_URL}/auth/captcha/verify`,
  }
};
