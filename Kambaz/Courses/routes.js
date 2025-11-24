import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    await dao.deleteCourse(courseId);
    res.sendStatus(200);
  };

  const updateCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const courseUpdates = req.body;
    await dao.updateCourse(courseId, courseUpdates);
    res.json(courseUpdates);
  };

  const enrollInCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

  const unenrollFromCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };

  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  const findCoursesForCurrentUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const courses = await enrollmentsDao.findCoursesForUser(currentUser._id);
    res.json(courses);
  };

  const enrollCurrentUser = async (req, res) => {
    const { courseId } = req.body;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const isEnrolled = await enrollmentsDao.isUserEnrolled(
      currentUser._id,
      courseId
    );
    if (isEnrolled) {
      res.status(400).json({ message: "Already enrolled" });
      return;
    }

    await enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
    res.status(201).json({ message: "Enrolled successfully" });
  };

  const unenrollCurrentUser = async (req, res) => {
    const courseId = req.query.courseId;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    if (!courseId) {
      res.status(400).json({ message: "Course ID required" });
      return;
    }

    await enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json({ message: "Unenrolled successfully" });
  };

  const enrollUserInCourse = async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.body;
    await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.status(201).json({ message: "User enrolled successfully" });
  };

  const unenrollUserFromCourse = async (req, res) => {
    const { courseId, userId } = req.params;
    await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.json({ message: "User unenrolled successfully" });
  };

  // Specific routes must come before parameterized routes
  app.get("/api/users/current/courses", findCoursesForCurrentUser);
  app.post("/api/users/current/enrollments", enrollCurrentUser);
  app.delete("/api/users/current/enrollments", unenrollCurrentUser);

  app.get("/api/courses", findAllCourses);
  app.post("/api/courses", createCourse);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/enrollments", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enrollments/:userId", unenrollUserFromCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/:userId/courses/:courseId", enrollInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollFromCourse);
}
