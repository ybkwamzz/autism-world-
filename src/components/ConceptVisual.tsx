import React from 'react';
import type { ConceptExemplar } from '../data/knowledgeGraph';

interface ConceptVisualProps {
  conceptId: string;
  exemplar?: ConceptExemplar;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConceptVisual({
  conceptId,
  exemplar,
  size = 'md'
}: ConceptVisualProps) {
  const variant = exemplar?.variant || 'primary';
  const dim = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-10 h-10' : 'w-5 h-5';

  if (exemplar?.customDataUrl) {
    return (
      <img
        src={exemplar.customDataUrl}
        alt={exemplar.title_en}
        referrerPolicy="no-referrer"
        className={`${size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-12 h-12' : 'w-6 h-6'} object-cover rounded-2xl`}
      />
    );
  }

  const renderSvg = () => {
    switch (conceptId) {
      case 'apple':
        if (variant === 'detail') {
          // Sliced apple on plate
          return (
            <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16h18c-1.5 3.5-5 5-9 5s-7.5-1.5-9-5Z" />
              <path d="M6 16c0-4.5 2.5-8 6-8s6 3.5 6 8" />
              <circle cx="10.5" cy="13" r="0.8" fill="currentColor" />
              <circle cx="13.5" cy="13" r="0.8" fill="currentColor" />
              <path d="M12 5v3" />
            </svg>
          );
        }
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M10 2c1 .5 2 2 2 5" />
            {variant === 'context' && <circle cx="9" cy="11" r="1.5" />}
          </svg>
        );

      case 'banana':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" />
            <path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z" />
            {variant === 'detail' && <circle cx="17" cy="6" r="2" />}
          </svg>
        );

      case 'milk':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2h8l2 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6l2-4Z" />
            <path d="M6 6h12" />
            <path d="M6 12c3-1.5 9 1.5 12 0" />
            {variant === 'context' && <circle cx="12" cy="16" r="2" />}
          </svg>
        );

      case 'bread':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 11a4 4 0 0 1 0-6c2-1.5 12-1.5 14 0a4 4 0 0 1 0 6v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8Z" />
            {variant !== 'primary' && <path d="M10 11v6M14 11v6" />}
          </svg>
        );

      case 'mango':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4c3.5 0 6 3 6 7.5 0 5.5-4.5 9.5-9.5 9.5-3.5 0-5.5-2-5.5-4.5 0-2 2-3.5 2-6C7 6.5 10.5 4 14 4Z" />
            <path d="M14 4c0-2 1.5-2.5 3-2" />
            <path d="M11 3.5c-1.5-1-3.5-.5-4 1" />
          </svg>
        );

      case 'dog':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.5 1 1.695-.69 3.83-2.5 4-5.828Z" />
            <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.5 1-1.695-.69-3.83-2.5-4-5.828Z" />
            <path d="M8.5 14c0 1.5 1.5 3 3.5 3s3.5-1.5 3.5-3" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <path d="M5 14c-1 2-1 5 1 7h12c2-2 2-5 1-7" />
          </svg>
        );

      case 'cat':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
          </svg>
        );

      case 'bird':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 7h.01" />
            <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
            <path d="m20 7 2 .5-2 .5" />
            <path d="M10 18v3" />
            <path d="M14 17.75V21" />
            <path d="M7 18a6 6 0 0 0 3.84-10.61" />
          </svg>
        );

      case 'cow':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4c-2 0-3 1.5-3 3 0 1 1 2 3 2" />
            <path d="M19 4c2 0 3 1.5 3 3 0 1-1 2-3 2" />
            <rect x="5" y="5" width="14" height="14" rx="5" />
            <ellipse cx="12" cy="16" rx="4" ry="2.5" />
            <circle cx="9.5" cy="10" r="1" fill="currentColor" />
            <circle cx="14.5" cy="10" r="1" fill="currentColor" />
            <circle cx="10.5" cy="16" r="0.6" fill="currentColor" />
            <circle cx="13.5" cy="16" r="0.6" fill="currentColor" />
          </svg>
        );

      case 'cup':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
        );

      case 'ball':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );

      case 'book':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );

      case 'spoon':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="7" rx="4" ry="5" />
            <path d="M12 12v10" />
            <path d="M10 22h4" />
          </svg>
        );

      case 'chair':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3v10h10V3" />
            <path d="M7 7h10" />
            <path d="M5 13h14v3H5z" />
            <path d="M7 16v5" />
            <path d="M17 16v5" />
          </svg>
        );

      case 'house':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );

      case 'school':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
            <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
            <path d="M18 5v17" />
            <path d="m4 6 8-4 8 4" />
            <path d="M6 5v17" />
            <circle cx="12" cy="9" r="2" />
          </svg>
        );

      case 'mother':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
        );

      case 'market':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
          </svg>
        );

      case 'run':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="15" cy="4" r="2" />
            <path d="M10.5 9.5 7 11.5l-1.5 3.5" />
            <path d="m14 9.5 3.5 2 2.5-1.5" />
            <path d="m13.5 9.5-2.5 5 4 2.5 1 4.5" />
            <path d="m11 14.5-4 2.5-3 1" />
          </svg>
        );

      case 'eat':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </svg>
        );

      case 'sleep':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path d="M19 3h3l-3 3h3" />
          </svg>
        );

      case 'happy':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        );

      case 'calm':
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 10c.5 1 2 1 2.5 0" />
            <path d="M13.5 10c.5 1 2 1 2.5 0" />
            <path d="M9 15c1.5 1 4.5 1 6 0" />
          </svg>
        );

      case 'tired':
      default:
        return (
          <svg className={dim} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 10h3" />
            <path d="M13 10h3" />
            <circle cx="12" cy="15.5" r="2" />
          </svg>
        );
    }
  };

  return renderSvg();
}
