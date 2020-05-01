import * as React from "react";
import img from "../img/TieSpecial.png";
import img2 from "../img/UnderConstruction.jpg";
import {Link} from "react-router-dom";

export function guildRoute (inputData: { data: string; }) {
    console.log('Key', inputData);
    // return <div className="div-content">
    //     {/*<h2>Users {inputData.data}</h2>*/}
	// 	{/*<header className="App-header">		</header>*/}
	// 		{/*<img src={img} className="App-logo" alt="logo" />*/}
	// 		{/*<a*/}
	// 		{/*	href="https://reactjs.org"*/}
	// 		{/*	target="_blank"*/}
	// 		{/*	rel="noopener noreferrer"*/}
	// 		{/*>*/}
	// 		{/*	<i className="App-link" aria-hidden="true" />*/}
	// 		{/*</a>*/}
	// 	<div>
	// 		<img src={img2}  alt="logo" width="100%" >
	// 		</img>
	// 	</div>
    // </div>
	return (
		<div className="div-content">
			<div className="div-left">
				<nav >
					<Link className="nav-link" to={`/12`}>Option 1</Link>
				</nav>
			</div>
			<div className="div-right">
				<img src={img2}  alt="logo" width="100%" >
				</img>
			</div>
		</div>
	);
}
