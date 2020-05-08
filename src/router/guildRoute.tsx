import * as React from "react";
import img from "../img/TieSpecial.png";
import img2 from "../img/UnderConstruction.jpg";
import {Link} from "react-router-dom";

export function guildRoute (inputData: { data: string; }) {
    console.log('Key', inputData);

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
