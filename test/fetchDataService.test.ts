import { fetchDataService } from '../server-src/service/fetchDataService';

describe('fetchDataService tests:', async function () {
	xit('should update players units', async function () {
		this.timeout(10000);
		const result2 = await fetchDataService.getPlayer2(621723826);
		const result = await fetchDataService.getPlayer(621723826);
	});
});
