import { expect } from 'chai';
import {
	playerController,
	isPlayerUnitsNeedUpdate,
	getLegendProgressByInterval,
	getEstimatedDate
} from '../server-src/controller/playerController';
import { LegendService } from '../server-src/service/LegendService';

xdescribe('playerController tests:', async function () {
	it('should legend progress for Kylo and Rey', async function () {
		this.timeout(5000);
		const result: any = await playerController.getLegendProgress(621723826);
		expect(result.length).equal(3);
	});
	it('should load file with progress', async function () {
		this.timeout(50000);
		const result: any = await playerController.getLegendProgress(715883665);
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
	xit('should update players units', async function () {
		this.timeout(1000000);
		console.log('Start Test');
		await playerController.updatePlayerUnits(115685251, true);
	});
	it('Get legends by id', async function () {
		const result = await getLegendProgressByInterval(
			'SUPREMELEADERKYLOREN',
			100,
			621723826,
			[]
		);
	});
	it('Get legends by id', async function () {
		const result = await getEstimatedDate(
			'SUPREMELEADERKYLOREN',
			100,
			621723826,
			[],
			100
		);
		console.log('Result ', result);
	});
	it('Get legends names', async function () {
		const result = await LegendService.getLegendNames();
		console.log('Result ', result);
	});
	it('Save legend Progress', async function () {
		const result = await playerController.saveLegendProgress(621723826);
		console.log('Result ', result);
	});
	xit('Save legend Progress', async function () {
		const result = await LegendService.clearOldData();
	});
});
