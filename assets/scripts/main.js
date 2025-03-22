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
