/// <reference lib="webworker" />

addEventListener('message', ({ data: { text, fnText } }: any) => {
	let flag: boolean = false;
	const w = createWorkert(
		({
			data: { text, fnText },
		}: {
			data: { text: string; fnText: string };
		}) => {
			const f = new Function('text', `${fnText}`);
			try {
				const result = f(text);
				postMessage(result);
				console.log(result, 'PST');
			} catch (e) {
				postMessage('');
			}
		}
	);

	w.addEventListener('message', ({ data }) => {
		flag = true;
		console.log(data);
		postMessage(data);
		w.terminate();
	});

	w.postMessage({ text, fnText });

	setTimeout(() => {
		if (!flag) {
			postMessage(null);
			w.terminate();
		}
	}, 3000);
});

function createWorkert(fn) {
	const blob = new Blob(['self.onmessage = ', fn.toString()], {
		type: 'text/javascript',
	});
	const url = URL.createObjectURL(blob);

	return new Worker(url, { type: 'module' });
}
