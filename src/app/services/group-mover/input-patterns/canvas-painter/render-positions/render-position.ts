import { getCharHeight, getLineHeight, getStringWidth } from './get-char-width';

export const renderPosition = (
	match: string,
	column: number,
	row: number,
	textBefore: string
): {
	x: number;
	y: number;
	w: number;
	h: number;
} => {
	const w = getStringWidth(match);
	const h = getLineHeight();

	const x = getStringWidth(textBefore);
	const y = row * getCharHeight();

	const result = {
		x,
		y,
		w,
		h,
	};

	return result;
};
