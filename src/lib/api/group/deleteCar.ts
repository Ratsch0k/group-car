import axios from 'axios';

/**
 * Sends the request to delete the car of the group
 * @param groupId Id of the group to which the car belongs
 * @param carId Id of the car within the group
 */
export const deleteCar = (groupId: number, carId: number) => {
  return axios.delete(`/api/group${groupId}/car/${carId}`);
};
