export type LineInfo = {
	value: string;
	startIndex: number;
	length: number;
};

let lines: { [line: number]: LineInfo } = {};

export const getLines = (textarea: HTMLTextAreaElement): typeof lines => {
	lines = {};

	let linePos = 1;

	do {
		lines[linePos] = calculateLines(textarea, linePos);
	} while (lines[linePos++] !== undefined);

	return lines;
};

const calculateLines = (textarea: HTMLTextAreaElement, lineNumber: number) => {
	const text = textarea.value;

	if (lineNumber === 1) {
		let index = 0;
		while (text[index] !== '\n' && text[index]) {
			index++;
		}

		let slice = text.slice(0, index + 1);

		return {
			value: slice,
			startIndex: 0,
			length: slice.length,
		};
	} else {
		const prevLine = lines[lineNumber - 1];

		const offset = prevLine.startIndex + prevLine.length;
		let index = offset;
		while (text[index] !== '\n' && text[index]) {
			index++;
		}

		let slice = text.slice(offset, index + 1);

		if (slice.length === 0) return undefined;

		return {
			value: slice,
			startIndex: offset,
			length: slice.length,
		};
	}
};
