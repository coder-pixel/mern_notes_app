import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
// import { createNoteAction } from "../../actions/notesActions";
import ReactMarkdown from "react-markdown";
import {
  errorHandler,
  formatDateAndTime,
  showToast,
} from "../../helper-methods";
import { createNewNote } from "../../http/http-calls";
import { addNewNote } from "../../actions/notesActions";

const initialFormFields = {
  title: "",
  content: "",
  category: "",
};
const initialIsDirty = {
  title: "",
  content: "",
  category: "",
};

function CreateNote({ history }) {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [isDirty, setIsDirty] = useState(initialIsDirty);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState({
    createLoading: false,
  });

  const _manageLoading = (key = "dataLoading", value = false) => {
    const newLoading = { ...loading };
    newLoading[key] = value;
    setLoading(newLoading);
  };

  const dispatch = useDispatch();

  const _resetState = () => {
    setFormFields(initialFormFields);
    setIsDirty(initialIsDirty);
    setErrors({});
  };

  const _setFormFields = (key = "", value = "") => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
    newIsDirty[key] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      const newErrors = {};
      let isFormValid = true;

      Object.keys(newFormFields)?.forEach((key) => {
        if (newIsDirty?.[key]) {
          switch (key) {
            case "title":
            case "content":
            case "category": {
              if (newFormFields?.[key]?.length) {
                newErrors[key] = null;
                newIsDirty[key] = false;
              } else {
                isFormValid = false;
                newErrors[key] = `*${key} is required`;
              }
              break;
            }

            default:
          }
        }
      });

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  // function to mark all formfields dirty for validation
  const _markAllDirty = () => {
    return new Promise((resolve) => {
      const newIsDirty = { ...isDirty };

      Object.keys(newIsDirty)?.forEach((key) => {
        newIsDirty[key] = true;
      });

      resolve(newIsDirty);
    });
  };

  const _createNote = async (e) => {
    try {
      if (e) e.preventDefault();

      _manageLoading("createLoading", true);

      const newFormFields = { ...formFields };

      const newIsDirty = await _markAllDirty();

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) {
        errorHandler({ reason: "Please fill all mandatory fields!" });
        _manageLoading("createLoading", false);
        return;
      }

      const payload = {
        title: formFields?.title,
        content: formFields?.content,
        category: formFields?.category,
      };

      const res = await createNewNote(payload);
      console.log({ res });

      dispatch(addNewNote(res?.createdNote));

      _manageLoading("createLoading", false);
      _resetState();
      showToast("Note added successfully");
      history.push("/mynotes");
    } catch (err) {
      errorHandler(err);
      _manageLoading("createLoading", false);
    }
  };

  useEffect(() => {}, []);

  return (
    <MainScreen title="Create a Note">
      <Card>
        <Card.Header>Create a new Note</Card.Header>
        <Card.Body>
          <Form onSubmit={_createNote}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                value={formFields?.title}
                placeholder="Enter the title"
                onChange={(e) => _setFormFields("title", e.target.value)}
              />
              {errors?.title ? (
                <p className="text-danger">{errors?.title}</p>
              ) : null}
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={formFields?.content}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => _setFormFields("content", e.target.value)}
              />
              {errors?.content ? (
                <p className="text-danger">{errors?.content}</p>
              ) : null}
            </Form.Group>
            {formFields?.content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{formFields?.content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="content">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="content"
                value={formFields?.category}
                placeholder="Enter the Category"
                onChange={(e) => _setFormFields("category", e.target.value)}
              />
              {errors?.category ? (
                <p className="text-danger">{errors?.category}</p>
              ) : null}
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={loading?.createLoading}
            >
              {loading?.createLoading ? (
                <i className="fa fa-spinner fa-spin mr-1" />
              ) : null}
              Create Note
            </Button>
            <Button
              className="mx-2"
              onClick={_resetState}
              variant="danger"
              disabled={loading?.createLoading}
            >
              Reset Fields
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Creating on - {formatDateAndTime(new Date())}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default CreateNote;
