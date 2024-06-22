import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { isUserAuthenticated } from "../guards/auth-guard";

const PublicRoute = ({ component: Component, ...rest }) => {
  // const userAuthenticated = await isUserAuthenticated();
  // console.log({ userAuthenticated });

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isUserAuthenticated()) {
          return (
            <Redirect
              to={{
                pathname: rest?.redirectRoute,
                extras: { ...rest.location },
              }}
            />
          );
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
