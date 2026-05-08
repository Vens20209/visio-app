const API_BASE_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = 45000;

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Server error while generating outfit');
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again in a moment.');
    }
    throw new Error(error.message || 'Network request failed.');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateVtonOutfit({ userImage, outfitImage = null, outfitCategory = null }) {
  return fetchWithTimeout(`${API_BASE_URL}/v1/generate-outfit`, {
    method: 'POST',
    body: JSON.stringify({
      user_image: userImage,
      outfit_image: outfitImage,
      outfit_category: outfitCategory,
    }),
  });
}
