import { BASE_URL } from "../config";
import { makeGetRequest, makePostRequest } from "./http-services";

export const Login = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/api/users/login", false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const signUp = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/api/users", false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const getIpData = () => {
  return new Promise((resolve, reject) => {
    fetch("https://ipapi.co/json/", {
      method: "GET",
    })
      .then((res) => {
        resolve(res.json());
      })
      .catch((e) => {
        console.log("getIpData call error: ", e);
        reject(e);
      });
  });
};

export const getAllNotes = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(BASE_URL + "/api/notes", true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};
