import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './PageBackNav.css';

const PageBackNav = ({ title, onBack, trailing = null, className = '' }) => (
  <header className={`page-back-nav ${className}`.trim()}>
    <button type="button" className="page-back-nav__btn" onClick={onBack} aria-label="Go back">
      <ArrowLeft className="page-back-nav__arrow" size={22} strokeWidth={2} aria-hidden />
      <span className="page-back-nav__title">{title}</span>
    </button>
    {trailing ? <div className="page-back-nav__trailing">{trailing}</div> : null}
  </header>
);

export default PageBackNav;
