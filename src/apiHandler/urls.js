export const BASE_URL = 'http://localhost:5000/api';
export const SERVER_URL = 'http://localhost:5000';
// export const BASE_URL = 'http://192.168.1.43:5000/api';
// export const BASE_URL = 'https://geotag-api.geoplanetsolution.in/api';
// export const SERVER_URL = 'https://geotag-api.geoplanetsolution.in';


export const URLS = {
  AUTH: {
    CAPTCHA: `${BASE_URL}/auth/captcha/generate`,
    VERIFY_CAPTCHA: `${BASE_URL}/auth/captcha/verify`,
    DEPARTMENT_REGISTER: `${BASE_URL}/auth/department-register`,
    DEPARTMENT_LOGIN: `${BASE_URL}/auth/department-login`,
    VERIFY_TOKEN: `${BASE_URL}/auth/verify-token`,
  },
  META: {
    DEPARTMENT_LIST: `${BASE_URL}/department_list`,
    LEVEL_LIST: `${BASE_URL}/level_list`,
    SOURCE_LIST: `${BASE_URL}/source_list`,
    DISTRICTS: `${BASE_URL}/locations/districts`,
    BLOCKS: (districtId) => `${BASE_URL}/locations/blocks/${districtId}`,
    GPS: (blockId) => `${BASE_URL}/locations/gps/${blockId}`,
    SEARCH_GP: (query) => `${BASE_URL}/locations/search-gp?q=${query}`
  },
  COMPLAINTS: {
    SUBMIT: `${BASE_URL}/complaints/submit`,
    DRAFT: `${BASE_URL}/complaints/draft`,
    DRAFTS: `${BASE_URL}/complaints/drafts`,
    DEPARTMENTS_LIST: `${BASE_URL}/complaints/departments`,
    FINANCIAL_YEARS: `${BASE_URL}/complaints/financial-years`,
    SCHEMES_LIST: `${BASE_URL}/complaints/schemes`,
    CATEGORIES_LIST: `${BASE_URL}/complaints/categories`,
    HISTORY: `${BASE_URL}/complaints/history`,
    DELETE_DRAFT: (id) => `${BASE_URL}/complaints/draft/${id}`,
    DRAFT_BY_ID: (id) => `${BASE_URL}/complaints/draft/${id}`,
    DUPLICATE_CHECKER: `${BASE_URL}/complaints/duplicateComplainChecker`,
    SAVE_DUPLICACY: `${BASE_URL}/complaints/saveDuplicacyDetails`,
    TRACK: (id) => `${BASE_URL}/complaints/track/${id}`,
    UPDATE_TRACK: `${BASE_URL}/complaints/update-track`,
    STATUS_LIST: `${BASE_URL}/complaints/statuses`,
    SEARCH: `${BASE_URL}/complaints/search`,
    DELETE_COMPLAINT: (id) => `${BASE_URL}/complaints/${id}`,
    UPDATE_COMPLAINT: (id) => `${BASE_URL}/complaints/${id}`
  }
};
