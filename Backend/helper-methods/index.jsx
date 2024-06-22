// payload should be in object
const formatSuccessResponse = (payload) => {
  return { error: false, ...payload };
};
module.exports = { formatSuccessResponse };
