import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import CoursesDao from "../Courses/dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();
  const enrollmentsDao = EnrollmentsDao();
  const coursesDao = CoursesDao();

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    // Default new signups to STUDENT role and set lastActivity
    const newUser = {
      ...req.body,
      role: req.body.role || "STUDENT",
      lastActivity: new Date()
    };
    const currentUser = await dao.createUser(newUser);
    req.session["currentUser"] = currentUser;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        res.status(500).json({ message: "Error saving session" });
      } else {
        res.json(currentUser);
      }
    });
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      // Update lastActivity timestamp
      await dao.updateUser(currentUser._id, { lastActivity: new Date() });
      currentUser.lastActivity = new Date();

      // Auto-enroll faculty and admin in all courses
      if (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") {
        const courses = await coursesDao.findAllCourses();
        for (const course of courses) {
          const isEnrolled = await enrollmentsDao.isUserEnrolled(
            currentUser._id,
            course._id
          );
          if (!isEnrolled) {
            await enrollmentsDao.enrollUserInCourse(
              currentUser._id,
              course._id
            );
          }
        }
      }

      req.session["currentUser"] = currentUser;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          res.status(500).json({ message: "Error saving session" });
        } else {
          res.json(currentUser);
        }
      });
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not sign out" });
      } else {
        res.sendStatus(200);
      }
    });
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json({ ...currentUser, ...userUpdates });
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    await dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };

  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  // Specific routes must come before parameterized routes
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}
