import {alpha, hexToRgb} from '@material-ui/core';

/**
 * Converts a color string into rgb color string
 */
const convertToRgb = (colorString: string): string => {
  let rgbColor = colorString;

  // First, detect the color format. Supported are hex and rgb/rgba
  if (colorString.match(/^#([0-9a-f]{2}){3,4}$/i)) {
    rgbColor = hexToRgb(colorString);
  }

  return rgbColor;
};

const SHADOWS = {
  1: {
    alpha: 0.25,
    values: '0px 4px 12px 0px',
  },
  2: {
    alpha: 0.25,
    values: '0px 4px 12px 2px',
  },
  3: {
    alpha: 0.35,
    values: '0px 6px 16px 2px',
  },
  4: {
    alpha: 0.4,
    values: '0px 8px 20px 4px',
  },
  5: {
    alpha: 0.45,
    values: '0px 8px 20px 6px',
  },
};


/**
 * Creates a colored box shadow for the given base color and elevation.
 *
 * @param color The color. Can be provided as hex or rgb. Any alpha value is
 *              overwritten
 * @param elevation Strength of the shadow. The higher the number
 *                  the further away the component will look like.
 *                  Minimum 0, maximum 5. Value is capped.
 */
const coloredShadow = (color: string, elevation: number): string => {
  // Limit the elevation
  elevation = Math.max(0, Math.min(5, elevation));

  // If elevation is 0, return none.
  if (elevation === 0) {
    return 'none';
  }

  // For any other elevation, compute the box shadow properly

  // Convert the color to rgba
  const rgbTuple = convertToRgb(color);
  // We can simply cast the elevation because we made sure that the
  // elevation is correct and matches the indices of SHADOWS.
  const shadowOptions = SHADOWS[elevation as keyof typeof SHADOWS];
  const shadowValues = shadowOptions.values;
  const shadowAlpha = shadowOptions.alpha;

  return `${shadowValues} ${alpha(rgbTuple, shadowAlpha)}`;
};

export default coloredShadow;
