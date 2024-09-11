"use strict";

/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 **/
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.input = this.element.querySelector('input');
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    const buttons = this.element.querySelectorAll('button');

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
    
    const process = (userId) => {
      const isAddAction = e.target.classList.contains('add');
      const isReplaceAction = e.target.classList.contains('replace');

      if (isAddAction) { 
        e.target.classList.add('disabled');
        VK.get(userId, App.imageViewer.drawImages) // запрос на добавление фото
      } else if (isReplaceAction) {
        App.imageViewer.clear();
        VK.get(userId, App.imageViewer.drawImages) // запрос на замену фото
      }
    }

    if (isNaN(userId)) {
      VK.getUserIdByScreenName(rawUserId, process);
    } else {
      process(userId);
    }
  }
}