import homeImg from '../../img/StarwarsFinal28.4.jpg';
import React from 'react';

export function Home() {
	return (
		<div className="div-content">
			<img src={homeImg} alt="logo" width="60%" />
			<div>
				We are here to help You to play Star Wars Galaxy of Heroes
				<br/>
				contact us, if You want kvartirip@gmail.com
			</div>
		</div>
	);
}
