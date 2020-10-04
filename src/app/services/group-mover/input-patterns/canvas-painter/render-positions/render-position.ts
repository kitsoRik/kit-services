const LETTER_WIDTH = 7.33;
const LETTER_HEIGHT = 16;

export const renderPosition = (
	match: string,
	column: number,
	row: number
): {
	x: number;
	y: number;
	w: number;
	h: number;
} => {
	const w = LETTER_WIDTH * match.length;
	const h = LETTER_HEIGHT;

	const x = column * LETTER_WIDTH;
	const y = row * LETTER_HEIGHT;

	const result = {
		x,
		y,
		w,
		h,
	};

	return result;
};
