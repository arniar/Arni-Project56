// Toggle sidebar functionality
const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');

// Event listener for toggle button
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // Toggle sidebar visibility
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('active'); // Hide sidebar if clicked outside
    }
});

// Sales Chart
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
            label: 'Monthly Sales',
            data: [85, 72, 78, 75, 77, 75, 70, 72, 70],
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#f3f4f6' // Legend text color
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#374151' // Y-axis grid color
                },
                ticks: {
                    color: '#f3f4f6' // Y-axis tick color
                }
            },
            x: {
                grid: {
                    color: '#374151' // X-axis grid color
                },
                ticks: {
                    color: '#f3f4f6' // X-axis tick color
                }
            }
        }
    }
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/admin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin' // This is important for sending cookies
        });

        if (response.ok) {
            // If logout was successful, redirect to login page
            window.location.href = '/auth/login';
        } else {
            // Handle error cases
            const data = await response.json();
            alert(data.message || 'Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    }
});