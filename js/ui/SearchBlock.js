"use strict";

/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
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


/*
Класс SearchBlock состоит из:

Конструктора, в котором выполняются следующие действия:

Сохраните переданный элемент в свойство объекта класса
Вызовите метод registerEvents для подписки на события кликов по кнопкам "Заменить" и "Добавить"
Метод registerEvents добавляет обработчики событий кликов на кнопки "Заменить" и "Добавить"

Клик по кнопкам должен проверять поле ввода идентификатора пользователя 
(если поле ввода пустое, то никакой запрос выполнять не нужно).
Выполняйте запрос на сервер для получения изображений.

После запроса (при обработке ответа) удалите ранее отрисованные изображения 
(для кнопки "Заменить"), а затем отрисовывайте все полученные изображения 
(для обеих кнопок).

Подсказка к пункту 1
У кнопки "Заменить" есть класс `replace`, а у кнопки "Добавить" есть класс `add`.

Подсказка к пункту 2
Используйте `VK.get` для выполнения запроса.

Подсказка к пункту 3
Используйте `App.imageViewer` для получения блока отображаемых изображений.
*/