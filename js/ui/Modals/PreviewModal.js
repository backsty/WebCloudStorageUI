"use strict";

/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.contentBlock = this.domElement.querySelector('.content');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.domElement.querySelector('.x').addEventListener('click', () => {
      console.log('Закрытие всплывающего окна');
      this.close();
    });
    this.domElement.querySelector('.content').addEventListener('click', (event) => {
      if (event.target.classList.contains('delete')) {
        console.log('Удаление изображения. Путь:', event.target.dataset.path);
        event.target.querySelector('i').classList.add('icon', 'spinner', 'loading');
        event.target.classList.add('disabled');

        Yandex.removeFile(event.target.dataset.path, (result) => {
          if (result === null) {
            console.log('Изображение успешно удалено');
            event.target.closest('.image-preview-container').remove();
          } else {
            console.error('Ошибка при удалении изображения:', result);
          }
        });
      } else if (event.target.classList.contains('download')) {
        console.log('Скачивание изображения. Файл:', event.target.dataset.file);
        Yandex.downloadFileByUrl(event.target.dataset.file);
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    console.log('Показ изображений. Количество:', data ? data.length : 0);
    if (!data || data.length === 0) {
      this.domElement.querySelector('.content').innerHTML = 'None';
      return;
    }
    const imageContainer = data.reverse().map(element => this.getImageInfo(element));
    this.contentBlock.innerHTML = imageContainer.join('');
    console.log('Изображения отрисованы');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('ru-RU', options);
    console.log('Форматирование даты:', dateString, '->', formattedDate);
    return formattedDate;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    console.log('Формирование разметки для изображения:', item);
    return `
      <div class="image-preview-container">
        <img src='${item.sizes[0].url}' />
        <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>AAA</td><td>${this.name}</td><td>${(item.size / 1024).toFixed(1)}б</td></tr>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>`;
  }
}
