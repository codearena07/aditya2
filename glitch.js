// Glitch Text Effect for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    // Wait for page to load completely and other animations to finish
    setTimeout(initGlitchEffect, 2200);
});

function initGlitchEffect() {
    const nameElement = document.querySelector('.glitch-text .highlight');
    if (!nameElement) return;
    
    const originalText = nameElement.getAttribute('data-glitch') || nameElement.textContent;
    // Extended glitch character set for more variety
    const glitchChars = '</>;#{*?$%>@&^~[]{}`!|\\+=-_:;"\',.0123456789';
    
    // Function to create a glitched version of the text
    function glitchText() {
        let glitched = '';
        // Increase glitch count for more intensity (2-5 characters)
        const glitchCount = Math.floor(Math.random() * 4) + 2;
        const positions = [];
        
        // Randomly select positions to glitch
        for (let i = 0; i < glitchCount; i++) {
            positions.push(Math.floor(Math.random() * originalText.length));
        }
        
        // Create glitched text by replacing characters at random positions
        for (let i = 0; i < originalText.length; i++) {
            if (positions.includes(i)) {
                glitched += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
            } else {
                glitched += originalText.charAt(i);
            }
        }
        
        return glitched;
    }
    
    // Apply the glitch effect and then restore original text
    function applyGlitch() {
        // Apply glitch
        nameElement.textContent = glitchText();
        
        // Restore original text after a short delay (faster for more rapid glitching)
        setTimeout(() => {
            nameElement.textContent = originalText;
        }, 780);
    }
    
    // Function to create a sequence of glitches
    function glitchSequence(count, interval) {
        for (let i = 0; i < count; i++) {
            setTimeout(applyGlitch, i * interval);
        }
    }
    
    // Start the random glitching
    function startRandomGlitching() {
        // Random delay between 1-5 seconds (reduced for more frequent glitches)
        const delay = Math.random() * 4000 + 2500;
        
        setTimeout(() => {
            // Random number of glitches in sequence (3-7)
            const glitchCount = Math.floor(Math.random() * 5) + 3;
            // Faster interval for more intense effect
            glitchSequence(glitchCount, 220);
            
            // Continue glitching randomly
            startRandomGlitching();
        }, delay);
    }
    
    /* Add hover effect
    nameElement.addEventListener('mouseenter', () => {
        // More intense glitch on hover - 7 rapid glitches
        glitchSequence(7, 80);
    });
    
    // Add click effect for mobile users
    nameElement.addEventListener('click', () => {
        // Super intense glitch on click - 10 very rapid glitches
        glitchSequence(10, 60);
    });*/
    
    // Start random glitching
    startRandomGlitching();
    
    // Initial glitch effect when loaded
    setTimeout(() => {
        glitchSequence(5, 100);
    }, 500);
} 