import { GET_NOTES_LIST } from "../constants/notesConstants";

export const noteListReducer = (state = { notes: [] }, action) => {
  let newState = { ...state };
  console.log("note state ", newState);

  switch (action.type) {
    case GET_NOTES_LIST: {
      newState = action.payload;
      break;
    }

    default:
  }

  return newState;
};
