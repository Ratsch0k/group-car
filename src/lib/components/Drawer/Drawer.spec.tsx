import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@material-ui/core';
import {theme, Drawer, AuthContext, GroupContext} from '../../../lib';
import { CarColor, CarWithDriver, GroupWithOwnerAndCars } from '../../api';
import { IUser, MapContext, MapProvider, SnackbarContext } from '../../context';
import { ModalContext } from '../../ModalRouter';
import userEvent from '@testing-library/user-event';
import { LatLng, Map } from 'leaflet';

it('renders and matches snapshot with open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={true} onClose={jest.fn} permanent={false}/>
      </ThemeProvider>,
  );

  expect(baseElement).toMatchSnapshot();
});

it('renders and matches snapshot with open and ' +
    'permanent without crashing', () => {
  const {container} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={true} onClose={jest.fn} permanent={true}/>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open ' +
    'and permanent without crashing', () => {
  const {container} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={false} onClose={jest.fn} permanent={true}/>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
});

it('renders and matches snapshot with not open and ' +
    'not permanent without crashing', () => {
  const {baseElement} = render(
      <ThemeProvider theme={theme}>
        <Drawer open={false} onClose={jest.fn} permanent={false}/>
      </ThemeProvider>,
  );

  expect(baseElement).toMatchSnapshot();
});


it('renders NotLoggedIn component if user is not logged in', () => {
  const authContext = {
    isLoggedIn: false,
  } as AuthContext;

  const {baseElement} = render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <Drawer open={false} onClose={jest.fn} permanent={false}/>
      </AuthContext.Provider>
    </ThemeProvider>,
  );

  expect(baseElement).toMatchSnapshot();
});

describe('if user is logged in', () => {
  const customRender = (
    modalContext: ModalContext,
    authContext: AuthContext,
    groupContext: GroupContext,
    snackContext: SnackbarContext,
    children?: React.ReactNode,
  ) => {
    return render(
        <ThemeProvider theme={theme}>
          <MapProvider>
            <SnackbarContext.Provider value={snackContext}>
              <ModalContext.Provider value={modalContext}>
                <AuthContext.Provider value={authContext}>
                  <GroupContext.Provider value={groupContext}>
                    <Drawer open={false} onClose={jest.fn} permanent={true}/>
                    {children}
                  </GroupContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MapProvider>
        </ThemeProvider>
    );
  };

  const user = {
    id: 10,
    username: 'USER',
  } as IUser;

  const groups = [
    {
      id: 1,
      name: 'Group',
      description: 'Test',
      ownerId: user.id,
      Owner: user,
    },
    {
      id: 2,
      name: 'Other group',
      description: 'Another group',
      ownerId: user.id,
      Owner: user,
    }
  ] as GroupWithOwnerAndCars[];

  const cars = [
    {
      groupId: 1,
      carId: 1,
      name: 'Car1',
      color: CarColor.Red,
      driverId: null,
      Driver: null,
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
    }
  ] as CarWithDriver[];

  it('renders create group button if user has no groups', () => {
    const authContext = {
      isLoggedIn: true,
    } as AuthContext;
    const groupContext = {
      groups: [],
    } as GroupContext;
    const modalContext = {} as ModalContext;
    const snackContext = {} as SnackbarContext;

    const {baseElement} = customRender(
      modalContext,
      authContext, 
      groupContext, 
      snackContext,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders select group button if user has at least ' +
  'one group and none is selected', () => {
    const authContext = {
      isLoggedIn: true,
      user,
    } as AuthContext;
    const groupContext = {
      groups: [groups[0]],
      selectedGroup: null,
    } as GroupContext;
    const modalContext = {} as ModalContext;
    const snackContext = {} as SnackbarContext;

    const {baseElement} = customRender(
      modalContext,
      authContext,
      groupContext,
      snackContext
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('renders list of cars correctly if a group is selected', () => {
    const authContext = {
      isLoggedIn: true,
      user,
    } as AuthContext;
    const groupContext = {
      groups: groups,
      selectedGroup: groups[0],
      groupCars: cars,
    } as GroupContext;
    const modalContext = {
      goTo: jest.fn(),
    } as unknown as ModalContext;
    const snackContext = {} as SnackbarContext;

    const {baseElement} = customRender(
      modalContext, 
      authContext, 
      groupContext, 
      snackContext,
    );

    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText(cars[0].name)).toBeTruthy();
    expect(screen.queryByText(cars[1].name)).toBeTruthy();
    expect(screen.queryByText(groups[0].name)).toBeTruthy();
    expect(screen.queryByText('drawer.cars.drivenBy')).toBeTruthy();
  });

  it('clicking on drive button will send drive request', async () => {
    const authContext = {
      isLoggedIn: true,
    } as AuthContext;

    const groupContext = {
      groups: groups,
      selectedGroup: groups[0],
      groupCars: cars,
      driveCar: jest.fn().mockResolvedValue(undefined),
    } as GroupContext;

    const modalContext = {
      goTo: jest.fn(),
    } as unknown as ModalContext;
    const snackContext = {} as SnackbarContext;

    const {baseElement} = customRender(
      modalContext, 
      authContext, 
      groupContext, 
      snackContext,
    );

    userEvent.click(baseElement.querySelector(`#drive-car-${cars[0].carId}`));
    
    await waitFor(() => expect(groupContext.driveCar).toBeCalledTimes(1));
    expect(groupContext.driveCar).toBeCalledWith(groups[0].id, cars[0].carId);
  });

  describe('park at current location', () => {
    it('get current location, send park request and move car to parked cars', async () => {
      const authContext = {
        isLoggedIn: true,
        user,
      } as AuthContext;
  
      const groupContext = {
        groups,
        selectedGroup: groups[0],
        groupCars: cars,
        parkCar: jest.fn().mockResolvedValue(undefined),
      } as GroupContext;

      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      } as Position;

      const modalContext = {
        goTo: jest.fn(),
      } as unknown as ModalContext;

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
      
      const snackContext = {} as SnackbarContext;
  
      (navigator.geolocation as any) = geolocation;

      const {baseElement} = customRender(
        modalContext, 
        authContext, 
        groupContext, 
        snackContext,
      );

      userEvent.click(baseElement.querySelector(`#park-current-car-${cars[2].carId}`));

      await waitFor(() => expect(groupContext.parkCar).toHaveBeenCalledTimes(1));
      expect(groupContext.parkCar).toHaveBeenCalledWith(
        groupContext.selectedGroup.id,
        cars[2].carId,
        position.coords.latitude,
        position.coords.longitude,
      );

      expect(baseElement).toMatchSnapshot();
    });

    it('shows snackbar if current position cannot be gotten', async () => {
      const authContext = {
        isLoggedIn: true,
        user,
      } as AuthContext;
  
      const groupContext = {
        groups,
        selectedGroup: groups[0],
        groupCars: cars,
        parkCar: jest.fn().mockResolvedValue(undefined),
      } as GroupContext;

      const modalContext = {
        goTo: jest.fn(),
      } as unknown as ModalContext;

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          error(new Error('TEST ERROR'));
        }),
      } as unknown as Geolocation;
  
      (navigator.geolocation as any) = geolocation;

      const snackContext = {
        show: jest.fn(),
      } as SnackbarContext;

      const {baseElement} = customRender(
        modalContext, 
        authContext, 
        groupContext, 
        snackContext,
      );

      userEvent.click(baseElement.querySelector(`#park-current-car-${cars[2].carId}`));

      await waitFor(() => expect(snackContext.show).toHaveBeenCalledTimes(1));
      expect(snackContext.show).toHaveBeenCalledWith('error', 'TEST ERROR');

      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('park with map', () => {
    it('clicking on park on map sets selected car on ' +
    'map context to car and drawer will show SelectLocation', async () => {
      const authContext = {
        isLoggedIn: true,
        user,
      } as AuthContext;
  
      const groupContext = {
        groups,
        selectedGroup: groups[0],
        groupCars: cars,
        parkCar: jest.fn().mockResolvedValue(undefined),
      } as GroupContext;

      const modalContext = {
        goTo: jest.fn(),
      } as unknown as ModalContext;
      
      const snackContext = {} as SnackbarContext;

      let actualSelectedCar;

      const {baseElement} = customRender(
        modalContext, 
        authContext, 
        groupContext, 
        snackContext,
        <MapContext.Consumer>
          {
            ({selectedCar}) => {
              actualSelectedCar = selectedCar;
              return <p>{selectedCar?.name}</p>
            }
          }
        </MapContext.Consumer>
      );

      userEvent.click(baseElement.querySelector(`#park-map-car-${cars[2].carId}`));

      await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

      expect(actualSelectedCar).toEqual(cars[2]);
      expect(baseElement).toMatchSnapshot();
    });

    describe('SelectLocation', () => {
      it('will add an click event listener on the map', async () => {
        const authContext = {
          isLoggedIn: true,
          user,
        } as AuthContext;
    
        const groupContext = {
          groups,
          selectedGroup: groups[0],
          groupCars: cars,
          parkCar: jest.fn().mockResolvedValue(undefined),
        } as GroupContext;
        
        const map = {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        } as unknown as Map;

        const mapContext = {
          map,
          selectedCar: cars[2],
        } as MapContext;
  
        const {baseElement} = render(
          <ThemeProvider theme={theme}>
            <MapContext.Provider value={mapContext}>
              <AuthContext.Provider value={authContext}>
                <GroupContext.Provider value={groupContext}>
                  <Drawer open={false} onClose={jest.fn} permanent={true}/>
                </GroupContext.Provider>
              </AuthContext.Provider>
            </MapContext.Provider>
          </ThemeProvider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());
        
        expect(map.addEventListener).toHaveBeenCalledTimes(1);
        expect(map.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      });

      it('clicking on cancel will change drawer to group overview', async () => {
        const authContext = {
          isLoggedIn: true,
          user,
        } as AuthContext;
    
        const groupContext = {
          groups,
          selectedGroup: groups[0],
          groupCars: cars,
          parkCar: jest.fn().mockResolvedValue(undefined),
        } as GroupContext;
  
        const modalContext = {
          goTo: jest.fn(),
        } as unknown as ModalContext;
  
        const snackContext = {} as SnackbarContext;
      
  
        const {baseElement} = customRender(
          modalContext, 
          authContext, 
          groupContext, 
          snackContext,
        );
  
        userEvent.click(baseElement.querySelector(`#park-map-car-${cars[2].carId}`));
  
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());
  
        expect(baseElement).toMatchSnapshot();

        userEvent.click(screen.queryByText('misc.cancel'));

        await waitFor(() => expect(screen.queryByText('misc.cancel')).toBeFalsy());

        expect(baseElement).toMatchSnapshot();
      });

      it('clicking on map will enable confirm button', async () => {
        const authContext = {
          isLoggedIn: true,
          user,
        } as AuthContext;
    
        const groupContext = {
          groups,
          selectedGroup: groups[0],
          groupCars: cars,
          parkCar: jest.fn().mockResolvedValue(undefined),
        } as GroupContext;

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
  
        const {baseElement} = render(
          <ThemeProvider theme={theme}>
            <MapContext.Provider value={mapContext}>
              <AuthContext.Provider value={authContext}>
                <GroupContext.Provider value={groupContext}>
                  <Drawer open={false} onClose={jest.fn} permanent={true}/>
                </GroupContext.Provider>
              </AuthContext.Provider>
            </MapContext.Provider>
          </ThemeProvider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

        expect(listener).toEqual(expect.any(Function));

        expect(baseElement).toMatchSnapshot();

        expect(baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`).getAttribute('disabled')).toEqual('');

        listener({latlng: new LatLng(50, 8)});

        await waitFor(() => expect(baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`).getAttribute('disabled')).toBeFalsy());
      });

      it('clicking confirm will send park request for car for specified location and set selectedCar to undefined', async () => {
        const authContext = {
          isLoggedIn: true,
          user,
        } as AuthContext;
    
        const groupContext = {
          groups,
          selectedGroup: groups[0],
          groupCars: cars,
          parkCar: jest.fn().mockResolvedValue(undefined),
        } as GroupContext;

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
  
        const {baseElement} = render(
          <ThemeProvider theme={theme}>
            <MapContext.Provider value={mapContext}>
              <AuthContext.Provider value={authContext}>
                <GroupContext.Provider value={groupContext}>
                  <Drawer open={false} onClose={jest.fn} permanent={true}/>
                </GroupContext.Provider>
              </AuthContext.Provider>
            </MapContext.Provider>
          </ThemeProvider>
        );
    
        await waitFor(() => expect(screen.queryByText('drawer.selectLocation.title')).toBeTruthy());

        expect(listener).toEqual(expect.any(Function));

        expect(baseElement.querySelector(`#park-map-${cars[2].carId}-confirm`).getAttribute('disabled')).toEqual('');

        const latlng = new LatLng(50, 8);

        listener({latlng});

        userEvent.click(screen.queryByText('misc.confirm'));

        await waitFor(() => expect(groupContext.parkCar).toHaveBeenCalledTimes(1));
        expect(groupContext.parkCar).toHaveBeenCalledWith(groupContext.selectedGroup.id, cars[2].carId, latlng.lat, latlng.lng);
        expect(mapContext.setSelectionDisabled).toHaveBeenCalledTimes(2);
        expect(mapContext.setSelectionDisabled).toHaveBeenCalledWith(true);
        expect(mapContext.setSelectionDisabled).toHaveBeenCalledWith(false);
        expect(mapContext.setSelectedCar).toHaveBeenCalledTimes(1);
        expect(mapContext.setSelectedCar).toHaveBeenCalledWith(undefined);
      });
    });
  });
  
  describe('view location', () => {
    it('location button is disabled if latitude or longitude is null', async () => {
      const authContext = {
        isLoggedIn: true,
        user,
      } as AuthContext;

      const cars = [
        {
          carId: 1,
          groupId: 1,
          name: 'Car 1',
          latitude: 60,
          longitude: null,
          driverId: null,
          color: CarColor.Red,
        },
        {
          carId: 2,
          groupId: 1,
          name: 'Car 1',
          latitude: null,
          longitude: 9,
          driverId: null,
          color: CarColor.Black,
        },
        {
          carId: 3,
          groupId: 1,
          name: 'Car 1',
          latitude: 60,
          longitude: 23,
          driverId: null,
          color: CarColor.Blue,
        },
      ];
  
      const groupContext = {
        groups,
        selectedGroup: groups[0],
        groupCars: cars,
        parkCar: jest.fn().mockResolvedValue(undefined),
      } as GroupContext;

      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      } as Position;

      const modalContext = {
        goTo: jest.fn(),
      } as unknown as ModalContext;

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
      
      const snackContext = {} as SnackbarContext;
  
      (navigator.geolocation as any) = geolocation;

      const {baseElement} = customRender(
        modalContext, 
        authContext, 
        groupContext, 
        snackContext,
      );

      await waitFor(() => expect(baseElement.querySelector(`#view-car-${cars[0].carId}`)).toBeTruthy());
      expect(baseElement.querySelector(`#view-car-${cars[0].carId}`).getAttribute('disabled')).toEqual('');
      expect(baseElement.querySelector(`#view-car-${cars[1].carId}`).getAttribute('disabled')).toEqual('');
      expect(baseElement.querySelector(`#view-car-${cars[2].carId}`).getAttribute('disabled')).toBeFalsy();
    });

    it('clicking on location button will call fly on map', async () => {
      const authContext = {
        isLoggedIn: true,
        user,
      } as AuthContext;

      const cars = [
        {
          carId: 1,
          groupId: 1,
          name: 'Car 1',
          latitude: 60,
          longitude: 23,
          driverId: null,
          color: CarColor.White,
        },
      ];
  
      const groupContext = {
        groups,
        selectedGroup: groups[0],
        groupCars: cars,
        parkCar: jest.fn().mockResolvedValue(undefined),
      } as GroupContext;

      const position = {
        coords: {
          latitude: 50,
          longitude: 8,
        },
      } as Position;

      const modalContext = {
        goTo: jest.fn(),
      } as unknown as ModalContext;

      const geolocation = {
        getCurrentPosition: jest.fn().mockImplementation((result, error) => {
          result(position);
        }),
      } as unknown as Geolocation;
      
      const snackContext = {} as SnackbarContext;

      const map = {
        flyTo: jest.fn(),
      };

      const mapContext = {
        map,
      } as unknown as MapContext;
  
      (navigator.geolocation as any) = geolocation;

      const {baseElement} = render(
        <ThemeProvider theme={theme}>
          <MapContext.Provider value={mapContext}>
            <SnackbarContext.Provider value={snackContext}>
              <ModalContext.Provider value={modalContext}>
                <AuthContext.Provider value={authContext}>
                  <GroupContext.Provider value={groupContext}>
                    <Drawer open={false} onClose={jest.fn} permanent={true}/>
                  </GroupContext.Provider>
                </AuthContext.Provider>
              </ModalContext.Provider>
            </SnackbarContext.Provider>
          </MapContext.Provider>
        </ThemeProvider>
      );

      await waitFor(() => expect(baseElement.querySelector(`#view-car-${cars[0].carId}`)).toBeTruthy());
      userEvent.click(baseElement.querySelector(`#view-car-${cars[0].carId}`));

      await waitFor(() => expect(map.flyTo).toHaveBeenCalledTimes(1));
      expect(map.flyTo).toHaveBeenCalledWith(new LatLng(cars[0].latitude, cars[0].longitude), 18, {duration: 1});
    });
  });
});
