import { GET_NOTES_LIST } from "../constants/notesConstants";

export const listNotes = (data) => {
  return {
    type: GET_NOTES_LIST,
    payload: data,
  };
};
