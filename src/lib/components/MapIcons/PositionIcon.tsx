import L from 'leaflet';
import markerIcon from '../../../assets/icons/marker_pos.svg';

/**
 * Marker icon for the current position of the user.
 */
export default new L.Icon({
  iconUrl: markerIcon,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
