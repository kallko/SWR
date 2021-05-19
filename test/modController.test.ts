import { expect } from 'chai';
import { modController } from '../server-src/controller/modController';
import { fetchDataService } from '../server-src/service/fetchDataService';
const sinon = require('sinon');
import { MODS } from './examples/mods';
import { PLAYER } from './examples/player';
import { getUnitsWithStats } from '../server-src/helper/modHelper';
import { IImportUnit } from '../server-src/@types/IUnit';

describe('mod Controller tests:', async function () {
	let trooper, general, phasma, officer;
	let trooperMods, generalMods, phasmaMods, officerMods;
	before(function () {
		this.stubGetAllMods = sinon
			.stub(fetchDataService, 'getAllMods')
			.callsFake(() => MODS);
		this.stubGetPlayer = sinon
			.stub(fetchDataService, 'getPlayer')
			.callsFake(() => PLAYER);
		this.timeout(10000);
		// @ts-ignore
		const units: IImportUnit[] = PLAYER.units.filter(
			(unit) =>
				unit.data.base_id === 'GENERALKENOBI' ||
				unit.data.base_id === 'FIRSTORDERTROOPER' ||
				unit.data.base_id === 'PHASMA' ||
				unit.data.base_id === 'FIRSTORDEROFFICERMALE'
		);
		const newUnits = getUnitsWithStats(units, MODS);
		trooper = newUnits.find(
			(nUnit) => nUnit.data.base_id === 'FIRSTORDERTROOPER'
		);
		trooperMods = MODS.filter((mod) => mod.character === 'FIRSTORDERTROOPER');
		general = newUnits.find((nUnit) => nUnit.data.base_id === 'GENERALKENOBI');
		generalMods = MODS.filter((mod) => mod.character === 'GENERALKENOBI');
		phasma = newUnits.find((nUnit) => nUnit.data.base_id === 'PHASMA');
		phasmaMods = MODS.filter((mod) => mod.character === 'PHASMA');
		officer = newUnits.find(
			(nUnit) => nUnit.data.base_id === 'FIRSTORDEROFFICERMALE'
		);
		officerMods = MODS.filter(
			(mod) => mod.character === 'FIRSTORDEROFFICERMALE'
		);
	});
	after(function () {
		this.stubGetAllMods.restore();
		this.stubGetPlayer.restore();
	});
	describe('Check call count for functions ', async function () {
		it('Should once call fetch get all mods', async function () {
			await modController.creator(621723826);
			expect(this.stubGetAllMods.callCount).equal(1);
		});
		it('Should once call fetch get player', async function () {
			let existSquad = true;
			try {
				await modController.creator(621723826);
			} catch (err) {
				existSquad = false;
				expect(err.toString()).equal(
					'Error: No such arena squad config exists.\n' +
						'To create config for Your squad, You should become a patron for project,\n' +
						'or wait until this squad became more popular.'
				);
			}
			// todo refactor getSquadsOptions to not call 2 time get player
			if (existSquad) {
				expect(this.stubGetPlayer.callCount).equal(2);
			}
		});
	});
});
