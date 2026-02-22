import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useAuthContext } from '../AuthProvider';

function NavbarAuthInner() {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          className="navbar__item"
          style={{
            fontSize: 13,
            color: 'var(--ifm-navbar-link-color)',
            fontWeight: 500,
          }}
        >
          {user.email}
        </span>
        <button
          onClick={async () => {
            await logout();
            window.location.href = '/';
          }}
          className="navbar__item navbar__link"
          style={{
            cursor: 'pointer',
            border: '1px solid var(--ifm-color-danger)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
            background: 'transparent',
            color: 'var(--ifm-color-danger)',
            transition: 'all 0.2s',
          }}
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Link to="/login" className="navbar__item navbar__link">
        Log In
      </Link>
      <Link
        to="/signup"
        className="navbar__item navbar__link"
        style={{
          border: '1px solid var(--ifm-color-primary)',
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 13,
          fontWeight: 600,
          background: 'var(--ifm-color-primary)',
          color: '#fff',
          transition: 'all 0.2s',
        }}
      >
        Sign Up
      </Link>
    </div>
  );
}

export default function NavbarAuthItems() {
  return (
    <BrowserOnly fallback={null}>
      {() => <NavbarAuthInner />}
    </BrowserOnly>
  );
}
