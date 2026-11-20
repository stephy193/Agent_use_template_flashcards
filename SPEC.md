# Spec: Dairy Diary

## Goal (one or two sentences)
Website to track meals and evaluate if meal contains lactose and leads to symptoms.

## Users
People with suspected lactose-intolerance.

## Features (numbered, so prompts can refer to them)
F1: Entry (containing Date, Food/Meal, Checkbox "Contains lactose?", Checkbox "Symptoms?", Symptom details) can be submitted with a button "Add Entry". Reset and clear form after entry.
F2: Create a list containing all submitted entries, sorted by entry date, starting from newest entry to oldest. Save entries in localStorage so they survive a page reload.
F3: Enable deletion of selected entries from the list.
F4: Count all entries where Checkbox "Contains lactose?" is checked, save as "Lactose-containing meals". Then count how many of those entries have Symptoms checked, save as "positive", and how many don't have Symptoms, save as "negative".
F5: Compare the "positive" count with the "negative" count in a pie chart (100% is refering to "Lactose-containing meals).


## Acceptance criteria (how I know a feature works)
F1: Empty fields cannot be submitted. 
F4: Show result in cosole.

## Out of scope (do NOT build)
No App


## Look & feel
