import { errorHandler } from "../helper-methods";
import { getToken } from "./token-interceptor";

let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const structureQueryParams = (params) => {
  let queryStrings = "?";
  const keys = Object.keys(params);

  keys?.forEach((key, index) => {
    queryStrings += key + "=" + params[key];

    if (params?.[keys?.[index + 1]]) {
      queryStrings += "&";
    }
  });

  return queryStrings;
};

export const handleErrorIfAvailable = (httpResponse) => {
  switch (httpResponse?.status) {
    // token expired or invalid  -- not authorized
    case 401: {
      // remove any redux state or any connections like socket here

      console.log("removing");
      localStorage.clear();
      window.location.reload();
      break;
    }
    case 403: {
      //   errorHandler({ reason: "You don't have permission for this action" });
      break;
    }

    default:
  }
};

// https calls services -- GET/POST/PUT/DELETE
export const makeGetRequest = async (
  url,
  attachToken = false,
  params = null,
  header
) => {
  let queryString = "";
  if (params) {
    queryString = structureQueryParams(params);
  }

  if (header) {
    // it's proper usage ??
    header?.forEach((each) => {
      const key = Object.keys(each)[0];
      headers[key] = each[key];
    });
  }

  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
        console.log(headers);
      }
    } catch (err) {
      console.log({ err });
    }
  }

  return new Promise((resolve, reject) => {
    try {
      fetch(url + queryString, {
        method: "GET",
        headers: headers,
      })
        .then((res) => {
          console.log({ res });
          handleErrorIfAvailable(res);
          return res.json();
        })
        .then((jsonResponse) => {
          console.log({ jsonResponse });
          if (jsonResponse?.error === false) {
            resolve(jsonResponse);
          } else {
            console.log(jsonResponse);
            reject(jsonResponse);
          }
        })
        .catch((e) => {
          console.log("XHR GET Error: ", e);
          reject(e);
        });
    } catch (err) {
      console.log({ err });
      reject();
    }
  });
};

export const makePostRequest = async (
  url,
  attachToken = false,
  params = {}
) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (attachToken) {
    try {
      const authToken = await getToken();
      if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
      }
    } catch (e) {
      console.log("Error fetching auth token: ", e);
    }
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params),
      })
        .then((res) => {
          handleErrorIfAvailable(res);
          return res.json();
        })
        .then((jsonResponse) => {
          if (jsonResponse.error === false) {
            resolve(jsonResponse);
          } else {
            console.log(jsonResponse);
            reject(jsonResponse);
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log({ error });
      reject();
    }
  });
};
