// Global variables
let currentTab = 'lost';
let items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Reset and reload sample data
function resetSampleData() {
    if (confirm('Are you sure you want to reset all data and reload sample items?')) {
        localStorage.removeItem('lostFoundItems');
        items = [];
        loadSampleData();
        showSection('search');
        searchItems();
    }
}

// Initialize the application
function initializeApp() {
    setupNavigation();
    setupFormHandling();
    setupDateDefaults();
    loadSampleData();
    
    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
    
    // Initialize notification counter
    initNotificationCounter();
    
    // Check for new matches periodically
    setInterval(checkForNewMatches, 300000); // Check every 5 minutes
    
    // Show home section by default
    showSection('home');
    
    // Add reset button for development
    const header = document.querySelector('header');
    if (header) {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Data';
        resetBtn.style.position = 'fixed';
        resetBtn.style.top = '10px';  
        resetBtn.style.right = '10px';
        resetBtn.style.zIndex = '1000';
        resetBtn.style.padding = '5px 10px';
        resetBtn.style.backgroundColor = '#ff6b9d';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.onclick = resetSampleData;
        header.appendChild(resetBtn);
    }
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections and the hero
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide hero by default (it will be shown only for home section)
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.display = 'none';
    }
    
    // If home section is requested, show the hero and return
    if (sectionId === 'home') {
        if (hero) {
            hero.style.display = 'block';
        }
        // Update URL hash
        window.location.hash = '';
        return;
    }
    
    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Update URL hash
        window.location.hash = sectionId;
        
        // If showing search section, refresh results
        if (sectionId === 'search') {
            displaySearchResults();
        }
        // If showing matches section, find potential matches
        else if (sectionId === 'matches') {
            findPotentialMatches();
        }
    } else {
        // Default to home if section not found
        showSection('home');
    }
}

// Tab switching for lost/found
function switchTab(tabType) {
    currentTab = tabType;
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update form title and submit button text
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

// Form handling
function setupFormHandling() {
    const form = document.getElementById('reportForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('reportForm'));
    
    // Create item object
    const item = {
        id: Date.now().toString(),
        status: currentTab,
        type: formData.get('itemType'),
        name: formData.get('itemName'),
        location: formData.get('location'),
        date: formData.get('date'),
        description: formData.get('description'),
        contactName: formData.get('contactName'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone') || 'Not provided',
        dateReported: new Date().toLocaleDateString()
    };

    // Validate required fields
    if (!item.type || !item.name || !item.location || !item.date || !item.contactName || !item.contactEmail) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Add to items array
    items.push(item);
    
    // Save to localStorage
    localStorage.setItem('lostFoundItems', JSON.stringify(items));
    
    // Show success message
    showMessage(`${currentTab === 'lost' ? 'Lost' : 'Found'} item reported successfully!`, 'success');
    
    // Reset form
    document.getElementById('reportForm').reset();
    
    // Refresh search results
    displaySearchResults();
    
    // Scroll to top of form
    document.getElementById('report').scrollIntoView({ behavior: 'smooth' });
}

// Show success/error messages
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the form
    const form = document.getElementById('reportForm');
    form.insertBefore(message, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Search functionality
function searchItems() {
    const query = document.getElementById('searchQuery')?.value?.toLowerCase() || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const dateFilter = document.getElementById('filterDate')?.value || '';
    
    try {
        const savedItems = localStorage.getItem('lostFoundItems');
        const allItems = savedItems ? JSON.parse(savedItems) : [];
        
        if (!Array.isArray(allItems)) {
            console.error('Invalid data in localStorage');
            displaySearchResults([]);
            return;
        }
        
        const filteredItems = allItems.filter(item => {
            if (!item) return false;
            
            const matchesQuery = !query || 
                (item.name && item.name.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query));
                
            const matchesType = !typeFilter || item.type === typeFilter;
            const matchesStatus = !statusFilter || item.status === statusFilter;
            const matchesDate = !dateFilter || item.date === dateFilter;
            
            return matchesQuery && matchesType && matchesStatus && matchesDate;
        });
        
        displaySearchResults(filteredItems);
    } catch (error) {
        console.error('Error searching items:', error);
        displaySearchResults([]);
    }
}

// Display search results
function displaySearchResults(itemsToShow = []) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (!itemsToShow || itemsToShow.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-search"></i>
                <h3>No Items Found</h3>
                <p>We couldn't find any items matching your search criteria.</p>
            </div>`;
        return;
    }
    
    resultsContainer.innerHTML = itemsToShow.map(item => `
        <div class="item-card">
            <div class="item-header">
                <h3>
                    <i class="fas fa-${getIconForType(item.type)}"></i>
                    ${item.name || 'Unnamed Item'}
                </h3>
                <span class="item-status ${item.status === 'lost' ? 'status-lost' : 'status-found'}">
                    ${item.status === 'lost' ? 'Lost' : 'Found'}
                </span>
            </div>
            <div class="item-details">
                <p><strong>Type:</strong> ${formatItemType(item.type)}</p>
                <p><strong>Date:</strong> ${formatDate(item.date) || 'Unknown'}</p>
                ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                <button class="contact-btn" onclick="showContactInfo('${item.id}')">
                    <i class="fas fa-envelope"></i> Contact ${item.status === 'lost' ? 'Finder' : 'Owner'}
                </button>
            </div>
        </div>
    `).join('');
}

// Get appropriate icon for item type
function getIconForType(type) {
    const icons = {
        'student-id': 'id-card',
        'national-id': 'id-card',
        'book': 'book',
        'electronics': 'laptop',
        'clothing': 'tshirt',
        'keys': 'key',
        'wallet': 'wallet',
        'other': 'question-circle'
    };
    return icons[type] || 'search';
}

// Format item type for display
function formatItemType(type) {
    if (!type) return 'Other';
    return type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Show contact information
function showContactInfo(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const contactInfo = `
        Contact Information for "${item.name}":
        
        Name: ${item.contactName}
        Email: ${item.contactEmail}
        Phone: ${item.contactPhone}
        
        Please be respectful when contacting about lost/found items.
    `;
    
    alert(contactInfo);
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Set default date to today
function setupDateDefaults() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// Load sample data for demonstration
function loadSampleData() {
    // Only load sample data if no items exist
    const existingItems = localStorage.getItem('lostFoundItems');
    if (existingItems && JSON.parse(existingItems).length > 0) {
        return; // Don't load sample data if items already exist
    }
    
    const sampleItems = [
        // A matching pair - Lost item
        {
            id: 'lost1-' + Date.now(),
            status: 'lost',
            type: 'student-id',
            name: 'Student ID Card',
            location: 'Library, 3rd floor',
            date: '2025-07-14',
            description: 'Lost my student ID card. Name: John Mwangi, ID: 2025-7890. Last seen at the library computer lab.',
            contactName: 'John Mwangi',
            contactEmail: 'john.mwangi@students.bright.edu',
            contactPhone: '+254 707 123 456',
            dateReported: '7/14/2025'
        },
        // The matching found item
        {
            id: 'found1-' + Date.now(),
            status: 'found',
            type: 'student-id',
            name: 'Student ID Card',
            location: 'Library, 3rd floor study area',
            date: '2025-07-15',
            description: 'Found a student ID card near the computer terminals. Name: John Mwangi, ID: 2025-7890.',
            contactName: 'Library Staff',
            contactEmail: 'library@bright.edu',
            contactPhone: '+254 707 141 003',
            dateReported: '7/15/2025'
        },
        // Additional sample items
        {
            id: 'found2-' + Date.now(),
            status: 'found',
            type: 'books',
            name: 'Finance Textbook - Corporate Finance',
            location: 'Cafeteria, table near the windows',
            date: '2025-07-14',
            description: 'Corporate Finance textbook by Ross, Westerfield & Jaffe. Has highlighter marks and sticky notes.',
            contactName: 'Cafeteria Manager',
            contactEmail: 'cafeteria@bright.edu',
            contactPhone: '+254 707 987 654',
            dateReported: '7/14/2025'
        },
            {
                id: 'lost2-' + Date.now(),
                status: 'lost',
                type: 'electronics',
                name: 'iPhone 14 Pro',
                location: 'Library, computer lab area',
                date: '2025-07-11',
                description: 'Black iPhone 14 Pro with blue case. Has university stickers on the back.',
                contactName: 'Emma Davis',
                contactEmail: 'emma.davis@bright.edu',
                contactPhone: '+254 707 456 789',
                dateReported: '7/11/2025'
            },
            // More sample items
            {
                id: 'found3-' + Date.now(),
                status: 'found',
                type: 'national-id',
                name: 'National ID Card',
                location: 'Student Center, near the food court',
                date: '2025-07-16',
                description: 'Found a national ID card on the table. Name: Sarah Johnson, DOB: 15/03/2000',
                contactName: 'Security Desk',
                contactEmail: 'security@bright.edu',
                contactPhone: '+254 707 111 222',
                dateReported: '7/16/2025'
            },
            {
                id: 'lost3-' + Date.now(),
                status: 'lost',
                type: 'books',
                name: 'Calculus Textbook',
                location: 'Math Building, Room 203',
                date: '2025-07-13',
                description: 'Lost my Calculus textbook. It has my name "David Kim" written on the inside cover.',
                contactName: 'David Kim',
                contactEmail: 'david.kim@bright.edu',
                contactPhone: '+254 707 333 444',
                dateReported: '7/13/2025'
            }
        ];
        
        // Save to localStorage and update the global items array
        items = sampleItems;
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
        console.log('Sample data loaded successfully');
}

// Find potential matches between lost and found items
function findPotentialMatches() {
    const typeFilter = document.getElementById('matchType').value;
    const lostItems = items.filter(item => item.status === 'lost');
    const foundItems = items.filter(item => item.status === 'found');
    
    const matchesContainer = document.getElementById('matchesContainer');
    matchesContainer.innerHTML = '';
    
    let hasMatches = false;
    
    // Check each lost item against all found items
    lostItems.forEach(lostItem => {
        foundItems.forEach(foundItem => {
            // Skip if type filter doesn't match
            if (typeFilter && lostItem.type !== typeFilter) return;
            
            // Calculate match score based on different criteria
            let score = 0;
            const matchReasons = [];
            
            // Check item type match
            if (lostItem.type === foundItem.type) {
                score += 40;
                matchReasons.push('Same item type');
            }
            
            // Check name similarity (basic check)
            if (lostItem.name.toLowerCase() === foundItem.name.toLowerCase()) {
                score += 30;
                matchReasons.push('Matching item name');
            } else if (lostItem.name.toLowerCase().includes(foundItem.name.toLowerCase()) || 
                      foundItem.name.toLowerCase().includes(lostItem.name.toLowerCase())) {
                score += 20;
                matchReasons.push('Similar item name');
            }
            
            // Check location similarity (basic check)
            if (lostItem.location.toLowerCase() === foundItem.location.toLowerCase()) {
                score += 20;
                matchReasons.push('Same location');
            } else if (lostItem.location.toLowerCase().includes('library') && 
                      foundItem.location.toLowerCase().includes('library')) {
                score += 10;
                matchReasons.push('Same general area (library)');
            }
            
            // Check date proximity (within 7 days)
            const lostDate = new Date(lostItem.date);
            const foundDate = new Date(foundItem.date);
            const timeDiff = Math.abs(foundDate.getTime() - lostDate.getTime());
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (dayDiff <= 7) {
                score += 10;
                matchReasons.push('Reported within 7 days');
            }
            
            // If we have a good enough match (at least 40%)
            if (score >= 40) {
                hasMatches = true;
                
                // Create match pair element
                const matchPair = document.createElement('div');
                matchPair.className = 'match-pair';
                
                // Calculate confidence percentage (capped at 95% for manual verification)
                const confidence = Math.min(95, score);
                
                matchPair.innerHTML = `
                    <div class="match-header">
                        <h3>Potential Match Found</h3>
                        <span class="match-confidence">${confidence}% Confidence</span>
                    </div>
                    <div class="match-cards">
                        <div class="match-card">
                            <h4><i class="fas fa-search"></i> Lost Item</h4>
                            <div class="match-details">
                                <p><strong>Item:</strong> ${lostItem.name}</p>
                                <p><strong>Type:</strong> ${lostItem.type.replace('-', ' ')}</p>
                                <p><strong>Lost on:</strong> ${formatDate(lostItem.date)}</p>
                                <p><strong>Location:</strong> ${lostItem.location}</p>
                                <p><strong>Description:</strong> ${lostItem.description}</p>
                                <button class="btn btn-small btn-primary" onclick="showContactInfo('${foundItem.id}')">
                                    <i class="fas fa-envelope"></i> Contact Finder
                                </button>
                            </div>
                        </div>
                        <div class="match-card">
                            <h4><i class="fas fa-check-circle"></i> Found Item</h4>
                            <div class="match-details">
                                <p><strong>Item:</strong> ${foundItem.name}</p>
                                <p><strong>Type:</strong> ${foundItem.type.replace('-', ' ')}</p>
                                <p><strong>Found on:</strong> ${formatDate(foundItem.date)}</p>
                                <p><strong>Location:</strong> ${foundItem.location}</p>
                                <p><strong>Description:</strong> ${foundItem.description}</p>
                                <button class="btn btn-small btn-primary" onclick="showContactInfo('${foundItem.id}')">
                                    <i class="fas fa-envelope"></i> Contact Finder
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="match-footer" style="padding: 1rem; background: #f8f9fa; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">
                            <strong>Match reasons:</strong> ${matchReasons.join(', ')}
                        </p>
                    </div>
                `;
                
                matchesContainer.appendChild(matchPair);
            }
        });
    });
    
    // Show message if no matches found
    if (!hasMatches) {
        matchesContainer.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-search"></i>
                <p>No potential matches found. Try adjusting your filters or check back later.</p>
            </div>
        `;
    }
}

// Check for new matches and show notifications
function checkForNewMatches() {
    // Only proceed if we have permission
    if (Notification.permission !== 'granted') return;
    
    const lostItems = items.filter(item => item.status === 'lost');
    const foundItems = items.filter(item => item.status === 'found');
    let newMatches = [];
    
    // Simple check to avoid notifying about the same matches
    const lastNotifiedMatch = localStorage.getItem('lastNotifiedMatch') || '{}';
    const lastNotified = JSON.parse(lastNotifiedMatch);
    
    lostItems.forEach(lostItem => {
        // Skip if we've already notified about this item
        if (lastNotified[lostItem.id]) return;
        
        foundItems.forEach(foundItem => {
            // Skip if types don't match
            if (lostItem.type !== foundItem.type) return;
            
            // Simple matching logic (same as before)
            let score = 0;
            if (lostItem.type === foundItem.type) score += 40;
            if (lostItem.name.toLowerCase() === foundItem.name.toLowerCase()) score += 30;
            
            // If we have a good match
            if (score >= 40) {
                newMatches.push({
                    lost: lostItem,
                    found: foundItem,
                    score: score
                });
                
                // Mark as notified
                if (!lastNotified[lostItem.id]) {
                    lastNotified[lostItem.id] = [];
                }
                lastNotified[lostItem.id].push(foundItem.id);
            }
        });
    });
    
    // Save the notification state
    localStorage.setItem('lastNotifiedMatch', JSON.stringify(lastNotified));
    
    // Show notifications for new matches
    newMatches.forEach(match => {
        showMatchNotification(match);
    });
}

// Show a browser notification for a match
function showMatchNotification(match) {
    const { lost, found, score } = match;
    const notificationText = `We found a possible match for your ${lost.name} (${Math.min(95, score)}% match)`;
    
    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
        const notification = new Notification('Potential Match Found!', {
            body: notificationText,
            icon: '/images/logo.png', // Add a logo image to your project
            tag: `match-${lost.id}-${found.id}`
        });
        
        // When notification is clicked, show the matches page
        notification.onclick = () => {
            window.focus();
            showSection('matches');
        };
    }
    
    // Show in-app notification banner
    showInAppNotification(notificationText);
    
    // Update notification counter
    updateNotificationCounter(1);
}

// Show in-app notification banner
function showInAppNotification(message) {
    const banner = document.getElementById('notificationBanner');
    const messageElement = document.getElementById('notificationMessage');
    
    if (banner && messageElement) {
        messageElement.textContent = message;
        banner.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            banner.style.display = 'none';
        }, 10000);
    }
}

// Update notification counter in the navigation
function updateNotificationCounter(change = 0) {
    const counter = document.querySelector('.notification-badge');
    if (!counter) return;
    
    let count = parseInt(counter.textContent) || 0;
    count = Math.max(0, count + change);
    counter.textContent = count;
    
    // Show/hide counter
    counter.style.display = count > 0 ? 'flex' : 'none';
    
    // Store the count in localStorage
    localStorage.setItem('notificationCount', count);
}

// Initialize notification counter from localStorage
function initNotificationCounter() {
    const count = parseInt(localStorage.getItem('notificationCount')) || 0;
    updateNotificationCounter(0); // This will set the initial count
}

// Reset notification counter when user clicks on the bell icon
document.addEventListener('DOMContentLoaded', () => {
    const notificationBell = document.querySelector('.nav-notification .nav-link');
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            updateNotificationCounter(-Infinity); // Reset counter to 0
        });
    }
    
    // Initialize counter
    initNotificationCounter();
    
    // Initialize search when page loads
    searchItems();
    
    // Add event listeners for search filters
    const searchInputs = ['searchQuery', 'filterType', 'filterStatus', 'filterDate'];
    searchInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', searchItems);
            if (id === 'searchQuery') {
                element.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') searchItems();
                });
            }
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        showSection('home');
    }
});

// Search on Enter key
document.addEventListener('keypress', function(e) {
    if (e.target.id === 'searchQuery' && e.key === 'Enter') {
        searchItems();
    }
});

// Auto-search when filters change
document.addEventListener('change', function(e) {
    if (e.target.matches('#filterType, #filterStatus, #filterDate')) {
        searchItems();
    }
});