document.addEventListener('DOMContentLoaded', async () => {
    // Function to fetch and update table content
    async function updateTable() {
        try {
            const response = await fetch('/admin/users/table', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const html = await response.text();
            const tbody = document.getElementById('tbody');
            if (tbody) {
                tbody.innerHTML = html;
                // Reattach event listeners after updating table
                attachEventListeners();
            } else {
                console.error('tbody element not found');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    // Function to attach all event listeners
    function attachEventListeners() {
        // Block button listeners
        document.querySelectorAll('.block-user-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                let form = btn.closest('tr').querySelector('.modal-overlay');
                form.classList.remove('hide');
            });
        });

        // Close button listeners
        document.querySelectorAll('.close-modal').forEach((btn) => {
            btn.addEventListener('click', () => {
                let form = btn.closest('tr').querySelector('.modal-overlay');
                form.classList.add('hide');
            });
        });

        // Cancel button listeners
        document.querySelectorAll('.cancel-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                let form = btn.closest('tr').querySelector('.modal-overlay');
                form.classList.add('hide');
            });
        });

        // Unblock button listeners
        document.querySelectorAll('.unblock-user-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                try {
                    let id = btn.closest('tr').querySelector('.id').value;
                    const response = await fetch('/admin/users/unblock-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: id })
                    });
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    // Update table instead of reloading
                    await updateTable();
                } catch (error) {
                    console.error('Unblock error:', error);
                }
            });
        });
    }

    // Initial table load and event listener attachment
    await updateTable();

    // Search functionality
    const search = document.getElementById('searchBar');
    search.addEventListener('input', async () => {
        const searchValue = search.value;
        try {
            const response = await fetch(`/admin/users/search?value=${encodeURIComponent(searchValue)}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const html = await response.text();
            const tbody = document.getElementById('tbody');
            if (tbody) {
                tbody.innerHTML = html;
                // Reattach event listeners after search update
                attachEventListeners();
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    });
});