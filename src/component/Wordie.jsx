import React, { useEffect, useRef, useState } from 'react'
import styles from "./Wordie.module.css"
import Box from './Box'
import axios from 'axios'

export default function Wordie() {
    const [word, setWord] = useState("")
    const [value, setValue] = useState(["", "", "", "", ""])
    const [boxes, setBoxes] = useState([])
    const [win, setWin] = useState(false)
    const [lose, setLose] = useState(false)
    const [isword, setisword] = useState(false)
    const [currentind, setCurrentind] = useState(0)
    const inpRef = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()])

    useEffect(() => {
        getWords()
        
    }, [])
    async function getWords() {
        try {
            const w = await axios.get('https://random-word-api.vercel.app/api?words=1&length=5')
            setWord(w.data[0])
            if(inpRef.current[0].current){
                await inpRef.current[0].current.focus()
            }
        }
        catch (err) {
            console.log("err")
        }
    }
    async function isWords() {
        try {
            const check = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${value.join("")}`)
            setisword(true)
        }
        catch (err) {
            setisword(false)
            console.log("err")
            if (value.join("").toLowerCase() === word) {
                setisword(true)
            }
        }
    }
    function handleChange(e, ind) {
        e.preventDefault()
        let arr = [...value]
        if (/^[a-zA-Z]+$/.test(e.target.value)) {
            arr[ind] = e.target.value
            if (ind < 4) {
                inpRef.current[ind + 1].current.focus()
                inpRef.current[ind + 1].current.setSelectionRange(1, 1)
            }
        }
        else {
            arr[ind] = ""
            if (ind > 0) {
                // inpRef.current[ind - 1].current.focus()
            }
        }
        setValue(() => [...arr])
    }
    useEffect(() => {
        if (value.join("").length === 5) {
            isWords()
        }
    }, [value])
    async function handleSubmit() {
        if (boxes.length <= 5) {
            setBoxes(()=>[...boxes, value])
            setValue(()=>["", "", "", "", ""])
            setisword(()=>false)
            await inpRef.current[0].current.focus()
        }
        if (value.join("").toLowerCase() === word) {
            setWin(true)
            setisword(true)
        }
        else if(boxes.length >= 5){
            setLose(true)
            setisword(true)
        }
    }
    function handleRestart() {
        getWords()
        setValue(["", "", "", "", ""])
        setBoxes([])
        setWin(false)
        setLose(false)
        setisword(false)
    }
    function handleFocus(ind) {
        setCurrentind(ind)
    }
    function key(e) {
        const key=e.key
        // console.log(key)
        if(key.toLowerCase()==="enter" && value.join("").length === 5 && isword){
            // inpRef.current[currentind + 1].current.focus()
            handleSubmit()
        }
        else if((key.toLowerCase()==="delete" || key.toLowerCase()==="backspace") && currentind > 0 && value[currentind]===""){
            inpRef.current[currentind - 1].current.focus()
            // console.log(currentind)
        }
    }
    return (
        <div className={styles.mainBox}>
            <div className={styles.container}>
                
                <>
                <div className={styles.smallCont}>
                    {boxes.map((element, index) =>
                        <div className={styles.column} key={index}>
                            {element.map((ele, ind) =>
                                <Box key={ind} index={ind} element={ele} word={word} />
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.column}>
                    {boxes.length <= 5 && !win &&
                        word.split("").map((element, index) =>
                            <input type="text" key={index} className={styles.letters} maxLength={1} value={value[index]} onChange={(e) => handleChange(e, index)} ref={inpRef.current[index]} onFocus={()=>handleFocus(index)} onKeyDown={key}/>
                        )}
                </div>
                </>
                {(win || lose) && <div className={styles.message}>{win && "YOU WON"}{lose && "YOU LOSE"}</div>}
                
            </div>
            <button className={styles.submit} onClick={win || lose ? handleRestart : isword ? handleSubmit : null} style={isword ? {} : { background: "gray" }}>{win || lose ? "RESTART" : "SUBMIT"}</button>
            
        </div>
    )
}
