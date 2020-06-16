import { expect } from 'chai';
import {
	playerController,
	getLastWeekPlayerData
} from '../server-src/controller/playerController';

describe('playerController tests:', async function () {
	it('should load file with progress and compare it', async function () {
		this.timeout(5000);
		let result: any = await playerController.getLegendProgress('621723826');
		expect(result.length).equal(2);
	});
	it('should load file with progress', async function () {
		this.timeout(5000);
		let result: any = await getLastWeekPlayerData('621723826');
		expect(result.hasOwnProperty('month')).equal(true);
		expect(result.hasOwnProperty('day')).equal(true);
		expect(result.hasOwnProperty('year')).equal(true);
		expect(result.hasOwnProperty('legend_progress')).equal(true);
		expect(result.legend_progress.length).equal(2);
	});
});
