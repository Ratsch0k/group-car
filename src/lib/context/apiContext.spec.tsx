import React from 'react';
import { render } from "@testing-library/react";
import ApiProvider, { ApiContext } from './apiContext';
import * as apiCalls from '../api';

it('contains all api calls from api folder', () => {
  let api;

  render(
    <ApiProvider>
      <ApiContext.Consumer>
        {(context) => {
          api = context;
          return (
            <div>
              TEST
            </div>
          );
        }}
      </ApiContext.Consumer>
    </ApiProvider>
  );

  expect(Object.keys(api)).toEqual(Object.keys(apiCalls));
});