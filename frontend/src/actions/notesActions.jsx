import {
  CLEAR_NOTES_DATA,
  CREATE_NEW_NOTE,
  DELETE_SINGLE_NOTE,
  GET_NOTES_LIST,
} from "../constants/notesConstants";

export const listNotes = (data) => {
  return {
    type: GET_NOTES_LIST,
    payload: data,
  };
};

export const addNewNote = (data) => {
  return {
    type: CREATE_NEW_NOTE,
    payload: data,
  };
};

export const deleteNote = (data) => {
  return {
    type: DELETE_SINGLE_NOTE,
    payload: data,
  };
};

export const clearNotesData = (data) => {
  return {
    type: CLEAR_NOTES_DATA,
    payload: data,
  };
};
