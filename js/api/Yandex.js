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
      url: `${Yandex.HOST}/resources/upload`,
      method: 'POST',
      headers: { 'Authorization': `OAuth ${this.getToken()}` },
      data: { path, url },
      callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({ 
      url: `${Yandex.HOST}/resources`,
      method: 'DELETE',
      headers: { 'Authorization': `OAuth ${this.getToken()}` },
      data: { path },
      callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({ 
      url: `${Yandex.HOST}/resources/files`,
      method: 'GET',
      headers: { 'Authorization': `OAuth ${this.getToken()}` },
      data: {},
      callback,
    });
  }

  /**
   * Метод скачивания файлов по URL
   */
  static downloadFileByUrl(url, callback) {
    console.log('Скачивание файла по URL:', url);
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
