import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {makeStyles} from '@material-ui/styles';
import {useTranslation} from 'react-i18next';

interface AvatarProps {
  userId?: number;
}

/**
 * Dimension of avatar in header bar.
 */
const dim = 40;

const useStyle = makeStyles({
  img: {
    borderRadius: '50%',
    width: dim,
    height: dim,
  },
  icon: {
    fontSize: dim,
  },
});

const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {
  const {userId} = props;
  const classes = useStyle();
  const {t} = useTranslation();

  if (userId) {
    return (
      <img
        className={classes.img}
        src={`/api/user/${userId}/profile-pic`}
        alt={t('misc.avatar')}
      />
    );
  } else {
    return (
      <AccountCircleIcon className={classes.icon} />
    );
  }
};

export default Avatar;
