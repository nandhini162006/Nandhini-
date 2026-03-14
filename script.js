class FormValidator {
    constructor() {
        this.registeredEmails = new Set([
            'nandhinibbsc@email.com',
            'mohammedjiyaulhuqbsc@email.com'
        ]);
        this.init();
    }

    init() {
        // Form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        });

        // Real-time validation
        ['name', 'email', 'phone', 'dob', 'gender', 'college', 'course', 'event', 'mode'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', () => this.validateField(field));
                element.addEventListener('change', () => this.validateField(field));
            }
        });

        // Radio buttons
        document.querySelectorAll('input[name="year"]').forEach(radio => {
            radio.addEventListener('change', () => this.validateField('year'));
        });

        // Checkbox
        document.getElementById('confirm').addEventListener('change', () => this.validateField('confirm'));
    }

    validateField(field) {
        let isValid = true;
        let errorMsg = '';

        switch(field) {
            case 'name':
                isValid = this.validateName();
                errorMsg = 'Name cannot be empty';
                break;
            case 'email':
                isValid = this.validateEmail();
                errorMsg = 'Please enter a valid email address';
                break;
            case 'phone':
                isValid = this.validatePhone();
                errorMsg = 'Phone number must contain exactly 10 digits';
                break;
            case 'dob':
                isValid = this.validateDOB();
                errorMsg = 'Date of Birth must be selected';
                break;
            case 'gender':
                isValid = this.validateSelect('gender');
                errorMsg = 'Gender must be selected';
                break;
            case 'college':
                isValid = this.validateCollege();
                errorMsg = 'College/Company cannot be empty';
                break;
            case 'course':
                isValid = this.validateSelect('course');
                errorMsg = 'Course must be selected';
                break;
            case 'year':
                isValid = document.querySelector('input[name="year"]:checked') !== null;
                errorMsg = 'Year of study must be selected';
                break;
            case 'event':
                isValid = this.validateSelect('event');
                errorMsg = 'Event must be selected';
                break;
            case 'mode':
                isValid = this.validateSelect('mode');
                errorMsg = 'Mode of participation must be selected';
                break;
            case 'confirm':
                isValid = document.getElementById('confirm').checked;
                errorMsg = 'Please confirm the details are correct';
                break;
        }

        this.showFieldFeedback(field, isValid, errorMsg);
    }

    validateName() {
        const name = document.getElementById('name').value.trim();
        return name.length > 0;
    }

    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && !this.registeredEmails.has(email);
    }

    validatePhone() {
        const phone = document.getElementById('phone').value.replace(/\D/g, '');
        return phone.length === 10;
    }

    validateDOB() {
        const dob = document.getElementById('dob').value;
        return dob !== '';
    }

    validateSelect(id) {
        const value = document.getElementById(id).value;
        return value !== '';
    }

    validateCollege() {
        const college = document.getElementById('college').value.trim();
        return college.length > 0;
    }

    showFieldFeedback(field, isValid, errorMsg) {
        const fieldEl = document.getElementById(field);
        const errorEl = document.getElementById(field + '-error');

        if (fieldEl) {
            fieldEl.classList.toggle('error', !isValid);
            fieldEl.classList.toggle('valid', isValid);
        }

        if (errorEl) {
            errorEl.textContent = isValid ? '' : errorMsg;
            errorEl.style.display = isValid ? 'none' : 'block';
        }
    }

    handleSubmit() {
        // Validate all fields
        const fieldsToValidate = ['name', 'email', 'phone', 'dob', 'gender', 'college', 'course', 'year', 'event', 'mode', 'confirm'];
        
        let allValid = true;
        fieldsToValidate.forEach(field => {
            this.validateField(field);
            if (field === 'year') {
                const yearValid = document.querySelector('input[name="year"]:checked') !== null;
                if (!yearValid) allValid = false;
            } else {
                const fieldEl = document.getElementById(field);
                if (fieldEl && fieldEl.classList.contains('error')) {
                    allValid = false;
                }
            }
        });

        if (!allValid) {
            alert('Please fix all errors before submitting!');
            return;
        }

        // Add to table
        this.addToTable();
        
        // Show success message
        const successMsg = document.getElementById('success-message');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);

        // Reset form
        this.resetForm();
        this.updateCounter();
    }

    addToTable() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const event = document.getElementById('event').value;
        const mode = document.getElementById('mode').value;

        const table = document.getElementById('participantsTable').getElementsByTagName('tbody')[0];
        const row = table.insertRow();
        
        row.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${event}</td>
            <td>${mode}</td>
            <td><button class="delete-btn" onclick="validator.deleteRow(this)">Delete</button></td>
        `;

        this.registeredEmails.add(email);
    }

    deleteRow(btn) {
        const row = btn.parentNode.parentNode;
        const emailCell = row.cells[1];
        this.registeredEmails.delete(emailCell.textContent);
        row.parentNode.removeChild(row);
        this.updateCounter();
    }

    resetForm() {
        document.querySelectorAll('form').forEach(form => form.reset());
        document.querySelectorAll('.error, .valid').forEach(el => {
            el.classList.remove('error', 'valid');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
    }

    updateCounter() {
        const rows = document.querySelectorAll('#participantsTable tbody tr');
        document.getElementById('participant-counter').textContent = `Total Participants: ${rows.length}`;
    }
}

// Initialize validator
const validator = new FormValidator();
