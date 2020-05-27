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

async function validatePlayerId(id, setName, setId) {
	id = id.toString().split('-').join('').trim();
	if (id.length !== 9) {
		return null;
	} else {
		const url = baseUrl + '/player/check/' + id;
		const dataFromServer = await fetch(url);
		const data = await dataFromServer.json();
		setName(data.result);
		setId(id);
	}
}
