export const speakText = (text: string, lang: string = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Extract English parts if mixed with Vietnamese
  // e.g. "Âm /ʊ/: cook, push, would, woman" -> "cook, push, would, woman"
  // or speak the cleaned string
  let textToSpeak = text;
  
  if (text.includes(':')) {
    const parts = text.split(':');
    if (parts.length > 1 && parts[1].trim()) {
      textToSpeak = parts[1].trim();
    }
  }

  // Remove parentheses or Vietnamese tips if any
  textToSpeak = textToSpeak.replace(/\(.*\)/g, '').trim();

  window.speechSynthesis.cancel(); // stop current speaking

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = lang;
  utterance.rate = 0.85; // slightly slower for language learners
  window.speechSynthesis.speak(utterance);
};
