import {
	isPlayerUnitsNeedUpdate,
	playerController
} from '../server-src/controller/playerController';
import { expect } from 'chai';
import { fetchDataService } from '../server-src/service/fetchDataService';

xdescribe('fetchDataService tests:', async function () {
	it('should update players units', async function () {
		this.timeout(10000);
		const result = await fetchDataService.getPlayer2(621723826);
		console.log('Magma !!!', result[0].roster[0].level);
		console.log('Arena !!!', result[0].arena.char.rank);
	});
});
