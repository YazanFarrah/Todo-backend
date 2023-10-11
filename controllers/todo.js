const { validationResult } = require("express-validator");
const Todo = require("../models/todo");
const User = require("../models/user");
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ msg: "Fetched successfully.", todos: todos });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.getUserTodos = async (req, res, next) => {
  try {
    const userId = req.userId;
    const todos = await Todo.find({ creator: userId });
    if (!todos) {
      const error = new Error("No todos Found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: "Fetched successfully.", todos: todos });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.createTodo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const userId = req.userId;

    const { title, content, titleColor } = req.body;
    const todo = new Todo({
      title: title,
      titleColor: titleColor,
      content: content,
      creator: userId,
    });
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Some error occured, please refresh the app.");
      error.statusCode = 409;
      throw error;
    }
    user.todos.push(todo);
    await todo.save();
    await user.save();

    res.status(201).json({
      msg: "Todo created",
      todo: todo,
      creator: { _id: user._id, name: user.name },
    });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.todoId;
    const todo = await Todo.findById(todoId);

    if (!todo) {
      const error = new Error("Todo not found!");
      error.statusCode = 404;
      throw error;
    }
    if (todo.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    await Todo.findByIdAndRemove(todoId);

    const user = await User.findById(req.userId);
    //here i'm using pull "from mongoose" to the user's post so it's cleared from the database
    await user.todos.pull(todoId);
    await user.save();
    res.status(200).json({ msg: "Todo deleted!" });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.updateTodo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const todoId = req.params.todoId;
    const todo = await Todo.findById(todoId).populate("creator");
    if (!todo) {
      const error = new Error("Todo not found!");
      error.statusCode = 404;
      throw error;
    }
    const { title, content, titleColor } = req.body;

    if (todo.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    todo.title = title;
    todo.content = content;
    todo.titleColor = titleColor;
    const result = await todo.save();

    res.status(200).json({ msg: "Todo updated!", todo: todo });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const todoId = req.params.todoId;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      const error = new Error("Todo not found!");
      error.statusCode = 404;
      throw error;
    }
    const status = req.body.status;

    todo.completed = status;

    await todo.save();
    res.status(200).json({ msg: "Status updated successfully" });
  } catch (e) {
    handleErrors(e, next);
  }
};

function handleErrors(e, next) {
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  next(e);
}
