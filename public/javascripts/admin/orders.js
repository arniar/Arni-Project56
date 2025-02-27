// Initialize status tabs
document.querySelectorAll('.status-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const status = this.getAttribute('data-status');
        filterOrders(status);
        document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

function filterOrders(status) {
    fetch(`/admin/orders/get?status=${status}`)
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.getElementById('ordersTableBody');
            ordersTableBody.innerHTML = ''; // Clear existing rows

            let i =1;
            
            data.orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i++}</td>
                    <td>
                        <div class="customer-info">
                            <p>${order.userId}</p>
                        </div>
                    </td>
                    <td>
                        <div class="product-info">
                            <img src="${order.image}" alt="${order.name}" class="product-thumbnail">
                            <p>${order.name}</p>
                            <small>Size: ${order.size}</small>
                        </div>
                    </td>
                    <td>${order.quantity}</td>
                    <td>₹${order.price.toLocaleString()}</td>
                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>${order.paymentMethod.toUpperCase()}</td>
                    <td>
                        <span class="status status-${order.status.toLowerCase()}">
                            ${order.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="change-status-btn btn-sm" data-order-id="${order._id}">
                                Change Status
                            </button>
                            <!-- <button class="view-details-btn btn-sm" data-order-id="${order._id}">
                                View Details
                            </button> -->
                        </div>
                    </td>
                `;
                ordersTableBody.appendChild(row);
            });
            
            // Re-attach event listeners
            attachChangeStatusListeners();
            attachViewDetailsListeners();
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch orders. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        });
}

function attachChangeStatusListeners() {
    document.querySelectorAll('.change-status-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = this.getAttribute('data-order-id');
            try {
                const result = await Swal.fire({
                    title: 'Change Order Status',
                    input: 'select',
                    inputOptions: {
                        'Pending': 'Pending',
                        'Processing': 'Processing',
                        'Shipped': 'Shipped',
                        'Delivered': 'Delivered',
                        'Cancelled': 'Cancelled'
                    },
                    inputPlaceholder: 'Select the new status',
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading(),
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to select a status';
                        }
                    },
                    preConfirm: async (newStatus) => {
                        try {
                            const response = await fetch(`/admin/orders/${orderId}/status`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ status: newStatus })
                            });
                            
                            const data = await response.json();
                            if (!data.success) {
                                throw new Error(data.message || 'Failed to update status');
                            }
                            return data;
                        } catch (error) {
                            Swal.showValidationMessage(
                                `Request failed: ${error.message}`
                            );
                        }
                    }
                });

                if (result.isConfirmed) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Order status updated successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    // Refresh the current filter
                    const currentStatus = document.querySelector('.status-tab.active').getAttribute('data-status');
                    filterOrders(currentStatus);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An unexpected error occurred. Please try again.'
                });
            }
        });
    });
}

function attachViewDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = this.getAttribute('data-order-id');
            try {
                const response = await fetch(`/admin/orders/${orderId}`);
                const order = await response.json();
                
                Swal.fire({
                    title: 'Order Details',
                    html: `
                        <div class="order-details">
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Customer ID:</strong> ${order.userId}</p>
                            <p><strong>Shipping Address:</strong><br>
                               ${order.address.street}<br>
                               ${order.address.city}, ${order.address.state}<br>
                               ${order.address.postalCode}<br>
                               ${order.address.country}</p>
                            <p><strong>Product:</strong> ${order.name}</p>
                            <p><strong>Size:</strong> ${order.size}</p>
                            <p><strong>Quantity:</strong> ${order.quantity}</p>
                            <p><strong>Price:</strong> ₹${order.price.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                            <p><strong>Status:</strong> ${order.status}</p>
                        </div>
                    `,
                    width: '600px',
                    confirmButtonColor: '#3085d6'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch order details'
                });
            }
        });
    });
}

// Initial load of all orders
document.addEventListener('DOMContentLoaded', () => {
    filterOrders('All');
});