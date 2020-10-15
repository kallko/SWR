import {
	isPlayerUnitsNeedUpdate,
	playerController
} from '../server-src/controller/playerController';
import { expect } from 'chai';
import { fetchDataService } from '../server-src/service/fetchDataService';

describe('fetchDataService tests:', async function () {
	xit('should update players units', async function () {
		this.timeout(10000);
		const result2 = await fetchDataService.getPlayer2(621723826);
		const result = await fetchDataService.getPlayer(621723826);
		console.log('Result ', JSON.stringify(result));
		console.log('Result 2', JSON.stringify(result2));
	});
});
