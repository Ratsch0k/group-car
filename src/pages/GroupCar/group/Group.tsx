import React from 'react';
import {useRouteMatch, Route, Switch} from 'react-router-dom';
import {CreateGroup} from './CreateGroup';
import ManageGroup from './ManageGroup';

export const Group: React.FC = () => {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create`}>
        <CreateGroup />
      </Route>
      <Route path={`${path}/manage/:groupId`}>
        <ManageGroup />
      </Route>
    </Switch>
  );
};

export default Group;
