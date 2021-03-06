//1.引入 express 使用 router | 引入必要model
const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
// 載入 auth middleware
const { authenticated, water } = require("../config/auth");

//---------------------------------------------
//2.create - 新增一筆資料
router.get("/new", authenticated, (req, res) => {
  //顯示新增頁面 |
  console.log(water);
  res.render("show");
});
router.post("/new", authenticated, (req, res) => {
  //顯示新增頁面 | 使用get-req.query.name 抓值 - 丟給model 建立參數
  //Q create & save 有什麼不一樣

  let newTodo = req.body.todo;

  const todo = Todo({ name: newTodo, userId: req.user._id });
  todo.save(err => {
    if (err) return console.log(err);
    return res.redirect("/");
  });
});

//3.檢視單一資料頁面
router.get("/:id", authenticated, (req, res) => {
  //檢視單一todo資料
  //研究一下-Model 的用法 findById()
  let id = req.params.id;
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    return res.render("detail", { todo: todo });
  });
});

//4.update 更新資料庫資料
router.get("/:id/edit", authenticated, (req, res) => {
  //檢視-單一todo資料 編輯頁
  let id = req.params.id;
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    return res.render("edit", { todo });
  });
});

router.put("/:id/edit", authenticated, (req, res) => {
  //編輯 單一todo資料

  id = req.params.id;
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    todo.name = req.body.name;
    todo.save(err => {});
    if (req.body.done) {
      todo.done = true;
    } else {
      todo.done = false;
    }
    return res.redirect("/todos/" + todo.id);
  });
});

//5.delete 刪除一筆資料
router.delete("/:id/delete", authenticated, (req, res) => {
  //刪除單一todo 資料
  id = req.params.id;
  Todo.findOne({ _id: req.params.id, userId: req.user._id }, (err, todo) => {
    todo.remove(err => {
      return res.redirect("/");
    });
  });
});

//---------------------------
module.exports = router;
