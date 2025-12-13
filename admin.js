// ===============================
// ADMIN AUTH CHECK
// ===============================
const isAdmin = localStorage.getItem('isAdmin') === 'true';

if (!isAdmin) {
    window.location.href = 'login.html';
}

// ===============================
// DOM ELEMENTS
// ===============================
const lostContainer = document.getElementById('lostContainer');
const foundContainer = document.getElementById('foundContainer');

const lostCountEl = document.getElementById('lostCount');
const foundCountEl = document.getElementById('foundCount');
const totalCountEl = document.getElementById('totalCount');

// ===============================
// LOAD LOST ITEMS
// ===============================
function loadLostItems() {
    fetch('/api/lostitems')
        .then(res => res.json())
        .then(data => {
            const activeLost = data.filter(item => item.status !== 'resolved');

            lostCountEl.textContent = activeLost.length;
            updateTotalCount();

            if (activeLost.length === 0) {
                lostContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>No active lost items</p>
                    </div>
                `;
                return;
            }

            let table = `
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            activeLost.forEach(item => {
                table += `
                    <tr>
                        <td>${item.itemName}</td>
                        <td>${item.location}</td>
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                        <td>${item.contactName}</td>
                        <td class="action-btns">
                            <button class="btn btn-view"
                                onclick="resolveLostItem('${item._id}')">
                                Mark Resolved
                            </button>
                            <button class="btn btn-delete"
                                onclick="deleteLostItem('${item._id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;
            lostContainer.innerHTML = table;
        })
        .catch(() => {
            lostContainer.innerHTML = `<p>Error loading lost items</p>`;
        });
}

// ===============================
// LOAD FOUND ITEMS
// ===============================
function loadFoundItems() {
    fetch('/api/founditems')
        .then(res => res.json())
        .then(data => {
            const activeFound = data.filter(item => item.status !== 'resolved');

            foundCountEl.textContent = activeFound.length;
            updateTotalCount();

            if (activeFound.length === 0) {
                foundContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-gift"></i>
                        <p>No active found items</p>
                    </div>
                `;
                return;
            }

            let table = `
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Location</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            activeFound.forEach(item => {
                table += `
                    <tr>
                        <td>${item.itemName}</td>
                        <td>${item.location}</td>
                        <td>${item.contactName}</td>
                        <td class="action-btns">
                            <button class="btn btn-view"
                                onclick="resolveFoundItem('${item._id}')">
                                Mark Resolved
                            </button>
                            <button class="btn btn-delete"
                                onclick="deleteFoundItem('${item._id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;
            foundContainer.innerHTML = table;
        })
        .catch(() => {
            foundContainer.innerHTML = `<p>Error loading found items</p>`;
        });
}

// ===============================
// RESOLVE ITEMS (ADMIN)
// ===============================
function resolveLostItem(id) {
    if (!confirm('Mark this lost item as resolved?')) return;

    fetch(`/api/lostitems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
    }).then(() => loadLostItems());
}

function resolveFoundItem(id) {
    if (!confirm('Mark this found item as resolved?')) return;

    fetch(`/api/founditems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
    }).then(() => loadFoundItems());
}

// ===============================
// DELETE ITEMS
// ===============================
function deleteLostItem(id) {
    if (!confirm('Delete this lost item permanently?')) return;

    fetch(`/api/lostitems/${id}`, { method: 'DELETE' })
        .then(() => loadLostItems());
}

function deleteFoundItem(id) {
    if (!confirm('Delete this found item permanently?')) return;

    fetch(`/api/founditems/${id}`, { method: 'DELETE' })
        .then(() => loadFoundItems());
}

// ===============================
// SEARCH
// ===============================
function filterLostItems() {
    const q = document.getElementById('lostSearch').value.toLowerCase();
    lostContainer.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function filterFoundItems() {
    const q = document.getElementById('foundSearch').value.toLowerCase();
    foundContainer.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

// ===============================
// TOTAL COUNT
// ===============================
function updateTotalCount() {
    totalCountEl.textContent =
        Number(lostCountEl.textContent) + Number(foundCountEl.textContent);
}

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    loadLostItems();
    loadFoundItems();
});
