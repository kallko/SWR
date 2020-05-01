import {appHeader} from "./header";
import React from "react";
import img from "../img/StarwarsFinal28.4.jpg";


export function homeRoute(status: string, serverStartTime: Date | null) {
    console.log('HOME ROUTE');
    return (
        <div className="div-content">
            <h2>STAR WARS GALAXY OF HEROES </h2>
            <h3> (second pilot) </h3>
            <div>
                <div>Server status: {status}</div>
                <div>Server start time: {serverStartTime}</div>
                {appHeader()}
                <img src={img} alt="logo" width="60%"/>
            </div>
        </div> );
}
