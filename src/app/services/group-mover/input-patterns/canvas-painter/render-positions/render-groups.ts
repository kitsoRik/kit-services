import { renderPosition } from './render-position';

export type RenderGroupPosition = {
	x: number;
	y: number;
	w: number;
	h: number;

	groupIndex: number;
};

export const renderGroups = (
	match: RegExpMatchArray,
	offsetX: number,
	offsetY: number,
	row: number
): RenderGroupPosition[] => {
	if (match.length === 1) return [];

	console.log(match);

	const groups: RenderGroupPosition[] = [];
	const text = match[0];

	for (let i = 1; i < match.length; i++) {
		const group = match[i];

		const column = text.indexOf(group);

		const position = renderPosition(
			group,
			column,
			row,
			text.slice(0, column + 1)
		);

		groups.push({
			x: offsetX + position.x,
			y: position.y,
			w: position.w,
			h: position.h,

			groupIndex: i,
		});
	}

	return groups;
};
