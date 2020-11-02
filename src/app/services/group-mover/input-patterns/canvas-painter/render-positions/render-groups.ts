import { Position, RenderGroupPosition } from '../types';
import { renderPosition } from './render-position';

export const renderGroups = (
	match: RegExpMatchArray & { groupsIndexes: any[] },
	offsetX: number,
	offsetY: number,
	row: number
): RenderGroupPosition[] => {
	if (match.length === 1) return [];

	const groups: RenderGroupPosition[] = [];
	const text = match[0];
	let lastIndex = -1;
	for (let i = 0; i < match.groupsIndexes.length; i++) {
		const { index, size } = match.groupsIndexes[i];
		const column = index;
		lastIndex += column;

		const position = renderPosition(
			match[i + 1],
			column,
			row,
			text.slice(0, column)
		);

		groups.push({
			x: offsetX + position.x,
			y: position.y,
			w: position.w,
			h: position.h,

			text: text.slice(index, index + size),

			groupIndex: i,
		});
	}

	return groups;
};
