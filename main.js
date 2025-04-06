// main.js - Enhanced version with all functionality

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSpinner();
    initWowJS();
    initNavbar();
    initCart();
    initSmoothScrolling();
    initBackToTop();
    initCounters();
    initCarousels();
    initPricingTabs();
    initDonationForm();
});

// Initialize Spinner
function initSpinner() {
    setTimeout(function() {
        const spinner = document.getElementById('spinner');
        if (spinner) spinner.classList.remove('show');
    }, 1);
}

// Initialize Wow.js
function initWowJS() {
    new WOW().init();
}

// Initialize Sticky Navbar
function initNavbar() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 45) {
            navbar.classList.add('sticky-top', 'shadow-sm');
        } else {
            navbar.classList.remove('sticky-top', 'shadow-sm');
        }
    });
}

// Initialize Cart System
function initCart() {
    const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: Date.now(),
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                quantity: 1,
                image: this.dataset.image || 'img/default-food.jpg'
            };
            
            // Check if item already exists in cart
            const existingItem = cart.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(item);
            }
            
            localStorage.setItem('reviveplateCart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
            
            // Show added notification
            showToast(`${item.name} added to cart!`);
        });
    });
    
    // Update cart display on cart page
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartMsg = document.querySelector('.empty-cart-message');
        
        if (cartItemsContainer) {
            if (cart.length === 0) {
                if (emptyCartMsg) emptyCartMsg.style.display = 'block';
                cartItemsContainer.innerHTML = '';
            } else {
                if (emptyCartMsg) emptyCartMsg.style.display = 'none';
                
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item d-flex mb-4 p-3 bg-light rounded">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img me-3" style="width: 80px; height: 80px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">${item.name}</h6>
                                    <small class="text-muted">$${item.price.toFixed(2)} each</small>
                                </div>
                                <button class="btn btn-sm btn-link text-danger remove-item" data-id="${item.id}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <div class="quantity-control d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary decrease" data-id="${item.id}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase" data-id="${item.id}">+</button>
                                </div>
                                <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Calculate totals
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const total = Math.max(0, subtotal - 2); // $2 discount
                
                if (document.querySelector('.cart-subtotal')) {
                    document.querySelector('.cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
                }
                if (document.querySelector('.cart-total')) {
                    document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
                }
                
                // Add event listeners to cart buttons
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', removeItem);
                });
                
                document.querySelectorAll('.decrease').forEach(btn => {
                    btn.addEventListener('click', decreaseQuantity);
                });
                
                document.querySelectorAll('.increase').forEach(btn => {
                    btn.addEventListener('click', increaseQuantity);
                });
            }
        }
    }
    
    // Cart item actions
    function removeItem(e) {
        const itemId = parseInt(e.currentTarget.dataset.id);
        const index = cart.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
            cart.splice(index, 1);
            saveCart();
        }
    }
    
    function decreaseQuantity(e) {
        const itemId = parseInt(e.currentTarget.dataset.id);
        const item = cart.find(item => item.id === itemId);
        
        if (item && item.quantity > 1) {
            item.quantity--;
            saveCart();
        }
    }
    
    function increaseQuantity(e) {
        const itemId = parseInt(e.currentTarget.dataset.id);
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity++;
            saveCart();
        }
    }
    
    function saveCart() {
        localStorage.setItem('reviveplateCart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showToast('Your cart is empty. Add some rescued meals first!', 'warning');
                return;
            }
            
            // In a real implementation, this would redirect to checkout
            showToast('Proceeding to checkout!', 'success');
            
            // Here you would typically:
            // 1. Send cart data to server
            // 2. Process payment
            // 3. Clear cart on success
            // localStorage.removeItem('reviveplateCart');
            // updateCartCount();
            // updateCartDisplay();
        });
    }
    
    // Initialize cart display
    updateCartCount();
    updateCartDisplay();
}

// Initialize Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== '') {
                e.preventDefault();
                
                const target = document.querySelector(this.hash);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 45,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav item
                    document.querySelectorAll('.navbar-nav .active').forEach(item => {
                        item.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
}

// Initialize Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize Counters
function initCounters() {
    const counters = document.querySelectorAll('[data-toggle="counter-up"]');
    
    counters.forEach(counter => {
        const target = +counter.textContent;
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current < target) {
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Initialize Carousels
function initCarousels() {
    // Screenshot Carousel
    $('.screenshot-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: true,
        items: 1
    });
    
    // Testimonial Carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });
}

// Initialize Pricing Tabs
function initPricingTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('href');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            document.querySelector(target).classList.add('show', 'active');
        });
    });
}

// Initialize Donation Form
function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value || 'N/A',
                familyMembers: document.getElementById('familyMembers').value,
                address: document.getElementById('address').value,
                landmark: document.getElementById('landmark').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                specialRequirements: document.getElementById('specialRequirements').value || 'N/A',
                consent: document.getElementById('consent').checked,
                updates: document.getElementById('updates').checked
            };
            
            // Simulate server request
            setTimeout(() => {
                // In a real app, you would use fetch() to send data to server
                // fetch('/api/donation', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     if (data.success) {
                        donationForm.classList.add('d-none');
                        document.getElementById('successMessage').classList.remove('d-none');
                //     }
                // });
                
                // For demo, we'll just show success after timeout
                donationForm.classList.add('d-none');
                document.getElementById('successMessage').classList.remove('d-none');
            }, 1500);
        });
        
        // Input validation
        document.getElementById('phone').addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9+]/g, '');
        });
        
        document.getElementById('pincode').addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }
}

// Helper function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '250px';
    toast.style.borderRadius = '5px';
    toast.style.padding = '10px 15px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.animation = 'fadeIn 0.3s ease-in-out';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    .bg-success { background-color: #28a745 !important; }
    .bg-warning { background-color: #ffc107 !important; }
    .bg-danger { background-color: #dc3545 !important; }
`;
document.head.appendChild(toastStyles);

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty array
    let cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = {
                id: this.dataset.id || Date.now(),
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                quantity: 1,
                image: this.dataset.image || 'img/default-food.jpg'
            };

            // Check if item already in cart
            const existingItem = cart.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(item);
            }

            // Save to localStorage
            localStorage.setItem('reviveplateCart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Optional: Show confirmation
            alert(`${item.name} added to cart!`);
        });
    });

    // Update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    // Initialize cart count on page load
    updateCartCount();
});

// Add this to main.js (or create cart.js)
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-items')) {
        const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartMsg = document.querySelector('.empty-cart-message');

        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            cartItemsContainer.innerHTML = '';
        } else {
            emptyCartMsg.style.display = 'none';
            
            // Generate cart items HTML
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">$${item.price.toFixed(2)} each</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary decrease" data-id="${item.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase" data-id="${item.id}">+</button>
                        <span class="ms-3 fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-link text-danger remove ms-2" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // Update totals
            updateCartTotals();

            // Add event listeners
            addCartEventListeners();
        }
    }

    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = Math.max(0, subtotal - 2); // $2 discount
        
        document.querySelector('.cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
    }

    function addCartEventListeners() {
        // Quantity decrease
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
                const itemId = this.dataset.id;
                const itemIndex = cart.findIndex(item => item.id == itemId);
                
                if (itemIndex !== -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                    localStorage.setItem('reviveplateCart', JSON.stringify(cart));
                    location.reload(); // Refresh to update display
                }
            });
        });
        
        // Quantity increase
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
                const itemId = this.dataset.id;
                const itemIndex = cart.findIndex(item => item.id == itemId);
                
                if (itemIndex !== -1) {
                    cart[itemIndex].quantity++;
                    localStorage.setItem('reviveplateCart', JSON.stringify(cart));
                    location.reload();
                }
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const cart = JSON.parse(localStorage.getItem('reviveplateCart')) || [];
                const itemId = this.dataset.id;
                const newCart = cart.filter(item => item.id != itemId);
                
                localStorage.setItem('reviveplateCart', JSON.stringify(newCart));
                location.reload();
            });
        });
    }
});
