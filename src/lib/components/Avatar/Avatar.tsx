import React, {useEffect} from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

interface AvatarProps {
  username?: string;
}

const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {
  const {username} = props;

  useEffect(() => {
    if (username) {

    }
  }, [username]);

  return (
    <AccountCircleIcon fontSize='large'/>
  );
};

export default Avatar;
