import Modal from '../scripts/Modal.js';
import FormValidator from '../scripts/FormValidator.js';
import FormHandler from '../scripts/FormHandler.js';

class OverlayMenu {
    constructor(headerSelector, options = {}) {
        this.headerElement = document.querySelector(headerSelector);
        if (!this.headerElement) {
            console.error(`Элемент ${headerSelector} не найден!`);
            return;
        }

        this.overlayElement = this.headerElement.querySelector(options.overlaySelector ?? '.js-overlay');
        this.burgerButtonElement = this.headerElement.querySelector(options.burgetButtonSelector ?? '.js-burger-button');
        this.links = this.headerElement.querySelectorAll('a[href]');

        this.animationDuration = options.animationDuration ?? 200;

        this.bindEvents();
    }

    onBurgerButtonClick = () => {
        this.toggleOverlay();
    }

    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick);
        // this.links.forEach(link => link.addEventListener('click', () => this.closeOverlay()));
    }

    toggleOverlay() {
        this.burgerButtonElement.classList.toggle('is-active');
        document.documentElement.classList.toggle('is-lock');

        if (this.overlayElement.open) {
            this.overlayElement.classList.toggle('is-active');
            setTimeout(() => {
                this.overlayElement.open = !this.overlayElement.open;
            }, this.animationDuration);
        } else {
            this.overlayElement.open = !this.overlayElement.open;
            setTimeout(() => {
                this.overlayElement.classList.toggle('is-active');
            }, 0);
        }
    }

    closeOverlay() {
        this.burgerButtonElement.classList.remove('is-active');
        document.documentElement.classList.remove('is-lock');

        this.overlayElement.classList.remove('is-active');
        setTimeout(() => {
            this.overlayElement.open = false;
        }, this.animationDuration);
    }

    openOverlay() {
        this.burgerButtonElement.classList.add('is-active');
        document.documentElement.classList.add('is-lock');

        this.overlayElement.open = true;
        setTimeout(() => {
            this.overlayElement.classList.add('is-active');
        }, 0);
    }
}

const overlayMenu = new OverlayMenu('.header');

const toggleControllerElements = document.querySelectorAll('.toggle-button');

toggleControllerElements.forEach(element => {
    element.addEventListener('click', () => {
        const toggleContainerElemet = element.closest('.toggle-container');
        const toggleTargetElement = toggleContainerElemet.querySelector('.toggle-target');

        if (!toggleTargetElement.style.height || toggleTargetElement.style.height == '0px') {
            toggleTargetElement.style.height = toggleTargetElement.scrollHeight + 'px';
            toggleTargetElement.classList.add('is-active');
        } else {
            toggleTargetElement.style.height = '0px';
            toggleTargetElement.classList.remove('is-active');
        }

    });
});

const coursesSlider = new Swiper('.courses-slider__swiper', {
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    spaceBetween: 16,
    navigation: {
        nextEl: '.courses-slider__nav--next',
        prevEl: '.courses-slider__nav--prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
        },
        360: {
            slidesPerView: 1.5,
        },
        480: {
            slidesPerView: 2,
        },
        767: {
            slidesPerView: 2.5,
        },
        1023: {
            slidesPerView: 3,
        }
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
    },
});

const modal = new Modal('#order-modal', {
});

const orderFormElement = document.querySelector('.order-form');
const inputPhoneElement = orderFormElement.querySelector('#phone');
const inputChildBirthdayElement = orderFormElement.querySelector('#child-birthday');

const inputPhoneMask = IMask(inputPhoneElement, {
    mask: '+7 (000) 000-00-00',
    definitions: {
        '0': /[0-9]/
    },
    lazy: false
});
const inputBirthdayMask = IMask(inputChildBirthdayElement, {
    mask: Date,
    pattern: 'd.m.Y',
    blocks: {
        d: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 31,
            maxLength: 2
        },
        m: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2
        },
        Y: {
            mask: IMask.MaskedRange,
            from: 1900,
            to: (new Date()).getFullYear(), // Текущий год
            maxLength: 4
        }
    },
    lazy: false, // Не удаляет маску, даже если поле пустое
    format: function (date) {
        return moment(date).format('DD.MM.YYYY');
    },
    parse: function (str) {
        return moment(str, 'DD.MM.YYYY').toDate();
    },
    autofix: true,
    prepare: function (str, masked, flags) {
        if (flags.from === 'input') {
            str = str.replace(/\D/g, ''); // Удалить все символы, кроме цифр
        }
        return str;
    }
});

const orderFormValidator = new FormValidator(orderFormElement);
const orderFormHandler = new FormHandler(orderFormElement, orderFormValidator, {
    onSuccess: (data) => {
        console.log(data);
    },
    onError: (errors) => {
        console.log(errors);
    }
});

const ytModalSrcElement = document.getElementById('yt-source');
const ytModal = new Modal('#yt-modal');

const ytModalOpenButtons = document.querySelectorAll('[data-yt-src]');
ytModalOpenButtons.forEach(element => {
    element.addEventListener('click', () => {
        ytModalSrcElement.src = element.dataset.ytSrc ?? '';
    });
});

const articleModal = new Modal('#article-modal');
