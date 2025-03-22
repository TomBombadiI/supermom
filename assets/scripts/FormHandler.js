import FormValidator from "./FormValidator.js";

export default class FormHandler {
    constructor(form, validator, { onSuccess, onError, enabledButtonFinally } = {}) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error("FormHandler requires a valid form element");
        }
        if (!(validator instanceof FormValidator)) {
            throw new Error("FormHandler requires a valid validator instance");
        }

        this.form = form;
        this.validator = validator;
        this.onSuccess = onSuccess || function () {};
        this.onError = onError || function () {};
        this.enabledButtonFinally = enabledButtonFinally ?? true;

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();

        const validationResult = this.validator.validate();
        if (!validationResult.valid) {
            this.onError(validationResult.errors);
            return;
        }

        await this.submitForm();
    }

    async submitForm() {
        const submitButton = this.form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.classList.add("loading");

        try {
            const response = await fetch(this.form.action, {
                method: this.form.method,
                body: new FormData(this.form)
            });

            const result = await response.json();

            if (response.ok) {
                this.onSuccess(result);
            } else if (result.errors) {
                this.validator.handleServerErrors(result.errors);
                this.onError(result.errors);
            } else {
                this.onError([{ message: "Неизвестная ошибка" }]);
            }
        } catch (error) {
            this.onError([{ message: "Ошибка сети" }]);
        } finally {
            if (this.enabledButtonFinally) {
                submitButton.disabled = false;
            }
            submitButton.classList.remove("loading");
        }
    }
}
