import { Request, Response } from "express";
import Task from "../models/task.model";
import {
  createTaskSchema,
  createTaskType,
  updateTaskSchema,
  updateTaskType,
} from "../schemas/task.schema";

// Render the list of tasks
export const renderTasks = async (req: Request, res: Response) => {
  const tasks = await Task.find().lean();
  res.render("tasks/list", { tasks });
};

// Render the form to create a new task
export const renderTaskForm = (req: Request, res: Response) => {
  res.render("tasks/create");
};

// Create a new task
export const createTask = async (
  req: Request<{}, {}, createTaskType>,
  res: Response
) => {
  try {
    const { title, description } = createTaskSchema.parse(req.body);
    const task = new Task({ title, description });
    await task.save();
    res.redirect("/tasks/list");
  } catch (errors) {
    if (errors.issues) {
      return res.render("tasks/create", { errors: errors.issues });
    }
    return res.render("tasks/create", {
      errors: [{ message: "Something went wrong" }],
    });
  }
};

// Delete a task by ID
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskDeleted = await Task.findByIdAndDelete(id);
  if (!taskDeleted) return res.sendStatus(404);
  res.redirect("/tasks/list");
};

// Render the form to edit a task
export const renderEditForm = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const task = await Task.findById(id).lean();
  if (!task) return res.sendStatus(404);
  return res.render("tasks/edit", { task });
};

// Update a task by ID
export const updateTask = async (
  req: Request<{ id: string }, {}, updateTaskType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedTaskData = updateTaskSchema.parse(req.body);
    const taskUpdated = await Task.findByIdAndUpdate(id, updatedTaskData, { new: true });
    if (!taskUpdated) return res.sendStatus(404);
    return res.redirect("/tasks/list");
  } catch (errors) {
    if (errors.issues) {
      return res.render("tasks/edit", {
        task: { ...req.body, _id: req.params.id },
        errors: errors.issues,
      });
    }
    return res.render("tasks/edit", {
      task: { ...req.body, _id: req.params.id },
      errors: [{ message: "Something went wrong" }],
    });
  }
};
