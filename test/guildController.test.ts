import { expect } from 'chai';
import { guildController } from '../server-src/controller/guildController';
import { IGuild } from '../server-src/@types/IGuild';
import { IFrontLegendTable } from '../server-src/@types/IFrontEnd';

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
});
