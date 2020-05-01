import {useParams} from "react-router-dom";
import React from "react";
import img from "../img/notFound404.jpg";

export function TestChild(data: { text: string, addText:string }) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
    return (
        <div>
            {/*<h3>ID: {id + ' ' + data.text + ' ' + data.addText}</h3>*/}
            <div className="div-content">
                <img src={img}  alt="logo" width="100%" >
                </img>
            </div>
        </div>
    );
}
