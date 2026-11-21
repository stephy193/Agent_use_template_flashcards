# Spec: Dairy Diary

## Goal (one or two sentences)
Website to track meals and evaluate if meal contains lactose and leads to symptoms.

## Users
People with suspected lactose-intolerance.

## Features (numbered, so prompts can refer to them)
F1: Entry (containing Date, Food/Meal, Checkbox "Contains lactose?", Checkbox "Symptoms?", Symptom details) can be submitted with a button "Add Entry". Symptom details are only required if symptoms are checked. 
F2: Create a list containing all submitted entries, sorted by entry date, starting from newest entry to oldest. Save entries in localStorage so they survive a page reload.
F3: Enable deletion of selected entries from the list. Delete the selected entry also from localStorage.
F4: Count all entries where Checkbox "Contains lactose?" is checked, save as "Lactose-containing meals". Then count how many of those entries have Symptoms checked, save as "positive", and how many don't have Symptoms, save as "negative".
F5: Compare the "positive" count with the "negative" count in a pie chart (100% is refering to "Lactose-containing meals).
F6: re-calculate the pie chart every time a new entry is made or an entry is deleted.


## Acceptance criteria (how I know a feature works)
F1: Required fields cannot be empty. Reset and clear form after entry. 
F4: Show result in cosole.
F6: new pie chart with every entry

## Out of scope (do NOT build)
- No login, no server, no database
- No frameworks or libraries (no React, no jQuery, no Bootstrap)
- No sound, no animations beyond simple CSS transitions
- No mobile app


## Look & feel
Simple, readable, playful, max width ~600px, one accent colour (light blue).