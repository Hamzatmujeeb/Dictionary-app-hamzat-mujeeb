document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const wordDetails = document.querySelector('.word-details');
    const fontSelector = document.getElementById('fontSelector');
    const toggleTheme = document.getElementById('toggleTheme');

    // Fetch word details from API
    async function fetchWord(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error('Word not found');
            const data = await response.json();
            return data[0];
        } catch (error) {
            alert('Word not found. Please try another word.');
        }
    }

    // Display word details
    function displayWordDetails(data) {
        const { word, phonetic, meanings, phonetics } = data;
        const audioSrc = phonetics.find(p => p.audio)?.audio;

        wordDetails.innerHTML = `
            <div class="word-container">
                <h2 class="word">
                    ${word}
                    ${audioSrc ? `<button class="play-button" id="playButton"><i class="fas fa-play"></i></button>` : ''}
                </h2>
                <p class="phonetic">${phonetic || ''}</p>
            </div>
            <div class="meanings">
                ${meanings.map(meaning => `
                    <h3>${meaning.partOfSpeech}</h3>
                    <ul>
                        ${meaning.definitions.map(def => `<li>${def.definition}</li>`).join('')}
                    </ul>
                `).join('')}
            </div>`;

        // Add play button functionality
        const playButton = document.getElementById('playButton');
        if (playButton && audioSrc) {
            playButton.addEventListener('click', () => {
                const audio = new Audio(audioSrc);
                audio.play();
            });
        }
    }

    // Search functionality
    searchButton.addEventListener('click', async () => {
        const word = searchInput.value.trim();
        if (word) {
            const data = await fetchWord(word);
            if (data) displayWordDetails(data);
        }
    });

    // Font Selector
    fontSelector.addEventListener('change', (event) => {
        document.body.style.fontFamily = event.target.value + ', sans-serif';
    });

    // Theme Toggle
    toggleTheme.addEventListener('change', (event) => {
        if (event.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});
