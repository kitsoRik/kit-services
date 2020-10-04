/// <reference lib="webworker" />

const TIMEOUT_FOR_LOOP_ERROR = 3000;

addEventListener('message', ({ data: { type, data } }: any) => {
	switch (type) {
		case 'PROCESS_MATCHES':
			processMatches(data);
			break;
		case 'PROCESS_EACH_FUNCTION':
			processEachFunction(data);
			break;
		case 'PROCESS_GLOBAL_FUNCTION':
			processGlobalFunction(data);
			break;
		case 'PROCESS_ARGUMENTS_PATTERN':
			processArguments(data);
			break;
	}
});

const processMatches = ({ regexp, text }: any) => {
	const w = createWorker(({ data: { regexp, text } }) => {
		const reg = new RegExp(regexp, 'gi');
		const matches: RegExpExecArray[] = [];
		let match: RegExpExecArray;
		let __index = 0;
		while ((match = reg.exec(text)) && match[0] !== '') {
			matches.push(match);
		}

		postMessage({ matches });
	});

	w.addEventListener('message', ({ data: { matches } }) => {
		postMessage({
			type: 'FINISH_PROCESS_MATCHES',
			matches,
		});
		w.terminate();
	});

	w.postMessage({ regexp, text });
};

const processFunctionFactory = (fn, codeName: string) => {
	return ({
		code,
		matches,
	}: {
		code: string;
		matches: RegExpExecArray[];
	}) => {
		const w = createWorker(fn);

		let flag: Boolean = false;

		w.addEventListener('message', ({ data }) => {
			flag = true;
			postMessage(data);
			w.terminate();
		});

		w.postMessage({ code, matches });

		setTimeout(() => {
			if (!flag) {
				w.terminate();
				postMessage({
					type: `LOOP_ERROR_PROCESS_${codeName}_FUNCTION`,
				});
			}
		}, TIMEOUT_FOR_LOOP_ERROR);
	};
};

const processEachFunction = processFunctionFactory(
	({ data: { code, matches } }) => {
		try {
			let result = '';
			matches.forEach((m, i) => {
				const f = new Function('match, index', `${code}`);
				result += f(m, i);
			});
			postMessage({
				type: 'FINISH_PROCESS_EACH_FUNCTION',
				result,
			});
		} catch (error) {
			postMessage({
				type: 'ERROR_PROCESS_EACH_FUNCTION',
				error,
			});
		}
	},
	'EACH'
);

const processGlobalFunction = processFunctionFactory(
	({ data: { code, matches } }) => {
		try {
			const f = new Function('matches', `${code}`);

			const result = f(matches);

			postMessage({
				type: 'FINISH_PROCESS_GLOBAL_FUNCTION',
				result,
			});
		} catch (error) {
			postMessage({
				type: 'ERROR_PROCESS_GLOBAL_FUNCTION',
				error,
			});
		}
	},
	'GLOBAL'
);

const processArguments = ({ pattern, matches }) => {
	let result = '';

	matches.forEach((m) => {
		let temp = pattern;
		for (let i = 0; i < m.length; i++) {
			temp = temp.replace(new RegExp(`%${i + 1}`, 'g'), m[i]);
		}
		result += temp;
	});

	postMessage({
		type: 'FINISH_PROCESS_ARGUMENTS_PATTERN',
		result,
	});
};

function createWorker(fn) {
	const blob = new Blob(['self.onmessage = ', fn.toString()], {
		type: 'text/javascript',
	});
	const url = URL.createObjectURL(blob);

	return new Worker(url, { type: 'module' });
}
