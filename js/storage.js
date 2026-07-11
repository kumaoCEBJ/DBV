
let localStorageCallback = null;
export function registerSaveCallback(callback) {
    localStorageCallback = callback;
}
window.addEventListener('beforeunload', async function (e) {
    if (localStorageCallback) {
        localStorageCallback();
    }
});
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, data);
    } catch (e) {
    }
}
export function loadFromLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}
export function showConfirmation(message) {
    return confirm(message);
}



export function removeDataFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
    }
}

export function clearAllLocalStorage() {
    try {
        localStorage.clear();
    } catch (e) {
    }
}