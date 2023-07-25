import React, {useEffect} from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {Box} from "@mui/material"
import {authUtils} from "../../utils/authUtils";
import {Sidebar} from "../common/Sidebar"
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/features/userSlice";

export const AppLayout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // ページ遷移するたびにJWTが入っているかチェック
    useEffect(() => {
        // JWTを持っているのか確認する。
        const checkAuth = async () => {
            // 認証チェック
            const user = await authUtils.isAuthenticated()

            if (!user) {
                navigate("/login")
            } else {
                // ユーザー情報があれば保存する（ユーザー名を表示したいので）
                console.log(user)
                dispatch(setUser(user))
            }
        }
        checkAuth()
    }, [navigate])

    return (
        <div>
            <Box sx={{display: "flex"}}>
                <Sidebar/>
                <Box sx={{flexGrow: 1, p: 1, width: "max-content"}}>
                    <Outlet/>
                </Box>
            </Box>
        </div>
    )
}
