"use strict";

/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.previewBlock = this.element.querySelector('.image');
    this.imageContainer = this.element.querySelector('.images-list .grid .row');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.imageContainer.addEventListener('dblclick', (e) => {
      if (e.target.tagName.toLowerCase() === 'img') {
        this.previewBlock.src = e.target.src;
        console.log('Изображение для предпросмотра установлено:', e.target.src);
      }
    });

    this.imageContainer.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'img') {
        e.target.classList.toggle('selected');
        console.log('Изображение выделено/снято выделение:', e.target.src);
      }
      this.checkButtonText();
    });

    this.element.querySelector('.select-all').addEventListener('click', () => {
      const allImages = Array.from(this.imageContainer.querySelectorAll('img'));
      const someImages = this.forSome(allImages);
      console.log('Выбрано ли хотя бы одно изображение:', someImages);

      if (someImages) {
        allImages.forEach(element => {
          element.classList.remove('selected');
          console.log('Снято выделение с изображения:', element.src);
        });
      } else {
        allImages.forEach(element => {
          element.classList.add('selected');
          console.log('Выделено изображение:', element.src);
        });
      }
      this.checkButtonText();
    });

    this.element.querySelector('.show-uploaded-files').addEventListener('click', () => {
      const getModalWindow = App.getModal("filePreviewer");
      console.log('Открытие модального окна для просмотра загруженных файлов:', getModalWindow);

      if (!document.querySelector('.uploaded-previewer-modal .content .asterisk')) {
        document.querySelector('.uploaded-previewer-modal .content').innerHTML =
          '<i class="asterisk loading icon massive"></i>';
      }

      getModalWindow.open();

      Yandex.getUploadedFiles((_, preview) => {
        console.log('Полученные файлы:', preview);
        getModalWindow.showImages(preview.items);
      });
    });

    this.element.querySelector('.send').addEventListener('click', () => {
      const getSendModalWindow = App.getModal('fileUploader');
      const allSelectedImages = this.imageContainer.querySelectorAll('.selected');

      console.log('Открытие модального окна для отправки файлов:', getSendModalWindow);
      console.log('Выбранные для отправки изображения:', Array.from(allSelectedImages).map(img => img.src));

      getSendModalWindow.open();
      getSendModalWindow.showImages(Array.from(allSelectedImages).map(image => image.src));
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    console.log('Очистка контейнера с изображениями...');
    this.imageContainer.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    console.log('Отрисовка изображений:', images);

    if (images.length > 0) {
      document.querySelector('.select-all').classList.remove('disabled');
    } else {
      document.querySelector('.select-all').classList.add('disabled');
    }

    images.forEach(image => {
      const imageWrapper = document.createElement('div');
      const img = document.createElement('img');

      imageWrapper.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
      img.src = image.url;
      imageWrapper.appendChild(img);
      document.querySelector('.images-list .grid .row').appendChild(imageWrapper);

      console.log('Добавлено изображение:', image.url);
    });
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const images = this.imageContainer.querySelectorAll('img');
    const resultSend = this.forSome(images);
    const selectAllButton = this.element.querySelector('.select-all');
    const sendButton = this.element.querySelector('.send');

    console.log('Проверка состояния кнопок... Выбраны изображения:', resultSend);

    resultSend ? sendButton.classList.remove('disabled') : sendButton.classList.add('disabled');
    selectAllButton.textContent = resultSend ? "Снять выделение" : "Выбрать всё";
    console.log('Текст кнопки "Выбрать все" изменен на:', selectAllButton.textContent);
  }

  forSome(arr) {
    return Array.from(arr).some(element => element.classList.contains('selected'));
  };
}