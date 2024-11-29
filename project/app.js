const transcriptElement = document.getElementById("transcript");
const translationElement = document.getElementById("translation");
const startRecordingBtn = document.getElementById("start-recording");
const speakTranslationBtn = document.getElementById("speak-translation");
const languageInput = document.getElementById("language-input");

let recognition;

// Initialize Speech Recognition
function initSpeechRecognition() {
    if ("webkitSpeechRecognition" in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = languageInput.value; // Set initial language

        recognition.onresult = async (event) => {
            const spokenText = event.results[0][0].transcript;
            transcriptElement.textContent = spokenText;

            try {
                // Call Translation API
                const translatedText = await translateText(spokenText, languageInput.value, "en");
                translationElement.textContent = translatedText;
            } catch (error) {
                translationElement.textContent = "Error in translation.";
                console.error("Error during translation:", error);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Speech recognition encountered an error. Please try again.");
        };
    } else {
        alert("Speech recognition not supported in this browser.");
    }
}

// Start Recording
startRecordingBtn.addEventListener("click", () => {
    if (!recognition) {
        initSpeechRecognition(); // Initialize if it's not already initialized
    }
    recognition.lang = languageInput.value; // Update language before starting
    recognition.start();
});

// Translation Function (Using the Backend API)
async function translateText(inputText, sourceLang, targetLang) {
    if (!inputText.trim()) {
        throw new Error("No text provided for translation.");
    }

    try {
        const response = await fetch("http://localhost:3000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: inputText,
                source_language: sourceLang,
                target_language: targetLang,
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.translation) {
            return data.translation; // Adjust based on actual API response format
        } else {
            throw new Error("Translation result is missing.");
        }
    } catch (error) {
        console.error("Translation API error:", error);
        return `Error in translation: ${error.message}. Please try again later.`;
    }
}

// Speak Translation
speakTranslationBtn.addEventListener("click", () => {
    debugger    
    const translatedText = translationElement.textContent;
    
    if (!translatedText || translatedText === "Error in translation.") {
        alert("No valid translation available to speak.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = "en"; // Set to the target language
    speechSynthesis.speak(utterance);
});




