"use strict";

/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.element = element;
    this.domElement = element[0];
    console.log('BaseModal инициализирован для элемента:', this.domElement);
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    console.log('Открытие модального окна:', this.domElement);
    this.element.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    console.log('Закрытие модального окна:', this.domElement);
    this.element.modal('hide');
  }
}