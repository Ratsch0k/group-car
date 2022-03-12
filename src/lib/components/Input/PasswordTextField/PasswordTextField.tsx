import React, {useState} from 'react';
import {InputAdornment, IconButton} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FormTextField, {FormTextFieldProps} from '../FormTextField';

export const PasswordTextField =
  (props: FormTextFieldProps): JSX.Element => {
    const {
      label = 'Password *',
      size = 'small',
      ...rest
    } = props;

    /**
   * Logic for showing or hiding the password
   */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () =>
      setShowPassword((prev: boolean) => !prev);


    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
      <FormTextField
        label={label}
        type={showPassword ? 'text' : 'password'}
        data-testid='textfield'
        size={size}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={toggleShowPassword}
                edge='end'
                size={size}>
                {
                  showPassword ?
                    <VisibilityIcon /> :
                    <VisibilityOffIcon />
                }
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...rest as any} />
    );
  };

export default PasswordTextField;
