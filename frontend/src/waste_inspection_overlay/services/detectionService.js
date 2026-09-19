// Service for interacting with Django Detection API

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : 'https://wastechakra.onrender.com/api/v1');

/**
 * Sends image to Django backend for optical object detection, bounding box extraction,
 * and live waste stream routing.
 * @param {File|Blob} file - Uploaded image file
 * @param {string} customApiKey - Optional Gemini API key
 * @returns {Promise<Object>} Detection results payload
 */
export async function inspectWasteImage(file, customApiKey = null) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('source', 'INSPECTION_OVERLAY');

  const headers = {};
  const savedKey = customApiKey || localStorage.getItem('wc_gemini_api_key');
  if (savedKey) {
    headers['X-Gemini-Key'] = savedKey;
  }

  const response = await fetch(`${API_BASE_URL}/pipeline/process/`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Inspection failed with status ${response.status}`);
  }

  return response.json();
}
