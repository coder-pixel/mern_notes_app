import platform from "platform";

export default class DeviceMetaData {
  static getBrowser = () => {
    return platform.name;
  };

  static getOs = () => {
    return platform.os;
  };

  static getDevice = () => {
    return platform.product;
  };
}
