// export const BASE_URL = 'http://localhost:5000/api';
export const BASE_URL = 'http://192.168.1.43:5000/api'; 

export const URLS = {
  AUTH: {
    CAPTCHA: `${BASE_URL}/auth/captcha/generate`,
    VERIFY_CAPTCHA: `${BASE_URL}/auth/captcha/verify`,
    DEPARTMENT_REGISTER: `${BASE_URL}/auth/department-register`,
    DEPARTMENT_LOGIN: `${BASE_URL}/auth/department-login`,
  },
  META: {
    DEPARTMENT_LIST: `${BASE_URL}/department_list`,
    LEVEL_LIST: `${BASE_URL}/level_list`,
    DISTRICTS: `${BASE_URL}/locations/districts`,
    BLOCKS: (districtId) => `${BASE_URL}/locations/blocks/${districtId}`,
    GPS: (blockId) => `${BASE_URL}/locations/gps/${blockId}`
  },
  COMPLAINTS: {
    SUBMIT: `${BASE_URL}/complaints/submit`,
    DRAFT: `${BASE_URL}/complaints/draft`,
    DRAFTS: `${BASE_URL}/complaints/drafts`,
    DEPARTMENTS_LIST: `${BASE_URL}/complaints/departments`,
    CATEGORIES_LIST: `${BASE_URL}/complaints/categories`
  }
};
