import * as React from "react";
import img from "../img/TieSpecial.png";


export function guildRoute (inputData: { data: string; }) {
    console.log('Key', inputData);
    return <div className="div-content">
        <h2>Users {inputData.data}</h2>
		<header className="App-header">
			<img src={img} className="App-logo" alt="logo" />
			<a
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
			>
				<i className="App-link" aria-hidden="true" />
			</a>
		</header>
    </div>
}
