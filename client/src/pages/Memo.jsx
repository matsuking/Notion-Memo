import {Box, IconButton, TextField} from "@mui/material"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import memoApi from "../api/memoApi";
import {useDispatch, useSelector} from "react-redux";
import {setMemo} from "../redux/features/memoSlice";
import {EmojiPicker} from "../compoments/common/EmojiPicker"

export const Memo = () => {
    const {memoId} = useParams()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [icon, setIcon] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const memos = useSelector((state) => state.memo.value)

    useEffect(() => {
        const getMemo = async () => {
            try {
                const res = await memoApi.getOne(memoId)
                setTitle(res.title)
                setDescription(res.description)
                setIcon(res.icon)
            } catch (err) {
                alert(err)
            }
        }
        getMemo()
    }, [memoId])

    let timer;
    const timeout = 500

    const updateTitle = async (e) => {
        clearTimeout(timer) // 連続で文字列を打ち込んだときに、timeoutが発動してしまうのを防ぐ。
        const newTitle = e.target.value;
        setTitle(newTitle)

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, {title: newTitle})
            } catch (err) {
                alert(err)
            }
        }, timeout)
    }

    const updateDescription = async (e) => {
        clearTimeout(timer) // 連続で文字列を打ち込んだときに、timeoutが発動してしまうのを防ぐ。
        const newDescription = e.target.value;
        setTitle(newDescription)

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, {description: newDescription})
            } catch (err) {
                alert(err)
            }
        }, timeout)
    }

    const deleteMemo = async () => {
        try {
            const deletedMemo = await memoApi.delete(memoId)
            console.log(deletedMemo)

            // deleteすると、メモの数が減るので、deleteしたもの以外でフィルターをかける。
            const newMemos = memos.filter((e) => e._id !== memoId)

            if (newMemos.length === 0) {
                navigate("/memo")
            } else {
                navigate(`/memo/${newMemos[0]._id}`)
            }
            dispatch(setMemo(newMemos))
        } catch (err) {
            alert(err)
        }
    }

    const onIconChange = async (newIcon) => {
        // memoをすべてコピー
        let temp = [...memos]

        // 配列の番号を見つける
        const index = temp.findIndex((event) => event._id === memoId)
        temp[icon] = {...temp[index], icon: newIcon}
        setIcon(newIcon)
        dispatch(setMemo(temp))

        try {
            await memoApi.update(memoId, {icon: newIcon})
        } catch (err) {
            alert(err)
        }
    }

    return (<div>
        <Box
            sx={{
                display: "flex",
                aliginItems: "center",
                width: "100%"
            }}
        >
            <IconButton>
                <StarBorderIcon/>
            </IconButton>
            <IconButton variant="outlined" color="error" onClick={deleteMemo}>
                <DeleteOutlineIcon/>
            </IconButton>
        </Box>
        <Box
            sx={{
                padding: "10px 50px"
            }}
        >
            <Box>
                <EmojiPicker icon={icon} onChange={onIconChange}/>
                <TextField
                    onChange={updateTitle}
                    value={title}
                    placeholder="無題"
                    variant="outlined"
                    fullWidth
                    sx={{
                        ".MuiOutlinedInput-input": {padding: 0},
                        ".MuiOutlinedInput-notchedOutline": {border: "none"},
                        ".MuiOutlinedInput-root": {fontSize: "2rem", fontWeight: "700"}
                    }}
                />
                <TextField
                    onChange={updateDescription}
                    value={description}
                    placeholder="追加"
                    variant="outlined"
                    fullWidth
                    sx={{
                        ".MuiOutlinedInput-input": {padding: 0},
                        ".MuiOutlinedInput-notchedOutline": {border: "none"},
                        ".MuiOutlinedInput-root": {fontSize: "1rem"}
                    }}
                />
            </Box>
        </Box>
    </div>)
};
