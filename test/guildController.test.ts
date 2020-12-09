import { expect } from 'chai';
import { guildController } from '../server-src/controller/guildController';
import { IGuild } from '../server-src/@types/IGuild';
import { guildService } from '../server-src/service/guildService';
import * as sinon from 'sinon';
import { userService } from '../server-src/service/UserService';
import { playerController } from '../server-src/controller/playerController';

describe('guildController tests:', async function () {
	const sandbox = sinon.createSandbox();
	this.timeout(50000);
	afterEach(() => {
		sandbox.restore();
	});
	it('receive allyCode for all players of Guild', async function () {
		const getGuildFunction = sandbox
			.stub(guildService, 'getGuildId')
			.callsFake(() => 2);
		const getGuildNameFunction = sandbox
			.stub(guildService, 'getGuildName')
			.callsFake(() => 'GuildName');
		const getGuildMembersFunction = sandbox
			.stub(guildService, 'getGuildMembers')
			.callsFake(() => [1, 2, 3]);
		const result: IGuild = await guildController.getGuildAll(621723826);
		expect(result.members.length > 0).equal(true);
		expect(result.members[0].hasOwnProperty('name')).equal(true);
		expect(result.members[0].hasOwnProperty('id')).equal(true);
		expect(getGuildFunction.callCount).equal(1);
		expect(getGuildNameFunction.callCount).equal(1);
		expect(getGuildMembersFunction.callCount).equal(1);
	});
	it('Get All Ally Codes with a common users/members', async function () {
		sandbox
			.stub(guildService, 'getAll')
			.callsFake(() => [{ allyCode: 21 }, { allyCode: 32 }]);
		sandbox
			.stub(userService, 'getUsersAllyCode')
			.callsFake(() => [{ allyCode: 21 }, { allyCode: 22 }]);
		const result = await guildController.getAllAllyCodes();
		expect(result.length).greaterThan(0);
		expect(result.length).equal(3);
	});
	it('Get All Ally Codes without a common users/members', async function () {
		sandbox
			.stub(guildService, 'getAll')
			.callsFake(() => [{ allyCode: 21 }, { allyCode: 42 }]);
		sandbox
			.stub(userService, 'getUsersAllyCode')
			.callsFake(() => [{ allyCode: 25 }, { allyCode: 22 }]);
		const result = await guildController.getAllAllyCodes();
		expect(result.length).greaterThan(0);
		expect(result.length).equal(4);
	});
	it('Update Data', async function () {
		sandbox
			.stub(guildService, 'getAll')
			.callsFake(() => [{ allyCode: 21 }, { allyCode: 42 }]);
		sandbox
			.stub(userService, 'getUsersAllyCode')
			.callsFake(() => [{ allyCode: 25 }, { allyCode: 22 }]);
		const updateGuildMembersFunction = sandbox.spy(
			guildController,
			'updateGuildMembers'
		);
		const updatePlayerUnitsFunction = sandbox
			.stub(playerController, 'updatePlayerUnits')
			.callsFake(() => true);
		const updateLegendProgressFunction = sandbox
			.stub(playerController, 'saveLegendProgress')
			.callsFake(() => true);
		await guildController.updateData();
		expect(updatePlayerUnitsFunction.callCount).eq(4);
		expect(updateLegendProgressFunction.callCount).eq(4);
	});
});
