"use strict";

/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const url = new URL(options.url);

    try {
        Object.entries(options.data).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });

        xhr.open(options.method, url.toString(), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.responseType = 'json';

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, val]) => {
                xhr.setRequestHeader(key, val);
            });
        }

        console.log(url.toString());

        xhr.send();
        xhr.onload = () => {
            options.callback( null, xhr.response );
        };
        xhr.onerror = () => {
            options.callback( xhr.response, null );
        };
    } catch (error) {
        console.error('Ошибка при выполнении запроса: ', error);
        options.callback(error);
    }
};