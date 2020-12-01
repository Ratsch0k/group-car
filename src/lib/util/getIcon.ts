import {CarColor} from 'lib/api';
import orangeMarker from '../../assets/icons/orange_location_marker.svg';
import blackMarker from '../../assets/icons/black_location_marker.svg';
import whiteMarker from '../../assets/icons/white_location_marker.svg';
import greenMarker from '../../assets/icons/green_location_marker.svg';
import blueMarker from '../../assets/icons/blue_location_marker.svg';
import redMarker from '../../assets/icons/red_location_marker.svg';
import yellowMarker from '../../assets/icons/yellow_location_marker.svg';
import brownMarker from '../../assets/icons/brown_location_marker.svg';
import purpleMarker from '../../assets/icons/purple_location_marker.svg';

export type MarkerIcon = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index in CarColor]: any;
}

const icons: MarkerIcon = {
  [CarColor.Orange]: orangeMarker,
  [CarColor.Black]: blackMarker,
  [CarColor.White]: whiteMarker,
  [CarColor.Green]: greenMarker,
  [CarColor.Blue]: blueMarker,
  [CarColor.Red]: redMarker,
  [CarColor.Yellow]: yellowMarker,
  [CarColor.Brown]: brownMarker,
  [CarColor.Purple]: purpleMarker,
};

/**
 * Gets the icon file for the specified color.
 * @param color The color
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getIcon = (color: CarColor): any => {
  return icons[color];
};

export default getIcon;
