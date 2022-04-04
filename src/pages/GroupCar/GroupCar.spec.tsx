import React from 'react';
import testRender from '../../__test__/testRender';
import GroupCar from './GroupCar';

it('renders without crashing', () => {

  ((global as any).navigator.geolocation as any) = {
    watchPosition: jest.fn().mockResolvedValue({
      coords: {
        latitude: 10,
        longitude: 20,
      },
    }),
  };

  testRender(
    {},
    <GroupCar />
  );
});
