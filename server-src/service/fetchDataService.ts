import fetch from 'node-fetch';
import { IMod } from '../@types/IMod';

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
	async getPlayer(allyCode: string) {
		const url = 'https://swgoh.gg/api/player/' + allyCode + '/';
		const result = await fetch(url);
		if (result.status === 200) {
			return await result.json();
		}
		return null;
	}
};
