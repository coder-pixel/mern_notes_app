import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MainScreen from "../../components/MainScreen";
import Loading from "../../components/Loading";
import {
  errorHandler,
  getFileExtension,
  renderFileOnType,
  showToast,
} from "../../helper-methods";
import { RegexConfig } from "../../config/RegexConfig";
import { cloudinaryURL } from "../../config";
import DeviceMetaData from "../../device-metadata";
import { getIpData, signUp } from "../../http/http-calls";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../actions/userActions";

const initialFormFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  selectedFile: null,
};
const initialIsDirty = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
  selectedFile: null,
};

const RegisterScreen = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState(initialFormFields);
  const [isDirty, setIsDirty] = useState(initialIsDirty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    registerLoading: false,
  });

  const _manageLoading = (key, value) => {
    const newLoading = { ...loading };

    newLoading[key] = value;
    setLoading(newLoading);
  };

  const _handleFormFields = (value, key) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
    newIsDirty[key] = true;

    setFormFields(newFormFields);
    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    const newErrors = { ...errors };
    let isFormValid = true;

    Object.keys(newFormFields)?.forEach((each) => {
      if (newIsDirty?.[each]) {
        switch (each) {
          case "name": {
            if (!newFormFields?.[each]) {
              newErrors[each] = "*Required";
              isFormValid = false;
            } else {
              newErrors[each] = null;
              newIsDirty[each] = false;
            }
            break;
          }

          case "email": {
            if (!newFormFields?.[each]) {
              newErrors[each] = "*Required";
              isFormValid = false;
            } else if (!RegexConfig?.email?.test(newFormFields?.[each])) {
              newErrors[each] = "*Invalid email address";
              isFormValid = false;
            } else {
              newErrors[each] = null;
              newIsDirty[each] = false;
            }
            break;
          }

          case "password": {
            if (!newFormFields?.[each]) {
              newErrors[each] = "*Required";
              isFormValid = false;
            } else {
              newErrors[each] = null;
              newIsDirty[each] = false;
            }
            break;
          }

          case "confirmPassword": {
            if (!newFormFields?.[each]) {
              newErrors[each] = "*Required";
              isFormValid = false;
            } else if (newFormFields?.[each] !== newFormFields?.password) {
              newErrors[each] = "*Passwords do not match";
              isFormValid = false;
            } else {
              newErrors[each] = null;
              newIsDirty[each] = false;
            }
            break;
          }

          case "selectedFile": {
            if (!newFormFields?.[each]?.file) {
              newErrors[each] = "*Required";
              isFormValid = false;
            } else {
              newErrors[each] = null;
              newIsDirty[each] = false;
            }
            break;
          }
          default:
        }
      }
    });

    setErrors(newErrors);
    setIsDirty(newIsDirty);

    return isFormValid;
  };

  const _markAllDirty = () => {
    const newIsDirty = { ...isDirty };

    Object.keys(isDirty)?.forEach((each) => {
      newIsDirty[each] = true;
    });

    setIsDirty(newIsDirty);
    return newIsDirty;
  };

  const _getDeviceDetails = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const deviceDetails = {};
        deviceDetails["name"] =
          DeviceMetaData.getBrowser() + " on " + DeviceMetaData.getOs();
        deviceDetails["ipAddress"] = (await getIpData())[0];

        resolve(deviceDetails);
      } catch (err) {
        reject(err);
      }
    });
  };

  const _onSignupComplete = (data) => {
    try {
      // localStorage.userInfo = JSON.stringify(data);
      localStorage.userToken = data?.token;
      dispatch(updateUserData(data));

      history.push("/mynotes");
    } catch (err) {
      console.log(err);
    }
  };

  const _onRegister = async (e) => {
    try {
      if (e) e.preventDefault();

      _manageLoading("registerLoading", true);
      const newFormFields = { ...formFields };
      const newIsDirty = _markAllDirty();

      const isFormValid = _validateFormFields({ newIsDirty, newFormFields });

      if (!isFormValid) {
        errorHandler({ reason: "Please enter required fields properly" });
        _manageLoading("registerLoading", false);
        return;
      }

      const detail = await _getDeviceDetails();
      console.log("deviceDetails>> ", detail);

      const payload = {
        // backend for this not prepared yet
        // deviceDetails: {
        //   deviceId: detail?.deviceId,
        //   ipAddress: detail?.ipAddress,
        //   name: detail?.name,
        // },
        name: formFields?.name,
        email: formFields?.email,
        password: formFields?.password,
      };

      console.log({ formFields });

      if (formFields?.selectedFile?.file) {
        const formData = new FormData();
        formData.append("name", formFields?.selectedFile?.file);
        formData.append("file", formFields?.selectedFile?.file?.uploadData);

        const res = await fetch(cloudinaryURL, {
          method: "POST",
          body: formData,
        });

        const data = await res?.json();

        if (data?.secure_url) {
          payload["pic"] = data?.secure_url || "";
        }
      }

      // const config = {
      //   headers: {
      //     "content-type": "application/json",
      //   },
      // };
      // const { data } = await axios.post("/api/users", payload, config);

      const res = await signUp(payload);
      _onSignupComplete(res);

      showToast("User added successfully");
      _manageLoading("registerLoading", false);
    } catch (err) {
      errorHandler(err?.response?.data);
      _manageLoading("registerLoading", false);
    }
  };

  const _uploadProfilePicture = (event) => {
    console.log({ event });
    try {
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length
      ) {
        console.log(event);
        const newFormFields = { ...formFields };

        let objFile = event.target.files[0];
        let objFileType = objFile.type.split("/")[0];

        if (objFileType === "image") {
          newFormFields["selectedFile"] = {};

          newFormFields.selectedFile["file"] = {
            previewBlob: URL.createObjectURL(objFile),
            uploadData: objFile,
            type: objFileType === "application" ? "pdf" : objFileType,
          };

          setFormFields(newFormFields);
        } else {
          errorHandler({ reason: "Only Image files are allowed" });
        }
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const _deleteImage = () => {
    const newFormFields = { ...formFields };

    newFormFields["selectedFile"] = null;

    setFormFields(newFormFields);
  };

  return (
    <MainScreen title="REGISTER">
      <div className="loginContainer">
        {/* {error && <ErrorMessage variant="danger">{error}</ErrorMessage>} */}
        {/* {message && <ErrorMessage variant="danger">{message}</ErrorMessage>} */}
        {/* {loading && <Loading />} */}
        <Form onSubmit={_onRegister}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={formFields?.name}
              placeholder="Enter name"
              onChange={(e) => _handleFormFields(e.target.value, "name")}
            />
            {errors?.name ? (
              <p className="text-danger">{errors?.name}</p>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={formFields?.email}
              placeholder="Enter email"
              onChange={(e) => _handleFormFields(e.target.value, "email")}
            />
            {errors?.email ? (
              <p className="text-danger">{errors?.email}</p>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              autoComplete="false"
              value={formFields?.password}
              placeholder="Password"
              onChange={(e) => _handleFormFields(e.target.value, "password")}
            />
            {errors?.password ? (
              <p className="text-danger">{errors?.password}</p>
            ) : null}
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={formFields?.confirmPassword}
              autoComplete="false"
              placeholder="Confirm Password"
              onChange={(e) =>
                _handleFormFields(e.target.value, "confirmPassword")
              }
            />
            {errors?.confirmPassword ? (
              <p className="text-danger">{errors?.confirmPassword}</p>
            ) : null}
          </Form.Group>

          {/* {picMessage && (
            <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
          )} */}
          {console.log({ formFields })}
          <Form.Group
            controlId="pic"
            className="d-flex flex-direction-column align-items-start"
          >
            <Form.Label>Profile Picture</Form.Label>
            <Form.File
              onChange={(e) => {
                e.target.files = null;
                _uploadProfilePicture(e);
              }}
              id="custom-file"
              type="image/x-png,image/gif,image/jpeg"
              label="Upload Profile Picture"
              custom
            />
            {errors?.confirmPassword ? (
              <p className="text-danger">{errors?.confirmPassword}</p>
            ) : null}

            <div className="d-flex mt-2 overflow-auto">
              {formFields?.selectedFile?.file ? (
                <div className="mr-2 my-2">
                  {formFields?.selectedFile?.file?.previewBlob &&
                    renderFileOnType(
                      getFileExtension(formFields?.selectedFile?.file),
                      formFields?.selectedFile?.file
                    )}

                  <Button
                    className="removeAttachment"
                    onClick={() => _deleteImage()}
                  >
                    <i className="fa fa-times" />
                  </Button>
                </div>
              ) : null}
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading?.registerLoading}
          >
            Register {loading?.registerLoading ? <Loading size={15} /> : null}
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Have an Account ? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterScreen;
