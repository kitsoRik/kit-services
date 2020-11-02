import {
	getCharHeight,
	getCharWidth,
	getStringWidth,
} from './render-positions/get-char-width';
import { RenderGroupPosition, RenderPosition } from './types';

export const placeTransfers = (
	fullMatchText: string,
	position: RenderPosition
): RenderPosition[] => {
	const nIndexes: number[] = [];
	let tempIndex: number = -1;
	do {
		tempIndex = fullMatchText.indexOf('\n', tempIndex + 1);
		if (tempIndex !== -1) {
			nIndexes.push(tempIndex);
		}
	} while (tempIndex !== -1);

	if (nIndexes.length === 0) return [position];

	const positions: RenderPosition[] = [];

	for (let i = 0; i < nIndexes.length; i++) {
		const prevTextWidth = getStringWidth(
			fullMatchText.slice(0, nIndexes[i])
		);
		const textWidth = getStringWidth(
			fullMatchText.slice(nIndexes[i - 1] + 1 || 0, nIndexes[i])
		);
		const groups: (
			| RenderGroupPosition
			| RenderGroupPosition[]
		)[] = (position.groups as RenderGroupPosition[]).filter(
			(g) => g.x - position.x + g.w <= prevTextWidth + 0.01
		);
		position.groups = (position.groups as RenderGroupPosition[]).filter(
			(g) => !groups.includes(g)
		);

		groups.forEach((g, index) => {
			(g as RenderGroupPosition).y =
				(g as RenderGroupPosition).y + getCharHeight() * i;
			if (i !== 0) (g as RenderGroupPosition).x = 0;
		});

		if (position.groups.length !== 0) {
			const gNIndexes: number[] = [];
			let gTempIndex: number = -1;
			const groupText = (position.groups[0] as RenderGroupPosition).text;
			do {
				gTempIndex = groupText.indexOf('\n', gTempIndex + 1);
				if (gTempIndex !== -1) {
					gNIndexes.push(gTempIndex);
				}
			} while (gTempIndex !== -1);

			if (gNIndexes.length !== 0) {
				const splitedGroups: RenderGroupPosition[] = [];
				const firstGroup = {
					...(position.groups[0] as RenderGroupPosition),
				};

				firstGroup.w = getStringWidth(groupText.slice(0, gNIndexes[0]));

				splitedGroups.push(firstGroup);

				for (let i = 0; i < nIndexes.length; i++) {
					const slicedGroup = {
						...(position.groups[0] as RenderGroupPosition),
					};

					slicedGroup.x = 0;
					slicedGroup.w = getStringWidth(
						groupText.slice(
							gNIndexes[i],
							gNIndexes[i + 1] ?? undefined
						)
					);
					slicedGroup.y += getCharHeight() * (i + 1);
					splitedGroups.push(slicedGroup);
				}
				position.groups = (position.groups as RenderGroupPosition[]).filter(
					(g, index) => index > 0
				);

				groups.push(splitedGroups);
			}
		}

		positions.push({
			...position,
			groups,
			y: position.y + getCharHeight() * i,
			w: textWidth,
		});
	}

	position.groups.forEach((g) => {
		((g as RenderGroupPosition).y =
			(g as RenderGroupPosition).y + nIndexes.length * getCharHeight()),
			((g as RenderGroupPosition).x = 0);
	});

	positions.push({
		...position,
		y: position.y + nIndexes.length * getCharHeight(),
		x: 0,
		w: getStringWidth(fullMatchText.slice(nIndexes[nIndexes.length - 1])),
	});
	return positions;
};
