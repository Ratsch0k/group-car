import L, {Icon} from 'leaflet';
import {CarColor} from 'lib/api';
import getIcon from 'lib/util/getIcon';

/**
 * Creates an location marker for the specified icon name.
 * @param iconName The file name of the icon.
 */
const createLocationMarker = (color: CarColor): Icon => {
  return new L.Icon({
    iconUrl: getIcon(color),
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    shadowUrl: require('../../../assets/icons/location_marker_shadow.png'),
    shadowSize: [24, 24],
    shadowAnchor: [12, 12],
  });
};

export type LocationMarker = {
  [index in CarColor]: Icon;
};

/**
 * Holds for every CarColor the corresponding Leaflet Icon.
 */
export const LocationMarker: LocationMarker = {
  [CarColor.Orange]: createLocationMarker(CarColor.Orange),
  [CarColor.Black]: createLocationMarker(CarColor.Black),
  [CarColor.Green]: createLocationMarker(CarColor.Green),
  [CarColor.Yellow]: createLocationMarker(CarColor.Yellow),
  [CarColor.Red]: createLocationMarker(CarColor.Red),
  [CarColor.Blue]: createLocationMarker(CarColor.Blue),
  [CarColor.White]: createLocationMarker(CarColor.White),
  [CarColor.Purple]: createLocationMarker(CarColor.Purple),
  [CarColor.Brown]: createLocationMarker(CarColor.Brown),
};

export default LocationMarker;
