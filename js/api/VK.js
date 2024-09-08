"use strict";

/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = window.env.ACCESS_TOKEN;
  static lastCallback = () => {};

  /**
   * Получает изображения из профиля VK.
   * @param {string} id - ID пользователя VK.
   * @param {function} callback - Функция обратного вызова для обработки полученных данных.
   */
  static get(id = '', callback){
    this.lastCallback = callback;

    let script = document.createElement('SCRIPT');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&photo_sizes=1&count=1000&access_token=${this.ACCESS_TOKEN}&v=5.199&callbakc=VK.lastCallback.callbackfn`;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   * * @param {Object} result - Ответ от VK API.
   */
  static processData(result){
    document.head.querySelector('script[src*="photos.get"]').remove();

    if (!result || result.error) {
      alert(result.error?.error_msg ?? 'Ошибка при загрузке изображений');
      return;
    }

    if (result.response.items.lenght === 0) {
      alert('Изображения не найдены в профиле.');
      return;
    }

    const images = result.response.items.map(item => {
      return item.sizes.reduce((largest, size) => {
        return size.width * size.height > largest.width * largest.height ? size : largest;
      }, item.sizes[0]);
    });

    this.lastCallback(images);
    this.lastCallback = () => {};
  }
}
