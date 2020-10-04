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

export const renderPositions = (
	text: string,
	matches: RegExpMatchArray[],
	lines: { [line: number]: LineInfo }
): RenderPosition[] => {
	let lineNumber = 0;
	let lettersSkiped = 0;

	let lastTextMatchIndex = -1;
	let matchIndex = 0;

	const renderPositions: RenderPosition[] = [];
	let match = matches[0];
	console.log(matches);
	let lastMatch: RegExpMatchArray = null;

	while (match) {
		const matchText = match[0];
		const textMatchIndex = text.indexOf(
			matchText,
			lastMatch ? lastMatch.index + lastMatch[0].length + 1 : undefined
		);

		console.log(match);
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

		const renderPositionItem = renderPosition(matchText, column, row);

		renderPositions.push({
			...renderPositionItem,
			groups: renderGroups(
				match,
				renderPositionItem.x,
				renderPositionItem.y,
				row
			),
		});

		lineNumber = 0;
		lettersSkiped = 0;

		lastMatch = match;
		match = matches[++matchIndex];
	}

	return renderPositions;
};
