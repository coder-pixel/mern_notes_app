import React, { useEffect, useState } from "react";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainScreen from "../../components/MainScreen";
import Swal from "sweetalert2";
import { deleteNote, listNotes } from "../../actions/notesActions";
import Loading from "../../components/Loading";
import {
  errorHandler,
  formatDateAndTime,
  showToast,
} from "../../helper-methods";
import { deleteSingleNote, getAllNotes } from "../../http/http-calls";

function MyNotes({ search }) {
  const dispatch = useDispatch();

  const noteList = useSelector((state) => state?.noteList?.notes);

  const [loading, setLoading] = useState({
    dataLoading: false,
    deleteLoading: false,
  });

  const _manageLoading = (key = "dataLoading", value = false) => {
    const newLoading = { ...loading };
    newLoading[key] = value;
    setLoading(newLoading);
  };

  const userInfo = useSelector((state) => state?.user?.userInfo);

  const _deleteNoteAlert = async (id) => {
    try {
      if (!id) return;

      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to remove this note.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f16667",
        cancelButtonColor: "#111",
        confirmButtonText: "Yes, remove it!",
      });

      if (result.isConfirmed) {
        _deleteNote(id);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const _deleteNote = async (noteId) => {
    try {
      const res = await deleteSingleNote(noteId);

      if (!res?.error) {
        dispatch(deleteNote(noteId));
        showToast("Note Deleted Successfully");
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const _getAllNotes = async () => {
    try {
      _manageLoading("dataLoading", true);
      const res = await getAllNotes();

      dispatch(listNotes(res?.notes));
      _manageLoading("dataLoading", false);
      showToast("Notes fetched successfully");
    } catch (err) {
      _manageLoading("dataLoading", false);
      errorHandler(err);
    }
  };

  useEffect(() => {
    if (!noteList?.length) {
      _getAllNotes();
    }
  }, []);

  return (
    <MainScreen title={`Welcome Back, ${userInfo?.name}`}>
      <Link to="/createnote">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create new Note
        </Button>
      </Link>

      {noteList?.length ? (
        noteList
          ?.filter((filteredNote) =>
            filteredNote?.title?.toLowerCase()?.includes(search?.toLowerCase())
          )
          ?.sort((a, b) => new Date(b?.createdAt) - new Date(a.createdAt)) // sorting in descending order by date i.e latest date on top
          ?.map((note) => (
            <Accordion key={note?._id}>
              <Card style={{ margin: 10 }} key={note?._id}>
                <Card.Header style={{ display: "flex" }}>
                  <span
                    // onClick={() => ModelShow(note)}
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    <Accordion.Toggle
                      as={Card.Text}
                      variant="link"
                      eventKey="0"
                    >
                      {note?.title}
                    </Accordion.Toggle>
                  </span>

                  <div>
                    <Button href={`/note/${note?._id}`}>Edit</Button>
                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={() => _deleteNoteAlert(note?._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <h4>
                      <Badge variant="success">
                        Category - {note?.category}
                      </Badge>
                    </h4>
                    <blockquote className="blockquote mb-0">
                      <ReactMarkdown>{note?.content}</ReactMarkdown>
                      <footer className="blockquote-footer">
                        Created on{" "}
                        <cite title="Source Title">
                          {formatDateAndTime(note?.createdAt)}
                        </cite>
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ))
      ) : loading?.dataLoading ? (
        <Loading />
      ) : (
        <p className="d-flex justify-content-center">No Data Found</p>
      )}
    </MainScreen>
  );
}

export default MyNotes;
