const express = require("express");
const { body } = require("express-validator");
const todosController = require("../controllers/todo");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// router.get("/todos", isAuth, todosController.getTodos);

router.get("/todos", isAuth, todosController.getUserTodos);

router.post(
  "/todo",
  isAuth,
  [
    body("title").trim().notEmpty(),
    body("content").trim().notEmpty(),
    body("titleColor").trim().notEmpty(),
  ],

  todosController.createTodo
);

router.patch(
  "/todo/:todoId",
  isAuth,
  [body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  todosController.updateTodo
);

router.patch(
  "/todo-status/:todoId",
  isAuth,
  [body("status").isBoolean()],
  todosController.updateStatus
);

router.get("/completed-todos", isAuth, todosController.getCompletedTasks);

router.delete(
  "/todo/:todoId",
  isAuth,

  todosController.deleteTodo
);

module.exports = router;
