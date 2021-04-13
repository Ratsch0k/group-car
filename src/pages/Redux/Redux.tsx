import {Button} from '@material-ui/core';
import React from 'react';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  decrement,
  groupSelector,
  hasFailed,
  increment,
  isLoading,
  wasSuccessful,
  testThunk,
} from 'redux/slices/group/groupSlice';

export const Redux: React.FC = () => {
  const groupTest = useAppSelector(groupSelector);
  const loading = useAppSelector(isLoading);
  const successful = useAppSelector(wasSuccessful);
  const failed = useAppSelector(hasFailed);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        Counter: {groupTest}
      </div>
      <Button onClick={() => dispatch(increment())}>
        INCREMENT
      </Button>
      <Button onClick={() => dispatch(decrement())}>
        DECREMENT
      </Button>
      <br />
      <div>
        IS LOADING: {loading ? 'YES' : 'NO'}
      </div>
      <div>
        SUCCESSFUL: {successful ? 'YES' : 'NO'}
      </div>
      <div>
        FAILED: {failed ? 'YES' : 'NO'}
      </div>
      <div>
        <Button onClick={async () => {
          const result = await dispatch(testThunk());
          console.dir(result);
        }} disabled={loading}>
          TEST ASYNC
        </Button>
      </div>
    </div>
  );
};

export default Redux;
