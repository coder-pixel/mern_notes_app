import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { isUserAuthenticated } from "../guards/auth-guard";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isUserAuthenticated()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: rest?.redirectRoute,
                extras: { ...rest?.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
