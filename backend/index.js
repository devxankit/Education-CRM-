import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { dbConnect } from "./Config/dbConnect.js";
import { errorHandler } from "./Helpers/helpers.js";
import routes from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// ✅ Allowed CORS origins
const allowedOrigins = [
  "https://crm.cloudedata.in",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Provide io instance to controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Socket Connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Socket Disconnected:', socket.id);
  });
});

// ✅ Connect DB
dbConnect();

// ✅ CORS
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// ✅ Handle Pre-flight (Simplified for Express 5)
app.use(cors());

// ============================
// ✅ Normal Middlewares AFTER webhook
// ============================
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// ✅ Serve Static Frontend Files (Moved up for priority)
const publicPath = path.resolve(process.cwd(), "public");
app.use(express.static(publicPath));
app.use('/assets', express.static(path.join(publicPath, 'assets')));

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ✅ API routes
app.use("/", routes);

// ✅ Handle SPA Routing (Robust version)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('.') && !req.path.startsWith("/api/v1") && !req.path.startsWith("/health")) {
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// ✅ Error handler
app.use(errorHandler);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running Port ${PORT} ❤️`);
});
