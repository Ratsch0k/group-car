import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from '@material-ui/core';
import {theme, Drawer, AuthContext, GroupContext} from 'lib';

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
  };

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
    authContext: AuthContext,
    groupContext: GroupContext,
  ) => {
    return render(
        <ThemeProvider theme={theme}>
          <AuthContext.Provider value={authContext}>
            <GroupContext.Provider value={groupContext}>
              <Drawer open={false} onClose={jest.fn} permanent={true}/>
            </GroupContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
    );
  };

  it('renders create group button if user has no groups', () => {
    const {baseElement} = customRender({isLoggedIn: true}, {groups: []});

    expect(baseElement).toMatchSnapshot();
  });
});
