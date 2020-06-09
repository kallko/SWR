export const DateHelper = {
	getDate: function (): number {
		return parseInt(new Date().getDate().toLocaleString());
	},
	getMonth: function (): number {
		return new Date().getMonth() + 1;
	},
	getYear: function () {
		return new Date().getFullYear();
	},
	getDayDiff: function (
		currentDate: number,
		currentMonth: number,
		archDate: number,
		archMonth: number
	): number {
		return currentMonth * 30 + currentDate - (archMonth * 30 + archDate);
	}
};
