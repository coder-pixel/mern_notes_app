import toast from "react-hot-toast";
import { store as REDUX_STORE } from "../store";
import { clearUserData } from "../actions/userActions";
import moment from "moment";

export const logout = (navRef = null) => {
  // can also remove any redux data and anything else like disconnecting from socket etc, before logging out
  // localStorage.clear();
  localStorage.removeItem("userToken");
  REDUX_STORE.dispatch(clearUserData());

  if (navRef) {
    navRef.replace("/login");
    window.location.reload();
  }
};

export const showToast = (message, type = "success", duration = 4000) => {
  toast.dismiss();

  toast[type](message, { duration });
};

export const errorHandler = (error) => {
  console.log({ error });
  showToast(
    error?.reason?.length || error?.message?.length || error?.error?.length
      ? error?.reason || error?.message || error?.error
      : "Something went wrong, Try again later.",
    "error"
  );
};

export const renderFileOnType = (type, item, cb = () => {}) => {
  switch (type) {
    case "pdf":
      return <i className="fa fa-file-pdf-o docIcon" onClick={() => cb()} />;

    case "docx":
    case "doc":
      return <i className="fa fa-file-text-o docIcon" onClick={() => cb()} />;

    case "mp4":
      return <i className="fa fa-video-camera docIcon" onClick={() => cb()} />;

    case "jpg":
    case "jpeg":
    case "png":
      return (
        <img
          className="uploadImagePreview "
          src={item?.previewBlob || item?.url || item}
          alt="Icon"
          onClick={() => cb()}
        />
      );
    default:
      return <i className="fa fa-file docIcon" onClick={() => cb()} />;
  }
};

export const getFileExtension = (data) => {
  try {
    if (data?.uploadData?.name) {
      return data?.uploadData?.name?.split(".")?.pop();
    }
    if (data?.title) {
      return data?.title?.split(".")?.pop();
    }

    // get file extension
    return data?.split(".")?.pop();
  } catch (error) {
    console.log({ error });
    return "";
  }
};

export const formatDateAndTime = (date) => {
  if (!date) return "";

  return moment(new Date(date)).format("MMM DD, YYYY - hh:mm a");
};
