// إدارة قائمة الطعام وسلة التسوق
class MenuManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartUI();
        this.setupFiltering();
    }

    setupEventListeners() {
        // إضافة عناصر إلى السلة
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.menu-item');
                this.addToCart(menuItem);
            });
        });

        // فتح/إغلاق السلة
        document.getElementById('cartToggle').addEventListener('click', () => {
            this.toggleCart();
        });

        document.getElementById('closeCart').addEventListener('click', () => {
            this.toggleCart();
        });

        // إتمام الطلب
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.checkout();
        });
    }

    setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشط للزر المختار
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                this.filterMenuItems(filter);
            });
        });
    }

    filterMenuItems(filter) {
        const menuItems = document.querySelectorAll('.menu-item');
        const categories = document.querySelectorAll('.menu-category');
        
        if (filter === 'all') {
            menuItems.forEach(item => item.style.display = 'flex');
            categories.forEach(category => category.style.display = 'block');
        } else {
            // إخفاء جميع العناصر أولاً
            menuItems.forEach(item => item.style.display = 'none');
            
            // إظهار العناصر التي تطابق التصفية
            menuItems.forEach(item => {
                if (item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                }
            });

            // إظهار/إخفاء الأقسام بناءً على وجود عناصر
            categories.forEach(category => {
                const itemsInCategory = category.querySelectorAll(`.menu-item[data-category="${filter}"]`);
                const visibleItems = Array.from(itemsInCategory).filter(item => 
                    item.style.display !== 'none'
                );
                
                if (visibleItems.length > 0) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
        }
    }

    addToCart(menuItem) {
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseInt(menuItem.querySelector('.item-price').textContent.replace(/[^\d]/g, ''));
        const itemDescription = menuItem.querySelector('p').textContent;
        const itemImage = menuItem.querySelector('img').src;

        const existingItem = this.cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                image: itemImage,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showAlert(`تم إضافة ${itemName} إلى السلة`, 'success');
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        if (this.cart[index].quantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        
        // تحديث العداد
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // تحديث العناصر
        cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666;">السلة فارغة</p>';
            cartTotal.textContent = '0 ريال';
            return;
        }
        
        let total = 0;
        
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} ريال × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">حذف</button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // تحديث المجموع
        cartTotal.textContent = `${total.toLocaleString()} ريال`;
        
        // إضافة مستمعي الأحداث للعناصر الجديدة
        this.addCartItemEventListeners();
    }

    addCartItemEventListeners() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.updateQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.removeFromCart(index);
            });
        });
    }

    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showAlert('السلة فارغة', 'error');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // في تطبيق حقيقي، هنا سيتم التوجيه إلى صفحة الدفع
        this.showAlert(`سيتم توجيهك إلى صفحة الدفع. المجموع: ${total.toLocaleString()} ريال`, 'info');
        
        // محاكاة عملية الدفع (لأغراض العرض)
        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.toggleCart();
            this.showAlert('شكراً لطلبك! سيتم تجهيز طلبك قريباً.', 'success');
        }, 2000);
    }

    showAlert(message, type = 'info') {
        // استخدام الدالة الموجودة في app.js أو إنشاء واحدة جديدة
        if (typeof showAlert === 'function') {
            showAlert(message, type);
        } else {
            // بديل إذا لم تكن الدالة موجودة
            alert(message);
        }
    }
}

// تهيئة مدير القائمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
});