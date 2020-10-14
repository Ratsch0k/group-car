import {
  ListItem,
  ListItemProps,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {InviteWithUserAndInviteSender} from 'lib';
import React from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the invited list item.
 */
export interface ManageGroupMemberListInvitedItemProps extends ListItemProps {
  /**
   * Data of the invite.
   */
  invitedData: InviteWithUserAndInviteSender;
  /**
   * Whether this item is the last one.
   * If true, the divider will not be shown.
   */
  last?: boolean;
}

export const ManageGroupMemberListInvitedItem: React.FC<
  ManageGroupMemberListInvitedItemProps
> =
(props: ManageGroupMemberListInvitedItemProps) => {
  const {t} = useTranslation();
  const {invitedData, last, ...rest} = props;

  return (
    <ListItem divider={!last} {...rest as unknown}>
      <ListItemText
        inset
        primary={
          <Typography
            color='textSecondary'
          >
            {
              invitedData.User.username
            }
          </Typography>
        }
        secondary={
          t(
              'modals.group.manage.members.invitedBy',
              {by: invitedData.InviteSender.username},
          )
        }
      />
    </ListItem>
  );
};
