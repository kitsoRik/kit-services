import { MatcherService } from '../../../matcher.service';
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
	matcher: MatcherService,
	lines: { [line: number]: LineInfo },
	callback: (pos: RenderPosition, index: number) => void | Promise<void>
): Promise<void> => {
	let lineNumber = 0;
	let lettersSkiped = 0;

	let lastTextMatchIndex = -1;

	let match = matcher.getNextMatch();
	let lastMatch: RegExpMatchArray = null;
	let index = 0;
	while (match) {
		const matchText = match[0];
		const textMatchIndex = text.indexOf(
			matchText,
			lastMatch
				? lastMatch.index + lastMatch.length
				: match
				? match.index
				: undefined
		);

		lastTextMatchIndex = textMatchIndex;

		while (lettersSkiped <= textMatchIndex) {
			lineNumber++;
			lettersSkiped += lines[lineNumber].length;
		}
		lettersSkiped -= lines[lineNumber]?.length ?? 0;

		const row = lineNumber - 1;
		let column;
		column = text.indexOf(
			matchText,
			lastMatch?.index + lastMatch?.[0].length ?? 0
		);

		const renderPositionItem = renderPosition(
			matchText,
			column,
			row,
			lines[lineNumber].value.slice(0, column)
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

		lineNumber = 0;
		lettersSkiped = 0;

		lastMatch = match;
		match = matcher.getNextMatch();
		if (index % 1000 === 0) await delay(1);
	}
};

export const delay = async (timeout: number) =>
	new Promise((r) => setTimeout(r, timeout));
