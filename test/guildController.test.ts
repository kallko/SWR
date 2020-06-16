import { expect } from 'chai';
import { guildController } from '../server-src/controller/guildController';
import { IGuild } from '../server-src/@types/IGuild';

describe('guildController tests:', async function () {
	it('receive allyCode for all players of Guild', async function () {
		this.timeout(500000);
		const result: IGuild[] = await guildController.getGuildAll(621723826);
		expect(result.length > 0).equal(true);
		expect(result[0].hasOwnProperty('name')).equal(true);
		expect(result[0].hasOwnProperty('id')).equal(true);
	});
});
