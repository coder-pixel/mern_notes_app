/**
 *
 * Checks for auth token in auth state & storage
 *
 */
export const getToken = () => {
  return new Promise((resolve) => {
    let token = null;

    if (localStorage?.userToken) {
      token = localStorage?.userToken;
    }

    resolve(token);
  });
};
