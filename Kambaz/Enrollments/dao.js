import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const enrollUserInCourse = (userId, courseId) => {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    const { enrollments } = db;
    db.enrollments = enrollments.filter(
      (enrollment) =>
        !(enrollment.user === userId && enrollment.course === courseId)
    );
  };

  const findEnrollmentsForUser = (userId) => {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  };

  const findEnrollmentsForCourse = (courseId) => {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.course === courseId);
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse
  };
}
