import React, {useState} from 'react'
import {Box, TextField, Button} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {Link, useNavigate} from "react-router-dom"
import authApi from "../api/authApi";

export const Login = () => {
    const navigate = useNavigate()

    const [usernameErrText, setUsernameErrText] = useState("");
    const [passwordErrText, setPasswordErrText] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        // reloadを防ぐ
        e.preventDefault()
        setUsernameErrText("")
        setPasswordErrText("")

        // 入力欄の文字列を取得
        const data = new FormData(e.target)

        // getの引数には、TextFieldのname属性で設定したものを指定することで、値を取得できる。trim()は空白を取り除く？
        const username = data.get("username")
        const password = data.get("password")

        let error;
        if (username === "") {
            error = true
            setUsernameErrText("名前を入力してください")
        }

        if (password === "") {
            error = true
            setPasswordErrText("パスワードを入力してください")
        }

        if (error) return;

        setIsLoading(true)

        // 新規登録APIをたたく
        try {
            const res = await authApi.login({
                username,
                password,
            })
            setIsLoading(false)

            // 返ってきたJWTをローカルストレージに保存。
            // {user, token}という形でレスポンスがある。
            localStorage.setItem("token", res.token)
            console.log("ログインに成功しました。")

            // リダイレクト
            navigate("/")

        } catch (err) {
            const errors = err.data.errors
            console.log(err.data)
            errors.forEach((err) => {
                if (err.params === "username") {
                    setUsernameErrText(err.msg)
                } else if (err.params === "password") {
                    setPasswordErrText(err.msg)
            }})
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
                <LoadingButton
                    sx={{mt: 3, mb: 2}}
                    fullWidth
                    type="submit"
                    loading={isLoading}
                    color="primary"
                    variant="outlined"
                >
                    ログイン
                </LoadingButton>
            </Box>
            <Button component={Link} to="/register">
                アカウントを持っていませんか？新規登録
            </Button>
        </div>
    )
}
