import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../components/MainScreen";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RegexConfig } from "../../config/RegexConfig";
import "./LoginScreen.css";
import Loading from "../../components/Loading";
import { errorHandler, showToast } from "../../helper-methods";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import DeviceMetaData from "../../device-metadata";
import { Login, getIpData } from "../../http/http-calls";
import { updateUserData } from "../../actions/userActions";

const initialFormFields = {
  email: "",
  password: "",
};
const initialIsDirty = {
  email: false,
  password: false,
};
const LoginScreen = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState(initialFormFields);
  const [isDirty, setIsDirty] = useState(initialIsDirty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    loginLoading: false,
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

  const _onLoginComplete = (data) => {
    try {
      // localStorage.userInfo = JSON.stringify(data);
      localStorage.userToken = data?.token;

      dispatch(updateUserData(data));

      history.push("/mynotes");
    } catch (err) {
      console.log(err);
    }
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

  const _submitHandler = async (e) => {
    try {
      if (e) e.preventDefault();

      _manageLoading("loginLoading", true);
      const newFormFields = { ...formFields };
      const newIsDirty = _markAllDirty();

      const isFormValid = _validateFormFields({ newIsDirty, newFormFields });

      if (!isFormValid) {
        errorHandler({ reason: "Please enter required fields properly" });
        _manageLoading("loginLoading", false);
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
        email: formFields?.email,
        password: formFields?.password,
      };

      // const config = {
      //   headers: {
      //     "content-type": "application/json",
      //   },
      // };
      // const { data } = await axios.post("/api/users/login", payload, config);
      const res = await Login(payload);
      _onLoginComplete(res);

      showToast("Login successfully");
      _manageLoading("loginLoading", false);
    } catch (err) {
      errorHandler(err?.response?.data);
      _manageLoading("loginLoading", false);
    }
  };

  return (
    <MainScreen title="LOGIN">
      <div className="loginContainer">
        <Form onSubmit={_submitHandler}>
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
              value={formFields?.password}
              placeholder="Password"
              onChange={(e) => _handleFormFields(e.target.value, "password")}
            />
            {errors?.password ? (
              <p className="text-danger">{errors?.password}</p>
            ) : null}
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading?.loginLoading}
          >
            Submit {loading?.loginLoading ? <Loading size={15} /> : null}
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            New Customer ? <Link to="/register">Register Here</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default LoginScreen;
