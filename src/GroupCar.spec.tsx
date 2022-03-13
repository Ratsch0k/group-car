import React from 'react';
import testRender from './__test__/testRender';
import GroupCar from './GroupCar';

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
