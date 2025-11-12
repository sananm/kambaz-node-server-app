import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(200);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  };

  const enrollInCourse = (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

  const unenrollFromCourse = (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };

  // Get enrolled users for a course
  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const userIds = enrollments.map(e => e.user);
    const users = db.users.filter(user => userIds.includes(user._id));
    res.json(users);
  };

  // Get courses for current user
  const findCoursesForCurrentUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const courses = dao.findCoursesForEnrolledUser(currentUser._id);
    res.json(courses);
  };

  // Enroll current user in a course
  const enrollCurrentUser = (req, res) => {
    const { courseId } = req.body;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    // Check if already enrolled
    const enrollments = enrollmentsDao.findEnrollmentsForUser(currentUser._id);
    const alreadyEnrolled = enrollments.some(e => e.course === courseId);

    if (alreadyEnrolled) {
      res.status(400).json({ message: 'Already enrolled' });
      return;
    }

    enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
    res.status(201).json({ message: 'Enrolled successfully' });
  };

  // Unenroll current user from a course
  const unenrollCurrentUser = (req, res) => {
    const courseId = req.query.courseId;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    if (!courseId) {
      res.status(400).json({ message: 'Course ID required' });
      return;
    }

    enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json({ message: 'Unenrolled successfully' });
  };

  // Enroll a specific user in a course (for faculty/admin)
  const enrollUserInCourse = (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.body;

    enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.status(201).json({ message: 'User enrolled successfully' });
  };

  // Unenroll a specific user from a course (for faculty/admin)
  const unenrollUserFromCourse = (req, res) => {
    const { courseId, userId } = req.params;

    enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.json({ message: 'User unenrolled successfully' });
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/current/courses", findCoursesForCurrentUser);
  app.post("/api/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.post("/api/users/:userId/courses/:courseId", enrollInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollFromCourse);

  // Current user enrollment endpoints
  app.post("/api/users/current/enrollments", enrollCurrentUser);
  app.delete("/api/users/current/enrollments", unenrollCurrentUser);

  // Course-specific enrollment endpoints
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/enrollments", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enrollments/:userId", unenrollUserFromCourse);
}
