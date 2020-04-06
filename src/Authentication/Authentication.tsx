import React from 'react';
import TextField from '@material-ui/core/TextField';

const Authentication: React.FC = () => {
  return (
    <form noValidate>
      <TextField
        placeholder="Username"/>
    </form>
  );
};

export default Authentication;
