// File: public/js/orders.js
document.addEventListener('DOMContentLoaded', function() {
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const closeOrderDetails = document.getElementById('closeOrderDetails');
    const orderSummary = document.querySelector('.order-summary');
    
    // Handle order row clicks to show details
    document.querySelectorAll('.orders-table tbody tr').forEach(row => {
        const productCell = row.querySelector('td:nth-child(2)');
        if (productCell) {
            productCell.addEventListener('click', async () => {
                const orderId = row.querySelector('.cancel-button')?.dataset.orderId;
                if (orderId) {
                    try {
                        const response = await fetch(`/users/order/${orderId}`);
                        const orderData = await response.json();
                        
                        // Populate modal with order details
                        orderSummary.innerHTML = generateOrderDetailsHTML(orderData);
                        orderDetailsModal.style.display = 'flex';
                    } catch (error) {
                        console.error('Error fetching order details:', error);
                        showToast('Error loading order details', 'error');
                    }
                }
            });
        }
    });
    
    // Handle order cancellation
    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const orderId = button.dataset.orderId;
            
            if (confirm('Are you sure you want to cancel this order?')) {
                try {
                    const response = await fetch(`/users/order/${orderId}/cancel`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const row = button.closest('tr');
                        row.style.opacity = '0.5';
                        button.disabled = true;
                        button.textContent = 'Cancelled';
                        showToast('Order cancelled successfully!');
                    } else {
                        const data = await response.json();
                        showToast(data.message || 'Error cancelling order', 'error');
                    }
                } catch (error) {
                    console.error('Error cancelling order:', error);
                    showToast('Error cancelling order', 'error');
                }
            }
        });
    });
    
    // Close modal
    closeOrderDetails?.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
    });
    
    // Helper function to generate order details HTML
    function generateOrderDetailsHTML(order) {
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        return `
            <div class="order-summary" style="margin-bottom: 2rem;">
                <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
                    <div class="product-image">
                        <img src="${order.image}" alt="Product" style="border-radius: 0.5rem; width:500px">
                    </div>
                    <div class="product-info">
                        <h4 style="color: #eab308; margin-bottom: 0.5rem;">${order.name}</h4>
                        <p>Order ID: #${order._id}</p>
                        <p>Placed on: ${orderDate}</p>
                        <p>Status: <span class="status-badge">${order.status}</span></p>
                        <div class="price-info" style="margin-top: 1rem;">
                            <p style="font-size: 1.25rem; color: #eab308;">₹${order.price}</p>
                            <p style="color: #64748b;">Qty: ${order.quantity}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Add more sections for tracking, shipping details, etc. -->
        `;
    }
    
    // Utility function to show toast messages
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});


// Background canvas animation
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

// Navbar scroll effect
var navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


