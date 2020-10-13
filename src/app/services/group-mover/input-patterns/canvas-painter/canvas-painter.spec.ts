import { renderPosition } from './canvas-painter';

describe('canvas painter', () => {
	it('should return verified value for index', () => {
		expect(renderPosition('', '', 0)).toEqual({
			x: 0,
			y: 0,
			w: 7.33,
			h: 16,
		});

		expect(renderPosition('', '', 1)).toEqual({
			x: 7.33,
			y: 0,
			w: 7.33,
			h: 16,
		});

		expect(renderPosition('', '', 50)).toEqual({
			x: 0,
			y: 16,
			w: 7.33,
			h: 16,
		});

		expect(renderPosition('', '', 51)).toEqual({
			x: 7.33,
			y: 16,
			w: 7.33,
			h: 16,
		});
	});
});
