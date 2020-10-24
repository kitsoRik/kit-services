import { LineInfo } from '../get-lines';
import { RenderGroupPosition, renderGroups } from './render-groups';
import { renderPosition } from './render-position';

export type RenderPosition = {
	x: number;
	y: number;
	w: number;
	h: number;
	groups: RenderGroupPosition[];
};

export const renderPositions = async (
	text: string,
	matches: RegExpMatchArray[],
	lines: { [line: number]: LineInfo },
	callback: (pos: RenderPosition, index: number) => void | Promise<void>
): Promise<void> => {
	let lineNumber = 0;
	let lettersSkiped = 0;

	let lastTextMatchIndex = -1;
	let matchIndex = 0;

	let match = matches[0];
	let lastMatch: RegExpMatchArray = null;
	let index = 0;

	while (match) {
		const matchText = match[0];
		const textMatchIndex = text.indexOf(
			matchText,
			lastMatch ? lastMatch.index + lastMatch.length + 1 : undefined
		);

		lastTextMatchIndex = textMatchIndex;

		while (lettersSkiped <= textMatchIndex) {
			lineNumber++;
			lettersSkiped += lines[lineNumber].length;
		}

		lettersSkiped -= lines[lineNumber]?.length ?? 0;

		const row = lineNumber - 1;
		let column;

		if (lettersSkiped !== 0)
			column =
				text.indexOf(matchText, lastTextMatchIndex) - lettersSkiped;
		else column = text.indexOf(matchText, lastTextMatchIndex);

		const renderPositionItem = renderPosition(
			matchText,
			column,
			row,
			lines[lineNumber].value.slice(0, column + 1)
		);

		callback(
			{
				...renderPositionItem,
				groups: renderGroups(
					match,
					renderPositionItem.x,
					renderPositionItem.y,
					row
				),
			},
			index++
		);

		if (index % 1000 === 0) await delay(1);

		lineNumber = 0;
		lettersSkiped = 0;

		lastMatch = match;
		match = matches[++matchIndex];
	}
};

export const delay = async (timeout: number) =>
	new Promise((r) => setTimeout(r, timeout));
