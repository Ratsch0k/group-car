import '../../__test__/mockAxios';
import { fireEvent, waitFor } from "@testing-library/react";
import React from 'react';
import { LatLng, Map } from "leaflet";
import { MapContext } from "../../lib";
import MapComponent from './Map';
import testRender from '../../__test__/testRender';
import { RootState } from "../../lib/redux/store";
import {act} from "react-dom/test-utils";
import PermissionHandlerContext from '../../lib/context/PermissionHandler/PermissionHandlerContext';

const mockWatchPosition = jest.fn();
jest.mock('../../lib/hooks/useGeolocation', () => ({
  __esModule: true,
  default: () => ({
    watchPosition: mockWatchPosition,
  }),
}));

describe('Map', () => {
  let permissionContext: PermissionHandlerContext;

  beforeEach(() => {
    permissionContext = {
      checkPermission: jest.fn().mockResolvedValue({
        state: 'granted',
      }),
      requestPermission: jest.fn().mockResolvedValue(undefined),
    };
  });

  afterEach(() => {
    mockWatchPosition.mockReset();
    jest.unmock('../../lib/hooks/useGeolocation');
  })

  const customRender = (state: Partial<RootState>, mapContext: MapContext) => {
    return testRender(
      state,
      <MapContext.Provider value={mapContext}>
        <PermissionHandlerContext.Provider value={permissionContext}>
          <MapComponent />
        </PermissionHandlerContext.Provider>
      </MapContext.Provider>
    );
  };

  
  it('watches position with geolocation', async () => {
    const map = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      flyTo: jest.fn(),
    } as unknown as Map;

    mockWatchPosition.mockResolvedValue(undefined);

    const mapContext = {
      map,
    } as MapContext;

    const state = {
      group: {
        selectedGroup: null,
        ids: [],
        entities: {},
        loading: false,
      },
    };

    const {baseElement} = customRender(state, mapContext);

    fireEvent.click(baseElement.querySelector('#show-current-position')!);
    await waitFor(() => expect(mockWatchPosition).toHaveBeenCalledTimes(1));
    expect(mockWatchPosition).toHaveBeenCalledWith(expect.any(Function));
  });


  describe('if a car is selected and selection is not disabled', () => {
    it('registers click event listener on map if a car is selected and select', async () => {
      const map = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        flyTo: jest.fn(),
      } as unknown as Map;

      const mapContext = {
        map,
        selectedCar: {
          groupId: 1,
          carId: 1,
          name: 'car',
          driverId: 1,
          Driver: {
            id: 1,
            username: 'driver'
          },
        },
        selectionDisabled: false,
      } as MapContext;

      const geolocation = {
        watchPosition: jest.fn(),
      } as unknown as Geolocation;
      (navigator.geolocation as any) = geolocation;

      const state = {
        group: {
          selectedGroup: null,
          ids: [],
          entities: {},
          loading: false,
        },
      };

      customRender(state, mapContext);

      await waitFor(() => expect(map.addEventListener).toHaveBeenCalledTimes(1));
      expect(map.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });
});