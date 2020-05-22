import React from "react";

export function InputPlayerId(props) {
    return <input style={{
        borderBottom: 'solid 2px blue',
        background: 'aliceblue',
        color: 'black',
        fontWeight: 'bold',
        placeContent: '',
    }} onChange={(event) => props.passChildData(event.target.value)}/>
}

