import { render, waitFor } from "@testing-library/react";
import React from 'react';
import { LatLng, latLng, Map } from "leaflet";
import { MapContext } from "../../lib";
import MapComponent from './Map';

describe('Map', () => {
  const customRender = (mapContext: MapContext) => {
    return render(
      <MapContext.Provider value={mapContext}>
        <MapComponent />
      </MapContext.Provider>
    );
  };

  
  it('watches position with geolocation', async () => {
    const map = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      flyTo: jest.fn(),
    } as unknown as Map;

    const mapContext = {
      map,
    } as MapContext;

    const geolocation = {
      watchPosition: jest.fn(),
    } as unknown as Geolocation;
    (navigator.geolocation as any) = geolocation;

    customRender(mapContext);

    await waitFor(() => expect(geolocation.watchPosition).toHaveBeenCalledTimes(1));
    expect(geolocation.watchPosition).toHaveBeenCalledWith(expect.any(Function));
  });

  it('zooms to current position when first found', async () => {
    let listener;

    const map = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      flyTo: jest.fn(),
    } as unknown as Map;

    const mapContext = {
      map,
    } as MapContext;

    const geolocation = {
      watchPosition: jest.fn().mockImplementation((fn) => {
        listener = fn;
      }),
    } as unknown as Geolocation;
    (navigator.geolocation as any) = geolocation;

    customRender(mapContext);

    await waitFor(() => expect(geolocation.watchPosition).toHaveBeenCalledTimes(1));
    expect(geolocation.watchPosition).toHaveBeenCalledWith(expect.any(Function));

    const position = {
      coords: {
        latitude: 50,
        longitude: 8,
      },
    } as Position;
    listener(position);

    await waitFor(() => expect(map.flyTo).toHaveBeenCalledTimes(1));
    expect(map.flyTo).toHaveBeenCalledWith(new LatLng(position.coords.latitude, position.coords.longitude), 17);
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

      customRender(mapContext);

      await waitFor(() => expect(map.addEventListener).toHaveBeenCalledTimes(1));
      expect(map.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });
});