import Parse from "parse";

class Logger {
  static log = async (message, payload) => {
    Parse.Cloud.run("log_event", { message, payload });
  };
}

export default Logger;
