import { URLS, SERVER_URL } from './urls';
export { SERVER_URL };

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
 * Global GET handler with Authorization (Bearer token)
 */
export const getAuthAPI = async (url) => {
  try {
    const userData = JSON.parse(localStorage.getItem('agentUserData') || '{}');
    const token = userData.accessToken;
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'GET', headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
  } catch (error) {
    console.error(`Error in Auth GET ${url}:`, error);
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

/**
 * Global POST handler with Authorization (Bearer token)
 */
export const postAuthAPI = async (url, payload = {}) => {
  try {
    const userData = JSON.parse(localStorage.getItem('agentUserData') || '{}');
    const token = userData.accessToken;
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
  } catch (error) {
    console.error(`Error in Auth POST ${url}:`, error);
    throw error;
  }
};

/**
 * Global POST handler for Multipart Form Data with Authorization (Bearer token)
 */
export const postAuthFormDataAPI = async (url, formData) => {
  try {
    const userData = JSON.parse(localStorage.getItem('agentUserData') || '{}');
    const token = userData.accessToken;
    
    const headers = {}; // Fetch automatically sets Content-Type for FormData
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
  } catch (error) {
    console.error(`Error in Auth POST Form ${url}:`, error);
    throw error;
  }
};


/**
 * Global DELETE handler with Authorization (Bearer token)
 */
export const deleteAuthAPI = async (url) => {
  try {
    const userData = JSON.parse(localStorage.getItem('agentUserData') || '{}');
    const token = userData.accessToken;
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'DELETE', headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
  } catch (error) {
    console.error(`Error in Auth DELETE ${url}:`, error);
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

export const loginDepartmentAPI = async (credentials) => {
  return await postAPI(URLS.AUTH.DEPARTMENT_LOGIN, credentials);
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

export const submitComplaintAPI = async (payload) => {
  // If payload is FormData, use postAuthFormDataAPI
  if (payload instanceof FormData) {
    return await postAuthFormDataAPI(URLS.COMPLAINTS.SUBMIT, payload);
  }
  return await postAuthAPI(URLS.COMPLAINTS.SUBMIT, payload);
};

export const draftComplaintAPI = async (payload) => {
  // If payload is FormData, use postAuthFormDataAPI
  if (payload instanceof FormData) {
    return await postAuthFormDataAPI(URLS.COMPLAINTS.DRAFT, payload);
  }
  return await postAuthAPI(URLS.COMPLAINTS.DRAFT, payload);
};


export const fetchDraftsAPI = async () => {
  return await getAuthAPI(URLS.COMPLAINTS.DRAFTS);
};

export const fetchDeptSchemesAPI = async () => {
  return await getAPI(URLS.COMPLAINTS.DEPARTMENTS_LIST, true); // Cache true as schemes rarely change
};

export const fetchComplaintCategoriesAPI = async () => {
  return await getAPI(URLS.COMPLAINTS.CATEGORIES_LIST, true); // Cache true
};

export const fetchSchemesAPI = async () => {
  return await getAPI(URLS.COMPLAINTS.SCHEMES_LIST, true);
};

export const fetchGrievanceHistoryAPI = async () => {
  return await getAuthAPI(URLS.COMPLAINTS.HISTORY);
};

export const deleteDraftAPI = async (id) => {
  return await deleteAuthAPI(URLS.COMPLAINTS.DELETE_DRAFT(id));
};
