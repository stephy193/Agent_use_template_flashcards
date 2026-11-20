const wordForm = document.getElementById("word-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordList = document.getElementById("word-list");
const wordPairs = [];

// Shows all saved word pairs in the list.
function renderWordPairs() {
  wordList.innerHTML = "";

  for (const wordPair of wordPairs) {
    const listItem = document.createElement("li");
    listItem.textContent = wordPair.english + " - " + wordPair.german;
    wordList.appendChild(listItem);
  }
}

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
  renderWordPairs();
  englishInput.focus();
}

wordForm.addEventListener("submit", addWordPair);