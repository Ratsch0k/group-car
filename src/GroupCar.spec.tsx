import React from 'react';
import GroupCar from './GroupCar';
import testRender from './__test__/testRender';

it('renders without crashing', () => {

  const geolocation = {
    watchPosition: jest.fn().mockResolvedValue({
      coords: {
        latitude: 10,
        longitude: 20,
      },
    }),
  };

  (global as any).navigator.geolocation = geolocation;

  testRender(
    {},
    <GroupCar />
  );
});
