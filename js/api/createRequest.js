/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = async (options = {}) => {
    const url = new URL(Yandex.HOST + options.path);

    if (options.data.way) {
        url.searchParams.append('path', encodeURIComponent(options.data.way))
    }
    if (options.data.url) {
        url.searchParams.append('url', encodeURIComponent(options.data.url))
    }
    if (options.data.media_type) {
        url.searchParams.append('media_type', encodeURIComponent(options.data.media_type))
    }
    if (options.data.limit >= 0) {
        url.searchParams.append('limit', encodeURIComponent(options.data.limit))
    }

    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers : { Authorization: options.headers.Authorization },
        });

        if (!response.ok) {
            const result = await response.json();
            console.log(result.message);
            throw new Error(`Ошибка ${response.status}: ${result.message}`)
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении запроса: ', error);
        throw error; 
    }
};
