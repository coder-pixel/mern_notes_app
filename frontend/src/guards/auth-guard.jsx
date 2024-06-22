// import { getToken } from "../http/token-interceptor";

export const isUserAuthenticated = () => {
  let isAuth = false;

  // const token = await getToken();
  if (localStorage?.userToken) {
    isAuth = true;
  }

  console.log();
  return isAuth;
};
