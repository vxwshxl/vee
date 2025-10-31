// Initialize with empty data structures
let portfolioData = {};
let portfolios = [];
let currentPortfolioIndex = 0;

// Confetti control variables
let confettiInterval;
let isConfettiRunning = false;

// Reveal state
let isRevealed = false;

// Function to fetch data from PHP
async function fetchData() {
    try {
        const response = await fetch('counting.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the response was successful
        if (data.success) {
            // Filter portfolios to only include those with at least 2 candidates
            const filteredPortfolios = [];
            const filteredPortfolioData = {};
            
            for (const portfolio of data.portfolios) {
                const candidates = data.portfolioData[portfolio];
                if (candidates && candidates.length >= 2) {
                    filteredPortfolios.push(portfolio);
                    filteredPortfolioData[portfolio] = candidates;
                } else {
                    console.warn(`Portfolio "${portfolio}" excluded: has ${candidates ? candidates.length : 0} candidates (minimum 2 required)`);
                }
            }
            
            // Update global variables with filtered data
            portfolioData = filteredPortfolioData;
            portfolios = filteredPortfolios;
            
            // Validate we have data
            if (!portfolios || portfolios.length === 0) {
                console.warn('No valid portfolios found in response, using sample data');
                useSampleData();
            }
        } else {
            console.error('API returned error:', data.error);
            useSampleData();
        }
        
        // Initialize the leaderboard with the fetched data
        initializeLeaderboard();
    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to sample data if fetch fails
        useSampleData();
        initializeLeaderboard();
    }
}

// Sample leaderboard data for each portfolio (fallback)
function useSampleData() {
    portfolioData = {
        "VICE PRESIDENT": [
            { position: 1, name: 'VEESHAL BODOSA', votes: 2000 },
            { position: 2, name: 'RIPUN BASUMATARY', votes: 1800 },
            { position: 3, name: 'HIMDIP NARZARY', votes: 1600 },
            { position: 4, name: 'ALEX JOHNSON', votes: 1400 },
            { position: 5, name: 'MARIA GARCIA', votes: 1200 },
            { position: 6, name: 'JAMES WILSON', votes: 1000 },
            { position: 7, name: 'SARAH MILLER', votes: 800 },
            { position: 8, name: 'ROBERT BROWN', votes: 600 },
            { position: 9, name: 'JENNY DAVIS', votes: 400 },
        ],
        "GENERAL SECRETARY": [
            { position: 1, name: 'JOHN SMITH', votes: 1900 },
            { position: 2, name: 'EMMA WATSON', votes: 1750 },
            { position: 3, name: 'MICHAEL JOHNSON', votes: 1550 },
            { position: 4, name: 'SOPHIA WILLIAMS', votes: 1350 },
            { position: 5, name: 'DAVID BROWN', votes: 1150 },
            { position: 6, name: 'OLIVIA DAVIS', votes: 950 },
            { position: 7, name: 'JAMES MILLER', votes: 750 },
            { position: 8, name: 'AVA WILSON', votes: 550 },
            { position: 9, name: 'WILLIAM TAYLOR', votes: 350 },
        ]
    };
    
    portfolios = [
        "VICE PRESIDENT",
        "GENERAL SECRETARY"
    ];
}

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

// Function to animate avatar fade-in
function animateAvatarFadeIn(element, callback) {
    element.style.opacity = '0';
    element.offsetHeight;
    element.style.transition = 'opacity 1s ease-in-out';
    element.style.opacity = '1';
    
    setTimeout(() => {
        if (callback) callback();
    }, 1000);
}

// Function to reveal player info sequentially
function revealPlayerInfo() {
    const currentData = getCurrentPortfolioData();
    
    // Check if we have at least 2 candidates
    if (!currentData || currentData.length < 2) {
        console.warn('Not enough data to reveal (minimum 2 candidates required)');
        stopContinuousConfetti();
        return;
    }
    
    const leftColumnItems = document.querySelectorAll('.rankings-column.left .ranking-item');
    const rightColumnItems = document.querySelectorAll('.rankings-column.right .ranking-item');
    const rankingItems = [...leftColumnItems, ...rightColumnItems];
    
    // Calculate how many items to reveal (positions beyond top 3)
    // If we have less than 3 candidates, skip to podium reveal
    if (currentData.length <= 3) {
        revealPodiumPositions();
        return;
    }
    
    const itemsToReveal = Math.min(currentData.length - 3, rankingItems.length);
    
    function revealNext(index) {
        if (index < itemsToReveal) {
            const element = rankingItems[itemsToReveal - 1 - index];
            const dataIndex = currentData.length - 1 - index;
            
            if (dataIndex >= 3 && element) {
                const data = currentData[dataIndex];
                if (data) {
                    const nameElement = element.querySelector('.rank-name');
                    const votesElement = element.querySelector('.rank-votes');
                    const avatarElement = element.querySelector('.rank-avatar');
                    const positionElement = element.querySelector('.rank-position');
                    
                    if (nameElement) nameElement.textContent = data.name;
                    
                    if (positionElement) {
                        positionElement.textContent = '';
                        positionElement.classList.add('hidden');
                    }
                    
                    if (avatarElement) {
                        animateAvatarFadeIn(avatarElement, () => {
                            if (votesElement) {
                                animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                                    revealNext(index + 1);
                                });
                            } else {
                                revealNext(index + 1);
                            }
                        });
                    } else {
                        if (votesElement) {
                            animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                                revealNext(index + 1);
                            });
                        } else {
                            revealNext(index + 1);
                        }
                    }
                } else {
                    revealNext(index + 1);
                }
            } else {
                revealNext(index + 1);
            }
        } else {
            revealPodiumPositions();
        }
    }
    
    revealNext(0);
}

// Function to reveal podium positions sequentially
function revealPodiumPositions() {
    const currentData = getCurrentPortfolioData();
    
    if (!currentData || currentData.length < 2) {
        stopContinuousConfetti();
        return;
    }
    
    // Check how many podium positions we have
    const hasThirdPlace = currentData.length >= 3;
    const hasSecondPlace = currentData.length >= 2;
    
    // Start revealing based on available positions
    if (hasThirdPlace) {
        // Reveal 3rd place
        setTimeout(() => {
            const thirdPlace = document.querySelector('.third-place');
            const data = currentData[2];
            
            if (thirdPlace && data) {
                const nameElement = thirdPlace.querySelector('.player-name');
                const votesElement = thirdPlace.querySelector('.player-votes');
                const avatarElement = thirdPlace.querySelector('.avatar');
                
                if (nameElement) nameElement.textContent = data.name;
                
                if (avatarElement) {
                    animateAvatarFadeIn(avatarElement, () => {
                        if (votesElement) {
                            animateVoteCount(votesElement, 0, data.votes, 2000, revealSecondPlace);
                        } else {
                            revealSecondPlace();
                        }
                    });
                } else {
                    if (votesElement) {
                        animateVoteCount(votesElement, 0, data.votes, 2000, revealSecondPlace);
                    } else {
                        revealSecondPlace();
                    }
                }
            }
        }, 500);
    } else {
        // Skip directly to 2nd place
        revealSecondPlace();
    }
}

function revealSecondPlace() {
    const currentData = getCurrentPortfolioData();
    
    setTimeout(() => {
        const secondPlace = document.querySelector('.second-place');
        const data = currentData[1];
        
        if (secondPlace && data) {
            const nameElement = secondPlace.querySelector('.player-name');
            const votesElement = secondPlace.querySelector('.player-votes');
            const avatarElement = secondPlace.querySelector('.avatar');
            
            if (nameElement) nameElement.textContent = data.name;
            
            if (avatarElement) {
                animateAvatarFadeIn(avatarElement, () => {
                    if (votesElement) {
                        animateVoteCount(votesElement, 0, data.votes, 2000, revealFirstPlace);
                    } else {
                        revealFirstPlace();
                    }
                });
            } else {
                if (votesElement) {
                    animateVoteCount(votesElement, 0, data.votes, 2000, revealFirstPlace);
                } else {
                    revealFirstPlace();
                }
            }
        }
    }, 500);
}

function revealFirstPlace() {
    const currentData = getCurrentPortfolioData();
    
    setTimeout(() => {
        const firstPlace = document.querySelector('.first-place');
        const data = currentData[0];
        
        if (firstPlace && data) {
            const nameElement = firstPlace.querySelector('.player-name');
            const votesElement = firstPlace.querySelector('.player-votes');
            const avatarElement = firstPlace.querySelector('.avatar');
            
            if (nameElement) nameElement.textContent = data.name;
            
            if (avatarElement) {
                animateAvatarFadeIn(avatarElement, () => {
                    if (votesElement) {
                        animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                            stopContinuousConfetti();
                        });
                    } else {
                        stopContinuousConfetti();
                    }
                });
            } else {
                if (votesElement) {
                    animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                        stopContinuousConfetti();
                    });
                } else {
                    stopContinuousConfetti();
                }
            }
        } else {
            stopContinuousConfetti();
        }
    }, 500);
}

// Function to get current portfolio data
function getCurrentPortfolioData() {
    const currentPortfolio = portfolios[currentPortfolioIndex];
    return portfolioData[currentPortfolio] || [];
}

// Function to update portfolio title
function updatePortfolioTitle() {
    const titleElement = document.querySelector('.portfolio');
    if (titleElement) {
        titleElement.textContent = portfolios[currentPortfolioIndex] || 'PORTFOLIO';
    }
}

// Function to handle reveal button click
function handleReveal() {
    if (isRevealed) return;
    
    isRevealed = true;
    
    const revealButton = document.querySelector('.reveal-button');
    if (revealButton) {
        revealButton.textContent = 'REVEALED';
        revealButton.classList.add('revealed');
    }
    
    startContinuousConfetti();
    
    setTimeout(() => {
        revealPlayerInfo();
    }, 1000);
}

// Function to navigate to next portfolio with animation
function nextPortfolio() {
    const container = document.querySelector('.leaderboard-container');
    if (container) {
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolios.length;
            updatePortfolioTitle();
            initializeLeaderboard();
            
            container.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
                container.style.transform = 'translateX(0)';
            }, 50);
        }, 500);
    }
}

// Function to navigate to previous portfolio with animation
function prevPortfolio() {
    const container = document.querySelector('.leaderboard-container');
    if (container) {
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolios.length) % portfolios.length;
            updatePortfolioTitle();
            initializeLeaderboard();
            
            container.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease';
                container.style.transform = 'translateX(0)';
            }, 50);
        }, 500);
    }
}

// Initialize leaderboard with data
function initializeLeaderboard() {
    isRevealed = false;
    
    document.querySelectorAll('.player-name, .player-votes, .rank-name, .rank-votes').forEach(element => {
        element.textContent = '';
    });
    
    document.querySelectorAll('.avatar, .rank-avatar').forEach(element => {
        element.style.opacity = '0';
    });
    
    document.querySelectorAll('.rank-position').forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
    
    updatePortfolioTitle();
    
    const revealButton = document.querySelector('.reveal-button');
    if (revealButton) {
        revealButton.textContent = 'REVEAL';
        revealButton.classList.remove('revealed');
    }
    
    stopContinuousConfetti();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    
    setTimeout(() => {
        const podiumItems = document.querySelectorAll('.podium-item');
        podiumItems.forEach(item => {
            item.style.opacity = '1';
        });
    }, 50);
    
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
    
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const revealButton = document.querySelector('.reveal-button');
    
    if (leftArrow) {
        leftArrow.addEventListener('click', prevPortfolio);
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', nextPortfolio);
    }
    
    if (revealButton) {
        revealButton.addEventListener('click', handleReveal);
    }
});

function launchConfetti() {
    startContinuousConfetti();
}