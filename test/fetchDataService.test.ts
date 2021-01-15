import { fetchDataService } from '../server-src/service/fetchDataService';
import { expect } from 'chai';

describe('fetchDataService tests:', async function () {
	this.timeout(10000);
	it('should update players units', async function () {
		const result = await fetchDataService.getPlayer2(621723826);
		expect(result.hasOwnProperty('units')).to.be.true;
		expect(result.hasOwnProperty('data')).to.be.true;
	});
	it('should update players units', async function () {
		const result = await fetchDataService.getPlayer(621723826);
		expect(result.hasOwnProperty('units')).to.be.true;
		expect(result.hasOwnProperty('data')).to.be.true;
	});
});
