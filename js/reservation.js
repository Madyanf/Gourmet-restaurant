// إدارة نموذج الحجز
class ReservationManager {
    constructor() {
        this.form = document.getElementById('reservationForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setMinDate();
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

    setMinDate() {
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
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

            case 'phone':
                if (!this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'رقم الهاتف غير صحيح';
                }
                break;

            case 'date':
                if (!value) {
                    isValid = false;
                    errorMessage = 'تاريخ الحجز مطلوب';
                } else if (new Date(value) < new Date().setHours(0,0,0,0)) {
                    isValid = false;
                    errorMessage = 'لا يمكن الحجز في تاريخ ماضي';
                }
                break;

            case 'time':
                if (!value) {
                    isValid = false;
                    errorMessage = 'وقت الحجز مطلوب';
                }
                break;

            case 'guests':
                if (!value) {
                    isValid = false;
                    errorMessage = 'عدد الأشخاص مطلوب';
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

    isValidPhone(phone) {
        const re = /^[\d\s\-+()]{10,}$/;
        return re.test(phone.replace(/\s/g, ''));
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
        const fields = this.form.querySelectorAll('input[required], select[required]');
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
        const reservationData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            time: formData.get('time'),
            guests: formData.get('guests'),
            specialRequests: formData.get('specialRequests'),
            newsletter: formData.get('newsletter') === 'on'
        };

        try {
            // عرض حالة التحميل
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الحجز...';
            submitBtn.disabled = true;

            // محاكاة إرسال البيانات إلى الخادم
            await this.submitReservation(reservationData);

            this.showAlert('تم الحجز بنجاح! سنتواصل معك للتأكيد.', 'success');
            this.form.reset();
            
            // في تطبيق حقيقي، هنا سيتم إعادة التوجيه أو عرض تأكيد
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            this.showAlert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            const submitBtn = this.form.querySelector('.submit-btn');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitReservation(data) {
        // محاكاة اتصال بالخادم
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // في تطبيق حقيقي، هنا سيتم إرسال البيانات إلى الخادم
                console.log('بيانات الحجز:', data);
                
                // محاكاة نجاح الإرسال بنسبة 90%
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('فشل في الاتصال بالخادم'));
                }
            }, 2000);
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

// تهيئة مدير الحجوزات
document.addEventListener('DOMContentLoaded', () => {
    new ReservationManager();
});