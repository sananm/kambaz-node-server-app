import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao() {
  const enrollUserInCourse = (userId, courseId) => {
    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
      enrollmentDate: new Date(),
    });
  };

  const unenrollUserFromCourse = (userId, courseId) =>
    model.deleteOne({ user: userId, course: courseId });

  const findEnrollmentsForUser = (userId) => model.find({ user: userId });

  const findEnrollmentsForCourse = (courseId) =>
    model.find({ course: courseId });

  const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  };

  const unenrollAllUsersFromCourse = (courseId) =>
    model.deleteMany({ course: courseId });

  const isUserEnrolled = async (userId, courseId) => {
    const enrollment = await model.findOne({ user: userId, course: courseId });
    return !!enrollment;
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findCoursesForUser,
    findUsersForCourse,
    unenrollAllUsersFromCourse,
    isUserEnrolled,
  };
}
