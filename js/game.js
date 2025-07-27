let properties = [];
let currentScore = 0;
let leftProperty = null;
let rightProperty = null;
let currentImageIndex = 0;
let gameActive = false;

// Load properties data
async function loadProperties() {
    try {
        const response = await fetch('data/scraped_nepremicnine.json');
        const data = await response.json();
        
        // Filter properties with valid prices and images
        properties = data.filter(property => 
            property.price && 
            property.images && 
            property.images.length > 0 &&
            !property.price.includes('Po dogovoru') &&
            !property.price.includes('na poizvedbo') &&
            property.images[0] !== '/images/n-1.jpg' // Filter out placeholder images
        );
        
        console.log(`Naloženih ${properties.length} nepremičnin`);
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Napaka pri nalaganju:', error);
        document.getElementById('loading').innerHTML = 'Napaka pri nalaganju podatkov';
    }
}

// Parse price from string to number
function parsePrice(priceString) {
    return parseFloat(priceString.replace(/[^\d,]/g, '').replace(',', '.'));
}

// Get random property
function getRandomProperty() {
    return properties[Math.floor(Math.random() * properties.length)];
}

// Update property display
function updatePropertyDisplay(side, property) {
    const prefix = side === 'left' ? 'left' : 'right';
    
    document.getElementById(`${prefix}Location`).textContent = property.title;
    document.getElementById(`${prefix}Area`).textContent = property.area;
    
    // Set background image
    const propertyElement = document.getElementById(`${prefix}Property`);
    if (property.images && property.images.length > 0) {
        propertyElement.style.backgroundImage = `url(${property.images[0]})`;
    }
    
    // Show price only for left property
    if (side === 'left') {
        document.getElementById(`${prefix}Price`).textContent = property.price;
        document.getElementById(`${prefix}Price`).style.display = 'block';
    } else {
        document.getElementById(`${prefix}Price`).style.display = 'none';
    }
}

// Update image navigation for right property
function updateImageNavigation(property) {
    const imageNav = document.getElementById('imageNavigation');
    const counter = document.getElementById('imageCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (property.images && property.images.length > 1) {
        imageNav.style.display = 'flex';
        counter.textContent = `1 od ${property.images.length}`;
        prevBtn.disabled = true;
        nextBtn.disabled = property.images.length <= 1;
        currentImageIndex = 0;
    } else {
        imageNav.style.display = 'none';
        currentImageIndex = 0;
    }
}

// Navigate to previous image
function previousImage() {
    if (rightProperty && rightProperty.images && currentImageIndex > 0) {
        currentImageIndex--;
        updateRightPropertyImage();
        updateImageCounter();
    }
}

// Navigate to next image
function nextImage() {
    if (rightProperty && rightProperty.images && currentImageIndex < rightProperty.images.length - 1) {
        currentImageIndex++;
        updateRightPropertyImage();
        updateImageCounter();
    }
}

// Update right property background image
function updateRightPropertyImage() {
    if (rightProperty && rightProperty.images && rightProperty.images[currentImageIndex]) {
        document.getElementById('rightProperty').style.backgroundImage = 
            `url(${rightProperty.images[currentImageIndex]})`;
    }
}

// Update image counter and navigation buttons
function updateImageCounter() {
    const counter = document.getElementById('imageCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (rightProperty && rightProperty.images) {
        counter.textContent = `${currentImageIndex + 1} od ${rightProperty.images.length}`;
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === rightProperty.images.length - 1;
    }
}

// Start new round
function startNewRound() {
    // If it's the first round, get two random properties
    if (!leftProperty) {
        leftProperty = getRandomProperty();
        rightProperty = getRandomProperty();
        
        // Ensure they're different
        while (rightProperty.url === leftProperty.url) {
            rightProperty = getRandomProperty();
        }
    } else {
        // Move right to left, get new right
        leftProperty = rightProperty;
        rightProperty = getRandomProperty();
        
        // Ensure they're different
        while (rightProperty.url === leftProperty.url) {
            rightProperty = getRandomProperty();
        }
    }
    
    updatePropertyDisplay('left', leftProperty);
    updatePropertyDisplay('right', rightProperty);
    updateImageNavigation(rightProperty);
    
    // Show choice buttons and hide right price
    document.getElementById('choiceButtons').style.display = 'flex';
    document.getElementById('rightPrice').style.display = 'none';
    
    gameActive = true;
}

// Make choice
function makeChoice(choice) {
    if (!gameActive) return;
    
    const leftPrice = parsePrice(leftProperty.price);
    const rightPrice = parsePrice(rightProperty.price);
    
    let correct = false;
    
    if (choice === 'higher' && rightPrice >= leftPrice) {
        correct = true;
    } else if (choice === 'lower' && rightPrice <= leftPrice) {
        correct = true;
    }
    
    // Hide choice buttons and show right property price
    document.getElementById('choiceButtons').style.display = 'none';
    document.getElementById('rightPrice').textContent = rightProperty.price;
    document.getElementById('rightPrice').style.display = 'block';
    
    gameActive = false;
    
    if (correct) {
        currentScore++;
        document.getElementById('score').textContent = currentScore;
        
        // Continue to next round after delay
        setTimeout(() => {
            startNewRound();
        }, 2500);
    } else {
        // Game over
        setTimeout(() => {
            endGame();
        }, 2500);
    }
}

// End game
function endGame() {
    document.getElementById('finalScore').textContent = currentScore;
    
    let message = '';
    let title = '';
    
    if (currentScore === 0) {
        title = 'Ojej! 😅';
        message = 'Poskusi ponovno, boš zagotovo boljši!';
    } else if (currentScore < 3) {
        title = 'Dober začetek! 👍';
        message = `Dosegel si ${currentScore} ${currentScore === 1 ? 'točko' : 'točki'}. Kar tako naprej!`;
    } else if (currentScore < 5) {
        title = 'Ne slabo! 🎯';
        message = `${currentScore} točk je že lepo! Poznaš osnovne cene.`;
    } else if (currentScore < 10) {
        title = 'Odlično! 🏆';
        message = `${currentScore} točk! Imaš občutek za slovenki nepremičninski trg!`;
    } else if (currentScore < 15) {
        title = 'Neverjetno! 🌟';
        message = `${currentScore} točk! Si pravi strokovnjak za nepremičnine!`;
    } else {
        title = 'LEGENDARNO! 🔥';
        message = `${currentScore} točk! Lahko te imenujemo za mojstra slovenskega nepremičninskega trga!`;
    }
    
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverMessage').innerHTML = 
        `${message}<br><br>Tvoj rezultat: <span style="color: #4ecdc4; font-weight: bold;">${currentScore}</span>`;
    
    document.getElementById('gameOver').classList.remove('hidden');
}

// Restart game
function restartGame() {
    currentScore = 0;
    leftProperty = null;
    rightProperty = null;
    gameActive = false;
    currentImageIndex = 0;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOver').classList.add('hidden');
    
    startNewRound();
}

// Start game
function startGame() {
    if (properties.length === 0) {
        alert('Podatki se še nalagajo, poskusi čez nekaj sekund...');
        return;
    }
    
    document.getElementById('landing').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    startNewRound();
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (!gameActive) return;
    
    switch(event.key) {
        case 'ArrowUp':
        case 'h':
        case 'H':
            makeChoice('higher');
            break;
        case 'ArrowDown':
        case 'l':
        case 'L':
            makeChoice('lower');
            break;
        case 'ArrowLeft':
            previousImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
});

// Initialize
window.addEventListener('load', () => {
    loadProperties();
});