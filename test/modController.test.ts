import { expect } from 'chai';
import {
	calculateNewStats,
	modController
} from '../server-src/controller/modController';
import { fetchDataService } from '../server-src/service/fetchDataService';
const sinon = require('sinon');
import { MODS } from './examples/mods';
import { PLAYER } from './examples/player';
import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';
import { getUnitsWithStats } from '../server-src/helper/modHelper';
import { IImportUnit } from '../server-src/@types/IUnit';

xdescribe('mod Controller tests:', async function () {
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
			await modController.creator(621723826);
			// todo refactor getSquadsOptions to not call 2 time get player
			expect(this.stubGetPlayer.callCount).equal(1);
		});
	});
	describe('Mod Helper check with 4 units GENERALKENOBI, FIRSTORDERTROOPER, PHASMA, FIRSTORDEROFFICERMALE', function () {
		before(function () {});
		it('Check trooper base critical Damage', function () {
			expect(trooper.data['baseCritical Damage']).equal(1.5);
		});
		it('Check trooper existing speed', function () {
			expect(trooper.data.speed.existingSpeed).equal(263);
		});
		it('Check trooper base speed', function () {
			expect(trooper.data.speed.baseSpeed).equal(136);
		});
		it('Check trooper base Potency', function () {
			expect(Math.floor(trooper.data.basePotency * 10000)).equal(2800);
		});
		it('Check trooper base Offence', function () {
			expect(Math.ceil(trooper.data.baseOffense)).equal(4664);
		});
		it('Check trooper base Health', function () {
			expect(Math.ceil(trooper.data.baseHealth)).equal(62930);
		});
		it('Check trooper base Tenacity', function () {
			expect(Math.round(trooper.data.baseTenacity * 100)).equal(57);
		});
		it('Check trooper base critical Protection', function () {
			expect(Math.round(trooper.data.baseProtection)).equal(59299);
		});
		it('Check trooper base critical Chance', function () {
			expect(trooper.data['baseCritical Chance']).equal(42.5);
		});
		xit('Check trooper base Defence', function () {
			expect(trooper.data.baseDefense).equal(1);
		});
		it('Check general base critical Damage', function () {
			expect(general.data['baseCritical Damage']).equal(1.5);
		});
		it('Check general existing speed', function () {
			expect(general.data.speed.existingSpeed).equal(253);
		});
		it('Check general base speed', function () {
			expect(general.data.speed.baseSpeed).equal(147);
		});
		it('Check general base Potency', function () {
			expect(Math.ceil(general.data.basePotency * 10000)).equal(0);
		});
		it('Check general base Offence', function () {
			expect(Math.ceil(general.data.baseOffense)).equal(4713);
		});
		it('Check general base Health', function () {
			expect(Math.ceil(general.data.baseHealth)).equal(56706);
		});
		it('Check general base Tenacity', function () {
			expect(Math.round(general.data.baseTenacity * 100)).equal(54);
		});
		it('Check general base Protection', function () {
			expect(Math.ceil(general.data.baseProtection)).equal(60219);
		});
		it('Check general base critical Chance', function () {
			expect(Math.ceil(general.data['baseCritical Chance'] * 100)).equal(4421);
		});
		xit('Check general base critical Defence', function () {
			expect(general.data.baseDefense).equal(1);
		});
		it('Check phasma base critical Damage', function () {
			expect(phasma.data['baseCritical Damage']).equal(1.5);
		});
		it('Check phasma existing speed', function () {
			expect(phasma.data.speed.existingSpeed).equal(235);
		});
		it('Check phasma base speed', function () {
			expect(phasma.data.speed.baseSpeed).equal(141);
		});
		it('Check phasma base Potency', function () {
			expect(Math.floor(phasma.data.basePotency * 10000)).equal(5300);
		});
		it('Check phasma base Offence', function () {
			expect(Math.ceil(phasma.data.baseOffense)).equal(3844);
		});
		it('Check phasma base Health', function () {
			expect(Math.ceil(phasma.data.baseHealth)).equal(46976);
		});
		it('Check phasma base Tenacity', function () {
			expect(Math.round(phasma.data.baseTenacity * 100)).equal(48);
		});
		it('Check phasma base critical Protection', function () {
			expect(Math.round(phasma.data.baseProtection)).equal(42300);
		});
		it('Check phasma base critical Chance', function () {
			expect(Math.ceil(phasma.data['baseCritical Chance'] * 100)).equal(5759);
		});
		it('Check officer base critical Damage', function () {
			expect(Math.floor(officer.data['baseCritical Damage'] * 1000)).equal(
				1575
			);
		});
		it('Check officer existing speed', function () {
			expect(officer.data.speed.existingSpeed).equal(251);
		});
		it('Check officer base speed', function () {
			expect(officer.data.speed.baseSpeed).equal(165);
		});
		it('Check officer base Potency', function () {
			expect(Math.ceil(officer.data.basePotency * 10000)).equal(4300);
		});
		it('Check officer base Offence', function () {
			expect(Math.ceil(officer.data.baseOffense)).equal(3819);
		});
		it('Check officer base Health', function () {
			expect(Math.ceil(officer.data.baseHealth)).equal(52941);
		});
		it('Check officer base Tenacity', function () {
			expect(Math.round(officer.data.baseTenacity * 100)).equal(40);
		});
		it('Check officer base critical Protection', function () {
			expect(Math.floor(officer.data.baseProtection)).equal(41449);
		});
		it('Check officer base critical Chance', function () {
			expect(Math.ceil(officer.data['baseCritical Chance'] * 100)).equal(6738);
		});
	});
	describe.only('Calculate units in another mods ', function () {
		before(function () {
			calculateNewStats(general, trooperMods);
			calculateNewStats(trooper, generalMods);
			calculateNewStats(phasma, officerMods);
			calculateNewStats(officer, phasmaMods);
			console.log('General ', general);
		});
		it('Check protection for General in FOT mods', function () {
			expect(Math.floor(general.data.newProtection)).equal(77076);
		});
		it('Check critical Chance for General in FOT mods', function () {
			expect(Math.ceil(general.data['newCritical Chance'] * 100)).equal(4750);
		});
		it('Check Offence for General in FOT mods', function () {
			expect(Math.floor(general.data.newOffense)).equal(5490);
		});
		it('Check Potency for General in FOT mods', function () {
			expect(Math.floor(general.data.newPotency)).equal(2.88);
		});
		it('Check Critical Damage for General in FOT mods', function () {
			expect(general.data['newCritical Damage']).equal(1.5);
		});
		it('Check Tenacity for General in FOT mods', function () {
			expect(Math.floor(general.data.newTenacity)).equal(150);
		});
		it('Check Health for General in FOT mods', function () {
			expect(Math.floor(general.data.newHealth)).equal(70360);
		});
		it('Check Speed for General in FOT mods', function () {
			expect(Math.floor(general.data.newSpeed)).equal(274);
		});
	});
});

//
