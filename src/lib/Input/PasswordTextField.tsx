import React, {useState} from 'react';
import {TextField, InputAdornment, IconButton} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

type TextFieldProps = import('@material-ui/core').TextFieldProps;

export interface PasswordTextFieldProps {
  value?: string;
  onChange?(arg0: React.ChangeEvent<HTMLInputElement>): void;
  size?: TextFieldProps['size'];
  variant: TextFieldProps['variant'];
  id?: string;
  label?: string;
  error?: boolean;
  name?: string;
  helperText?: string;
  onBlur?(event: any): void;
}

const PasswordTextField: React.FC<PasswordTextFieldProps> =
  (props: PasswordTextFieldProps) => {
    const {
      label = 'Password *',
      size = 'medium',
      ...rest
    } = props;

    /**
   * Logic for showing or hiding the password
   */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () =>
      setShowPassword((prev: boolean) => !prev);


    return (
      <TextField
        label={label}
        type={showPassword ? 'text' : 'password'}
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
        size={size}
        {...rest as any} />
    );
  };

export default PasswordTextField;
