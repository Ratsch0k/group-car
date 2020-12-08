import L from 'leaflet';

/**
 * Marker icon for the current position of the user.
 */
export default new L.Icon({
  iconUrl: require('../../../assets/icons/marker_pos.svg'),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
