export const BASE_URL = 'http://localhost:5000/api';

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
  }
};
