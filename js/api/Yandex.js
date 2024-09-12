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

    if (!token) {
      token = prompt('Введите ваш Oauth токен для Yandex.Disk');
      if (token) {
        localStorage.setItem('yandexToken', token);
      } else {
        alert('Вы не ввели токен. Попробуйте ещё раз!');
      }
    }
    
    return token;
  }

  /**
   * Метод для выполнения запроса с использованием токена.
  */
  static createRequest(url, method, data, callback) {
    const token = this.getToken();

    if (!token) {
      return;
    }


    const options = {
      method,
      headers: {
        'Authorization': `Oauth ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    fetch(`${this.HOST}${url}`, options)
      .then(response => response.json)
      .then(data => callback(null, data))
      .catch(error => callback(error));
  }


  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    const uploadUrl = '/resources/upload';
    const data = { path, url }
    this.createRequest(uploadUrl, 'POST', data, callback)
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const deleteUrl = `/resources?path=${encodeURIComponent(path)}`;
    this.createRequest(deleteUrl, 'DELETE', null, callback);
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    const fileUrl = '/resources/files';
    this.createRequest(fileUrl, 'GET', null, callback);
  }

  /**
   * Метод скачивания файлов по URL
   */
  static downloadFileByUrl(url){
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
