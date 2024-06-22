import { CLEAR_USER_DATA, UPDATE_USER_DATA } from "../actions";
// import {
//   USER_LOGIN_FAIL,
//   USER_LOGIN_LOGOUT,
//   USER_LOGIN_REQUEST,
//   USER_LOGIN_SUCCESS,
// } from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  let newState = { ...state };

  switch (action?.type) {
    case UPDATE_USER_DATA: {
      newState = action.payload;
      break;
    }

    case CLEAR_USER_DATA: {
      newState = {};
      break;
    }

    default:
  }

  console.log("user state: ", newState);
  return newState;
};
