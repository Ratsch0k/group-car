import {Location} from 'history';
import store, {RootState} from 'redux/store';
import {history as appHistory} from 'redux/store';
import queryString from 'query-string';
import {
  goBack,
  replace as routerReplace,
  push,
  CallHistoryMethodAction,
} from 'connected-react-router';


export const goTo = (
  value: string | undefined | null,
  replace = false,
): CallHistoryMethodAction<unknown> => {
  const state = store.getState();

  if (value === undefined && appHistory.length === 1) {
    value = null;
    replace = true;
  }

  const query = queryString.stringify(
    {
      ...queryString.parse(state.router.location.search),
      modal: value,
    },
    {
      encode: false,
    },
  );

  if (value === undefined) {
    return goBack();
  } else {
    const newLocation: {search: string, state: unknown} = {
      search: '/',
      state: undefined,
    };

    newLocation.search = query;

    newLocation.state = {
      ...(state.router.location.state as unknown as Record<string, unknown>),
      model: value,
    };

    if (replace) {
      return routerReplace(newLocation);
    } else {
      return push(newLocation);
    }
  }
};

export const close = (): CallHistoryMethodAction<unknown> => {
  const state = store.getState();

  const search = queryString.parse(state.router.location.search);

  if (search.modal !== undefined) {
    delete search.modal;
  }

  const query = queryString.stringify(
    {
      ...search,
    },
    {
      encode: false,
    },
  );

  return push(state.router.location.pathname + '?' + query);
};

const getRoute = (search: string) => {
  let value = queryString.parse(search).modal || '/';
  if (Array.isArray(value) && value.length > 0) {
    value = value[0];
  } else if (Array.isArray(value)) {
    value = '/';
  }

  return value;
};

export const getModalRoute = (state: RootState): string =>
  getRoute(state.router.location.search);

export const getModalLocation = (state: RootState): Location<unknown> => ({
  state: undefined,
  pathname: getRoute(state.router.location.search),
  search: '',
  hash: '',
});
