const CHAR_WIDTH = 7.33;
const CHAR_HEIGHT = 15;

export const getStringWidth = (str: string) => {
	let width = 0;

	for (const char of str) width += getCharWidth(char);

	return width;
};

export const getCharWidth = (char?: string) => {
	if (char === '\t') return CHAR_WIDTH * 5;
	if (char === '\n') return 0;
	return CHAR_WIDTH;
};

export const getCharHeight = (char?: string) => {
	return CHAR_HEIGHT;
};

export const getLineHeight = () => {
	return CHAR_HEIGHT;
};
