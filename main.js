// Sample leaderboard data
const leaderboardData = [
    { position: 1, name: 'VEESHAL BODOSA', votes: 100000 },
    { position: 2, name: 'RIPUN BASUMATARY', votes: 80000 },
    { position: 3, name: 'HIMDIP NARZARY', votes: 70000 },
    { position: 4, name: 'PLAYER 4', votes: 60000 },
    { position: 5, name: 'PLAYER 5', votes: 50000 },
    { position: 6, name: 'PLAYER 6', votes: 40000 },
    { position: 7, name: 'PLAYER 7', votes: 30000 },
    { position: 8, name: 'PLAYER 8', votes: 20000 },
    { position: 9, name: 'PLAYER 9', votes: 10000 },
];

// Confetti control variables
let confettiInterval;
let isConfettiRunning = false;

// Function to format votes with commas
function formatVotes(votes) {
    return votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to get ordinal suffix
function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// Function to animate vote counting with callback
function animateVoteCount(element, start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = formatVotes(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (callback) callback();
        }
    };
    window.requestAnimationFrame(step);
}

// Function to start continuous confetti
function startContinuousConfetti() {
    if (isConfettiRunning) return;
    
    isConfettiRunning = true;
    const colors = ['#FFD700', '#FFEA00', '#D4AF37', '#C94B6D', '#F5E6D3', '#4a2d8f'];
    
    function createConfetti() {
        if (!isConfettiRunning) return;
        
        // Create confetti from different positions
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.8 },
            colors: colors,
            gravity: 0.8,
            scalar: 1.2,
            zIndex: 1000
        });
        
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.8 },
            colors: colors,
            gravity: 0.8,
            scalar: 1.2,
            zIndex: 1000
        });
        
        // Center confetti
        confetti({
            particleCount: 2,
            angle: 90,
            spread: 120,
            origin: { x: 0.5, y: 0 },
            colors: colors,
            gravity: 0.8,
            scalar: 1.2,
            zIndex: 1000
        });
        
        // Continue creating confetti
        confettiInterval = setTimeout(createConfetti, 300);
    }
    
    createConfetti();
}

// Function to stop continuous confetti
function stopContinuousConfetti() {
    isConfettiRunning = false;
    if (confettiInterval) {
        clearTimeout(confettiInterval);
        confettiInterval = null;
    }
}

// Function to reveal player info sequentially
function revealPlayerInfo() {
    // Get all ranking items
    const leftColumnItems = document.querySelectorAll('.rankings-column.left .ranking-item');
    const rightColumnItems = document.querySelectorAll('.rankings-column.right .ranking-item');
    
    // Combine items in the correct order (4th, 5th, 6th in left column, 7th, 8th, 9th in right column)
    const rankingItems = [...leftColumnItems, ...rightColumnItems];
    
    // Function to reveal items sequentially
    function revealNext(index) {
        if (index < rankingItems.length) {
            const element = rankingItems[rankingItems.length - 1 - index]; // Reverse order for reveal
            const dataIndex = 8 - index; // 9th position (index 8) to 4th position (index 3)
            
            if (dataIndex >= 3 && dataIndex <= 8 && element) {
                const data = leaderboardData[dataIndex];
                if (data) {
                    const nameElement = element.querySelector('.rank-name');
                    const votesElement = element.querySelector('.rank-votes');
                    const positionElement = element.querySelector('.rank-position');
                    
                    if (nameElement) nameElement.textContent = data.name;
                    if (positionElement) positionElement.textContent = data.position + getOrdinalSuffix(data.position);
                    
                    // Animate vote count and reveal next item when finished
                    if (votesElement) {
                        animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                            revealNext(index + 1);
                        });
                    } else {
                        revealNext(index + 1);
                    }
                } else {
                    revealNext(index + 1);
                }
            } else {
                revealNext(index + 1);
            }
        } else {
            // After revealing positions 9-4, reveal podium positions 3rd, 2nd, 1st
            revealPodiumPositions();
        }
    }
    
    // Start revealing from the first item (9th position)
    revealNext(0);
}

// Function to reveal podium positions sequentially
function revealPodiumPositions() {
    // Reveal 3rd place
    setTimeout(() => {
        const thirdPlace = document.querySelector('.third-place');
        const data = leaderboardData[2]; // 3rd place data
        if (thirdPlace && data) {
            const nameElement = thirdPlace.querySelector('.player-name');
            const votesElement = thirdPlace.querySelector('.player-votes');
            
            if (nameElement) nameElement.textContent = data.name;
            
            // Animate vote count and reveal next podium position when finished
            if (votesElement) {
                animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                    // Reveal 2nd place
                    setTimeout(() => {
                        const secondPlace = document.querySelector('.second-place');
                        const data2 = leaderboardData[1]; // 2nd place data
                        if (secondPlace && data2) {
                            const nameElement2 = secondPlace.querySelector('.player-name');
                            const votesElement2 = secondPlace.querySelector('.player-votes');
                            
                            if (nameElement2) nameElement2.textContent = data2.name;
                            
                            // Animate vote count and reveal next podium position when finished
                            if (votesElement2) {
                                animateVoteCount(votesElement2, 0, data2.votes, 2000, () => {
                                    // Reveal 1st place
                                    setTimeout(() => {
                                        const firstPlace = document.querySelector('.first-place');
                                        const data1 = leaderboardData[0]; // 1st place data
                                        if (firstPlace && data1) {
                                            const nameElement1 = firstPlace.querySelector('.player-name');
                                            const votesElement1 = firstPlace.querySelector('.player-votes');
                                            
                                            if (nameElement1) nameElement1.textContent = data1.name;
                                            
                                            // Animate vote count for 1st place and stop confetti when finished
                                            if (votesElement1) {
                                                animateVoteCount(votesElement1, 0, data1.votes, 2000, () => {
                                                    // Stop confetti when 1st place animation is complete
                                                    stopContinuousConfetti();
                                                });
                                            } else {
                                                // Stop confetti if there's no vote animation
                                                stopContinuousConfetti();
                                            }
                                        } else {
                                            // Stop confetti if 1st place element not found
                                            stopContinuousConfetti();
                                        }
                                    }, 500); // Small delay before revealing 1st place
                                });
                            } else {
                                // If no vote animation for 2nd place, check if we should stop confetti
                                setTimeout(() => {
                                    stopContinuousConfetti();
                                }, 2500); // Wait for potential 1st place animation
                            }
                        }
                    }, 500); // Small delay before revealing 2nd place
                });
            } else {
                // If no vote animation for 3rd place, check if we should stop confetti
                setTimeout(() => {
                    stopContinuousConfetti();
                }, 5000); // Wait for potential 2nd and 1st place animations
            }
        }
    }, 500); // Small delay before revealing 3rd place
}

// Initialize leaderboard with data
function initializeLeaderboard() {
    // Initially hide all player info
    document.querySelectorAll('.player-name, .player-votes, .rank-name, .rank-votes, .rank-position').forEach(element => {
        element.textContent = '';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLeaderboard();
    
    // Trigger podium animations after a short delay
    setTimeout(() => {
        const podiumItems = document.querySelectorAll('.podium-item');
        podiumItems.forEach(item => {
            item.style.opacity = '1';
        });
        
        // Start continuous confetti
        startContinuousConfetti();
        
        // Start revealing player info from last to first
        setTimeout(() => {
            revealPlayerInfo();
        }, 1000);
    }, 50);
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.ranking-item').forEach(item => {
        observer.observe(item);
    });
});

// Confetti animation function (kept for backward compatibility)
function launchConfetti() {
    // This function is now replaced by continuous confetti
    startContinuousConfetti();
}