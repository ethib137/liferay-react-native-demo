export const getSelectedOption = (value, options) => {
	const optionsMap = {};

	options.forEach((option) => {
		optionsMap[option.value] = option.label;
	});

	return value.map((value) => optionsMap[value]).join(', ');
};
