import React from 'react'
import styles from "./Box.module.css"

export default function Box({element, index, word}) {
    // const
    return (
        <>
            <div className={styles.box} style={element.toLowerCase()===word[index].toLowerCase() ? {backgroundColor:"green"}:word.toLowerCase().includes(element.toLowerCase())&&element!==""?{backgroundColor:"yellow"}:{backgroundColor:"gray"}} >{element}
            </div>
        </>
    )
}
