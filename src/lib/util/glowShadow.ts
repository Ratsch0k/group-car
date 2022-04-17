import {alpha} from '@material-ui/core';

const levels = {
  1: {
    shadow: '0px 0px 10px 3px',
    alpha: 0.3,
  },
  2: {
    shadow: '0px 0px 14px 4px',
    alpha: 0.4,
  },
};

export const glowShadow = (
  color: string,
  intensity: keyof typeof levels,
): string => {
  const level = levels[intensity];
  color = alpha(color, level.alpha);

  return `${level.shadow} ${color}`;
};
