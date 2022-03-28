import {createEntityAdapter} from '@reduxjs/toolkit';
import {GroupWithOwner} from 'lib';

/**
 * Groups adapter.
 */
export const groupsAdapter = createEntityAdapter<GroupWithOwner>();

export default groupsAdapter;
