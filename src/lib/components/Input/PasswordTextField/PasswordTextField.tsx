import React, {useState} from 'react';
import {InputAdornment, IconButton} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FormTextField from '../FormTextField';
import {Formik} from 'lib';

type TextFieldProps = import('@material-ui/core').TextFieldProps;

export interface PasswordTextFieldProps {
  value?: string;
  onChange?(arg0: React.ChangeEvent<HTMLInputElement>): void;
  size?: TextFieldProps['size'];
  variant?: TextFieldProps['variant'];
  id?: string;
  label?: string;
  error?: boolean;
  name?: string;
  helperText?: string;
  fullWidth?: boolean;
  onBlur?: TextFieldProps['onBlur'];
  formik?: Formik;
}

export const PasswordTextField: React.FC<PasswordTextFieldProps> =
  (props: PasswordTextFieldProps) => {
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
