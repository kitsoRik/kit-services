/// <reference lib="webworker" />

addEventListener('message', ({ data: { text, fnText } }: any) => {
	let flag: boolean = false;
	const w = createWorkert(
		({
			data: { text, fnText },
		}: {
			data: { text: string; fnText: string };
		}) => {
			try {
				const f = new Function('text', `${fnText}`);
				const result = f(text);
				postMessage(result);
			} catch (e) {
				postMessage('');
			}
		}
	);

	w.addEventListener('message', ({ data }) => {
		flag = true;
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
