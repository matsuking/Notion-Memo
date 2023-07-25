import React, {useState} from 'react'
import {Box, TextField, Button} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {Link, useNavigate} from "react-router-dom"
import authApi from "../api/authApi";

export const Register = () => {
    const navigate = useNavigate()

    const [usernameErrText, setUsernameErrText] = useState("");
    const [passwordErrText, setPasswordErrText] = useState("");
    const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        // reloadを防ぐ
        e.preventDefault()
        setUsernameErrText("")
        setPasswordErrText("")
        setConfirmPasswordErrText("")

        // 入力欄の文字列を取得
        const data = new FormData(e.target)

        // getの引数には、TextFieldのname属性で設定したものを指定することで、値を取得できる。trim()は空白を取り除く？
        const username = data.get("username")
        const password = data.get("password")
        const confirmPassword = data.get("confirmPassword")

        let error;
        if (username === "") {
            error = true
            setUsernameErrText("名前を入力してください")
        }

        if (password === "") {
            error = true
            setPasswordErrText("パスワードを入力してください")
        }

        if (confirmPassword === "") {
            error = true
            setConfirmPasswordErrText("確認用パスワードを入力してください")
        }
        if (password !== confirmPassword) {
            setConfirmPasswordErrText("パスワードと確認用パスワードが異なります。")
        }

        if (error) return;

        setIsLoading(true)

        // 新規登録APIをたたく
        try {
            const res = await authApi.register({
                username,
                password,
                confirmPassword
            })
            setIsLoading(false)

            // 返ってきたJWTをローカルストレージに保存。
            // {user, token}という形でレスポンスがある。
            localStorage.setItem("token", res.token)
            console.log("新規登録に成功しました。")

            // リダイレクト
            navigate("/")

        } catch (err) {
            const errors = err.data.error
            errors.forEach((err) => {
                if (err.params === "username") {
                    setUsernameErrText(err.msg)
                } else if (err.params === "password") {
                    setPasswordErrText(err.msg)
                } else if (err.params === "confirmPassword") {
                    setConfirmPasswordErrText(err.msg)
                }
            })
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    fullWidth
                    id="username"
                    label="お名前"
                    margin="normal"
                    name="username"
                    required
                    helperText={usernameErrText}
                    error={usernameErrText !== ""}
                    // 通信中は入力できないようにする。
                    disabled={isLoading}
                />
                <TextField
                    fullWidth
                    id="password"
                    label="パスワード"
                    margin="normal"
                    name="password"
                    // type属性で、入力した値が見えなくなる
                    type="password"
                    required
                    helperText={passwordErrText}
                    error={passwordErrText !== ""}
                    // 通信中は入力できないようにする。
                    disabled={isLoading}
                />
                <TextField
                    fullWidth
                    id="confirmPassword"
                    label="確認用パスワード"
                    margin="normal"
                    name="confirmPassword"
                    // type属性で、入力した値が見えなくなる
                    type="password"
                    required
                    helperText={confirmPasswordErrText}
                    error={confirmPasswordErrText !== ""}
                    // 通信中は入力できないようにする。
                    disabled={isLoading}
                />
                <LoadingButton
                    sx={{mt: 3, mb: 2}}
                    fullWidth
                    type="submit"
                    loading={isLoading}
                    color="primary"
                    variant="outlined"
                >
                    アカウント作成
                </LoadingButton>
            </Box>
            <Button component={Link} to="/login">
                すでにアカウントを持っていますか？ログイン
            </Button>
        </div>
    )
}
