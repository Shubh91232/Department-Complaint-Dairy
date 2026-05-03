import { URLS } from './urls';

// In-memory cache for API responses
const apiCache = new Map();

/**
 * Global GET handler with optional caching
 */
export const getAPI = async (url, useCache = false) => {
  if (useCache && apiCache.has(url)) {
    return apiCache.get(url);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    if (useCache) {
      apiCache.set(url, data);
    }
    
    return data;
  } catch (error) {
    console.error(`Error in GET ${url}:`, error);
    throw error;
  }
};

/**
 * Global POST handler
 */
export const postAPI = async (url, payload = {}) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // We try to parse JSON even if status is not ok, to catch server error messages
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
  } catch (error) {
    console.error(`Error in POST ${url}:`, error);
    throw error;
  }
};

// --- SPECIFIC IMPLEMENTATIONS ---

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
  // Uses global POST handler
  return await postAPI(URLS.AUTH.VERIFY_CAPTCHA, { captcha_jwt: token, captcha_code: code });
};

export const registerDepartmentAPI = async (formData) => {
  return await postAPI(URLS.AUTH.DEPARTMENT_REGISTER, formData);
};

export const fetchDepartmentsAPI = async () => {
  // Uses global GET handler with CACHE enabled (true)
  return await getAPI(URLS.META.DEPARTMENT_LIST, true);
};

export const fetchLevelsAPI = async () => {
  return await getAPI(URLS.META.LEVEL_LIST, true);
};

export const fetchDistrictsAPI = async () => {
  return await getAPI(URLS.META.DISTRICTS, true); // Cache true as districts rarely change
};

export const fetchBlocksAPI = async (districtId) => {
  return await getAPI(URLS.META.BLOCKS(districtId), true);
};

export const fetchGPsAPI = async (blockId) => {
  return await getAPI(URLS.META.GPS(blockId), true);
};
