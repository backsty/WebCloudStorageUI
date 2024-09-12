/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const { method = 'GET', url, headers = {}, data = {}, callback } = options;

    if (method === 'GET' && Object.keys(data).length > 0) {
        const params = new URLSearchParams(data);
        url += `?${params.toString()}`;
    }

    xhr.responseType = 'json';

    return new Promise((resolve, reject) => {
        try {
            xhr.open(method, url);

            for (const headerKey in headers) {
                xhr.setRequestHeader(headerKey, headers[headerKey]);
            }

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status <= 300) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Ошибка запроса: ${xhr.status}`));
                }
            };

            xhr.onload = () => {
                reject(new Error('Ошибка сети'));
            };

            if (method === 'POST' && Object.keys(data).length > 0) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        } catch (error) {
            console.log('Ошибка при отправке запроса: ', error);
            reject(error);
        }
    });
};
