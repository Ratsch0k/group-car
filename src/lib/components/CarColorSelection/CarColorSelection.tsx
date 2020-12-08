import {Grid, MenuItem, Select} from '@material-ui/core';
import {CarColor} from 'lib';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {makeStyles} from '@material-ui/styles';
import getIcon from 'lib/util/getIcon';

/**
 * Props for car color selection.
 */
export interface CarColorSelectionProps {
  /**
   * The list of available colors.
   */
  availableColors: CarColor[];

  /**
   * Function which will be called if
   * the user selects a color.
   * @param color The selected color.
   */
  setColor(color: CarColor): void;

  /**
   * HTML id for the component.
   */
  id?: string;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  outlined: {
    paddingBottom: 6.5,
    paddingTop: 6.5,
  },
});

/**
 * Selection for car colors.
 * @param props Props
 */
export const CarColorSelection: React.FC<CarColorSelectionProps> =
(props: CarColorSelectionProps) => {
  const classes = useStyles();
  const {setColor: setColorParent, availableColors, id} = props;
  const [color, setColor] = useState<CarColor>(availableColors[0]);
  const {t} = useTranslation();

  /**
   * Handles change event of the selection element.
   * @param event The event
   */
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
              <img
                src={getIcon(color)}
                height='24x'
                width='24px'
                alt={`select-car-color-icon-${color}`}
              />
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
