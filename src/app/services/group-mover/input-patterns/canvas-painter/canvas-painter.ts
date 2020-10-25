import { MatcherService } from '../../matcher.service';
import { getGroupColor, getMainColor } from './colors';
import { getLines } from './get-lines';
import { getCharWidth, getLineHeight } from './render-positions/get-char-width';
import { renderPositions } from './render-positions/render-positions';

export const canvasPainter = async (
	canvas: HTMLCanvasElement,
	textarea: HTMLTextAreaElement,
	matcher: MatcherService
) => {
	const context = canvas.getContext('2d');

	const offsetTop = -canvas.offsetTop;
	const canvasHeight = textarea.clientHeight;

	const text = textarea.value;
	const lines = getLines(textarea);
	const clearFromLineNumber = Object.keys(lines).find((lineNumberKey) => {
		const line = lines[lineNumberKey];
		if (!line) return false;
		const matcherIndex = matcher.getMatchIndex();
		return (
			line.startIndex < matcherIndex &&
			line.startIndex + line.length > matcherIndex
		);
	});
	const clearFromLine = lines[clearFromLineNumber ?? 1];

	context.clearRect(0, 0, 10000, 10000);
	const offset = 500;

	renderPositions(text, matcher, lines, async (position, index) => {
		const { x, y, w, h, groups } = position;
		if (y < offsetTop - offset || y > offsetTop + canvasHeight + offset)
			return;
		renderRect(context, x, y, w, h, getMainColor(index));

		for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
			const renderGroupPosition = groups[groupIndex];
			const group = renderGroupPosition;

			renderRect(
				context,
				group.x,
				group.y,
				group.w,
				group.h,
				getGroupColor(groupIndex)
			);
		}
	});
};

const renderRect = (
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	color: string
) => {
	context.fillStyle = color;
	context.clearRect(3 + x, y, w, h);
	context.fillRect(3 + x, y, w, h);
};
