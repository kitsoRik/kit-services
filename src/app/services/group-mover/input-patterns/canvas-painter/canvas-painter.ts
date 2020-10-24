import { getGroupColor, getMainColor } from './colors';
import { getLines } from './get-lines';
import { renderPositions } from './render-positions/render-positions';

export const canvasPainter = async (
	canvas: HTMLCanvasElement,
	textarea: HTMLTextAreaElement,
	matches: RegExpMatchArray[]
) => {
	const context = canvas.getContext('2d');
	const margin = 3;

	const offsetTop = -canvas.offsetTop;
	const canvasHeight = textarea.clientHeight;
	console.log(offsetTop, canvasHeight);

	context.clearRect(0, 0, 10000, 10000);

	const text = textarea.value;
	const lines = getLines(textarea);

	renderPositions(text, matches, lines, async (position, index) => {
		const { x, y, w, h, groups } = position;
		if (y < offsetTop || y > offsetTop + canvasHeight) return;

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
