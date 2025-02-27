// Fetch API for CRUD operations
const addAddress = async (data) => {
    const response = await fetch('/users/adr/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

const updateAddress = async (id, data) => {
    const response = await fetch(`/users/adr/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

const deleteAddress = async (id) => {
    const response = await fetch(`/users/adr/addresses/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

const setPrimaryAddress = async (id) => {
    const response = await fetch(`/users/adr/addresses/${id}/primary`, {
        method: 'PATCH',
    });
    return response.json();
};

// Event listeners for address management
document.getElementById('addAddressBtn').addEventListener('click', () => {
    document.getElementById('createAddressFormContainer').classList.add('active');
});

document.getElementById('closeCreateFormBtn').addEventListener('click', () => {
    document.getElementById('createAddressFormContainer').classList.remove('active');
});

document.getElementById('cancelCreateFormBtn').addEventListener('click', () => {
    document.getElementById('createAddressFormContainer').classList.remove('active');
});

document.getElementById('createAddressForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.isPrimary = data.isPrimary === 'on'; // Convert checkbox value to boolean
    const response = await addAddress(data);
    if (response.success) {
        window.location.reload();
    }
});

document.getElementById('addressGrid').addEventListener('click', async (e) => {
    const target = e.target;
    const card = target.closest('.address-card');
    const id = card.dataset.id;

    if (target.classList.contains('delete-address')) {
        if (confirm('Are you sure you want to delete this address?')) {
            const response = await deleteAddress(id);
            if (response.success) {
                window.location.reload();
            }
        }
    } else if (target.classList.contains('edit-address')) {
        const address = {
            id: id,
            street: card.querySelector('p:nth-child(1)').textContent,
            city: card.querySelector('p:nth-child(2)').textContent.split(',')[0].trim(),
            state: card.querySelector('p:nth-child(2)').textContent.split(',')[1].trim(),
            postalCode: card.querySelector('p:nth-child(2)').textContent.split(' ')[2].trim(),
            country: card.querySelector('p:nth-child(3)').textContent,
            isPrimary: card.classList.contains('default'),
        };
        document.getElementById('editAddressFormContainer').classList.add('active');
        const editForm = document.getElementById('editAddressForm');
        editForm.id.value = address.id;
        editForm.street.value = address.street;
        editForm.city.value = address.city;
        editForm.state.value = address.state;
        editForm.postalCode.value = address.postalCode;
        editForm.country.value = address.country;
        editForm.isPrimary.checked = address.isPrimary;
    } else if (target.classList.contains('set-default')) {
        const response = await setPrimaryAddress(id);
        if (response.success) {
            window.location.reload();
        }
    }
});

document.getElementById('closeEditFormBtn').addEventListener('click', () => {
    document.getElementById('editAddressFormContainer').classList.remove('active');
});

document.getElementById('cancelEditFormBtn').addEventListener('click', () => {
    document.getElementById('editAddressFormContainer').classList.remove('active');
});

document.getElementById('editAddressForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.isPrimary = data.isPrimary === 'on'; // Convert checkbox value to boolean
    const response = await updateAddress(data.id, data);
    if (response.success) {
        window.location.reload();
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

