export type Position = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export type RenderGroupPosition = Position & {
	groupIndex: number;
	text: string;
};

export type RenderPosition = Position & {
	groups: (RenderGroupPosition | RenderGroupPosition[])[];
};
