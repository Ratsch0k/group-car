import {Map} from 'leaflet';
import {CarWithDriver} from 'lib';
import React, {useState} from 'react';

/**
 * Context which helps to move accessing and interacting with the
 * map to a higher component.
 * The context provides access to the map component and additional logic
 * for indicating that location selection on the map should be disabled or
 * if it should be active for a specified car.
 */
export interface MapContext {
  /**
   * The map component.
   */
  map: Map | undefined;

  /**
   * Sets the map state.
   * @param map The map
   */
  setMap(map: Map): void;

  /**
   * Sets the selected car.
   * @param car The car
   */
  setSelectedCar(car: CarWithDriver | undefined): void;

  /**
   * The currently selected car.
   */
  selectedCar: CarWithDriver | undefined;

  /**
   * Whether or not the selection of a location
   * should be disabled.
   */
  selectionDisabled: boolean;

  /**
   * Sets the selectionDisabled state.
   */
  setSelectionDisabled(value: boolean): void;
}

export const MapContext = React.createContext<MapContext>({
  map: undefined,
  setMap: () => undefined,
  selectedCar: undefined,
  setSelectedCar: () => undefined,
  selectionDisabled: false,
  setSelectionDisabled: () => undefined,
});

/**
 * Default provider for the MapContext.
 * Provides the states.
 * @param props Only children.
 */
export const MapProvider: React.FC = (props) => {
  const [map, setMap] = useState<Map>();
  const [selectedCar, setSelectedCar] = useState<CarWithDriver>();
  const [selectionDisabled, setSelectionDisabled] = useState<boolean>(false);

  return (
    <MapContext.Provider value={{
      map,
      setMap,
      selectedCar,
      setSelectedCar,
      setSelectionDisabled,
      selectionDisabled,
    }}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapProvider;
