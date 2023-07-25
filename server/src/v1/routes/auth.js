const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body } = require("express-validator");

const validation = require("../handlers/validation")
const userController = require("../controllers/user")
const tokenHandler = require("../handlers/tokenHandler")

// これがないと、envファイルを読み込めない
require("dotenv").config();

// jsonオブジェクトとして認識させる。
// postやgetするときに使用する。
router.use(express.json());

// ユーザー新規登録API
router.post(
  "/register",
  body("username").isLength({ min: 8 }).withMessage("ユーザー名は8文字以上である必要があります。"),
  body("password").isLength({ min: 2 }).withMessage("パスワードは2文字以上である必要があります。"),
  body("confirmPassword").isLength({ min: 8 }).withMessage("確認用パスワードは2文字以上である必要があります。"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザーはすでに使われています。");
      }
    });
  }),
  validation.validate,
  userController.register,
);

// ログイン用API
router.post(
    "/login", 
    body("username")
        .isLength({ min: 8 })
        .withMessage("ユーザー名は8文字以上である必要があります。"),
    body("password")
        .isLength({ min: 2 })
        .withMessage("パスワードは2文字以上である必要があります。"),
    validation.validate,
    userController.login,
)

// JWT認証API
router.post(
    "/verify-token",
    tokenHandler.verifyToken,
    // verifyTokenがnext()に行かなかった場合、以下の処理は走らない。
    (req, res) => {
        return res.status(200).json({user: req.user})
    }
)

module.exports = router;
