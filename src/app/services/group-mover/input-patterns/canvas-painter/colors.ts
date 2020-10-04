const TRANSPARENT = 60; // 0 - 100
const MAIN_COLORS = ['#7FB3D5', '#117A65'];
const GROUP_COLORS = ['#E74C3C', '#9B59B6', '#2980B9'];

export const getMainColor = (index: number): string => {
	return transformColor(MAIN_COLORS[index % 2]);
};

export const getGroupColor = (groupIndex: number): string => {
	return transformColor(GROUP_COLORS[groupIndex]);
};

const transformColor = (color: string) => {
	const transparent = Math.floor((TRANSPARENT * 256) / 100).toString(16);
	return `${color}${transparent}`;
};
