// إدارة تسجيل الدخول
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.loginType = 'customer';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLoginOptions();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // التحقق أثناء الكتابة
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    setupLoginOptions() {
        const optionButtons = document.querySelectorAll('.login-option-btn');
        
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشط من جميع الأزرار
                optionButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشط للزر المختار
                button.classList.add('active');
                this.loginType = button.getAttribute('data-type');
                
                this.updateFormForLoginType();
            });
        });
    }

    updateFormForLoginType() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (this.loginType === 'admin') {
            emailInput.placeholder = 'admin@althawqa.com';
            passwordInput.placeholder = 'كلمة مرور المدير';
        } else {
            emailInput.placeholder = '';
            passwordInput.placeholder = '';
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                }
                break;

            case 'password':
                if (value.length < 6) {
                    isValid = false;
                    errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
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
        const fields = this.form.querySelectorAll('input[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleLogin() {
        if (!this.validateForm()) {
            this.showAlert('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on',
            type: this.loginType
        };

        try {
            // عرض حالة التحميل
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري تسجيل الدخول...';
            submitBtn.disabled = true;

            // محاكاة تسجيل الدخول
            const user = await this.authenticate(loginData);

            this.showAlert(`مرحباً بعودتك! تم تسجيل الدخول بنجاح كـ ${this.loginType === 'admin' ? 'مدير' : 'عميل'}`, 'success');
            
            // حفظ بيانات المستخدم
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', this.loginType);

            // إعادة التوجيه بعد تسجيل الدخول الناجح
            setTimeout(() => {
                window.location.href = this.loginType === 'admin' ? 'admin-dashboard.html' : 'index.html';
            }, 2000);

        } catch (error) {
            this.showAlert(error.message, 'error');
        } finally {
            const submitBtn = this.form.querySelector('.submit-btn');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async authenticate(loginData) {
        // محاكاة المصادقة
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // بيانات اختبارية للمستخدمين
                const testUsers = {
                    customer: [
                        { email: 'customer@example.com', password: '123456', name: 'عميل تجريبي' },
                        { email: 'user@test.com', password: 'password', name: 'مستخدم عادي' }
                    ],
                    admin: [
                        { email: 'admin@althawqa.com', password: 'admin123', name: 'مدير النظام' },
                        { email: 'manager@test.com', password: 'manager123', name: 'مدير المطعم' }
                    ]
                };

                const users = testUsers[loginData.type] || testUsers.customer;
                const user = users.find(u => 
                    u.email === loginData.email && u.password === loginData.password
                );

                if (user) {
                    resolve({
                        ...user,
                        type: loginData.type,
                        loginTime: new Date().toISOString()
                    });
                } else {
                    reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة'));
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

// إضافة تنسيقات إضافية للأزرار الاجتماعية
const socialStyles = `
    .social-login {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e0e0e0;
    }

    .divider {
        text-align: center;
        margin-bottom: 1.5rem;
        position: relative;
    }

    .divider span {
        background: white;
        padding: 0 1rem;
        color: #666;
        font-size: 0.9rem;
    }

    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        height: 1px;
        background: #e0e0e0;
        z-index: -1;
    }

    .social-buttons {
        display: flex;
        gap: 1rem;
    }

    .social-btn {
        flex: 1;
        padding: 12px;
        border: 2px solid #e0e0e0;
        background: transparent;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 500;
        transition: all 0.3s;
    }

    .social-btn:hover {
        border-color: var(--primary-color);
        background: #f8f8f8;
    }

    .social-btn span {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .google-btn span {
        color: #DB4437;
    }

    .facebook-btn span {
        color: #4267B2;
    }
`;

// إضافة الأنماط إلى head المستند
const styleSheet = document.createElement('style');
styleSheet.textContent = socialStyles;
document.head.appendChild(styleSheet);

// تهيئة مدير تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();

    // إضافة مستمعي الأحداث للأزرار الاجتماعية
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.classList.contains('google-btn') ? 'جوجل' : 'فيسبوك';
            alert(`سيتم توجيهك لتسجيل الدخول باستخدام ${platform} (هذه ميزة تجريبية)`);
        });
    });
});