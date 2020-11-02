import { GroupMoverWasmService } from '../../group-mover-wasm.service';
import { MatcherService } from '../../matcher.service';
import { getGroupColor, getMainColor } from './colors';
import { getLines } from './get-lines';
import { placeTransfers } from './placeTransfers';
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

	renderPositions(
		text,
		matcher,
		lines,
		async (fullMatchText, position, index) => {
			const { y } = position;
			if (y < offsetTop - offset || y > offsetTop + canvasHeight + offset)
				return;

			const positionWithPlacedTransfers = placeTransfers(
				fullMatchText,
				position
			);
			let counterGroupIndex = 0;
			positionWithPlacedTransfers.forEach(
				(positionWithPlacedTransfer) => {
					const {
						x: pX,
						y: pY,
						w: pW,
						h: pH,
					} = positionWithPlacedTransfer;
					renderRect(context, pX, pY, pW, pH, getMainColor(index));
				}
			);

			positionWithPlacedTransfers.forEach(
				(positionWithPlacedTransfer) => {
					const { groups: pGroups } = positionWithPlacedTransfer;
					for (
						let groupIndex = 0;
						groupIndex < pGroups.length;
						groupIndex++, counterGroupIndex++
					) {
						const renderGroupPosition = pGroups[groupIndex];
						if (Array.isArray(renderGroupPosition)) {
							renderGroupPosition.forEach((p) => {
								renderRect(
									context,
									p.x,
									p.y,
									p.w,
									p.h,
									getGroupColor(counterGroupIndex)
								);
							});
						} else {
							renderRect(
								context,
								renderGroupPosition.x,
								renderGroupPosition.y,
								renderGroupPosition.w,
								renderGroupPosition.h,
								getGroupColor(counterGroupIndex)
							);
						}
					}
				}
			);
		}
	);
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
