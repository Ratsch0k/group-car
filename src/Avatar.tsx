import React from "react";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from "@material-ui/core/IconButton"

interface AvatarProps {
    iconName: string
}

const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {
    return (
        <IconButton color="inherit"><AccountCircleIcon className={props.iconName}/></IconButton>
    );
};

export default Avatar;