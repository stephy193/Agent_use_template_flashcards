const wordForm = document.getElementById("word-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordList = document.getElementById("word-list");
const deleteSelectedButton = document.getElementById("delete-selected");
const storageKey = "vocabularyWordPairs";
let wordPairs = loadWordPairs();

// Loads saved word pairs from the browser.
function loadWordPairs() {
  const savedWordPairs = localStorage.getItem(storageKey);

  if (savedWordPairs === null) {
    return [];
  }

  const parsedWordPairs = JSON.parse(savedWordPairs);
  if (!Array.isArray(parsedWordPairs)) {
    throw new Error("Gespeicherte Vokabeln haben ein ungültiges Format.");
  }

  for (const wordPair of parsedWordPairs) {
    if (!wordPair || typeof wordPair.english !== "string" || typeof wordPair.german !== "string") {
      throw new Error("Gespeicherte Vokabeln haben ein ungültiges Format.");
    }
  }

  return parsedWordPairs;
}

// Saves the given word pairs in the browser.
function saveWordPairs(updatedWordPairs) {
  localStorage.setItem(storageKey, JSON.stringify(updatedWordPairs));
}

// Shows all saved word pairs in the list.
function renderWordPairs() {
  wordList.innerHTML = "";

  for (let index = 0; index < wordPairs.length; index++) {
    const wordPair = wordPairs[index];
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const wordText = document.createElement("span");

    checkbox.type = "checkbox";
    checkbox.dataset.index = index;
    checkbox.setAttribute("aria-label", "Vokabel auswählen");
    wordText.textContent = wordPair.german + " - " + wordPair.english;

    listItem.appendChild(checkbox);
    listItem.appendChild(wordText);
    wordList.appendChild(listItem);
  }
}

// Removes all word pairs whose checkboxes are selected.
function deleteSelectedWordPairs() {
  const checkboxes = wordList.querySelectorAll("input[type='checkbox']:checked");
  const indexesToDelete = [];

  for (const checkbox of checkboxes) {
    indexesToDelete.push(Number(checkbox.dataset.index));
  }

  const updatedWordPairs = wordPairs.slice();
  for (let index = indexesToDelete.length - 1; index >= 0; index--) {
    updatedWordPairs.splice(indexesToDelete[index], 1);
  }

  saveWordPairs(updatedWordPairs);
  wordPairs = updatedWordPairs;
  renderWordPairs();
}

// Adds one word pair when the form is submitted.
function addWordPair(event) {
  event.preventDefault();

  const englishWord = englishInput.value.trim();
  const germanWord = germanInput.value.trim();

  if (englishWord === "" || germanWord === "") {
    return;
  }

  const updatedWordPairs = wordPairs.slice();
  updatedWordPairs.push({
    english: englishWord,
    german: germanWord
  });

  saveWordPairs(updatedWordPairs);
  wordPairs = updatedWordPairs;
  wordForm.reset();
  renderWordPairs();
  englishInput.focus();
}

wordForm.addEventListener("submit", addWordPair);
deleteSelectedButton.addEventListener("click", deleteSelectedWordPairs);
renderWordPairs();
germanInput.focus();