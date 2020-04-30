import {appHeader} from "./header";
import React from "react";
import img from "../img/StarwarsFinal.jpg";


export function homeRoute(status: string, serverStartTime: Date | null) {
    return (
        <div className="div-content">
            <h2>STAR WARS GALAXY OF HEROES </h2>
            <h3> (second pilot) </h3>
            <div>
                <div>Server status: {status}</div>
                <div>Server start time: {serverStartTime}</div>
                {appHeader()}
                <img src={img} className="App-img" alt="logo" />
            </div>
        </div> );
}
