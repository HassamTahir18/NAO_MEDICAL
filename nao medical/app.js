//Speech-to-Text
const speechButton = document.getElementById("start-speech");
const inputText = document.getElementById("input-text");
const speechLang = document.getElementById("speech-lang");

speechButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = speechLang.value;

    recognition.onstart = () => {
        speechButton.textContent = "Listening...";
    };

    recognition.onend = () => {
        speechButton.textContent = "Start Speech-to-Text";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputText.value = transcript;  // Display transcript in the input text area
    };

    recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
    };

    recognition.start();
});

// Copy Speech-to-Text Content and Speak
const copyAndSpeakButton = document.getElementById("copy-and-speak");
const outputText = document.getElementById("output-text");
const textLang = document.getElementById("text-lang");

copyAndSpeakButton.addEventListener("click", () => {
    // Copy content from input-text to output-text
    outputText.value = inputText.value;

    // Get the selected language for Text-to-Speech
    const selectedLang = textLang.value;

    // Perform Text-to-Speech on the copied content
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(outputText.value);

    // Set the language of the utterance to the selected language
    utterance.lang = selectedLang;

    // Speak the text
    speechSynthesis.speak(utterance);
});
