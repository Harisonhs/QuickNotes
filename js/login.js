class Login {
    constructor(form) {
        this.form = form;
        this.fields = new Fields(form).fields;
        this.validate();
    }

    validate() {
        this.form.addEventListener("submit", (evt) => {
            evt.preventDefault();
            let error = 0;
            for (let field of this.fields) {
                const input = this.form.querySelector("." + field);
                if (this.validateField(input) == false) {
                    error++;
                }
            }
            console.log(error);
            if (error == 0) {
                localStorage.setItem("auth", 1);
                this.form.submit();
            }
        });
    }

    validateField(field) {
        if (field.value.trim() == "") {
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} must be informed.`,
                "error"
            );
            return false;
        }
        if (field.type == "password") {
            return this.validatePassword(field);
        } else {
            this.setStatus(field, null, "success");
            return true;
        }
    }

    validatePassword(field) {
        if (field.value.length < 8) {
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} must have at least 8 characters.`,
                "error"
            );
            return false;
        }
        this.setStatus(field, null, "success");
        return true;

    }

    setStatus(field, message, status) {
        const errorMessage = field.parentElement.querySelector(".error-message");
        if (status == "success") {
            if (errorMessage) {
                errorMessage.innerText = "";
            }
            field.classList.remove("input-error");
        }
        else if (status == "error") {
            errorMessage.innerText = message;
            field.classList.add("input-error");
        }
    }
}

const form = document.querySelector(".loginForm");
if (form) {
    const validator = new Login(form);
}