export const discordHelper = {
	getParameters: function (dataString: string, key: string) {
		dataString = dataString.replace(key, '').trim();
		const options = dataString.split('-');
		options.shift();
		const result = {};
		options.forEach((option) => {
			result[option.split('=')[0].trim()] = option.split('=')[1].trim();
		});
		return result;
	}
};
