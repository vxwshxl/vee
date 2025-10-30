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
        const response = await fetch('fetch_data.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update global variables with fetched data
        portfolioData = data.portfolioData;
        portfolios = data.portfolios;
        
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
        ],
        "ASSISTANT GENERAL SECRETARY": [
            { position: 1, name: 'DANIEL ANDERSON', votes: 1850 },
            { position: 2, name: 'ISABELLA THOMAS', votes: 1700 },
            { position: 3, name: 'MATTHEW JACKSON', votes: 1500 },
            { position: 4, name: 'MIA WHITE', votes: 1300 },
            { position: 5, name: 'ETHAN HARRIS', votes: 1100 },
            { position: 6, name: 'CHARLOTTE MARTIN', votes: 900 },
            { position: 7, name: 'ALEXANDER CLARK', votes: 700 },
            { position: 8, name: 'AMELIA LEWIS', votes: 500 },
            { position: 9, name: 'BENJAMIN WALKER', votes: 300 },
        ],
        "CULTURAL SECRETARY": [
            { position: 1, name: 'SOFIA GARCIA', votes: 1800 },
            { position: 2, name: 'LIAM MARTINEZ', votes: 1650 },
            { position: 3, name: 'HARPER LOPEZ', votes: 1450 },
            { position: 4, name: 'LUCAS GONZALEZ', votes: 1250 },
            { position: 5, name: 'EVELYN HERNANDEZ', votes: 1050 },
            { position: 6, name: 'JACK TORRES', votes: 850 },
            { position: 7, name: 'ABIGAIL RAMIREZ', votes: 650 },
            { position: 8, name: 'OWEN FLORES', votes: 450 },
            { position: 9, name: 'EMILY RIVERA', votes: 250 },
        ],
        "LITERARY SECRETARY": [
            { position: 1, name: 'LOGAN PHILLIPS', votes: 1750 },
            { position: 2, name: 'ELIZABETH TURNER', votes: 1600 },
            { position: 3, name: 'SEBASTIAN PARKER', votes: 1400 },
            { position: 4, name: 'VICTORIA COLLINS', votes: 1200 },
            { position: 5, name: 'JULIAN STUART', votes: 1000 },
            { position: 6, name: 'MADISON BUTLER', votes: 800 },
            { position: 7, name: 'LEVI SIMMONS', votes: 600 },
            { position: 8, name: 'ZOE FOSTER', votes: 400 },
            { position: 9, name: 'ADAM ROGERS', votes: 200 },
        ],
        "DEBATE & SYMPOSIUM SECRETARY": [
            { position: 1, name: 'CHLOE MURPHY', votes: 1700 },
            { position: 2, name: 'NATHANIEL BELL', votes: 1550 },
            { position: 3, name: 'PENELOPE COOK', votes: 1350 },
            { position: 4, name: 'ISAAC REED', votes: 1150 },
            { position: 5, name: 'AUBREY MORGAN', votes: 950 },
            { position: 6, name: 'XAVIER PETTERSON', votes: 750 },
            { position: 7, name: 'QUINN COOPER', votes: 550 },
            { position: 8, name: 'CLARA RICHARDSON', votes: 350 },
            { position: 9, name: 'ROMAN COX', votes: 150 },
        ],
        "MAJOR GAMES SECRETARY": [
            { position: 1, name: 'AVERY WARD', votes: 1650 },
            { position: 2, name: 'ELENA CHAVEZ', votes: 1500 },
            { position: 3, name: 'JORDAN RUIZ', votes: 1300 },
            { position: 4, name: 'MADISON ALVAREZ', votes: 1100 },
            { position: 5, name: 'ADRIAN CASTILLO', votes: 900 },
            { position: 6, name: 'NATALIE JIMENEZ', votes: 700 },
            { position: 7, name: 'CARSON SANTOS', votes: 500 },
            { position: 8, name: 'HAILEY TORRES', votes: 300 },
            { position: 9, name: 'COLE CASTRO', votes: 100 },
        ],
        "MINOR GAMES SECRETARY": [
            { position: 1, name: 'ELLIE GOMEZ', votes: 1600 },
            { position: 2, name: 'TRISTAN DIAZ', votes: 1450 },
            { position: 3, name: 'LILY VASQUEZ', votes: 1250 },
            { position: 4, name: 'JASON MENDOZA', votes: 1050 },
            { position: 5, name: 'AALIYAH ORTIZ', votes: 850 },
            { position: 6, name: 'LINCOLN GUTIERREZ', votes: 650 },
            { position: 7, name: 'HANNAH CHAMBERS', votes: 450 },
            { position: 8, name: 'THEODORE FLETCHER', votes: 250 },
            { position: 9, name: 'ARIA HUNTER', votes: 50 },
        ],
        "SOCIAL SERVICE & NSS SECRETARY": [
            { position: 1, name: 'LUKA MORENO', votes: 1550 },
            { position: 2, name: 'MELANIE WEBER', votes: 1400 },
            { position: 3, name: 'IONA CURTIS', votes: 1200 },
            { position: 4, name: 'FELIX ARNOLD', votes: 1000 },
            { position: 5, name: 'IVY WAGNER', votes: 800 },
            { position: 6, name: 'LEO NORRIS', votes: 600 },
            { position: 7, name: 'DANIELA STEELE', votes: 400 },
            { position: 8, name: 'SELENE ROWE', votes: 200 },
            { position: 9, name: 'ORION PETERS', votes: 25 },
        ],
        "MUSIC & PERFORMING ARTS SECRETARY": [
            { position: 1, name: 'CECILIA NORMAN', votes: 1500 },
            { position: 2, name: 'DAMIAN SIMON', votes: 1350 },
            { position: 3, name: 'FREYA PEARSON', votes: 1150 },
            { position: 4, name: 'GABRIEL PALMER', votes: 950 },
            { position: 5, name: 'HELENA FRANKS', votes: 750 },
            { position: 6, name: 'ISAAC BRADLEY', votes: 550 },
            { position: 7, name: 'JULIETTE OSBORNE', votes: 350 },
            { position: 8, name: 'KAIAN LLOYD', votes: 150 },
            { position: 9, name: 'LUNA DYER', votes: 10 },
        ],
        "GIRLS' WELFARE SECRETARY": [
            { position: 1, name: 'MAYA FINCH', votes: 1450 },
            { position: 2, name: 'NOAH HOPKINS', votes: 1300 },
            { position: 3, name: 'OPHELIA WOOD', votes: 1100 },
            { position: 4, name: 'PHOENIX BERRY', votes: 900 },
            { position: 5, name: 'QUINN LITTLE', votes: 700 },
            { position: 6, name: 'RUBY HALE', votes: 500 },
            { position: 7, name: 'STELLA GRAHAM', votes: 300 },
            { position: 8, name: 'THEO WARREN', votes: 100 },
            { position: 9, name: 'UNA GIBSON', votes: 5 },
        ],
        "BOYS' WELFARE SECRETARY": [
            { position: 1, name: 'VIOLET DUNCAN', votes: 1400 },
            { position: 2, name: 'WYATT ARMSTRONG', votes: 1250 },
            { position: 3, name: 'XIMENA ATKINSON', votes: 1050 },
            { position: 4, name: 'YUSUF PARSONS', votes: 850 },
            { position: 5, name: 'ZARA DENNIS', votes: 650 },
            { position: 6, name: 'ADAM CHAPMAN', votes: 450 },
            { position: 7, name: 'BRIAN SILVA', votes: 250 },
            { position: 8, name: 'CARA OCONNOR', votes: 50 },
            { position: 9, name: 'DEREK CHAMBERLAIN', votes: 1 },
        ],
        "ACADEMIC AFFAIRS SECRETARY": [
            { position: 1, name: 'ELLA PATEL', votes: 1350 },
            { position: 2, name: 'FINN OCONNELL', votes: 1200 },
            { position: 3, name: 'GRACE HASSAN', votes: 1000 },
            { position: 4, name: 'HENRY FLEMING', votes: 800 },
            { position: 5, name: 'IRENE GOODMAN', votes: 600 },
            { position: 6, name: 'JACKIE MILES', votes: 400 },
            { position: 7, name: 'KIAN TUCKER', votes: 200 },
            { position: 8, name: 'LENA RAMOS', votes: 50 },
            { position: 9, name: 'MILES FIGUEROA', votes: 5 },
        ]
    };
    
    portfolios = [
        "VICE PRESIDENT",
        "GENERAL SECRETARY",
        "ASSISTANT GENERAL SECRETARY",
        "CULTURAL SECRETARY",
        "LITERARY SECRETARY",
        "DEBATE & SYMPOSIUM SECRETARY",
        "MAJOR GAMES SECRETARY",
        "MINOR GAMES SECRETARY",
        "SOCIAL SERVICE & NSS SECRETARY",
        "MUSIC & PERFORMING ARTS SECRETARY",
        "GIRLS' WELFARE SECRETARY",
        "BOYS' WELFARE SECRETARY",
        "ACADEMIC AFFAIRS SECRETARY"
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

// Function to animate avatar fade-in
function animateAvatarFadeIn(element, callback) {
    // Reset opacity to 0
    element.style.opacity = '0';
    
    // Force reflow
    element.offsetHeight;
    
    // Animate to full opacity
    element.style.transition = 'opacity 1s ease-in-out';
    element.style.opacity = '1';
    
    // Call callback when transition ends
    setTimeout(() => {
        if (callback) callback();
    }, 1000);
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
                const data = getCurrentPortfolioData()[dataIndex];
                if (data) {
                    const nameElement = element.querySelector('.rank-name');
                    const votesElement = element.querySelector('.rank-votes');
                    const avatarElement = element.querySelector('.rank-avatar');
                    const positionElement = element.querySelector('.rank-position');
                    
                    // Set name and votes for all positions
                    if (nameElement) nameElement.textContent = data.name;
                    
                    // Hide position text for all positions
                    if (positionElement) {
                        positionElement.textContent = '';
                        positionElement.classList.add('hidden');
                    }
                    
                    // Animate avatar fade-in
                    if (avatarElement) {
                        animateAvatarFadeIn(avatarElement, () => {
                            // Animate vote count and reveal next item when finished
                            if (votesElement) {
                                animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                                    revealNext(index + 1);
                                });
                            } else {
                                revealNext(index + 1);
                            }
                        });
                    } else {
                        // Animate vote count and reveal next item when finished
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
        const data = getCurrentPortfolioData()[2]; // 3rd place data
        if (thirdPlace && data) {
            const nameElement = thirdPlace.querySelector('.player-name');
            const votesElement = thirdPlace.querySelector('.player-votes');
            const avatarElement = thirdPlace.querySelector('.avatar');
            
            if (nameElement) nameElement.textContent = data.name;
            
            // Animate avatar fade-in
            if (avatarElement) {
                animateAvatarFadeIn(avatarElement, () => {
                    // Animate vote count and reveal next podium position when finished
                    if (votesElement) {
                        animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                            // Reveal 2nd place
                            setTimeout(() => {
                                const secondPlace = document.querySelector('.second-place');
                                const data2 = getCurrentPortfolioData()[1]; // 2nd place data
                                if (secondPlace && data2) {
                                    const nameElement2 = secondPlace.querySelector('.player-name');
                                    const votesElement2 = secondPlace.querySelector('.player-votes');
                                    const avatarElement2 = secondPlace.querySelector('.avatar');
                                    
                                    if (nameElement2) nameElement2.textContent = data2.name;
                                    
                                    // Animate avatar fade-in
                                    if (avatarElement2) {
                                        animateAvatarFadeIn(avatarElement2, () => {
                                            // Animate vote count and reveal next podium position when finished
                                            if (votesElement2) {
                                                animateVoteCount(votesElement2, 0, data2.votes, 2000, () => {
                                                    // Reveal 1st place
                                                    setTimeout(() => {
                                                        const firstPlace = document.querySelector('.first-place');
                                                        const data1 = getCurrentPortfolioData()[0]; // 1st place data
                                                        if (firstPlace && data1) {
                                                            const nameElement1 = firstPlace.querySelector('.player-name');
                                                            const votesElement1 = firstPlace.querySelector('.player-votes');
                                                            const avatarElement1 = firstPlace.querySelector('.avatar');
                                                            
                                                            if (nameElement1) nameElement1.textContent = data1.name;
                                                            
                                                            // Animate avatar fade-in
                                                            if (avatarElement1) {
                                                                animateAvatarFadeIn(avatarElement1, () => {
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
                                                                });
                                                            } else {
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
                                        });
                                    } else {
                                        // Animate vote count and reveal next podium position when finished
                                        if (votesElement2) {
                                            animateVoteCount(votesElement2, 0, data2.votes, 2000, () => {
                                                // Reveal 1st place
                                                setTimeout(() => {
                                                    const firstPlace = document.querySelector('.first-place');
                                                    const data1 = getCurrentPortfolioData()[0]; // 1st place data
                                                    if (firstPlace && data1) {
                                                        const nameElement1 = firstPlace.querySelector('.player-name');
                                                        const votesElement1 = firstPlace.querySelector('.player-votes');
                                                        const avatarElement1 = firstPlace.querySelector('.avatar');
                                                        
                                                        if (nameElement1) nameElement1.textContent = data1.name;
                                                        
                                                        // Animate avatar fade-in
                                                        if (avatarElement1) {
                                                            animateAvatarFadeIn(avatarElement1, () => {
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
                                                            });
                                                        } else {
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
                                }
                            }, 500); // Small delay before revealing 2nd place
                        });
                    } else {
                        // If no vote animation for 3rd place, check if we should stop confetti
                        setTimeout(() => {
                            stopContinuousConfetti();
                        }, 5000); // Wait for potential 2nd and 1st place animations
                    }
                });
            } else {
                // Animate vote count and reveal next podium position when finished
                if (votesElement) {
                    animateVoteCount(votesElement, 0, data.votes, 2000, () => {
                        // Reveal 2nd place
                        setTimeout(() => {
                            const secondPlace = document.querySelector('.second-place');
                            const data2 = getCurrentPortfolioData()[1]; // 2nd place data
                            if (secondPlace && data2) {
                                const nameElement2 = secondPlace.querySelector('.player-name');
                                const votesElement2 = secondPlace.querySelector('.player-votes');
                                const avatarElement2 = secondPlace.querySelector('.avatar');
                                
                                if (nameElement2) nameElement2.textContent = data2.name;
                                
                                // Animate avatar fade-in
                                if (avatarElement2) {
                                    animateAvatarFadeIn(avatarElement2, () => {
                                        // Animate vote count and reveal next podium position when finished
                                        if (votesElement2) {
                                            animateVoteCount(votesElement2, 0, data2.votes, 2000, () => {
                                                // Reveal 1st place
                                                setTimeout(() => {
                                                    const firstPlace = document.querySelector('.first-place');
                                                    const data1 = getCurrentPortfolioData()[0]; // 1st place data
                                                    if (firstPlace && data1) {
                                                        const nameElement1 = firstPlace.querySelector('.player-name');
                                                        const votesElement1 = firstPlace.querySelector('.player-votes');
                                                        const avatarElement1 = firstPlace.querySelector('.avatar');
                                                        
                                                        if (nameElement1) nameElement1.textContent = data1.name;
                                                        
                                                        // Animate avatar fade-in
                                                        if (avatarElement1) {
                                                            animateAvatarFadeIn(avatarElement1, () => {
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
                                                            });
                                                        } else {
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
                                    });
                                } else {
                                    // Animate vote count and reveal next podium position when finished
                                    if (votesElement2) {
                                        animateVoteCount(votesElement2, 0, data2.votes, 2000, () => {
                                            // Reveal 1st place
                                            setTimeout(() => {
                                                const firstPlace = document.querySelector('.first-place');
                                                const data1 = getCurrentPortfolioData()[0]; // 1st place data
                                                if (firstPlace && data1) {
                                                    const nameElement1 = firstPlace.querySelector('.player-name');
                                                    const votesElement1 = firstPlace.querySelector('.player-votes');
                                                    const avatarElement1 = firstPlace.querySelector('.avatar');
                                                    
                                                    if (nameElement1) nameElement1.textContent = data1.name;
                                                    
                                                    // Animate avatar fade-in
                                                    if (avatarElement1) {
                                                        animateAvatarFadeIn(avatarElement1, () => {
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
                                                        });
                                                    } else {
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
        }
    }, 500); // Small delay before revealing 3rd place
}

// Function to get current portfolio data
function getCurrentPortfolioData() {
    const currentPortfolio = portfolios[currentPortfolioIndex];
    // Return empty array if portfolio data doesn't exist
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
    
    // Update button style
    const revealButton = document.querySelector('.reveal-button');
    if (revealButton) {
        revealButton.textContent = 'REVEALED';
        revealButton.classList.add('revealed');
    }
    
    // Start continuous confetti
    startContinuousConfetti();
    
    // Start revealing player info from last to first
    setTimeout(() => {
        revealPlayerInfo();
    }, 1000);
}

// Function to navigate to next portfolio with animation
function nextPortfolio() {
    // Add a sliding animation effect
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
    // Add a sliding animation effect
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
    // Reset reveal state
    isRevealed = false;
    
    // Initially hide all player info
    document.querySelectorAll('.player-name, .player-votes, .rank-name, .rank-votes').forEach(element => {
        element.textContent = '';
    });
    
    // Hide all avatars initially
    document.querySelectorAll('.avatar, .rank-avatar').forEach(element => {
        element.style.opacity = '0';
    });
    
    // Hide all position texts initially
    document.querySelectorAll('.rank-position').forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
    
    // Update portfolio title
    updatePortfolioTitle();
    
    // Reset reveal button
    const revealButton = document.querySelector('.reveal-button');
    if (revealButton) {
        revealButton.textContent = 'REVEAL';
        revealButton.classList.remove('revealed');
    }
    
    // Stop any running confetti
    stopContinuousConfetti();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from server
    fetchData();
    
    // Trigger podium animations after a short delay
    setTimeout(() => {
        const podiumItems = document.querySelectorAll('.podium-item');
        podiumItems.forEach(item => {
            item.style.opacity = '1';
        });
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
    
    // Add event listeners to arrows
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

// Confetti animation function (kept for backward compatibility)
function launchConfetti() {
    // This function is now replaced by continuous confetti
    startContinuousConfetti();
}