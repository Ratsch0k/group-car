import React from 'react';
import testRender from '../../../__test__/testRender';
import mockedAxios from '../../../__test__/mockAxios';
import {render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@material-ui/core';
import {Drawer} from './Drawer';
import { CarColor, CarWithDriver, GroupWithOwner, GroupWithOwnerAndCars, GroupWithOwnerAndMembersAndInvitesAndCars, User } from '../../api';
import { MapContext, MapProvider, SnackbarContext } from '../../context';
import { ModalContext } from '../../ModalRouter';
import userEvent from '@testing-library/user-event';
import { LatLng, Map } from 'leaflet';
import theme from '../../../__test__/testTheme';
import { RootState } from '../../redux/store';
import {act} from "react-dom/test-utils";
import PermissionHandlerContext from '../../context/PermissionHandler/PermissionHandlerContext';

afterEach(() => {
  jest.clearAllMocks();
});

it('renders and matches snapshot with open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = testRender(
    {},
    <Drawer open={true} onClose={jest.fn} permanent={false}/>,
  );

  expect(baseElement).toMatchSnapshot();
});

it('renders and matches snapshot with open and ' +
    'permanent without crashing', () => {
  const {container} = testRender(
    {},
    <Drawer open={true} onClose={jest.fn} permanent={true}/>
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open ' +
    'and permanent without crashing', () => {
  const {container} = testRender(
    {},
    <Drawer open={false} onClose={jest.fn} permanent={true}/>,
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = testRender(
    {},
    <Drawer open={false} onClose={jest.fn} permanent={false}/>,
  );

  expect(baseElement).toMatchSnapshot();
});


it('renders NotLoggedIn component if user is not logged in', () => {
  const {baseElement} = testRender(
    {},
    <Drawer open={false} onClose={jest.fn} permanent={false}/>
  );

  expect(baseElement).toMatchSnapshot();
});

describe('if user is logged in', () => {
  const customRender = (
    state: any,
    snackContext: SnackbarContext,
    children?: React.ReactNode,
    permissionContext?: PermissionHandlerContext,
  ) => {
    const defaultPermissionContext: PermissionHandlerContext = {
      checkPermission(name) {
        return Promise.resolve({
          onchange: undefined,
          state: 'granted',
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => undefined,
        } as any);
      },
      requestPermission(name) {
        return Promise.resolve();
      }
    }

    return testRender(
      state,
      <MapProvider>
        <SnackbarContext.Provider value={snackContext}>
          <PermissionHandlerContext.Provider
            value={permissionContext ?? defaultPermissionContext}
          >
            {children}
          </PermissionHandlerContext.Provider>
        </SnackbarContext.Provider>
      </MapProvider>
    );
  };

  let user: User;
  let groups: GroupWithOwner[];
  let state: Partial<RootState>;
  let cars: CarWithDriver[];
  let group: GroupWithOwnerAndMembersAndInvitesAndCars;

  beforeEach(() => {
    user = {
      id: 10,
      username: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'USER@mail.com',
      deletedAt: null,
      isBetaUser: false,
    };
  
    groups = [
      {
        id: 1,
        name: 'Group',
        description: 'Test',
        ownerId: user.id,
        Owner: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Other group',
        description: 'Another group',
        ownerId: user.id,
        Owner: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  
    cars = [
      {
        groupId: 1,
        carId: 1,
        name: 'Car1',
        color: CarColor.Red,
        driverId: null,
        Driver: null,
        latitude: 1.0,
        longitude: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupId: 1,
        carId: 2,
        name: 'Car2',
        color: CarColor.Green,
        driverId: 4,
        Driver: {
          id: 4,
          username: 'TEST DRIVER',
        },
        latitude: null,
        longitude: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupId: 1,
        carId: 2,
        name: 'Car3',
        color: CarColor.Blue,
        driverId: user.id,
        Driver: {
          id: user.id,
          username: user.username,
        },
        latitude: null,
        longitude: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    group = {
      id: 3,
      name: 'SELECTED GROUP',
      description: 'DESCRIPTION',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: user.id,
      Owner: {
        username: user.username,
        id: user.id,
      },
      invites: [],
      cars,
      members: [],
    };

    state = {
      auth: {
        user,
        signUpRequestSent: false,
        loading: false,
      },
      group: {
        selectedGroup: null,
        entities: groups.map((g) => ({[g.id]: g})),
        ids: groups.map((g) => g.id),
        loading: false,
      }
    }
  });

  

  it('renders create group button if user has no groups', () => {
    state.group.ids = [];
    state.group.entities = {};

    const snackbarContext = {
      show: jest.fn(),
    };

    const {baseElement} = customRender(
      state, 
      snackbarContext, 
      <Drawer open={false} onClose={jest.fn} permanent={true}/>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders select group button if user has at least ' +
  'one group and none is selected', () => {
    const {baseElement} = customRender(
      state,
      {} as any,
      <Drawer open={false} onClose={jest.fn} permanent={true}/>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders list of cars correctly if a group is selected', () => {
    state.group.selectedGroup = group;
    const screen = customRender(
      state,
      {} as any,
      <Drawer open={false} onClose={jest.fn} permanent={true}/>
    );

    expect(screen.baseElement).toMatchSnapshot();
    expect(screen.queryByText(cars[0].name)).toBeTruthy();
    expect(screen.queryByText(cars[1].name)).toBeTruthy();
    expect(screen.queryByText(group.name)).toBeTruthy();
    expect(screen.queryByText('drawer.cars.drivenBy')).toBeTruthy();
  });

  it('clicking on drive button will dispatch driveCar action', async () => {
    state.group.selectedGroup = group;

    mockedAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

    const {baseElement, store} = customRender(
      state,
      {} as any,
      <Drawer open={false} onClose={jest.fn} permanent={true}/>,
    );

    userEvent.click(baseElement.querySelector(`#drive-car-${cars[0].carId}`)!);
    
    const expectedPendingAction = {
      type: 'group/driveCar/pending',
      payload: undefined,
      meta: {
        arg: {
          groupId: group.id,
          carId: cars[0].carId,
        },
        requestStatus: expect.any(String),
        requestId: expect.any(String),
      },
    };
    const expectedFulfilledCar = {
      type: 'group/driveCar/fulfilled',
      payload: undefined,
      meta: {
        arg: {
          groupId: group.id,
          carId: cars[0].carId,
        },
        requestStatus: expect.any(String),
        requestId: expect.any(String),
      },
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledCar));
    expect(store.getActions()).toContainEqual(expectedPendingAction);
    expect(mockedAxios.put).toBeCalledWith(`/api/group/${group.id}/car/${cars[0].carId}/drive`);
  });

  describe('park at current location', () => {
    it('get current location, dispatch parkCar action with location', async () => {
      state.group.selectedGroup = group;

      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      };

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
  
      (navigator.geolocation as any) = geolocation;

      mockedAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});

      const {baseElement, store} = customRender(
        state,
        {} as SnackbarContext,
        <Drawer open={false} onClose={jest.fn} permanent={true}/>,
      );

      userEvent.click(baseElement.querySelector(`#park-current-car-${cars[2].carId}`)!);

      const expectedPendingAction = {
        type: 'group/parkCar/pending',
        payload: undefined,
        meta: {
          arg: {
            groupId: group.id,
            carId: cars[2].carId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };
      const expectedFulfilledAction = {
        type: 'group/parkCar/fulfilled',
        payload: undefined,
        meta: {
          arg: {
            groupId: group.id,
            carId: cars[2].carId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          requestStatus: expect.any(String),
          requestId: expect.any(String),
        },
      };

      await waitFor(() => expect(store.getActions()).toContainEqual(expectedFulfilledAction));
      expect(store.getActions()).toContainEqual(expectedPendingAction);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/group/${group.id}/car/${cars[2].carId}/park`,
        {
          ...position.coords,
        }
      );
    });

    it('shows snackbar if current position cannot be gotten', async () => {
      state.group.selectedGroup = group;


      const snackContext = {
        show: jest.fn(),
      } as SnackbarContext;

      const {baseElement} = customRender(
        state,
        snackContext,
        <Drawer open={false} onClose={jest.fn} permanent={true}/>,
        {
          checkPermission(name) {
              return {
                state: 'denied',
              } as any;
          },
          requestPermission(name) {
              return Promise.reject()
          },
        },
      );

      userEvent.click(baseElement.querySelector(`#park-current-car-${cars[2].carId}`)!);

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'map.locationDenied');
    });
  });

  describe('park with map', () => {
    it('clicking on park on map sets selected car on ' +
    'map context to car and drawer will show SelectLocation', async () => {
      state.group.selectedGroup = group;

      let actualSelectedCar;

      const {baseElement} = customRender(
        state,
        {} as SnackbarContext,
        <>
          <MapContext.Consumer>
            {
              ({selectedCar}) => {
                actualSelectedCar = selectedCar;
                return <p>{selectedCar?.name}</p>
              }
            }
          </MapContext.Consumer>
          <Drawer open={false} onClose={jest.fn} permanent={true}/>
        </>
      );

      userEvent.click(baseElement.querySelector(`#park-map-car-${cars[2].carId}`));

      await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

      expect(actualSelectedCar).toEqual(cars[2]);
      expect(baseElement).toMatchSnapshot();
    });

    describe('SelectLocation', () => {
      it('will add an click event listener on the map', async () => {
 
        const map = {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        } as unknown as Map;

        const mapContext = {
          map,
          selectedCar: cars[2],
        } as MapContext;
  
        customRender(
          state,
          {} as SnackbarContext,
          <MapContext.Provider value={mapContext}>
            <Drawer open={false} onClose={jest.fn} permanent={true}/>
          </MapContext.Provider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());
        
        expect(map.addEventListener).toHaveBeenCalledTimes(1);
        expect(map.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      });

      it('clicking on cancel will change drawer to group overview', async () => {
        state.group.selectedGroup = group;
  
        const {baseElement} = customRender(
          state,
          {} as SnackbarContext,
          <Drawer open={false} onClose={jest.fn} permanent={true}/>,
        );
  
        userEvent.click(baseElement.querySelector(`#park-map-car-${cars[2].carId}`)!);
  
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());
  
        expect(baseElement).toMatchSnapshot();

        userEvent.click(screen.queryByText('misc.cancel')!);

        await waitFor(() => expect(screen.queryByText('misc.cancel')).toBeFalsy());

        expect(baseElement).toMatchSnapshot();
      });

      it('clicking on map will enable confirm button', async () => {
        state.group.selectedGroup = group;
        
        let listener;

        const map = {
          addEventListener: jest.fn().mockImplementation((type, fn) => {
            listener = fn;
          }),
          removeEventListener: jest.fn(),
        } as unknown as Map;

        const mapContext = {
          selectedCar: cars[2],
          map,
        } as MapContext;
  
        const {baseElement} = customRender(
          state,
          {} as SnackbarContext,
          <MapContext.Provider value={mapContext}>
            <Drawer open={false} onClose={jest.fn} permanent={true}/>
          </MapContext.Provider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

        expect(listener).toEqual(expect.any(Function));

        expect(baseElement).toMatchSnapshot();

        expect(baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`)!.getAttribute('disabled')).toEqual('');

        act(() => {
          listener({latlng: new LatLng(50, 8)});
        });

        await waitFor(() => expect(baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`)!.getAttribute('disabled')).toBeFalsy());
      });

      it('clicking confirm will dispatch parkCar action for car for specified location and set selectedCar to undefined', async () => {
        state.group.selectedGroup = group;
        
        let listener;
        
        const map = {
          addEventListener: jest.fn().mockImplementation((type, fn) => {
            listener = fn;
          }),
          removeEventListener: jest.fn(),
        } as unknown as Map;

        const mapContext = {
          selectedCar: cars[2],
          setSelectionDisabled: jest.fn(),
          setSelectedCar: jest.fn(),
          map,
        } as unknown as MapContext;

        mockedAxios.put = jest.fn().mockResolvedValueOnce({data: undefined});
  
        const screen = customRender(
          state,
          {} as SnackbarContext,
          <MapContext.Provider value={mapContext}>
            <Drawer open={false} onClose={jest.fn} permanent={true}/>
          </MapContext.Provider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

        expect(listener).toEqual(expect.any(Function));

        expect(screen.baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`)!.getAttribute('disabled')).toEqual('');

        const latlng = new LatLng(50, 8);

        act(() => {
          listener({latlng});
        });

        await waitFor(() => expect(screen.baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`)!.getAttribute('disabled')).toBeFalsy());

        userEvent.click(screen.baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`)!);

        const expectedPendingAction = {
          type: 'group/parkCar/pending',
          payload: undefined,
          meta: {
            arg: {
              groupId: group.id,
              carId: cars[2].carId,
              latitude: latlng.lat,
              longitude: latlng.lng,
            },
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };
        const expectedFulfilledAction = {
          type: 'group/parkCar/fulfilled',
          payload: undefined,
          meta: {
            arg: {
              groupId: group.id,
              carId: cars[2].carId,
              latitude: latlng.lat,
              longitude: latlng.lng,
            },
            requestStatus: expect.any(String),
            requestId: expect.any(String),
          },
        };

        await waitFor(() => expect(screen.store.getActions()).toContainEqual(expectedFulfilledAction));
        expect(screen.store.getActions()).toContainEqual(expectedPendingAction);
        expect(mockedAxios.put).toBeCalledTimes(1);
        expect(mockedAxios.put).toBeCalledWith(
          `/api/group/${group.id}/car/${cars[2].carId}/park`,
          {
            latitude: latlng.lat,
            longitude: latlng.lng,
          }
        )
      });
    });
  });
  
  describe('view location', () => {
    it('location button is disabled if latitude or longitude is null', async () => {
      const newCars = [
        {
          groupId: 1,
          carId: 1,
          name: 'Car1',
          color: CarColor.Red,
          driverId: null,
          Driver: null,
          latitude: null,
          longitude: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 1,
          carId: 2,
          name: 'Car2',
          color: CarColor.Red,
          driverId: null,
          Driver: null,
          latitude: 2.0,
          longitude: 4.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      group.cars = newCars;
      state.group.selectedGroup = group;
      
      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      };

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
  
      (navigator.geolocation as any) = geolocation;


      const {baseElement} = customRender(
        state,
        {} as SnackbarContext,
        <Drawer open={false} onClose={jest.fn} permanent={true}/>
      );

      await waitFor(() => expect(baseElement.querySelector(`#view-car-${newCars[0].carId}`)).toBeTruthy());
      expect(baseElement).toMatchSnapshot();
      expect(baseElement.querySelector(`#view-car-${newCars[0].carId}`)!.getAttribute('disabled')).toEqual('');
      expect(baseElement.querySelector(`#view-car-${newCars[1].carId}`)!.getAttribute('disabled')).toBeFalsy();
    });

    it('clicking on location button will call fly on map', async () => {
      const newCars = [
        {
          carId: 1,
          groupId: 1,
          name: 'Car 1',
          latitude: 60,
          longitude: 23,
          driverId: null,
          color: CarColor.White,
          Driver: null,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ];
  
      group.cars = newCars;
      state.group.selectedGroup = group;

      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      };

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
      

      const map = {
        flyTo: jest.fn(),
      };

      const mapContext = {
        map,
      } as unknown as MapContext;
  
      (navigator.geolocation as any) = geolocation;

      const {baseElement} = customRender(
        state,
        {} as SnackbarContext,
        <MapContext.Provider value={mapContext}>
          <Drawer open={false} onClose={jest.fn} permanent={true}/>
        </MapContext.Provider>,
      );

      await waitFor(() => expect(baseElement.querySelector(`#view-car-${newCars[0].carId}`)).toBeTruthy());
      userEvent.click(baseElement.querySelector(`#view-car-${newCars[0].carId}`)!);

      await waitFor(() => expect(map.flyTo).toHaveBeenCalledTimes(1));
      expect(map.flyTo).toHaveBeenCalledWith(new LatLng(newCars[0].latitude, newCars[0].longitude), 18, {duration: 1});
    });
  });
});
