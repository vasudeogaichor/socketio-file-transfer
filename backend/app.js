const restify = require("restify");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const corsMiddleware = require("restify-cors-middleware2");
const errorHandler = require("./errorHandler");
const {
  handleFileUpload,
  handleFileDownload,
  handleFileList,
  handleFileDelete,
} = require("./socketHandlers");
const MAX_BUFFER_SIZE = 1024 * 1024;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const server = restify.createServer();

const cors = corsMiddleware({
  origins: ["http://localhost:8503"],
  allowHeaders: ["API-Token"],
  exposeHeaders: ["API-Token-Expiry"],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.pre((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin || 'No Origin Header');
    return next();
});

server.opts("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8503");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.send(200);
  return next();
});

const io = socketIo(server.server, {
  path: "/socketio-file-transfer/socket.io",
  cors: {
    origin: ["http://localhost:8503", "https://vasudeogaichor.site"],
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: MAX_BUFFER_SIZE,
});

server.use(restify.plugins.bodyParser());
require("./routes/userRoutes")(server);

io.on("connection", (socket) => {
  console.log("User connected.");
  handleFileUpload(socket, MAX_BUFFER_SIZE);
  handleFileDownload(socket, MAX_BUFFER_SIZE);
  handleFileList(socket);
  handleFileDelete(socket);
});

// server.on('restifyError', errorHandler(req, res));

// Start server
const PORT = 8504;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
