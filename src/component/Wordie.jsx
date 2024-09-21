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
    const inpRef=useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()])

    useEffect(() => {
        async function getWords() {
            try {
                const w = await axios.get('https://random-word-api.vercel.app/api?words=1&length=5')
                setWord(w.data[0])
            }
            catch (err) {
                console.log("err")
            }
        }
        getWords()
    }, [])
    function handleChange(e, ind) {
        e.preventDefault()
        let arr = [...value]
        if (/^[a-zA-Z]+$/.test(e.target.value)) {
            arr[ind] = e.target.value
            if(ind<4){
                inpRef.current[ind+1].current.focus()
            }
        }
        else {
            arr[ind] = ""
            if(ind>0){
                inpRef.current[ind-1].current.focus()
            }
        }
        setValue([...arr])

    }
    function handleSubmit() {
        if(boxes.length<=4){
            setBoxes([...boxes, value])
            setValue(["", "", "", "", ""])
        }
        if(value.join("")===word){
            setWin(true)
        }
    }
    return (
        <div className={styles.mainBox}>
            <div className={styles.container}>
                <div className={styles.smallCont}>
                    {boxes.map((ele) =>
                <div className={styles.column}>
                        {ele.map((ele, index) =>
                            <Box key={index} index={index} element={ele} word={word} />
                        )}
                    </div>
                    )}
                    </div>
            <div className={styles.column}>
                    {boxes.length <=4 && !win &&
                    word.split("").map((element, index) =>
                        <input type="text" className={styles.letters} maxLength={1} value={value[index]} onChange={(e) => handleChange(e, index)} ref={inpRef.current[index]}/>
                    )}
                    </div>
            </div>
            

            <button className={styles.submit} onClick={handleSubmit}>SUBMIT{word}</button>

        </div>
    )
}
