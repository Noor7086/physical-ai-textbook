import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useTranslation } from '../../contexts/TranslationContext';

function NavbarTranslateInner() {
  const { isUrdu, isTranslating, toggleTranslation } = useTranslation();

  return (
    <button
      onClick={toggleTranslation}
      disabled={isTranslating}
      className="navbar__item navbar__link"
      style={{
        cursor: isTranslating ? 'wait' : 'pointer',
        border: '1px solid var(--ifm-color-primary)',
        borderRadius: 20,
        padding: '4px 12px',
        fontSize: 13,
        fontWeight: 600,
        background: isUrdu ? 'var(--ifm-color-primary)' : 'transparent',
        color: isUrdu ? '#fff' : 'var(--ifm-color-primary)',
        transition: 'all 0.2s',
      }}
    >
      {isTranslating ? 'Translating...' : isUrdu ? 'English' : 'اردو'}
    </button>
  );
}

export default function NavbarTranslateButton() {
  return (
    <BrowserOnly fallback={null}>
      {() => <NavbarTranslateInner />}
    </BrowserOnly>
  );
}
