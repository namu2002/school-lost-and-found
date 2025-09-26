document.addEventListener('DOMContentLoaded', () => {
    const challengesContainer = document.getElementById('challengesContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resetButton = document.getElementById('resetProgress');
    const shareButton = document.getElementById('shareProgress');

    // Prayer topics for each day
    const prayerTopics = [
        "Pray for confidence and self-acceptance",
        "Express gratitude for my physical health",
        "Pray for healing from insecurities",
        "Ask God to help me see myself as He sees me",
        "Reflect on the talents God has given me and give thanks",
        "Journal about three things I love about myself",
        "Take a 'me day' with prayer and journaling",
        "Pray for strength and love in friendships",
        "Ask God for guidance in romantic relationships",
        "Pray to be a source of kindness to others",
        "Pray for reconciliation in strained relationships",
        "Give thanks for my family and friends",
        "Ask for wisdom in building Christ-centered connections",
        "Write a thank you note for someone I love",
        "Pray to trust God's perfect timing",
        "Pray for open doors, recognition, and breakthrough",
        "Pray for patience and surrender my worries to God",
        "Pray for hope and forgiveness",
        "Pray for boldness, wisdom, and courage",
        "Pray for peace and strength in all circumstances",
        "Journal about a day when God was faithful to me",
        "Ask God to help me hear His voice clearly",
        "Pray for guidance in discovering my life's purpose",
        "Give thanks for my current season of life",
        "Pray for God's blessings over my work and education",
        "Pray for courage to step out of my comfort zone",
        "Journal about three things I'm grateful for this week",
        "Pray for a heart of worship and thanksgiving",
        "Seek God's will for my future plans",
        "Reflect on God's faithfulness this month and commit the next steps to Him"
    ];

    let completedDays = JSON.parse(localStorage.getItem('prayerChallengeCompletedDays')) || [];
    const totalDays = 30;

    // Initialize the app
    function init() {
        renderChallengeDays();
        updateProgress();
    }

    // Render all 30 days with prayer topics
    function renderChallengeDays() {
        challengesContainer.innerHTML = '';
        
        for (let day = 1; day <= totalDays; day++) {
            const isCompleted = completedDays.includes(day);
            const prayerTopic = prayerTopics[day - 1] || `Day ${day} Prayer`;
            
            const dayElement = document.createElement('div');
            dayElement.className = `day-card ${isCompleted ? 'completed' : ''}`;
            dayElement.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-prayer">${prayerTopic}</div>
                <i class="fas fa-check-circle checkmark"></i>
            `;
            
            dayElement.addEventListener('click', () => toggleDayCompletion(day));
            challengesContainer.appendChild(dayElement);
        }
    }

    // Toggle day completion
    function toggleDayCompletion(day) {
        const index = completedDays.indexOf(day);
        
        if (index === -1) {
            completedDays.push(day);
            completedDays.sort((a, b) => a - b);
            // Show a nice message when completing a day
            const prayerTopic = prayerTopics[day - 1];
            showNotification(`Day ${day} marked as complete: ${prayerTopic}`);
        } else {
            completedDays.splice(index, 1);
        }
        
        saveProgress();
        renderChallengeDays();
        updateProgress();
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }, 100);
    }

    // Update progress bar and text
    function updateProgress() {
        const completedCount = completedDays.length;
        const progressPercentage = (completedCount / totalDays) * 100;
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedCount}/${totalDays} days completed`;
        
        // Update share text
        const shareCompleted = document.getElementById('shareCompleted');
        if (shareCompleted) {
            shareCompleted.textContent = completedCount;
        }
    }

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem('prayerChallengeCompletedDays', JSON.stringify(completedDays));
    }

    // Reset all progress
    function resetProgress() {
        if (confirm('Are you sure you want to reset your prayer challenge progress? This cannot be undone.')) {
            completedDays = [];
            saveProgress();
            renderChallengeDays();
            updateProgress();
            showNotification('Your progress has been reset');
        }
    }

    // Share progress
    function shareProgress() {
        const completedCount = completedDays.length;
        const progressPercentage = Math.round((completedCount / totalDays) * 100);
        
        const shareText = `I've completed ${completedCount} out of ${totalDays} days (${progressPercentage}%) of the 30 Days Prayer Challenge! 🙏 #PrayerChallenge`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My 30 Days Prayer Challenge Progress',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareText + '\n' + window.location.href)
                .then(() => showNotification('Progress copied to clipboard!'))
                .catch(err => console.error('Failed to copy:', err));
        }
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #7b2cbf;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(123, 44, 191, 0.3);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        }
        .notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    resetButton.addEventListener('click', resetProgress);
    shareButton.addEventListener('click', shareProgress);

    // Initialize the app
    init();
});