export default class FormValidator {
    constructor(form, options = {}) {
        if (!(form instanceof HTMLFormElement)) {
            throw new Error('FormValidator requires a form');
        }

        this.form = form;
        this.options = {
            errorClass: options.errorClass || 'error-message',
            captchaField: options.captchaField || null,
        };

        this.form.setAttribute('novalidate', 'true');
        this.fields = [...this.form.elements].filter(el => el.name && !el.disabled);
        this.isValidated = false;
    }

    validate() {
        const errors = this.validateFields();
        if (errors.length) {
            if (!this.isValidated) {
                this.addInputListeners();
                this.isValidated = true;
            }

            // scroll to first error
            errors[0].field.scrollIntoView({ behavior: "smooth", block: "center" });

            return { valid: false, errors };
        }

        this.hideErrors();



        return { valid: true };
    }

    validateFields() {
        const errors = [];

        if (this.options.captchaField) {
            const captchaField = this.form.querySelector(`[name="${this.options.captchaField}"]`);
            if (!captchaField || !captchaField.value.trim()) {
                errors.push({
                    field: this.options.captchaField,
                    value: "",
                    rule: "captcha",
                    message: "Подтвердите, что вы не робот"
                });
                this.showError(captchaField, { message: "Подтвердите, что вы не робот" });
            }
        }

        this.fields.forEach(field => {
            const errorMessage = this.validateField(field);

            if (errorMessage) {
                errors.push({
                    field,
                    value: field.value,
                    rule: errorMessage.rule,
                    message: errorMessage.message
                });
                this.showError(field, errorMessage);
            } else {
                this.hideError(field);
            }
        });

        return errors;
    }

    validateField(field) {
        if (field.hasAttribute("required")) {
            if (field.type === "checkbox" && !field.checked) {
                return this.getErrorMessage(field, "required");
            } else if (field.type !== "checkbox" && !field.value.trim()) {
                return this.getErrorMessage(field, "required");
            }
        }
        if (field.hasAttribute("minlength") && field.value.length < field.minLength) {
            return this.getErrorMessage(field, "minlength");
        }
        if (field.hasAttribute("maxlength") && field.value.length > field.maxLength) {
            return this.getErrorMessage(field, "maxlength");
        }
        if (field.hasAttribute("pattern")) {
            const pattern = new RegExp(field.getAttribute("pattern"));
            if (!pattern.test(field.value)) {
                return this.getErrorMessage(field, "pattern");
            }
        }
        if (field.type === "email" && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(field.value)) {
            return this.getErrorMessage(field, "email");
        }
        if (field.dataset.validatorEquals) {
            const matchField = this.form.querySelector(`[name="${field.dataset.validatorEquals}"]`);
            if (matchField && field.value !== matchField.value) {
                return this.getErrorMessage(field, "equals");
            }
        }

        return null;
    }

    getErrorMessage(field, rule) {
        const ruleNameInCamelCase = rule.charAt(0).toUpperCase() + rule.slice(1);
        const customMessage = field.dataset[`validatorErrorMessage${ruleNameInCamelCase}`];
        const defaultMessages = {
            required: "Это поле обязательно",
            email: "Введите корректный email",
            pattern: "Неверный формат",
            minlength: `Минимальная длина: ${field.minLength}`,
            maxlength: `Максимальная длина: ${field.maxLength}`,
            equals: "Значения должны совпадать",
            captcha: "Подтвердите, что вы не робот"
        };

        return { rule, message: customMessage || defaultMessages[rule] };
    }

    showError(field, message) {
        field.setAttribute("aria-invalid", "true");
        field.classList.add("invalid");

        const errorMessageId = field.getAttribute('aria-errormessage') || field.name + "-error";
        let errorElement = this.form.querySelector(`#${field.getAttribute('aria-errormessage')}`);
        if (!errorElement || !errorElement.classList.contains(this.options.errorClass)) {
            errorElement = document.createElement("div");
            errorElement.classList.add(this.options.errorClass);
            errorElement.id = errorMessageId;
            field.setAttribute('aria-errormessage', errorMessageId);
            field.insertAdjacentElement("afterend", errorElement);
        }

        errorElement.textContent = message.message;
        field.setAttribute("aria-errormessage", errorElement.id || "error-" + field.name);
    }

    hideError(field) {
        field.removeAttribute("aria-invalid");
        field.classList.remove("invalid");

        const errorElement = this.form.querySelector(`[id="${field.getAttribute('aria-errormessage')}"]`);
        if (errorElement && errorElement.classList.contains(this.options.errorClass)) {
            errorElement.textContent = "";
        }
    }

    addInputListeners() {
        this.fields.forEach(field => {
            field.addEventListener("input", () => {
                this.validateFieldOnInput(field);
            });
        });
    }

    validateFieldOnInput(field) {
        const errorMessage = this.validateField(field);
        if (errorMessage) {
            this.showError(field, errorMessage);
        } else {
            this.hideError(field);
        }
    }

    hideErrors() {
        this.fields.forEach(field => {
            this.hideError(field);
        });
    }

    handleServerErrors(errors) {
        this.hideErrors();

        if (Array.isArray(errors)) {
            errors.forEach(({ field, message }) => {
                if (field === 'alert') {
                    alert(message);
                    return;
                }

                const inputField = this.form.querySelector(`[name="${field}"]`);
                if (inputField) {
                    this.showError(inputField, { message: message });
                }
            });
        } else if (errors && typeof errors === 'object') {
            Object.entries(errors).forEach(([field, message]) => {
                if (field === 'alert') {
                    alert(message);
                    return;
                }

                const inputField = this.form.querySelector(`[name="${field}"]`);
                if (inputField) {
                    this.showError(inputField, { message: message });
                }
            });
        }

    }
}
