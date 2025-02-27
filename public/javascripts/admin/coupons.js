 // State
 let coupons = [];
 let currentFilter = 'all';
 let editingCouponId = null;
 let couponToDeleteId = null;

 // DOM Elements
 const couponModal = document.getElementById('couponModal');
 const couponForm = document.getElementById('couponForm');
 const modalTitle = document.getElementById('modalTitle');
 const loader = document.getElementById('loader');
 const tableBody = document.getElementById('couponsTableBody');
 const confirmDeleteModal = document.getElementById('confirmDeleteModal');

 // Event Listeners
 document.getElementById('createCouponBtn').addEventListener('click', () => {
     editingCouponId = null;
     modalTitle.textContent = 'Create Coupon';
     couponForm.reset();
     couponModal.classList.add('active');
 });

 document.querySelector('.modal-close').addEventListener('click', () => {
     couponModal.classList.remove('active');
 });

 document.getElementById('cancelBtn').addEventListener('click', () => {
     couponModal.classList.remove('active');
 });

 document.querySelectorAll('.filter-btn').forEach(btn => {
     btn.addEventListener('click', (e) => {
         document.querySelector('.filter-btn.active').classList.remove('active');
         e.target.classList.add('active');
         currentFilter = e.target.dataset.filter;
         renderCoupons();
     });
 });

 couponForm.addEventListener('submit', async (e) => {
     e.preventDefault();
     const formData = {
         couponName: document.getElementById('couponName').value,
         couponCode: document.getElementById('couponCode').value,
         discount: document.getElementById('discount').value,
         minAmount: document.getElementById('minAmount').value,
         validity: document.getElementById('validity').value
     };

     try {
         showLoader();
         if (editingCouponId) {
             await updateCoupon(editingCouponId, formData);
         } else {
             await createCoupon(formData);
             alert('Coupon created successfully!'); // User feedback
         }
         couponModal.classList.remove('active');
         await fetchCoupons();
     } catch (error) {
         console.error('Error:', error);
         alert('An error occurred. Please try again.');
     } finally {
         hideLoader();
     }
 });

 // API Functions
 async function fetchCoupons() {
     showLoader();
     try {
         const response = await fetch('/admin/coupons/get');
         coupons = await response.json();
         renderCoupons();
     } catch (error) {
         console.error('Error fetching coupons:', error);
         alert('Failed to load coupons');
     } finally {
         hideLoader();
     }
 }

 async function createCoupon(data) {
     const response = await fetch('/admin/coupons/add', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
     });
     return response.json();
 }

 async function updateCoupon(id, data) {
     const response = await fetch(`/admin/coupons/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
     });
     return response.json();
 }

 async function deleteCoupon(id) {
     showLoader();
     try {
         await fetch(`/admin/coupons/${id}`, { method: 'DELETE' });
         await fetchCoupons();
     } catch (error) {
         console.error('Error deleting coupon:', error);
         alert('Failed to delete coupon');
     } finally {
         hideLoader();
     }
 }

 // UI Functions
 function renderCoupons() {
     const filteredCoupons = currentFilter === 'all' 
         ? coupons 
         : coupons.filter(c => c.status.toLowerCase() === currentFilter);

     tableBody.innerHTML = filteredCoupons.map(coupon => `
         <tr>
             <td>${coupon.couponName}</td>
             <td>${coupon.couponCode}</td>
             <td>${coupon.discount}</td>
             <td>${coupon.minAmount}</td>
             <td>${coupon.validity}</td>
             <td>
                 <span class="status-badge ${coupon.status === 'Active' ? 'status-active' : 'status-expired'}">
                     ${coupon.status}
                 </span>
             </td>
             <td>${coupon.created}</td>
             <td>
                 <div class="action-buttons">
                     <button class="action-btn" onclick="handleEdit(${coupon.id})">Edit</button>
                     <button class="action-btn" onclick="confirmDelete(${coupon.id})">Delete</button>
                 </div>
             </td>
         </tr>
     `).join('');
 }

 function handleEdit(id) {
     const coupon = coupons.find(c => c.id === id);
     if (!coupon) return;

     editingCouponId = id;
     modalTitle.textContent = 'Edit Coupon';
     
     document.getElementById('couponName').value = coupon.couponName;
     document.getElementById('couponCode').value = coupon.couponCode;
     document.getElementById('discount').value = coupon.discount;
     document.getElementById('minAmount').value = coupon.minAmount;
     document.getElementById('validity').value = coupon.validity;
     
     couponModal.classList.add('active');
 }

 function confirmDelete(id) {
     couponToDeleteId = id;
     confirmDeleteModal.classList.add('active');
 }

 document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
     if (couponToDeleteId) {
         deleteCoupon(couponToDeleteId);
         confirmDeleteModal.classList.remove('active');
     }
 });

 document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
     confirmDeleteModal.classList.remove('active');
 });

 function showLoader() {
     loader.classList.add('active');
 }

 function hideLoader() {
     loader.classList.remove('active');
 }

 // Close modal on Escape key
 document.addEventListener('keydown', (event) => {
     if (event.key === 'Escape' && couponModal.classList.contains('active')) {
         couponModal.classList.remove('active');
     }
     if (event.key === 'Escape' && confirmDeleteModal.classList.contains('active')) {
         confirmDeleteModal.classList.remove('active');
     }
 });

 // Initial load
 fetchCoupons();