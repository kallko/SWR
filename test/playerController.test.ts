import { expect } from 'chai';
import {
	playerController,
	isPlayerUnitsNeedUpdate
} from '../server-src/controller/playerController';

xdescribe('playerController tests:', async function () {
	it('should legend progress for Kylo and Rey', async function () {
		this.timeout(5000);
		const result: any = await playerController.getLegendProgress(621723826);
		expect(result.length).equal(2);
	});
	it('should load file with progress', async function () {
		this.timeout(50000);
		const result: any = await playerController.getLegendProgress(621723826);
		expect(result[0].hasOwnProperty('legend_name')).equal(true);
		expect(result[0].hasOwnProperty('display_data')).equal(true);
		expect(result[0].display_data.hasOwnProperty('display_status')).equal(true);
		expect(result[0].display_data.hasOwnProperty('sorting_data')).equal(true);
		expect(result[0].display_data.hasOwnProperty('last_week_add')).equal(true);
		expect(result[1].hasOwnProperty('legend_name')).equal(true);
		expect(result[1].hasOwnProperty('display_data')).equal(true);
		expect(result[1].display_data.hasOwnProperty('display_status')).equal(true);
		expect(result[1].display_data.hasOwnProperty('sorting_data')).equal(true);
		expect(result[1].display_data.hasOwnProperty('last_week_add')).equal(true);
	});
	it('should check necessary of update players units', async function f() {
		this.timeout(5000);
		const result: boolean = await isPlayerUnitsNeedUpdate(621723826);
		console.log('Result ', result);
	});
	it('should update players units', async function f() {
		this.timeout(10000);
		await playerController.updatePlayerUnits(621723826, true);
	});
});
