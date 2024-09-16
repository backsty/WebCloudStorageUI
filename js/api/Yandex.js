"use strict";

/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API.
   * Если токен отсутствует в локальном хранилище, запрашивает у пользователя.
  */
  static getToken(){
    let token = localStorage.getItem('yandexToken');
    console.log('Полученный токен из локального хранилища:', token);

    if (!token) {
      token = prompt('Введите ваш Oauth токен для Yandex.Disk');
      console.log('Введённый токен:', token);
      if (token) {
        localStorage.setItem('yandexToken', token);
        console.log('Токен сохранён в локальном хранилище.');
      } else {
        alert('Вы не ввели токен. Попробуйте ещё раз!');
        console.log('Токен не был введён.');
      }
    }
    
    return token;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: `${Yandex.HOST}/resources/upload`,
      data: { path, url },
      headers: { "Authorization": `OAuth ${Yandex.getToken()}`, "Accept": 'application/json', "Content-Type": 'application/json'},
      callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({ 
      method: 'DELETE',
      url: `${Yandex.HOST}/resources`,
      data: { path },
      headers: { "Authorization": `OAuth ${Yandex.getToken()}`, "Accept": 'application/json', "Content-Type": 'application/json'},
      callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({
      method: 'GET',
      url: `${Yandex.HOST}/resources/files`,
      data: { mediaType: "image", limit: 1000000 },
      headers: { "Authorization": `OAuth ${Yandex.getToken()}`},
      callback,
    });
  }

  /**
   * Метод скачивания файлов по URL
   */
  static downloadFileByUrl(url) {
    console.log('Скачивание файла по URL:', url);
    const link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
