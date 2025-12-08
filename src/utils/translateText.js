/**
 * Translate text using Google Translate API (free tier)
 * This uses the unofficial Google Translate API endpoint
 * For production, consider using official Google Cloud Translation API
 */

// Cache translations to avoid repeated API calls
const translationCache = new Map();

/**
 * Generate a cache key for the translation
 */
function getCacheKey(text, targetLang) {
  return `${targetLang}:${text.substring(0, 100)}`;
}

/**
 * Translate text to the target language
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code (en, fr, nl)
 * @param {string} sourceLang - Source language code (default: 'auto')
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLang, sourceLang = 'auto') {
  // Don't translate if target language is English (assuming most content is in English)
  if (targetLang === 'en') {
    return text;
  }

  // Check if text is empty
  if (!text || text.trim() === '') {
    return text;
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLang);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // Use Google Translate's unofficial API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Translation API error:', response.status);
      return text; // Return original text on error
    }

    const data = await response.json();
    
    // Extract translated text from response
    // Response format: [[[translated_text, original_text, ...]]]
    let translatedText = '';
    if (data && data[0]) {
      translatedText = data[0].map(item => item[0]).join('');
    }

    // Cache the translation
    translationCache.set(cacheKey, translatedText);

    return translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate HTML content while preserving HTML tags
 * @param {string} html - HTML content to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} - Translated HTML
 */
export async function translateHTML(html, targetLang) {
  if (targetLang === 'en' || !html) {
    return html;
  }

  try {
    // Strip HTML tags for translation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // Translate the text content
    const translatedText = await translateText(textContent, targetLang);

    // For simple HTML, just replace the text content
    // Note: This is a simple implementation. For complex HTML,
    // you might want to translate each text node separately
    if (html.includes('<')) {
      // Keep the HTML structure but with translated text
      tempDiv.textContent = translatedText;
      return tempDiv.innerHTML;
    }

    return translatedText;
  } catch (error) {
    console.error('HTML translation error:', error);
    return html;
  }
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

