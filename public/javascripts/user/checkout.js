

   // Payment method handling
   document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
        // Update selected state
        document.querySelectorAll('.payment-method').forEach(m => 
            m.classList.remove('selected'));
        method.classList.add('selected');
        
        // Check radio
        const radio = method.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Show/hide payment details
        const paymentType = method.dataset.method;
        document.querySelectorAll('.payment-details').forEach(detail => 
            detail.style.display = 'none');
        if (paymentType !== 'cod') {
            document.getElementById(`${paymentType}Details`).style.display = 'block';
        }
    });
    });
    
    
    
    // Address form handling
    const addressForm = document.getElementById('addressForm');
    const editAddressForm = document.getElementById('editAddressForm');
    
    // Create new address
    addressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: addressForm.querySelector('input[placeholder="Full Name"]').value,
            street: addressForm.querySelector('input[placeholder="Street Address"]').value,
            city: addressForm.querySelector('input[placeholder="City"]').value,
            state: addressForm.querySelector('input[placeholder="State"]').value,
            postalCode: addressForm.querySelector('input[placeholder="ZIP Code"]').value,
            phone: addressForm.querySelector('input[placeholder="Phone Number"]').value,
            country: 'US'
        };
    
        try {
            const response = await fetch('/checkout/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to create address');
            }
    
            closeAddressModal();
            // Optionally refresh address list or update UI
        } catch (error) {
            showError(error.message);
        }
    });
    
    // Edit address
    editAddressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const addressId = document.getElementById('editAddressId').value;
        
        const formData = {
            name: document.getElementById('editName').value,
            street: document.getElementById('editStreet').value,
            city: document.getElementById('editCity').value,
            state: document.getElementById('editState').value,
            postalCode: document.getElementById('editZip').value,
            phone: document.getElementById('editPhone').value,
            country: 'US'
        };
    
        try {
            const response = await fetch(`/checkout/addresses/${addressId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update address');
            }
    
            closeEditAddressModal();
            // Optionally refresh address list or update UI
        } catch (error) {
            showError(error.message);
        }
    });
    
    // Modal close functions
    function closeAddressModal() {
        document.getElementById('addressModal').style.display = 'none';
    }
    
    function closeEditAddressModal() {
        document.getElementById('editAddressModal').style.display = 'none';
    }
    
    // Select address as primary
    async function selectAddress(addressId) {
        try {
            const response = await fetch(`/checkout/addresses/${addressId}/select`, {
                method: 'PATCH'
            });
    
            if (!response.ok) {
                throw new Error('Failed to select address');
            }
    
            updateAddressList();
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Update address list UI
    async function updateAddressList() {
        try {
            const response = await fetch('/users/checkout/addresses/primary');
            const address = await response.json();
    
            if (response.status === 404) {
                showError('Please select a primary address to continue');
                return;
            }
    
            const addressList = document.querySelector('.address-list');
            // Update UI with address data
            addressList.innerHTML = `
                <div class="address-card selected">
                    <h3>${address.street}</h3>
                    <p>${address.city}, ${address.state} ${address.postalCode}</p>
                    <div class="address-actions">
                        <button class="btn btn-outline" onclick="editAddress('${address._id}')">Edit</button>
                    </div>
                </div>
            `;
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Error handling
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.main-content').prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    // Initial load
    updateAddressList();
    
    // Close modals on outside click
    window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
    }
    
    // Address modal functions
    function showAddAddressModal() {
        document.getElementById('addressModal').style.display = 'flex';
    }
    
    function closeAddressModal() {
        document.getElementById('addressModal').style.display = 'none';
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('addressModal');
        if (event.target == modal) {
            closeAddressModal();
        }
    }
    
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let mousePosition = { x: 0, y: 0 };
    
    function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    class Particle {
    constructor() {
    this.reset();
    }
    
    reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    const colors = [
        'hsla(45, 100%, 50%, 0.2)',  // Gold
        'hsla(280, 70%, 40%, 0.2)',  // Deep Purple
        'hsla(350, 70%, 40%, 0.2)'   // Dark Red
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    
    if (this.life >= this.maxLife ||
        this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
        this.reset();
    }
    }
    
    draw() {
    const opacity = 1 - (this.life / this.maxLife);
    ctx.fillStyle = this.color.replace('0.2', opacity * 0.2);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    }
    }
    
    const particles = Array.from({ length: 100 }, () => new Particle());
    
    function animate() {
    ctx.fillStyle = 'rgba(18, 18, 18, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
    particle.update();
    particle.draw();
    });
    
    const mouseGradient = ctx.createRadialGradient(
    mousePosition.x, mousePosition.y, 0,
    mousePosition.x, mousePosition.y, 150
    );
    mouseGradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
    mouseGradient.addColorStop(1, 'rgba(18, 18, 18, 0)');
    ctx.fillStyle = mouseGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    requestAnimationFrame(animate);
    }
    
    window.addEventListener('mousemove', (e) => {
    mousePosition = { x: e.clientX, y: e.clientY };
    });
    
    animate();
    
    // Scroll animations for elements
    const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
    }
    });
    }, observerOptions);
    
    // Animate sections on scroll
    document.querySelectorAll('.section-title, .category, .product-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
    });
    
    
    async function fetchAddresses() {
        try {
            const response = await fetch('/users/checkout/addresses');
            const addresses = await response.json();
    
            const addressList = document.querySelector('.address-list');
            addressList.innerHTML = addresses.map(address => `
                <div class="address-card" data-address-id="${address._id}">
                    <input type="radio" name="shipping-address" 
                           value="${address._id}" 
                           ${address.isPrimary ? 'checked' : ''}>
                    <div class="address-details">
                        <h3>${address.street}</h3>
                        <p>${address.city}, ${address.state} ${address.postalCode}</p>
                    </div>
                    <div class="address-actions">
                        <button class="btn btn-outline" onclick="editAddress('${address._id}')">Edit</button>
                    </div>
                </div>
            `).join('');
    
            // Add event listeners for card and radio selection
            document.querySelectorAll('.address-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    // Ignore if click is on edit button
                    if (e.target.closest('.address-actions')) return;
    
                    // Deselect other addresses
                    document.querySelectorAll('.address-card').forEach(c => 
                        c.classList.remove('selected'));
                    
                    // Select this card
                    card.classList.add('selected');
                    
                    // Check the radio button
                    const radio = card.querySelector('input[type="radio"]');
                    radio.checked = true;
                });
            });
        } catch (error) {
            showError('Failed to load addresses');
        }
    }
    
    // Call on page load
    document.addEventListener('DOMContentLoaded', fetchAddresses);
    
   // Frontend JavaScript
document.getElementById('placeOrderBtn').addEventListener('click', async (e) => {
    // Prevent default button action
    e.preventDefault();

    // Gather all form data
    const selectedAddressRadio = document.querySelector('input[name="shipping-address"]:checked');
    const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (!selectedAddressRadio) {
        showError('Please select a shipping address');
        return;
    }

    if (!selectedPaymentMethod) {
        showError('Please select a payment method');
        return;
    }

    const orderData = {
        shippingAddressId: selectedAddressRadio.value,
        paymentMethod: selectedPaymentMethod
    };

    try {
        const response = await fetch('/users/checkout/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (responseData.stock === "out") {
                // Handle out of stock case
                window.location.href = '/users/cart';
                return;
            }
            throw new Error(responseData.error || 'Order placement failed');
        }

        // Handle successful order
        window.location.href = '/users/order';

    } catch (error) {
        console.error('Order Placement Error:', error);
        showError(error.message);
    }
});