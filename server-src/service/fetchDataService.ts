import fetch from 'node-fetch';
import { IMod } from '../@types/IMod';
import { IPlayer } from '../@types/IPlayer';
import { IGuild } from '../@types/IGuild';
const ApiSwgohHelp = require('api-swgoh-help');
import { config } from '../config/config';

const swapi = new ApiSwgohHelp(config.swoghApiHelpCredentials);

export const fetchDataService = {
	async getAllHeroes(): Promise<number[]> {
		const url = 'https://swgoh.gg/api/characters/';
		const result = await fetch(url);
		return await result.json();
	},
	async getAllMods(allyCode: string): Promise<IMod[]> {
		const url = 'https://swgoh.gg/api/players/' + allyCode + '/mods/';
		const result = await fetch(url);
		if (result.status === 200) {
			const resp = await result.json();
			return resp.mods;
		}
		return null;
	},
	async getPlayer(allyCode: string): Promise<IPlayer> {
		const url = 'https://swgoh.gg/api/player/' + allyCode + '/';
		const result = await fetch(url);
		if (result.status === 200) {
			return await result.json();
		}
		console.error('No such player data ', allyCode);
		return { units: null, data: null, detail: null };
	},
	async getGuildPlayersCode(allyCode: number): Promise<IGuild> {
		const token = await swapi.connect();
		console.log('Token ', token);
		const payload = { allyCode };
		console.log('AllyCode ', allyCode);
		const { result, error, warning } = await swapi.fetchGuild(payload);
		console.log('Result ', result);
		console.log('error ', error);
		console.log('warning ', warning);
		return {
			name: result[0].name,
			members: result[0].roster.map((member) => {
				return {
					name: member.name,
					id: member.allyCode
				};
			})
		};
	}
};
