import {
  TabPanel,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  CarWithDriver,
} from 'lib';
import {RefObject, useCallback, useEffect, useState} from 'react';
import {isAdmin as isAdminCheck} from 'lib/util';
import React from 'react';
import ManageGroupCarsTabAddFab from './ManageGroupCarsTabAddFab';
import {Portal} from '@material-ui/core';
import ManageGroupCarsList from './ManageGroupCarsList';
import io from 'socket.io-client';
import {SocketGroupActionData} from 'typings/socket';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';

/**
 * Props for the cars tab.
 */
export interface ManageGRoupCarsTabProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvitesAndCars;

  /**
   * Whether or not this component should be visible.
   */
  visible: boolean;

  /**
   * Will be forwarded to the top element.
   */
  className?: string;

  /**
   * Portal to display the fab.
   */
  fabPortal: RefObject<HTMLDivElement>;

  /**
   * Set state action for the group state.
   */
  setGroup: React.Dispatch<
  React.SetStateAction<
  GroupWithOwnerAndMembersAndInvitesAndCars | null
  >
  >;
}

/**
 * Cars tab for the group management.
 * @param props Props
 */
export const ManageGroupCarsTab: React.FC<ManageGRoupCarsTabProps> =
(props: ManageGRoupCarsTabProps) => {
  const {group, visible, className, fabPortal, setGroup} = props;
  const user = useAppSelector(getUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    isAdminCheck(group, user?.id));
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  const socketActionHandler = useCallback((data: SocketGroupActionData) => {
    switch (data.action) {
      case 'add': {
        if (group.cars.every((car) => car.carId !== data.car.carId)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setGroup((group) => {
            if (group) {
              return {
                ...group,
                cars: group.cars.concat(data.car),
              };
            } else {
              return group;
            }
          });
        }
        break;
      }
      case 'drive': {
        if (group.cars.some((car) =>
          car.carId === data.car.carId &&
          car.driverId !== data.car.driverId,
        )) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setGroup((group) => {
            if (group) {
              return {
                ...group,
                cars: group.cars.map((car) => {
                  if (car.carId === data.car.carId) {
                    return data.car;
                  }

                  return car;
                }),
              };
            } else {
              return group;
            }
          });
        }
        break;
      }
      case 'park': {
        if (group.cars.some((car) =>
          car.carId === data.car.carId &&
          car.latitude !== data.car.latitude &&
          car.longitude !== data.car.longitude,
        )) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setGroup((group) => {
            if (group) {
              return {
                ...group,
                cars: group.cars.map((car) => {
                  if (car.carId === data.car.carId) {
                    return data.car;
                  }

                  return car;
                }),
              };
            } else {
              return group;
            }
          });
        }
        break;
      }
    }
  }, [group.cars, setGroup]);

  useEffect(() => {
    if (socket) {
      socket.disconnect();
      setSocket(undefined);
    }

    setSocket(io(`/group/${group.id}`, {path: '/socket'}));

    return () => {
      if (socket) {
        socket?.disconnect();
        setSocket(undefined);
      }
    };
    /* eslint-disable-next-line */
  }, [group.id]);

  useEffect(() => {
    if (socket) {
      socket.off('update', socketActionHandler);
      socket.on('update', socketActionHandler);
    }

    return () => {
      socket?.off('update', socketActionHandler);
    };
  }, [socket, socketActionHandler]);

  useEffect(() => {
    setIsAdmin(isAdminCheck(group, user?.id));
  }, [user, group]);

  const addCar = (car: CarWithDriver) => {
    setGroup((prev) => {
      if (prev && prev.cars.every((item) => item.carId !== car.carId)) {
        return {
          ...prev,
          cars: prev.cars.concat(car),
        };
      } else {
        return prev;
      }
    });
  };

  return (
    <TabPanel
      className={className}
      visible={visible}
      id='group-tabpanel-cars'
      aria-labelledby='group-tab-cars'
    >
      <ManageGroupCarsList group={group}/>
      {
        isAdmin &&
        <Portal container={fabPortal.current} >
          <ManageGroupCarsTabAddFab
            group={group}
            addCar={addCar}
          />
        </Portal>
      }
    </TabPanel>
  );
};

export default ManageGroupCarsTab;
