import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@material-ui/core';
import {theme, Drawer, AuthContext, GroupContext} from '../../../lib';
import { CarColor, CarWithDriver, GroupWithOwnerAndCars } from '../../api';
import { IUser } from '../../context';
import { ModalContext } from '../../ModalRouter';
import userEvent from '@testing-library/user-event';

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
  ) => {
    return render(
        <ThemeProvider theme={theme}>
          <ModalContext.Provider value={modalContext}>
            <AuthContext.Provider value={authContext}>
              <GroupContext.Provider value={groupContext}>
                <Drawer open={false} onClose={jest.fn} permanent={true}/>
              </GroupContext.Provider>
            </AuthContext.Provider>
          </ModalContext.Provider>
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

    const {baseElement} = customRender(modalContext, authContext, groupContext);

    expect(baseElement).toMatchSnapshot();
  });

  it('renders select group button if user has at least ' +
  'one group and none is selected', () => {
    const authContext = {
      isLoggedIn: true,
    } as AuthContext;
    const groupContext = {
      groups: [groups[0]],
      selectedGroup: null,
    } as GroupContext;
    const modalContext = {} as ModalContext;

    const {baseElement} = customRender(modalContext, authContext, groupContext);

    expect(baseElement).toMatchSnapshot();
  });

  it('renders list of cars correctly if a group is selected', () => {
    const authContext = {
      isLoggedIn: true,
    } as AuthContext;
    const groupContext = {
      groups: groups,
      selectedGroup: groups[0],
      groupCars: cars,
    } as GroupContext;
    const modalContext = {
      goTo: jest.fn(),
    } as unknown as ModalContext;

    const {baseElement} = customRender(modalContext, authContext, groupContext);

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

    const {baseElement} = customRender(modalContext, authContext, groupContext);

    userEvent.click(baseElement.querySelector(`#drive-car-${cars[0].carId}`));
    
    await waitFor(() => expect(groupContext.driveCar).toBeCalledTimes(1));
    expect(groupContext.driveCar).toBeCalledWith(groups[0].id, cars[0].carId);
  });
});
