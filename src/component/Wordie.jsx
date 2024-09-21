import React, { useEffect, useRef, useState } from 'react'
import styles from "./Wordie.module.css"
import Box from './Box'
import axios from 'axios'

export default function Wordie() {
    const [word, setWord] = useState("april")
    const [value, setValue] = useState(["", "", "", "", ""])
    const [boxes, setBoxes] = useState([])
    const [win, setWin] = useState(false)
    const [lose, setLose] = useState(false)
    const [isword, setisword] = useState(false)
    const inpRef = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()])

    useEffect(() => {
        getWords()
    }, [])
    async function getWords() {
        try {
            const w = await axios.get('https://random-word-api.vercel.app/api?words=1&length=5')
            // setWord(w.data[0])
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
            }
        }
        else {
            arr[ind] = ""
            if (ind > 0) {
                inpRef.current[ind - 1].current.focus()
            }
        }
        setValue(() => [...arr])
    }
    useEffect(() => {
        if (value.join("").length === 5) {
            isWords()
        }
    }, [value])
    function handleSubmit() {
        if (boxes.length <= 4) {
            setBoxes([...boxes, value])
            setValue(["", "", "", "", ""])
            setisword(false)
        }
        if(boxes.length >= 4){
            setLose(true)
            setisword(true)
        }
        if (value.join("").toLowerCase() === word) {
            setWin(true)
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
    return (
        <div className={styles.mainBox}>
            <div className={styles.container}>
                <div className={styles.smallCont}>
                    {boxes.map((element, index) =>
                        <div className={styles.column} key={index}>
                            {element.map((ele, ind) =>
                                <Box key={index} index={ind} element={ele} word={word} />
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.column}>
                    {boxes.length <= 4 && !win &&
                        word.split("").map((element, index) =>
                            <input type="text" key={index} className={styles.letters} maxLength={1} value={value[index]} onChange={(e) => handleChange(e, index)} ref={inpRef.current[index]}/>
                        )}
                </div>
            </div>
            <button className={styles.submit} onClick={win || lose ? handleRestart : isword ? handleSubmit : null} style={isword ? {} : { background: "gray" }}>{win || lose ? "RESTART" : "SUBMIT"}{lose && word}</button>
            
        </div>
    )
}
