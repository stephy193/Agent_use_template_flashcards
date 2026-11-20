const wordForm = document.getElementById("word-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordList = document.getElementById("word-list");
const deleteSelectedButton = document.getElementById("delete-selected");
const wordPairs = [];

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

  for (let index = indexesToDelete.length - 1; index >= 0; index--) {
    wordPairs.splice(indexesToDelete[index], 1);
  }

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

  wordPairs.push({
    english: englishWord,
    german: germanWord
  });

  wordForm.reset();
  renderWordPairs();
  englishInput.focus();
}

wordForm.addEventListener("submit", addWordPair);
deleteSelectedButton.addEventListener("click", deleteSelectedWordPairs);
germanInput.focus()