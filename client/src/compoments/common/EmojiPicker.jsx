import {Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Picker from "@emoji-mart/react"

export const EmojiPicker = (props) => {
    const [selectedEmoji, setSelectedEmoji] = useState()
    const [isShowPicker, setIsShowPicker] = useState()

    useEffect(() => {
        setSelectedEmoji(props.icon)
    }, [props.icon])

    const showPicker = () => setIsShowPicker(!isShowPicker)
    const selectEmoji = (event) => {
        // const emojiCode = event.unified.split("-")
        //
        // let codeArray = []
        // codeArray.push("0x" + emojiCode)
        // const emoji = String.fromCodePoint(...codeArray)
        // console.log(emoji)


        const emoji = event.native
        console.log(emoji)
        setIsShowPicker(false)
        props.onChange(emoji)
    }

    return (
        <Box>
            <Typography
                variant="h3"
                fontWeight="700"
                sx={{cursor: "pointer"}}
                onClick={showPicker}
            >
                {selectedEmoji}
            </Typography>
            <Box sx={{display: isShowPicker ? "block": "none", position: "absolute", zIndex: 100}}>
                <Picker onEmojiSelect={selectEmoji}/>
            </Box>
        </Box>
    )
}