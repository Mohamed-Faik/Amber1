"use client";

import { useState, useEffect } from 'react';
import { translateText, translateHTML } from '@/utils/translateText';

/**
 * Custom hook to translate content based on the current language
 * @param {string} content - Original content to translate
 * @param {string} language - Target language code (en, fr, nl)
 * @param {boolean} isHTML - Whether the content contains HTML (default: false)
 * @returns {object} - { translatedContent, isTranslating }
 */
export function useTranslatedContent(content, language, isHTML = false) {
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Don't translate if language is English or content is empty
    if (language === 'en' || !content) {
      setTranslatedContent(content);
      return;
    }

    let isMounted = true;

    const translateContent = async () => {
      setIsTranslating(true);
      
      try {
        let translated;
        if (isHTML) {
          translated = await translateHTML(content, language);
        } else {
          translated = await translateText(content, language);
        }
        
        if (isMounted) {
          setTranslatedContent(translated);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedContent(content); // Fallback to original content
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    };

    translateContent();

    return () => {
      isMounted = false;
    };
  }, [content, language, isHTML]);

  return { translatedContent, isTranslating };
}

