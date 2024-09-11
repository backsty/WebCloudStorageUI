"use strict";

/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = window.env.ACCESS_TOKEN;
  static lastCallback;
  static screenNameCallback;


  /**
   * Получает изображения из профиля VK.
   * @param {string} id - ID пользователя VK.
   * @param {function} callback - Функция обратного вызова для обработки полученных данных.
   */
  static get(id = '', callback){
    VK.lastCallback = callback;
    const script = document.createElement('script');
    script.id = 'requestScript';
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&photo_sizes=1&count=1000&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    document.head.appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   * * @param {Object} result - Ответ от VK API.
   */
  static processData(result){
    document.head.removeChild(document.getElementById('requestScript'));
    console.log("Ответ от VK API:", result);

    if (!result || result.error) {
      alert(`Error: ${result.error.error_code} --> ${result.error.error_msg}`);
      return;
    }

    if (result.response.items.length === 0) {
      alert('Изображения не найдены в профиле.');
      return;
    }

    const images = result.response.items.map(item => {
      console.log("Обработка изображения:", item); 
      return item.sizes.reduce((largest, size) => {
        return size.width * size.height > largest.width * largest.height ? size : largest;
      }, item.sizes[0]);
    });
    console.log(images);

    this.lastCallback(images);
    this.lastCallback = () => {};
  }

  static getUserIdByScreenName(screenName, callback) {
    VK.screenNameCallback = callback;
    const script = document.createElement('script');
    script.id = 'vkData';
    script.src = `https://api.vk.com/method/utils.resolveScreenName?screen_name=${screenName}&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processScreenNameData`;
    document.head.appendChild(script);
    script.onload = (...args) => {
      console.log(args);
    };
  }

  static processScreenNameData({response: {object_id}}) {
    document.head.removeChild(document.getElementById('vkData'));
    VK.screenNameCallback(object_id);
    VK.screenNameCallback = () => {};
  }
}
