import React from 'react';
import {useShallowAppSelector} from '../../lib/redux/hooks';
import {
  getModalLocation,
} from '../../lib/redux/slices/modalRouter/modalRouterSlice';
import {Route, Switch} from 'react-router-dom';
import Settings from './settings';
import {Invites} from './invites';
import {Group} from './group';

export const GroupCarModals = (): JSX.Element => {
  const modalLocation = useShallowAppSelector(getModalLocation);

  return (
    <Switch location={modalLocation}>
      <Route path='/settings'>
        <Settings/>
      </Route>
      <Route path='/invites'>
        <Invites/>
      </Route>
      <Route path='/group'>
        <Group/>
      </Route>
    </Switch>
  );
};

export default GroupCarModals;
