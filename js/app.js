window.addEventListener('beforeunload', function (e) {
    if (window.savedStateDotNetHelper) {
        window.savedStateDotNetHelper.invokeMethodAsync('SaveStateBeforeUnload');
    }
});

window.setSavedStateDotNetHelper = (dotNetHelper) => {
    window.savedStateDotNetHelper = dotNetHelper;
};

window.clearSavedStateDotNetHelper = () => {
    window.savedStateDotNetHelper = null;
};

window.saveDataToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, data);
    } catch (e) {
    }
};

window.getDataFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data;
    } catch (e) {
        return null;
    }
};

window.removeDataFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
    }
};

window.clearAllLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (e) {
    }
};

let myWorker = null;
let dotNetHelper = null;
function showConfirmation(message) {
    return confirm(message);
}
window.startWorkerProcessing = function (jsonData, dotNetHelperRef) {
    dotNetHelper = dotNetHelperRef;

    if (myWorker === null) {
        myWorker = new Worker('./js/worker.js');
        myWorker.onmessage = function (e) {
            const message = e.data;
            if (!message || typeof message.type === 'undefined') {
                if (dotNetHelper) {
                    dotNetHelper.invokeMethodAsync('HandleWorkerError', 'Received message with unknown format');
                }
                return;
            }
            switch (message.type) {
                case 'progress':
                    if (dotNetHelper && message.payload && typeof message.payload.currentIndex !== 'undefined') {
                        dotNetHelper.invokeMethodAsync('HandleProgressUpdate', message.payload.currentIndex);
                    }
                    break;
                case 'preresult':
                    if (dotNetHelper && message.payload) {
                        dotNetHelper.invokeMethodAsync('HandleProgressPreResult', message.payload.message);
                    }
                    break;
                case 'result':
                    if (dotNetHelper && message.data && message.data.arrayId) {
                        const transferredBuffer = message.data.dataBuffer;
                        const numElements = message.data.length;
                        const uint8Array = new Uint8Array(transferredBuffer);
                        dotNetHelper.invokeMethodAsync('HandleWorkerResult', uint8Array, numElements);
                    }
                    break;
                case 'torehan':
                    if (dotNetHelper && message.data && message.data.arrayId) {
                        const transferredBuffer = message.data.dataBuffer;
                        const numElements = message.data.length;
                        const uint8Array = new Uint8Array(transferredBuffer);
                        dotNetHelper.invokeMethodAsync('HandleWorkerResultTorehan', uint8Array, numElements);
                    }
                    break;
                case 'error':
                    if (dotNetHelper && message.payload) {
                        dotNetHelper.invokeMethodAsync('HandleWorkerError', message.payload);
                    }
                    break;
                case 'cancelled':
                    if (dotNetHelper && message.payload) {
                        dotNetHelper.invokeMethodAsync('HandleWorkerCancelled', message.payload.reason || 'Unknown reason');
                    } else if (dotNetHelper) {
                        dotNetHelper.invokeMethodAsync('HandleWorkerCancelled', 'Processing cancelled');
                    }
                    break;
                default:
                    if (dotNetHelper) {
                        dotNetHelper.invokeMethodAsync('HandleWorkerError', `Received message with unhandled type: ${message.type}`);
                    }
                    break;
            }
        };

        myWorker.onerror = function (e) {
            if (dotNetHelper) {
                dotNetHelper.invokeMethodAsync('HandleWorkerError', e.message || 'Unknown worker error');
            }
        };
    }
    myWorker.postMessage({ type: 'start', payload: jsonData });
};

window.cancelWorkerProcessing = function () {
    if (myWorker) {
        myWorker.postMessage({
            type: 'cancel', payload: { reason: `cancelled by cansel button` }
        });
        if (dotNetHelper) {
            dotNetHelper.invokeMethodAsync('HandleWorkerCancelled', 'Canceled by user/timeout');
        }
    }
};