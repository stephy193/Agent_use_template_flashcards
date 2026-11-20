const wordForm = document.getElementById("word-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordPairs = [];

// Adds one word pair when the form is submitted.
function addWordPair(event) {
  event.preventDefault();

  const englishWord = englishInput.value.trim();
  const germanWord = germanInput.value.trim();

  if (englishWord === "" || germanWord === "") {
    return;
  }

  wordPairs.push({
    english: englishWord,
    german: germanWord
  });

  wordForm.reset();
  englishInput.focus();
}

wordForm.addEventListener("submit", addWordPair);