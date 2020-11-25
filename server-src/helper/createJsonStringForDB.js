const units = require('../@const/unitModOptions');

const squadString =
	'SUPREMELEADERKYLOREN,FIRSTORDEROFFICERMALE,FIRSTORDERTROOPER,GENERALHUX,KYLORENUNMASKED';

function createJsonString(squadString) {
	const units = sortSquad(squadString);
	let options = [];
	units.forEach((unit) => (options = options.concat(getOptions(unit))));
	if (options.length > 5) {
		console.log('Be careful, options more than 5');
	}
	console.log('Options: ', JSON.stringify(options));
}

function sortSquad(squadString) {
	const squad = squadString.split(',');
	if (squad.length !== 5) {
		throw new Error('Units in squad ' + squad.length);
	}
	squad.forEach((unit) => {
		if (squad.filter((squadUnit) => squadUnit === unit).length > 1) {
			throw new Error('Several same units in squad: ' + unit);
		}
	});
	const leader = squad.splice(0, 1);
	squad.sort();
	console.log('Squad string: ', leader.concat(squad).toString());
	return leader.concat(squad);
}

function getOptions(baseId) {
	const options = units.filter((unit) => unit.name === baseId);
	if (options.length === 0) {
		throw new Error('No options for ' + baseId);
	}
	return options;
}

createJsonString(squadString);
