import React from 'react'
import styles from "./Box.module.css"

export default function Box({element, index, word}) {
    // const
    return (
        <>
            <div className={styles.box} style={element===word[index] ? {backgroundColor:"green"}:word.includes(element)&&element!==""?{backgroundColor:"yellow"}:{backgroundColor:"gray"}} >{element}
            </div>
        </>
    )
}
