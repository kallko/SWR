import { expect } from 'chai';
import { modController } from '../server-src/controller/modController';
import { fetchDataService } from '../server-src/service/fetchDataService';
const sinon = require('sinon');
import { MODS } from './examples/mods';
import { PLAYER } from './examples/player';
import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';

describe.only('mod Controller tests:', async function () {
	beforeEach(function () {
		this.stubGetAllMods = sinon
			.stub(fetchDataService, 'getAllMods')
			.callsFake(() => MODS);
		this.stubGetPlayer = sinon
			.stub(fetchDataService, 'getPlayer')
			.callsFake(() => PLAYER);
	});
	afterEach(function () {
		this.stubGetAllMods.restore();
		this.stubGetPlayer.restore();
	});
	it('Should once call fetch get all mods', async function () {
		await modController.creator(621723826);
		expect(this.stubGetAllMods.callCount).equal(1);
	});
	xit('Should once call fetch get player', async function () {
		await modController.creator(621723826);
		// todo refactor getSquadsOptions to not call 2 time get player
		expect(this.stubGetPlayer.callCount).equal(1);
	});
	it.only('developer test', async function () {
		this.timeout(10000);
		const result = await modController.creator(621723826);
	});
});
