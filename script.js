let currentTab = 'lost';
let items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];

async function fetchItemsFromBackend() {
    try {
        const [resLost, resFound] = await Promise.all([
            fetch("http://localhost:5000/api/lost-items"),
            fetch("http://localhost:5000/api/found-items")
        ]);

        if (!resLost.ok || !resFound.ok) throw new Error("Failed to fetch items");

        const lostItems = await resLost.json();
        const foundItems = await resFound.json();

        lostItems.forEach(item => item.status = 'lost');
        foundItems.forEach(item => item.status = 'found');

        items = [...lostItems, ...foundItems];

        localStorage.setItem('lostFoundItems', JSON.stringify(items));

        displaySearchResults(items);

        console.log("Items loaded from backend:", items);

    } catch (err) {
        console.error(err);
        showMessage("Unable to load items from server. Is backend running?", "error");
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    setupNavigation();
    setupFormHandling();
    setupDateDefaults();

    await fetchItemsFromBackend();

    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') console.log('Notification permission granted');
        });
    }

    initNotificationCounter();
    setInterval(checkForNewMatches, 300000); 
    showSection('home');

    const header = document.querySelector('header');
    if (header) {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Data';
        Object.assign(resetBtn.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: '1000',
            padding: '5px 10px', backgroundColor: '#fc6691ff', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
        });
        resetBtn.onclick = resetSampleData;
        header.appendChild(resetBtn);
    }
}

async function resetSampleData() {
    if (confirm('Are you sure you want to reload items from the backend?')) {
        items = [];
        localStorage.removeItem('lostFoundItems');
        await fetchItemsFromBackend();
        showSection('search');
        searchItems();
    }
}
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showSection(link.getAttribute('href').substring(1));
            navMenu.classList.remove('active');
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';

    if (sectionId === 'home') {
        if (hero) hero.style.display = 'block';
        window.location.hash = '';
        return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        window.location.hash = sectionId;

        if (sectionId === 'search') displaySearchResults();
        else if (sectionId === 'matches') findPotentialMatches();
    } else {
        showSection('home');
    }
}

function switchTab(tabType, buttonElement) {
    currentTab = tabType;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');

    const formTitle = document.querySelector('#report h2');
    const submitBtn = document.querySelector('#reportForm button[type="submit"]');

    if (tabType === 'lost') {
        formTitle.textContent = 'Report a Lost Item';
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Report Lost Item';
    } else {
        formTitle.textContent = 'Report a Found Item';
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Report Found Item';
    }
}

function setupFormHandling() {
    const form = document.getElementById('reportForm');
    if (form) form.addEventListener('submit', handleFormSubmission);
}

async function handleFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('reportForm'));

    const item = {
        type: formData.get('itemType'),
        itemName: formData.get('itemName'),
        location: formData.get('location'),
        date: formData.get('date'),
        description: formData.get('description') || '',
        contactName: formData.get('contactName') || '',
        contactEmail: formData.get('contactEmail') || '',
        contactPhone: formData.get('contactPhone') || '',
        status: currentTab 
    };

    if (!item.type || !item.itemName || !item.location || !item.date || !item.contactName || !item.contactEmail) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    const endpoint = currentTab === 'lost'
        ? 'http://localhost:5000/api/lost-items'
        : 'http://localhost:5000/api/found-items';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            throw new Error('Failed to save item to server');
        }

        const savedItem = await response.json();

        items.push(savedItem);     
        localStorage.setItem('lostFoundItems', JSON.stringify(items)); 
        displaySearchResults();       

        showMessage(`${currentTab === 'lost' ? 'Lost' : 'Found'} item reported successfully!`, 'success');

        document.getElementById('reportForm').reset();
        document.getElementById('report').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error(error);
        showMessage('Error connecting to server. Please check your backend.', 'error');
    }
}


function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    const form = document.getElementById('reportForm');
    form.insertBefore(message, form.firstChild);

    setTimeout(() => { if (message.parentNode) message.remove(); }, 5000);
}

function searchItems() {
    const query = document.getElementById('searchQuery')?.value?.toLowerCase() || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const dateFilter = document.getElementById('filterDate')?.value || '';

    let filteredItems = items.filter(item => {
        if (!item) return false;
        const matchesQuery = !query || (item.itemName && item.itemName.toLowerCase().includes(query)) || (item.description && item.description.toLowerCase().includes(query));
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesDate = !dateFilter || item.date?.slice(0, 10) === dateFilter;
        return matchesQuery && matchesType && matchesStatus && matchesDate;
    });

    displaySearchResults(filteredItems);
}

function displaySearchResults(itemsToShow = []) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (!itemsToShow || itemsToShow.length === 0) {
        resultsContainer.innerHTML = `<div class="no-matches"><i class="fas fa-search"></i><h3>No Items Found</h3><p>We couldn't find any items matching your search criteria.</p></div>`;
        return;
    }

    resultsContainer.innerHTML = itemsToShow.map(item => {
        const itemId = item._id || item.id || '';
        const itemStatus = item.status || 'lost';
        const itemType = item.type || 'other';
        const itemName = item.itemName || 'Unnamed Item';
        const itemDate = formatDate(item.date) || 'Unknown';
        const itemDescription = item.description || '';

        return `
        <div class="item-card">
            <div class="item-header">
                <h3><i class="fas fa-${getIconForType(itemType)}"></i> ${itemName}</h3>
                <span class="item-status ${itemStatus === 'lost' ? 'status-lost' : 'status-found'}">${itemStatus === 'lost' ? 'Lost' : 'Found'}</span>
            </div>
            <div class="item-details">
                <p><strong>Type:</strong> ${formatItemType(itemType)}</p>
                <p><strong>Date:</strong> ${itemDate}</p>
                ${itemDescription ? `<p><strong>Description:</strong> ${itemDescription}</p>` : ''}
                <button class="contact-btn" onclick="showContactInfo('${itemId}')"><i class="fas fa-envelope"></i> Contact ${itemStatus === 'lost' ? 'Finder' : 'Owner'}</button>
            </div>
        </div>`;
    }).join('');
}

function getIconForType(type) {
    const icons = { 'student-id': 'id-card', 'national-id': 'id-card', 'book': 'book', 'electronics': 'laptop', 'clothing': 'tshirt', 'keys': 'key', 'wallet': 'wallet', 'other': 'question-circle' };
    return icons[type] || 'search';
}

function formatItemType(type) {
    if (!type) return 'Other';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function showContactInfo(itemId) {
    const item = items.find(i => i._id === itemId || i.id === itemId);
    if (!item) { alert('Item not found'); return; }

    const modalContent = document.getElementById('modalContent');
    const modal = document.getElementById('modal');
    if (!modalContent || !modal) { console.error('Modal elements missing'); return; }

    modalContent.innerHTML = `
        <span id="closeModal" style="cursor:pointer; float:right; font-size:1.5rem;">&times;</span>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${item.contactName || 'N/A'}</p>
        <p><strong>Email:</strong> ${item.contactEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> ${item.contactPhone || 'Not provided'}</p>
        <p><strong>Item:</strong> ${item.itemName || 'Unnamed Item'}</p>
        <p><strong>Status:</strong> ${item.status === 'lost' ? 'Lost Item Owner' : 'Finder'}</p>
    `;

    modal.style.display = 'flex';

    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
    };
}


function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function setupDateDefaults() {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
}

function findPotentialMatches() {
    const typeFilter = document.getElementById('matchType')?.value || '';
    const lostItems = items.filter(item => item.status === 'lost');
    const foundItems = items.filter(item => item.status === 'found');
    const matchesContainer = document.getElementById('matchesContainer');
    if (!matchesContainer) return;
    matchesContainer.innerHTML = '';

    let hasMatches = false;

    lostItems.forEach(lostItem => {
        foundItems.forEach(foundItem => {
            if (typeFilter && lostItem.type !== typeFilter) return;

            let score = 0;
            const matchReasons = [];

            if (lostItem.type === foundItem.type) { score += 40; matchReasons.push('Same item type'); }
            if (lostItem.itemName && foundItem.itemName) {
                if (lostItem.itemName.toLowerCase() === foundItem.itemName.toLowerCase()) { score += 30; matchReasons.push('Matching item name'); }
                else if (lostItem.itemName.toLowerCase().includes(foundItem.itemName.toLowerCase()) || foundItem.itemName.toLowerCase().includes(lostItem.itemName.toLowerCase())) { score += 20; matchReasons.push('Similar item name'); }
            }
            if (lostItem.location.toLowerCase() === foundItem.location.toLowerCase()) { score += 20; matchReasons.push('Same location'); }
            else if (lostItem.location.toLowerCase().includes('library') && foundItem.location.toLowerCase().includes('library')) { score += 10; matchReasons.push('Same general area (library)'); }

            const lostDate = new Date(lostItem.date);
            const foundDate = new Date(foundItem.date);
            if (Math.abs(foundDate - lostDate)/(1000*3600*24) <= 7) { score += 10; matchReasons.push('Reported within 7 days'); }

            if (score >= 40) {
                hasMatches = true;
                const matchPair = document.createElement('div');
                matchPair.className = 'match-pair';
                const confidence = Math.min(95, score);

                matchPair.innerHTML = `
                    <div class="match-header"><h3>Potential Match Found</h3><span class="match-confidence">${confidence}% Confidence</span></div>
                    <div class="match-cards">
                        <div class="match-card">
                            <h4><i class="fas fa-search"></i> Lost Item</h4>
                            <div class="match-details">
                                <p><strong>Item:</strong> ${lostItem.itemName}</p>
                                <p><strong>Type:</strong> ${lostItem.type.replace('-', ' ')}</p>
                                <p><strong>Lost on:</strong> ${formatDate(lostItem.date)}</p>
                                <p><strong>Location:</strong> ${lostItem.location}</p>
                                <p><strong>Description:</strong> ${lostItem.description || 'No description'}</p>
                                <button class="btn btn-small btn-primary" onclick="showContactInfo('${lostItem._id}')"><i class="fas fa-envelope"></i> Contact Owner</button>
                            </div>
                        </div>
                        <div class="match-card">
                            <h4><i class="fas fa-check-circle"></i> Found Item</h4>
                            <div class="match-details">
                                <p><strong>Item:</strong> ${foundItem.itemName}</p>
                                <p><strong>Type:</strong> ${foundItem.type.replace('-', ' ')}</p>
                                <p><strong>Found on:</strong> ${formatDate(foundItem.date)}</p>
                                <p><strong>Location:</strong> ${foundItem.location}</p>
                                <p><strong>Description:</strong> ${foundItem.description || 'No description'}</p>
                                <button class="btn btn-small btn-primary" onclick="showContactInfo('${foundItem._id}')"><i class="fas fa-envelope"></i> Contact Finder</button>
                            </div>
                        </div>
                    </div>
                    <div class="match-footer" style="padding: 1rem; background: #f8f9fa; border-top: 1px solid #e9ecef;">
                        <p style="margin:0;font-size:0.9rem;color:#666;"><strong>Match reasons:</strong> ${matchReasons.join(', ')}</p>
                    </div>`;
                matchesContainer.appendChild(matchPair);
            }
        });
    });

    if (!hasMatches) {
        matchesContainer.innerHTML = `<div class="no-matches"><i class="fas fa-search"></i><p>No potential matches found. Try adjusting your filters or check back later.</p></div>`;
    }
}

function checkForNewMatches() {
    if (Notification.permission !== 'granted') return;

    const lostItems = items.filter(i => i.status==='lost');
    const foundItems = items.filter(i => i.status==='found');
    let newMatches = [];
    const lastNotified = JSON.parse(localStorage.getItem('lastNotifiedMatch') || '{}');

    lostItems.forEach(lostItem => {
        const lostId = lostItem._id || lostItem.id;
        if (lastNotified[lostId]) return;

        foundItems.forEach(foundItem => {
            if (lostItem.type !== foundItem.type) return;
            let score = 0;
            const matchReasons = [];

            if (lostItem.type === foundItem.type) { score += 40; matchReasons.push('Same item type'); }
            if (lostItem.itemName && foundItem.itemName) {
                if (lostItem.itemName.toLowerCase() === foundItem.itemName.toLowerCase()) score += 30;
                else if (lostItem.itemName.toLowerCase().includes(foundItem.itemName.toLowerCase()) || foundItem.itemName.toLowerCase().includes(lostItem.itemName.toLowerCase())) score += 20;
            }

            if (score >= 40) {
                newMatches.push({ lost: lostItem, found: foundItem, score, matchReasons });
                if (!lastNotified[lostId]) lastNotified[lostId] = [];
                lastNotified[lostId].push(foundItem._id || foundItem.id);
            }
        });
    });

    localStorage.setItem('lastNotifiedMatch', JSON.stringify(lastNotified));
    newMatches.forEach(match => showMatchNotification(match));
}

function showMatchNotification(match) {
    const { lost, found, score } = match;
    const lostId = lost._id || lost.id;
    const foundId = found._id || found.id;
    const notificationText = `We found a possible match for your ${lost.itemName} (${Math.min(95, score)}% match)`;

    if (Notification.permission === 'granted') {
        const notification = new Notification('Potential Match Found!', { body: notificationText, icon: '/images/logo.png', tag: `match-${lostId}-${foundId}` });
        notification.onclick = () => { window.focus(); showSection('matches'); };
    }

    showInAppNotification(notificationText);
    updateNotificationCounter(1);
}

function showInAppNotification(message) {
    const banner = document.getElementById('notificationBanner');
    const messageElement = document.getElementById('notificationMessage');
    if (banner && messageElement) {
        messageElement.textContent = message;
        banner.style.display = 'block';
        setTimeout(() => { banner.style.display = 'none'; }, 10000);
    }
}

function updateNotificationCounter(change = 0) {
    const counter = document.querySelector('.notification-badge');
    if (!counter) return;
    let count = parseInt(counter.textContent) || 0;
    count = Math.max(0, count + change);
    counter.textContent = count;
    counter.style.display = count > 0 ? 'flex' : 'none';
    localStorage.setItem('notificationCount', count);
}

function initNotificationCounter() {
    const count = parseInt(localStorage.getItem('notificationCount')) || 0;
    updateNotificationCounter(0);
}
document.addEventListener('DOMContentLoaded', () => {
    const notificationBell = document.querySelector('.nav-notification .nav-link');
    if (notificationBell) notificationBell.addEventListener('click', () => updateNotificationCounter(-Infinity));

    initNotificationCounter();
    searchItems();

    ['searchQuery','filterType','filterStatus','filterDate'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', searchItems);
        if (id==='searchQuery') el.addEventListener('keyup', e=>{ if(e.key==='Enter') searchItems(); });
    });
});
const notificationBell = document.querySelector('.nav-notification .nav-link');
if (notificationBell) {
    notificationBell.addEventListener('click', e => {
        e.preventDefault(); 

        updateNotificationCounter(-Infinity);

        showInAppNotification("You clicked the notification bell!");
    });
}

window.addEventListener('hashchange', ()=>{ showSection(window.location.hash.substring(1) || 'home'); });
document.addEventListener('keypress', e => { if(e.target.id==='searchQuery' && e.key==='Enter') searchItems(); });
document.addEventListener('change', e => { if(e.target.matches('#filterType,#filterStatus,#filterDate')) searchItems(); });
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
