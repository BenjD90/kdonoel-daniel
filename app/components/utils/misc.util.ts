import _get = require("lodash/get");

export const noop = () => {
};

export const noopWithValue = (_) => {
};

export const ifNilReturnDefault = (val, path, defaultValue) => {
	const value = _get(val, path);
	if (value === undefined || value === null) {
		return defaultValue;
	} else {
		return value;
	}
};
