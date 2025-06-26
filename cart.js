class CartManager {
    constructor() {
        this.cartItems = [];
        this.init();
    }

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
        }
        
        this.setupEventListeners();
        this.updateCartUI();
    }

    setupEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.showCartModal();
            });
        }

        // Close cart modal
        const closeCartModal = document.getElementById('closeCartModal');
        if (closeCartModal) {
            closeCartModal.addEventListener('click', () => {
                this.hideCartModal();
            });
        }

        // Place order button
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }

        // Close modal when clicking outside
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.hideCartModal();
                }
            });
        }
    }

    addToCart(productId, quantity = 1) {
        const product = productManager.getProductById(productId);
        if (!product) {
            authManager.showToast('Product not found.', 'error');
            return;
        }

        // Check if item already exists in cart
        const existingItem = this.cartItems.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartUI();
        authManager.showToast(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cartItems.find(item => item.productId === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
            this.renderCartItems();
        }
    }

    getCartTotal() {
        return this.cartItems.reduce((total, item) => {
            const product = productManager.getProductById(item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    getCartItemCount() {
        return this.cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.getCartItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = this.getCartTotal().toFixed(2);
        }
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.add('show');
            this.renderCartItems();
        }
    }

    hideCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const placeOrderBtn = document.getElementById('placeOrderBtn');

        if (this.cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmpty.style.display = 'block';
            placeOrderBtn.disabled = true;
            placeOrderBtn.style.opacity = '0.5';
            return;
        }

        cartItemsContainer.style.display = 'block';
        cartEmpty.style.display = 'none';
        placeOrderBtn.disabled = false;
        placeOrderBtn.style.opacity = '1';

        cartItemsContainer.innerHTML = this.cartItems.map(item => {
            const product = productManager.getProductById(item.productId);
            if (!product) return '';

            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${product.name}</div>
                        <div class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.productId}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span
