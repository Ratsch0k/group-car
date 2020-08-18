import React from 'react';
import {useRouteMatch, Route, Switch} from 'react-router-dom';
import {CreateGroup} from './CreateGroup';

export const Group: React.FC = () => {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create`}>
        <CreateGroup />
      </Route>
    </Switch>
  );
};

export default Group;
