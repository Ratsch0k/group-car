import React from 'react';
import {SvgIcon, SvgIconProps} from '@material-ui/core';

const sizes: {
  [index in 'small' | 'medium' | 'large' | 'default' | 'inherit']: number
} = {
  small: 32,
  medium: 44,
  large: 56,
  default: 44,
  inherit: 44,
};

/**
 * Group Car logo.
 * @param props
 * @constructor
 */
export const Logo = (props: SvgIconProps): JSX.Element => {
  const {fontSize} = props;

  return (
    <SvgIcon
      {...props}
      style={{fontSize: sizes[fontSize || 'medium']}}
      viewBox='0 0 264.58 264.58'
    >
      <g
        stroke='currentColor'
        fill='none'
        strokeLinecap="round"
        strokeWidth="20"
      >
        <path d="m123.07 39.285 56.196 0.12564"/>
        <path d="m70.575 65.859 26.591 0.12564"/>
        <path d="m55.738 119 26.591 0.12565"/>
        <path d="m58.682 172.15 26.591 0.12565"/>
        <path d="m70.877 198.72 26.591 0.12565"/>
        <path d="m90.77 225.3 63.592 0.12565"/>
        <path d="m175.84 198.85 26.591 0.12565"/>
        <path d="m182.56 172.28 26.591 0.12565"/>
        <path d="m156.6 145.65 26.591 0.12565"/>
        <path d="m176.17 65.984 26.591 0.12564"/>
        <path d="m58.393 92.432 26.591 0.12564"/>
      </g>
      <g fill='currentColor' stroke='none'>
        <circle cx="209.17" cy="145.74" r="11"/>
        <circle cx="180.54" cy="225.12" r="11"/>
        <circle cx="55.898" cy="145.77" r="11"/>
        <circle cx="82.069" cy="145.64" r="11"/>
        <circle cx="96.566" cy="39.361" r="11"/>
        <circle cx="148.33" cy="65.542" r="11"/>
        <circle cx="149.92" cy="65.542" r="11"/>
      </g>
    </SvgIcon>

  );
};

export default Logo;
