import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function ModulesDao() {
  const findModulesForCourse = (courseId) => model.find({ course: courseId });

  const findModuleById = (moduleId) => model.findById(moduleId);

  const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4() };
    return model.create(newModule);
  };

  const deleteModule = (moduleId) => model.deleteOne({ _id: moduleId });

  const updateModule = (moduleId, moduleUpdates) =>
    model.updateOne({ _id: moduleId }, { $set: moduleUpdates });

  return {
    findModulesForCourse,
    findModuleById,
    createModule,
    deleteModule,
    updateModule,
  };
}
