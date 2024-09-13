"use strict";

/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 **/
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.input = this.element.querySelector('input');
    console.log('Инициализация SearchBlock:', this.element);
    console.log('Поисковое поле:', this.input);
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    const buttons = this.element.querySelectorAll('button');
    console.log('Найденные кнопки:', buttons);

    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.handleButtonClick(e));
    });
  }

  /**
   * Обрабатывает клик по кнопкам
   * @param {Event} e - Событие клика
  */
  handleButtonClick(e) {
    const rawUserId = this.input.value.trim();
    const userId = Number.parseInt(rawUserId);
    console.log('Введённое значение:', rawUserId);
    console.log('Преобразованный userId:', userId);
    
    const process = (userId) => {
      const isAddAction = e.target.classList.contains('add');
      const isReplaceAction = e.target.classList.contains('replace');

      console.log('Кнопка действия:', e.target);
      console.log('isAddAction:', isAddAction);
      console.log('isReplaceAction:', isReplaceAction);

      if (isAddAction) { 
        e.target.classList.add('disabled');
        console.log('Запрос на добавление фото для userId:', userId);
        VK.get(userId, App.imageViewer.drawImages) // запрос на добавление фото
      } else if (isReplaceAction) {
        console.log('Очистка изображений перед заменой.');
        App.imageViewer.clear();
        console.log('Запрос на замену фото для userId:', userId);
        VK.get(userId, App.imageViewer.drawImages) // запрос на замену фото
      }
    }

    if (isNaN(userId)) {
      console.log('Поиск userId по screenName:', rawUserId);
      VK.getUserIdByScreenName(rawUserId, process);
    } else {
      process(userId);
    }
  }
}