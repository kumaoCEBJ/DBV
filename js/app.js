let worker = null;
let dotnetCallback = null;
export function initWorker(callback) {
    dotnetCallback = callback;
    worker = new Worker('./js/worker.js');

    worker.onmessage = function (e) {
        const { action, payload } = e.data;
        if (!dotnetCallback) return;

        let byteArray = null;
        switch (action) {
            case 'progress':
                dotnetCallback({
                    counter: payload,
                    type: 2,
                    data: new Uint8Array(0)
                });
                break;
            case 'preresult':
                dotnetCallback({
                    counter: payload,
                    type: 3,
                    data: new Uint8Array(0)
                });
                break;
            case 'result': {
                byteArray = new Uint8Array(payload);
                dotnetCallback({
                    counter: 0,
                    type: 5,
                    data: byteArray
                });
                break;
            }
            case 'torehan': {
                byteArray = new Uint8Array(payload);
                dotnetCallback({
                    counter: 0,
                    type: 7,
                    data: byteArray
                });
                break;
            }
            case 'cancelled':
                dotnetCallback({
                    counter: payload,
                    type: 9,
                    data: new Uint8Array(0)
                });
                break;
            case 'error':
                dotnetCallback({
                    counter: 0,
                    type: 99,
                    data: new Uint8Array(0)
                });
                break;
            default:
                console.error('Received message with unknown format:');
                dotnetCallback({
                    counter: 0,
                    type: 0,
                    data: new Uint8Array(0)
                });
                break;
        }
    };
}
export function startWorkerProcessing(jsonData) {
    if (!worker) return;
    worker.postMessage({ action: "Simulate", payload: jsonData });
}
export function terminateWorker() {
    if (worker) {
        if (worker.onmessage) {
            worker.onmessage({
                data: {
                    action: 'cancelled',
                    payload: 1
                }
            });
        }
        worker.terminate();
    }
    initWorker(dotnetCallback);
}
