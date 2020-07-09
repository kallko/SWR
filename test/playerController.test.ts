import { expect } from 'chai';
import {
	playerController,
	getLastWeekPlayerData,
	isPlayerUnitsNeedUpdate
} from '../server-src/controller/playerController';

describe('playerController tests:', async function () {
	it('should load file with progress and compare it', async function () {
		this.timeout(5000);
		const result: any = await playerController.getLegendProgress(621723826);
		expect(result.length).equal(2);
	});
	it('should load file with progress', async function () {
		this.timeout(50000);
		const result: any = await getLastWeekPlayerData(621723826);
		expect(result.hasOwnProperty('month')).equal(true);
		expect(result.hasOwnProperty('day')).equal(true);
		expect(result.hasOwnProperty('year')).equal(true);
		expect(result.hasOwnProperty('legend_progress')).equal(true);
		expect(result.legend_progress.length).equal(2);
	});
	it('should check necessary of update players units', async function f() {
		this.timeout(5000);
		const result: boolean = await isPlayerUnitsNeedUpdate(621723826);
		console.log('Result ', result);
	});
	it('should update players units', async function f() {
		this.timeout(10000);
		await playerController.updatePlayerUnits(
			621723826,
			true
		);
	});
});
