import React from 'react';
import {config} from "../config/configService";
const baseUrl = config.get('url');

export function InputPlayerId(props) {
	return (
		<input
			placeholder='ally code'
			style={{
				borderBottom: 'solid 2px blue',
				background: 'aliceblue',
				color: 'black',
				fontWeight: 'bold',
				placeContent: ''
			}}
			onChange={(event) =>
				validatePlayerId(
					event.target.value,
					props.definePlayerName,
					props.passPlayerId
				)
			}
		/>
	);
}

export function logout (setName, setId) {
	setName('');
	setId('');
	localStorage.removeItem('playerId');
	localStorage.removeItem('playerName');
}

async function validatePlayerId(playerId, setName, setId) {
	playerId = playerId.toString().split('-').join('').trim();
	if (playerId.length !== 9) {
		return null;
	} else {
		const url = baseUrl + '/player/check/' + playerId;
		const dataFromServer = await fetch(url);
		const data = await dataFromServer.json();
		setName(data.result);
		setId(playerId);
		localStorage.setItem('playerId', playerId);
		localStorage.setItem('playerName', data.result);
	}
}
