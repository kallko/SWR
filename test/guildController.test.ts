import { expect } from 'chai';
import { guildController } from '../server-src/controller/guildController';
import { IGuild } from '../server-src/@types/IGuild';
import { IFrontLegendTable } from '../server-src/@types/IFrontEnd';
import * as lodash from 'lodash';

describe('guildController tests:', async function () {
	xit('receive allyCode for all players of Guild', async function () {
		this.timeout(500000);
		const result: IGuild = await guildController.getGuildAll(621723826);
		expect(result.members.length > 0).equal(true);
		expect(result.members[0].hasOwnProperty('name')).equal(true);
		expect(result.members[0].hasOwnProperty('id')).equal(true);
	});
	xit('receive Legend Progress by allyCode', async function () {
		this.timeout(500000);
		const result: IFrontLegendTable[][] = await guildController.getLegendProgress(
			621723826
		);
		expect(result.length === 2).equal(true);
		expect(result[0].length === 3).equal(true);
		expect(result[0][0].hasOwnProperty('player')).equal(true);
		expect(result[0][0].hasOwnProperty('sort')).equal(true);
		expect(result[0][0].hasOwnProperty('display')).equal(true);
	});
	xit('check guild', async function () {
		this.timeout(500000);
		const result: IGuild = await guildController.getGuildAll(621723826);
		console.log('Guild test ', result);
	});
	xit('Get All Ally Codes', async function () {
		this.timeout(50000);
		const result = await guildController.getAllAllyCodes();
		const uniq = lodash.uniqBy(result, 'allyCode');
		expect(result.length).greaterThan(0);
		expect(result.length).equal(uniq.length);
	});
	xit('Update Guilds', async function () {
		this.timeout(500000);
		const members = await guildController.getAllAllyCodes();
		const result = await guildController.updateGuilds(members);
		expect(result).equal(true);
	});
	xit('Update Data', async function () {
		this.timeout(500000);
		const members = await guildController.updateData();
		// const tri1 = await fetchDataService.getPlayer(621723826);
		// const tri2 = await fetchDataService.getPlayer2(621723826);
		// console.log(JSON.stringify(tri1));
		// console.log('------------------------------------------------------');
		// console.log('------------------------------------------------------');
		// console.log('------------------------------------------------------');
		// console.log(tri2);

		// console.log('TEST RESULT ', members);
	});
});
