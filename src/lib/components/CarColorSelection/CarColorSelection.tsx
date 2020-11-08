import {Grid, MenuItem, Select} from '@material-ui/core';
import {CarColor} from 'lib';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RoomIcon from '@material-ui/icons/Room';
import {makeStyles} from '@material-ui/styles';

export interface CarColorSelectionProps {
  availableColors: CarColor[];
  setColor(color: CarColor): void;
  id?: string;
}

const useStyles = makeStyles({
  outlined: {
    paddingBottom: 6.5,
    paddingTop: 6.5,
  },
});

export const CarColorSelection: React.FC<CarColorSelectionProps> =
(props: CarColorSelectionProps) => {
  const classes = useStyles();
  const {setColor: setColorParent, availableColors, id} = props;
  const [color, setColor] = useState<CarColor>(availableColors[0]);
  const {t} = useTranslation();
  const handleChange = (event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown
  }>) => {
    const value = event.target.value as CarColor;
    setColor(value);
    setColorParent(value);
  };

  return (
    <Select
      value={color}
      onChange={handleChange}
      fullWidth
      variant='outlined'
      classes={{
        outlined: classes.outlined,
      }}
      id={id}
    >
      {availableColors.map((color) => (
        <MenuItem
          value={color}
          key={`select-car-color-${color}`}
        >
          <Grid container alignItems='center'>
            <Grid item>
              <RoomIcon htmlColor={color}/>
            </Grid>
            <Grid item>
              {t(`misc.color.${color}`)}
            </Grid>
          </Grid>
        </MenuItem>
      ))}
    </Select>
  );
};

export default CarColorSelection;
