export default class Modal {
    static activeModal = null;

    constructor(selector, options = {}) {
        this.selector = selector;
        this.dialog = document.querySelector(selector);
        if (!this.dialog) throw new Error(`Модальное окно ${selector} не найдено`);

        this.options = {
            closeOnClickOutside: options.closeOnClickOutside ?? true,
            closeOnEscape: options.closeOnEscape ?? true,
            animationDuration: options.animationDuration ?? 200,
            selectorCloseButton: options.selectorCloseButton ?? ".modal__close-button",
            lockScrollClass: options.lockScrollClass ?? "is-lock",
            onOpen: options.onOpen ?? (() => { }),
            onClose: options.onClose ?? (() => { }),
            autoOpen: options.autoOpen ?? this.dialog.hasAttribute("data-modal-auto-open") ?? false,
        };

        this.init();
    }

    init() {
        document.documentElement.style.setProperty("--modal-animation-duration", this.options.animationDuration + "ms");
        document.documentElement.style.setProperty("--scrollbar-width", Modal.getScrollBarWidth() + 'px');

        this.dialog.querySelector(this.options.selectorCloseButton)?.addEventListener("click", () => {
            this.close();
        });

        if (this.options.closeOnClickOutside) {
            this.dialog.addEventListener("mousedown", (event) => {
                if (event.button === 0 && event.target === this.dialog) {
                    this.close();
                }
            });
        }

        if (this.options.closeOnEscape) {
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape" && this.dialog.open) {
                    this.close();
                }
            });
        }

        document.querySelectorAll(`[data-modal="${this.selector}"]`).forEach(button => {
            button.addEventListener("click", () => {
                this.open();
            });
        });

        if (this.options.autoOpen) {
            this.open();
        }
    }

    open() {
        this.dialog.showModal();
        this.dialog.classList.add("open");

        Modal.activeModal = this;

        document.documentElement.classList.add(this.options.lockScrollClass);

        this.options.onOpen();
    }

    close() {
        this.dialog.classList.remove("open");
        this.dialog.classList.add("closing");

        if (Modal.activeModal === this) {
            Modal.activeModal = null;
        }

        document.documentElement.classList.remove(this.options.lockScrollClass);

        setTimeout(() => {
            this.dialog.close();
            this.dialog.classList.remove("closing");
            this.options.onClose();

        }, this.options.animationDuration);
    }

    static alert(message, title = null) {
        return new Promise((resolve) => {
            const id = "modal-alert-" + Date.now();
            const dialog = document.createElement("dialog");
            dialog.classList.add('modal');
            dialog.classList.add('alert-modal');
            dialog.id = id;
            dialog.innerHTML = `
              <div class="modal-wrapper">
                <p class="modal-message">${message}</p>
                <button type="button" class="btn-ok btn-base btn-white modal-closer">OK</button>
              </div>
            `;
            document.body.appendChild(dialog);

            const modal = new Modal(`#${id}`, {
                onClose: () => {
                    resolve();
                    dialog.remove()
                },
            });

            dialog.querySelector(".btn-ok").addEventListener(
                "click",
                () => {
                    modal.close();
                    resolve(true);
                },
                { once: true }
            );

            modal.open();
        });
    }

    static confirm(message, title = null) {
        return new Promise((resolve) => {
            const id = "modal-confirm-" + Date.now();
            const dialog = document.createElement("dialog");
            dialog.classList.add('modal');
            dialog.classList.add('alert-modal');
            dialog.classList.add('confirm-modal');
            dialog.id = id;
            dialog.innerHTML = `
              <div class="modal-wrapper">
                <p class="modal-message">${message}</p>
                <div class="modal-buttons">
                  <button type="button" class="btn-ok btn-base btn-blue modal-closer">Да</button>
                  <button type="button" class="btn-cancel btn-base btn-order modal-closer">Нет</button>
                </div>
              </div>
            `;
            document.body.appendChild(dialog);

            const modal = new Modal(`#${id}`, {
                onClose: () => {
                    resolve(false);
                    dialog.remove()
                },
            });

            dialog.querySelector(".btn-ok").addEventListener(
                "click",
                () => {
                    modal.close();
                    resolve(true);
                },
                { once: true }
            );

            dialog.querySelector(".btn-cancel").addEventListener(
                "click",
                () => {
                    modal.close();
                    resolve(false);
                },
                { once: true }
            );

            modal.open();
        });
    }

    static getScrollBarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }
}
