"use strict";

/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.uploaderWindow = document.querySelector(".file-uploader-modal");
    this.contentBlock = this.domElement.querySelector('.content');
    this.closeButton = this.domElement.querySelector('.close');
    this.sendAllButton = this.domElement.querySelector('.send-all');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    this.uploaderWindow.querySelector('.header .x').addEventListener('click', () => {
      console.log('Клик по крестику, закрытие модального окна');
      this.close()
    });
    this.closeButton.addEventListener('click', () => {
      console.log('Клик по кнопке "Закрыть", закрытие модального окна');
      this.close()
    });
    this.sendAllButton.addEventListener('click',  () => {
      console.log('Клик по кнопке "Отправить все файлы", отправка всех изображений');
      this.sendAllImages.call(this);
    });
    this.contentBlock.addEventListener('click', (event) => {
      if (event.target === document.querySelector('.file-uploader-modal .content .input')) {
        console.log('Клик по полю ввода');
        if (this.contentBlock.classList.contains('error')) {
          this.contentBlock.classList.remove('error');
          console.log('Ошибка убрана с поля ввода');
        }
      } else if (event.target.classList.contains('button') || event.target.classList.contains('upload')) {
        console.log('Клик по кнопке отправки изображения');
        this.sendImage(event.target.closest('.image-preview-container'));
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages( images ) {
    console.log('Отображение изображений в модальном окне. Количество:', images.length);
    const imageContainer = images.reverse().map(element => this.getImageHTML(element));
    this.contentBlock.innerHTML = imageContainer.join('');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML( item ) {
    console.log('Формирование HTML разметки для изображения:', item);
    return `
      <div class="image-preview-container">
        <img src='${item}' />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>`;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const allImages = Array.from(document.querySelectorAll('.content > .image-preview-container'));
    console.log('Отправка всех изображений. Количество:', allImages.length);
    allImages.forEach(image => this.sendImage(image));
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage( imageContainer ) {
    const image = imageContainer.querySelector('input');
    const imageValue = image.value.trim();
    console.log('Попытка отправить изображение. Путь к файлу:', imageValue);

    if (!imageValue) {
      console.log('Ошибка: путь к файлу пустой');
      image.parentElement.classList.add('error');
      return;
    }

    image.parentElement.classList.add('disabled');
    const imageUrl = imageContainer.querySelector('img').src;
    console.log('Отправка изображения на сервер:', imageUrl);

    Yandex.uploadFile(`${imageValue}.jpg`, imageUrl, () => {
      console.log('Изображение успешно отправлено:', imageUrl);
      imageContainer.remove();
      
      if (this.contentBlock.children.length === 0) {
        console.log('Все изображения отправлены, закрытие модального окна');
        this.close();
      }
    });
  }
}