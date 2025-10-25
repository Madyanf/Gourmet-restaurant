// إدارة نموذج الاتصال
class ContactManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // التحقق أثناء الكتابة
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'الاسم يجب أن يكون على الأقل حرفين';
                }
                break;

            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                }
                break;

            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'الموضوع مطلوب';
                }
                break;

            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'الرسالة يجب أن تكون على الأقل 10 أحرف';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            this.showAlert('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            // عرض حالة التحميل
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;

            // محاكاة إرسال البيانات
            await this.submitContact(contactData);

            this.showAlert('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.', 'success');
            this.form.reset();

        } catch (error) {
            this.showAlert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            const submitBtn = this.form.querySelector('.submit-btn');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitContact(data) {
        // محاكاة اتصال بالخادم
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('بيانات الاتصال:', data);
                
                // محاكاة نجاح الإرسال
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('فشل في إرسال الرسالة'));
                }
            }, 1500);
        });
    }

    showAlert(message, type = 'info') {
        if (typeof showAlert === 'function') {
            showAlert(message, type);
        } else {
            alert(message);
        }
    }
}

// تهيئة مدير الاتصال
document