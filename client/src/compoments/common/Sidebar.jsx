import {Box, Drawer, List, ListItemButton, Typography, IconButton,} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {assets} from "../../assets";
import {useNavigate, Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import memoApi from "../../api/memoApi";
import {setMemo} from "../../redux/features/memoSlice";


export const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // URLのパスパラメータを取得。
    // http://localhost:3000/memo/64bb0c0db71a0d90f6f4a124 であれば、64bb0c0db71a0d90f6f4a124を取得
    const {memoId} = useParams()
    const user = useSelector((state) => state.user.value)
    const memos = useSelector((state) => state.memo.value)

    // JWTを取り除くだけでログアウトできる。
    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    useEffect(() => {
        const getMemos = async () => {
            try {
                const res = await memoApi.getAll()
                dispatch(setMemo(res))
            } catch (err) {
                alert(err)
            }
        }
        getMemos()
    }, [dispatch])

    useEffect(()=>{
        const activeIndex = memos.findIndex((e) => e._id === memoId)
        console.log(activeIndex)
        setActiveIndex(activeIndex)
    },[navigate])

    const addMemo = async () => {
        try {
            const res = await memoApi.create()
            const newMemos = [res, ...memos]
            dispatch(setMemo(newMemos))

            // リダイレクト
            navigate(`/memo/${res._id}`)
        } catch (err) {
            alert(err)
        }
    }
    return (
        <Drawer
            container={window.document.body}
            variant="permanent"
            open={true}
            sx={{width: 250, height: "100vh"}}
        >
            <List sx={{width: 250, height: "100vh", backgroundColor: assets.colors.secondary}}>
                <ListItemButton>
                    <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Typography variant="body2" fontWeight="700">
                            {user.username}
                        </Typography>
                        <IconButton onClick={logout}>
                            <LogoutIcon/>
                        </IconButton>
                    </Box>
                </ListItemButton>
                <Box sx={{paddingTop: "10px"}}></Box>
                <ListItemButton>
                    <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Typography variant="body2" fontWeight="700">
                            お気に入り
                        </Typography>
                    </Box>
                </ListItemButton>
                <Box sx={{paddingTop: "10px"}}></Box>
                <ListItemButton>
                    <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Typography variant="body2" fontWeight="700">
                            プライベート
                        </Typography>
                        <IconButton onClick={addMemo}>
                            <AddBoxIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                </ListItemButton>
                {memos.map((item, index) => (
                    <ListItemButton
                        sx={{pl: "20px"}}
                        component={Link}
                        to={`memo/${item._id}`}
                        key={item._id}
                        selected={index === activeIndex}
                    >
                        <Typography variant="body2" fontWeight="700">
                            {item.icon} {item.title}
                        </Typography>
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    )
}