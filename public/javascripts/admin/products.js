document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/products/table', {
            method: 'POST',
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const html = await response.text();
        console.log('Fetched HTML:', html);
        const tbody = document.getElementById('tbody');
        if (tbody) {
            tbody.innerHTML = html;
        } else {
            console.error('tbody element not found');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    // Select all edit buttons
    const editButtons = document.querySelectorAll('.edit-product-btn');

    // Loop through each edit button to add event listeners
    editButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Find the closest row and associated modal
            const row = button.closest('tr');
            const addForm = row.querySelector('.cat-modal__overlay');
            if (addForm) {
                addForm.classList.remove('active');
            }
        });
    });

    // Select all cancel buttons
    const cancelButtons = document.querySelectorAll('.cat-btn--cancel');

    cancelButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Find the closest modal
            const modal = button.closest('.cat-modal__overlay');
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Select all close buttons
    const closeButtons = document.querySelectorAll('.cat-modal__close-btn');

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Find the closest modal
            const modal = button.closest('.cat-modal__overlay');
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    let permanentDelete = document.querySelectorAll('.permanentDelete');

    permanentDelete.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            try {
                // First confirmation dialog
                const isConfirmed = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'Are you sure you want to delete this main category permanently?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!'
                });

                if (!isConfirmed.isConfirmed) {
                    return; // Exit if the user cancels
                }

                // Second confirmation dialog
                const isConfirmed2 = await Swal.fire({
                    title: 'Warning!',
                    text: 'It will delete all products in it. Are you sure you want to proceed?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, proceed!',
                    cancelButtonText: 'No, cancel!'
                });

                if (!isConfirmed2.isConfirmed) {
                    return; // Exit if the user cancels
                }

                // Get the ID from the closest row
                let id = btn.closest('tr').querySelector('.id').value;

                // Create formData object
                let formData = {
                    id: id,
                };

                // Send DELETE request
                const response = await fetch('/admin/products/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                // Check if the response is OK
                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }

                // Reload the page after successful deletion
                location.reload();
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete the category. Please try again.'
                });
            }
        });
    });

    // Inactivate Button Logic
    let inactivateBtn = document.querySelectorAll('.makeInactive');
    inactivateBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            try {
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to inactivate this main category?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, inactivate it!',
                    cancelButtonText: 'No, cancel!'
                });

                if (!result.isConfirmed) return;

                let id = btn.closest('tr').querySelector('.id').value;
                let formData = { id: id };

                const response = await fetch('/admin/products/inactivate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }

                location.reload();
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to inactivate the category. Please try again.'
                });
            }
        });
    });

    // Activate Button Logic
    let activateBtn = document.querySelectorAll('.makeActive');
    activateBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            try {
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to activate this main category?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, activate it!',
                    cancelButtonText: 'No, cancel!'
                });

                if (!result.isConfirmed) return;

                let id = btn.closest('tr').querySelector('.id').value;
                let formData = { id: id };

                const response = await fetch('/admin/products/activate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }
                const result1 = await response.text();
                console.log(result);
                if (result1 === "main") {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'First activate the sub category'
                    });
                } else if (result1 === "done") {
                    location.reload();
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result1
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to activate the category. Please try again.'
                });
            }
        });
    });
});