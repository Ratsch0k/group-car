import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {makeStyles} from '@material-ui/styles';
import {Avatar, useMediaQuery, useTheme} from '@material-ui/core';

/**
 * Props for the UserAvatar.
 */
interface AvatarProps {
  /**
   * Id of the user.
   */
  userId?: number;
  /**
   * Size of the icon.
   */
  size?: 'small' | 'medium' | 'large' | number;
}

/**
 * Dimension of avatar in header bar.
 */
interface UserAvatarDim {
  [index: string]: number;
  small: number;
  medium: number;
  large: number;
}
const avatarDims: UserAvatarDim = {
  small: 30,
  medium: 40,
  large: 50,
};

/**
 * UserAvatar component.
 * If the user is logged in it will display the avatar
 * if the user, if not an icon will be displayed.
 * @param props Props
 */
export const UserAvatar: React.FC<AvatarProps> = (props: AvatarProps) => {
  const {userId, size} = props;
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Depending on size in props change width and height
  let dim;
  if (size !== undefined) {
    if (typeof size === 'number') {
      dim = size;
    } else {
      dim = avatarDims[size];
    }
  } else {
    dim = avatarDims.medium;
  }

  const useStyle = makeStyles({
    avatar: {
      width: dim,
      height: dim,
      margin: 'auto',
    },
    icon: {
      fontSize: dim,
      margin: 'auto',
    },
  });
  const classes = useStyle();

  if (userId) {
    return (
      <Avatar
        className={classes.avatar}
        src={`/api/user/${userId}/profile-pic`}
        alt={`user-${props.userId}`}
      />
    );
  } else {
    return (
      <AccountCircleIcon
        className={classes.icon}
        fontSize={smallerXs ? 'small' : 'large'}
      />
    );
  }
};

export default UserAvatar;
