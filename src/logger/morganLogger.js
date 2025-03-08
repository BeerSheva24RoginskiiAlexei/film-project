import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";

const env = process.env.NODE_ENV || "development";

const allLogsStream = createStream("access.log", {
  interval: "1d",
  path: path.join(process.cwd(), "logs"),
});

const authErrorsStream = createStream("auth-errors.log", {
  interval: "1d",
  path: path.join(process.cwd(), "logs"),
});

const authErrorFilter = (req, res) => {
  return res.statusCode === 401 || res.statusCode === 403;
};


const morganLogger =
  env === "production"
    ? [
        morgan("combined", {
          stream: allLogsStream,
          skip: authErrorFilter,
        }),
        morgan("combined", {
          stream: authErrorsStream,
          skip: (req, res) => !authErrorFilter(req, res),
        }),
      ]
    : morgan("dev", { stream: process.stdout });

export default morganLogger;
