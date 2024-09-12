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
  static async createRequest(url, method, data) {
    const token = this.getToken();

    if (!token) {
      throw new Error('Токен не был получен.');
    }

    const options = {
      method,
      headers: {
        'Authorization': `Oauth ${token}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    };

    try {
      const response = await fetch(`${this.HOST}${url}`, options);
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Ошибка при выполнении запроса: ${error.message}`);
    }
  }

  /**
   * Метод загрузки файла в облако
   */
  static async uploadFile(path, url){
    const uploadUrl = '/resources/upload';
    const data = { path, url }
    return await this.createRequest(uploadUrl, 'POST', data)
  }

  /**
   * Метод удаления файла из облака
   */
  static async removeFile(path){
    const deleteUrl = `/resources?path=${encodeURIComponent(path)}`;
    return await this.createRequest(deleteUrl, 'DELETE');
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static async getUploadedFiles(){
    const fileUrl = '/resources/files';
    return await this.createRequest(fileUrl, 'GET');
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
