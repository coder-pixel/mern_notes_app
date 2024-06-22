import {
  CLEAR_NOTES_DATA,
  CREATE_NEW_NOTE,
  DELETE_SINGLE_NOTE,
  GET_NOTES_LIST,
} from "../constants/notesConstants";

const initialState = {
  notes: [],
};

export const noteListReducer = (state = initialState, action) => {
  let newState = { ...state };

  switch (action?.type) {
    case GET_NOTES_LIST: {
      newState.notes = action?.payload;
      break;
    }

    case CREATE_NEW_NOTE: {
      newState.notes.push(action.payload);
      break;
    }

    case DELETE_SINGLE_NOTE: {
      const foundIndx = newState?.notes?.findIndex(
        (each) => each?._id === action?.payload
      );

      if (foundIndx > -1) {
        newState.notes = newState?.notes
          ?.slice(0, foundIndx)
          ?.concat(newState?.notes?.slice(foundIndx + 1));
      }

      break;
    }

    case CLEAR_NOTES_DATA: {
      newState = initialState;
      break;
    }

    default:
  }

  return newState;
};
