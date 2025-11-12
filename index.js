import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();

// More permissive CORS for Vercel
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  /\.vercel\.app$/, // Match all Vercel domains
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });

    if (isAllowed) {
      console.log("CORS allowed origin:", origin);
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser handle it
  },
};

if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
}

app.use(session(sessionOptions));
app.use(express.json());

// Add response header logging middleware
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    console.log("Response headers:", res.getHeaders());
    return originalJson.call(this, data);
  };
  next();
});

// Root route for health check
app.get("/", (req, res) => {
  res.json({
    message: "Kambaz Node Server is running",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
Lab5(app);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port", process.env.PORT || 4000);
  console.log("Allowed origins:", allowedOrigins);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Session secure:", sessionOptions.cookie.secure);
  console.log("Session sameSite:", sessionOptions.cookie.sameSite);
});