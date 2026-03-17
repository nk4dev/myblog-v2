import React from 'react';

import './link.css';

export interface NaviLinkProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the link button be? */
  size?: 'small' | 'medium' | 'large';
  /** Link text */
  label: string;
  /** URL the link points to */
  href?: string;
  /** Where to open the link */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** Optional click handler */
  onClick?: () => void;
}

/** Link styled as a button for navigation actions */
export const NaviLink = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  href = 'https://nknighta.me',
  target = '_self',
  onClick,
  ...props
}: NaviLinkProps) => {
  const mode = primary ? 'storybook-link--primary' : 'storybook-link--secondary';
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={['storybook-link', `storybook-link--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      onClick={onClick}
      {...props}
    >
      {label}
    </a>
  );
};
