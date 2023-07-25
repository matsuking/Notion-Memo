import React, {useEffect} from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {Container, Box} from "@mui/material"
import notionLogo from '../../assets/images/notion-logo.png';
import {authUtils} from "../../utils/authUtils";

export const AuthLayout = () => {
    const navigate = useNavigate()

    // ページ遷移するたびにJWTが入っているかチェック
    useEffect(() => {
        // JWTを持っているのか確認する。
        const checkAuth = async () => {
            // 認証チェック
            const isAuth = await authUtils.isAuthenticated()

            if (isAuth) {
                // JWTがあれば、ログイン新規登録する必要がないので、自動でリダイレクトする。
                navigate("/")
            }
        }

        checkAuth()
    }, [navigate])

    return (
        <div>
            <Container componnent="main" maxWidth="xs">
                <Box sx={{
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <img
                        src={notionLogo}
                        alt=""
                        style={{width: 100, height: 100}}
                    />
                    Notionクローン開発
                </Box>
                <Outlet/>
            </Container>
        </div>
    )
}
