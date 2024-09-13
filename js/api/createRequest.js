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
        xhr.open(options.method, url, true);
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





    // const url = new URL(Yandex.HOST + options.path);
    // console.log('Созданный URL:', url.href);

    // if (options.data.way) {
    //     url.searchParams.append('path', encodeURIComponent(options.data.way))
    //     console.log('Добавлен параметр path:', options.data.way);
    // }
    // if (options.data.url) {
    //     url.searchParams.append('url', encodeURIComponent(options.data.url))
    //     console.log('Добавлен параметр url:', options.data.url);
    // }
    // if (options.data.media_type) {
    //     url.searchParams.append('media_type', encodeURIComponent(options.data.media_type))
    //     console.log('Добавлен параметр media_type:', options.data.media_type);
    // }
    // if (options.data.limit >= 0) {
    //     url.searchParams.append('limit', encodeURIComponent(options.data.limit))
    //     console.log('Добавлен параметр limit:', options.data.limit);
    // }

    // try {
    //     console.log('Отправка запроса на URL:', url.href);
    //     const response = await fetch(url, {
    //         method: options.method || 'GET',
    //         headers : { Authorization: options.headers.Authorization },
    //     });

    //     console.log('Ответ от сервера получен:', response);

    //     if (!response.ok) {
    //         const result = await response.json();
    //         console.error(`Ошибка ${response.status}: ${result.message}`);
    //         throw new Error(`Ошибка ${response.status}: ${result.message}`)
    //     }

    //     const jsonResponse = await response.json();
    //     console.log('Успешный ответ от сервера:', jsonResponse);
    //     return jsonResponse;
    // } catch (error) {
    //     console.error('Ошибка при выполнении запроса: ', error);
    //     throw error; 
    // }
};
