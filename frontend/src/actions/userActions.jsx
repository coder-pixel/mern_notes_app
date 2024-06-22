import { UPDATE_USER_DATA, CLEAR_USER_DATA } from ".";

export const updateUserData = (userData) => {
  console.log({ userData });
  return {
    type: UPDATE_USER_DATA,
    payload: { userInfo: userData },
  };
};

export const clearUserData = () => {
  return {
    type: CLEAR_USER_DATA,
  };
};
