const express = require("express");
const { body } = require("express-validator");
const todosController = require("../controllers/todo");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/todos", isAuth, todosController.getTodos);

router.post(
  "/todo",
  isAuth,
  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 3 }),
  ],

  todosController.createTodo
);

router.patch("/todo/:todoId", isAuth, todosController.updateTodo);

router.patch(
  "/todo-status/:todoId",
  isAuth,
  [body("status").isBoolean()],
  todosController.updateStatus
);

router.delete(
  "/todo/:todoId",
  isAuth,

  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 3 }),
  ],
  todosController.deleteTodo
);

module.exports = router;
