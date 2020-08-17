import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Button, Typography, Paper} from '@material-ui/core';
import {getRandomProfilePic} from 'lib';
import {useTranslation} from 'react-i18next';
import {grey} from '@material-ui/core/colors';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

type AxiosResponse = import('axios').AxiosResponse;
type AxiosError = import('axios').AxiosError;
type TCancel = import('axios').Cancel;


interface GenerateProfilePicProps {
  username: string;
  setOffset(value: React.SetStateAction<number>): void;
  offset: number;
}

const imgDim = 100;
const iconDim = 120;

const useStyle = makeStyles({
  img: {
    width: imgDim,
    height: imgDim,
  },
  imgContainer: {
    width: imgDim,
    height: imgDim,
    border: `2px solid ${grey[100]}`,
    borderRadius: '50%',
    overflow: 'hidden',
  },
  imgText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: imgDim,
    width: imgDim,
    fontSize: '0.8rem',
  },
  imgIconAlt: {
    fontSize: iconDim,
  },
});

export const GenerateProfilePic: React.FC<GenerateProfilePicProps> =
(props: GenerateProfilePicProps) => {
  const {username, offset, setOffset} = props;
  const [data, setData] = useState<string>();
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const incrementOffset = () => {
    setOffset((prev: number) => prev + 1);
  };

  /**
   * Every time either the username of the offset changes
   * get the appropriate profile picture
   */
  useEffect(() => {
    if (username.length > 0) {
      const request = getRandomProfilePic(username, offset);

      setLoading(true);
      request.request.then((response: AxiosResponse) => {
        setData(response.data);
        setLoading(false);
      }).catch((err: AxiosError | TCancel) => {
        if (!(err.constructor.name === 'Cancel')) {
          setData(undefined);
          setLoading(false);
        }
      });

      return () => request.cancel();
    }
  }, [username, offset]);

  /**
   * If the username changes reset the offset.
   */
  useEffect(() => {
    setOffset(0);
    // eslint-disable-next-line
  }, [username]);

  const classes = useStyle();

  return (
    <Grid
      container
      direction='column'
      justify='space-around'
      alignItems='center'
    >
      <Grid
        item

      >
        <Paper className={classes.imgContainer} elevation={5}>
          {data ?
          <img
            className={classes.img}
            src={data && URL.createObjectURL(data)}
            alt={t('form.profilePicture.alt')}
          /> :
          <Typography align='center' className={classes.imgText}>
            {
              loading ?
              t('misc.loading') :
              <AccountCircleIcon className={classes.imgIconAlt} />
            }
          </Typography>

          }
        </Paper>
      </Grid>
      <Grid item>
        <Button
          onClick={incrementOffset}
          color='secondary'
          disabled={!username || username.length <= 0 || loading}
        >
          {
            !username || username.length <= 0 ?
            t('form.profilePicture.noUsername') :
            t('form.profilePicture.generateNew')
          }
        </Button>
      </Grid>
    </Grid>

  );
};

export default GenerateProfilePic;
