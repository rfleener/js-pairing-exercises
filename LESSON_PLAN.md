# Lesson Plan: Data Manipulation & API Integration with JavaScript

**Repo:** `js-pairing-exercises`
**Format:** Pair programming
**Total Estimated Time:** 90–120 minutes
**Prerequisites:** Basic JavaScript (functions, arrays, objects), familiarity with Promises or async/await
**Testing Framework:** Jest (watch mode)
**Mock API:** json-server running on `http://localhost:5000/api`

---

## Overview

This lesson walks a pair of developers through a progressive series of exercises that start with verifying a live API connection and build toward combining and transforming data from multiple endpoints. Each exercise maps to a specific learning objective and unlocks the next by removing the `x` prefix from an `xtest` in `src/captains-service.test.js`.

The exercises use a fictional dataset of famous fictional starship/sailing captains and their ships (Jack Sparrow, Malcolm Reynolds, Jean-Luc Picard, Han Solo) to keep the domain fun and relatable while the technical concepts stay front and center.

---

## Environment Setup

**Suggested time: 10 minutes**

**Learning objective:** Students can clone a repo, install dependencies, start a mock REST API, and run a test suite in watch mode.

**Steps:**

1. Clone the repo and run `npm install`.
2. In one terminal, start the mock API: `npm run api`. Confirm json-server is serving at `http://localhost:5000/api`.
3. In a second terminal, start the test runner: `npm test`. Jest will launch in watch mode and re-run tests on every save.
4. Verify that `src/apiClient.test.js` passes all three tests — this confirms the API is reachable and the axios client is correctly configured.

**Key files introduced:**
- `api/db.json` — the mock database (captains and ships collections)
- `routes.json` / `json-server.json` — json-server configuration that maps `/api/*` to the root
- `src/apiClient.js` — a thin axios wrapper pre-configured with `baseURL`
- `src/apiClient.test.js` — smoke tests for the running API (already complete, do not modify)

**Discussion prompt:** Look at `api/db.json` together. What are the two resources? How are captains and ships related to each other? What field links them?

---

## Exercise 1 — Fetch All Captains

**Suggested time: 10 minutes**
**File:** `src/captains-service.js`
**Test:** `'returns data from captains endpoint'` (already enabled — no `x` to remove)

**Learning objective:** Students can call a REST API endpoint using axios and return the response data from an async service function.

**Starting stub:**

```js
export const getCaptains = () => null;
```

**What to implement:** Replace the stub so `getCaptains` makes a `GET` request to `/captains` using `apiClient` and returns the array of captain objects.

**Concepts covered:**
- `async` / `await` syntax
- Returning `response.data` from an axios response
- Writing a named export from a service module

**Expected result:** The test asserts the returned array has length 4 and that the first element matches Jack Sparrow's full object (id, first, last, age, ship fields).

**Pair tip:** The driver writes the implementation; the navigator watches the test output in the terminal and reads the assertion aloud before the driver types anything.

---

## Exercise 2 — Extract First Names

**Suggested time: 10 minutes**
**File:** `src/captains-service.js`
**Test:** `'captain first names'` — remove the `x` from `xtest` to enable

**Learning objective:** Students can call an existing service function and use `Array.map()` to transform an array of objects into an array of scalar values.

**What to implement:** Add a `firstNames` function that calls `getCaptains()` and maps the result to an array of `first` name strings.

**Concepts covered:**
- Reusing an existing async function (`getCaptains`)
- `Array.prototype.map`
- Awaiting the result of another async function inside an async function

**Expected result:**

```js
['Jack', 'Malcolm', 'Jean Luc', 'Han']
```

**Pair tip:** Before writing code, have the pair predict the output by reading `db.json` together. Then write the implementation and confirm the test passes.

---

## Exercise 3 — Sort First Names Alphabetically

**Suggested time: 10 minutes**
**File:** `src/captains-service.js`
**Test:** `'captain first names sorted alphabetically'` — remove the `x` from `xtest` to enable

**Learning objective:** Students can sort an array of strings using `Array.sort()` and understand that sort mutates the original array.

**What to implement:** Add a `firstNamesSorted` function that builds on `firstNames()` (or `getCaptains()`) and returns the names sorted A–Z.

**Concepts covered:**
- `Array.prototype.sort` with and without a comparator
- Mutation vs. immutability — discuss whether to sort in place or copy first
- Chaining async operations

**Expected result:**

```js
['Han', 'Jack', 'Jean Luc', 'Malcolm']
```

**Pair tip:** Ask the pair: what happens if you call `.sort()` without a comparator function on strings? Does it work here? What would happen with numbers or mixed-case strings? Use this as a jumping-off point to discuss comparator functions.

---

## Exercise 4 — Compute Total Age

**Suggested time: 10 minutes**
**File:** `src/captains-service.js`
**Test:** `'captain combined total age'` — remove the `x` from `xtest` to enable

**Learning objective:** Students can use `Array.reduce()` to aggregate values from an array of objects into a single number.

**What to implement:** Add a `totalAge` function that calls `getCaptains()` and reduces the result to the sum of all `age` fields.

**Concepts covered:**
- `Array.prototype.reduce` — accumulator pattern
- Accessing a nested property (`captain.age`) inside a reducer
- The importance of the initial accumulator value (`0`)

**Expected result:** `179` (48 + 34 + 64 + 33)

**Pair tip:** Have the navigator calculate the expected total by hand from `db.json` before running the test. This reinforces that tests are specifications, not magic.

---

## Exercise 5 — Join Captain and Ship Data

**Suggested time: 20 minutes**
**File:** `src/captains-service.js`
**Test:** `'captain and ship combined for given captain id'` — remove the `x` from `xtest` to enable

**Learning objective:** Students can make two parallel API calls, correlate records across them using a shared key, and return a merged object shaped to a specification.

**What to implement:** Add a `captainBio(captainId)` function that:
1. Fetches captains from `/captains` and ships from `/ships` (can be done in parallel with `Promise.all`).
2. Finds the captain whose `id` matches the given `captainId`.
3. Finds the ship whose `id` matches the captain's `ship` field.
4. Returns a new object with the shape `{ id, firstName, lastName, shipId, shipName }`.

**Concepts covered:**
- `Promise.all` for concurrent async requests
- `Array.prototype.find` to locate a single matching record
- Object construction / reshaping — note that the output keys (`firstName`, `lastName`, `shipName`) differ from the source keys (`first`, `last`, `name`)
- Foreign-key style joins in a client-side context

**Expected result for `captainBio('R6TZN')`:**

```js
{
  id: 'R6TZN',
  firstName: 'Malcolm',
  lastName: 'Reynolds',
  shipId: 'V7B8T',
  shipName: 'Serenity'
}
```

**Pair tip:** This is the most complex exercise so far. Encourage the pair to sketch the data flow on paper or a whiteboard before coding: two API calls → find captain → find ship → build output object. Switch driver and navigator roles here if they haven't recently.

---

## Exercise 6 — Captains Sorted by Ship Size

**Suggested time: 20 minutes**
**File:** `src/captains-service.js`
**Test:** `'Captains sorted by ship size'` — remove the `x` from `xtest` to enable

**Learning objective:** Students can join two datasets, enrich each record with data from the second dataset, and sort the combined result by a numeric field from the joined data.

**What to implement:** Add a `captainsWithShipNamesBySize()` function that:
1. Fetches both `/captains` and `/ships`.
2. For each captain, replaces the `ship` id field with the matching ship's `name` string.
3. Sorts the resulting array by the ship's `crewCount` in ascending order (smallest crew first).

**Concepts covered:**
- Combining `Promise.all`, `Array.map`, and `Array.sort` in a single async pipeline
- Sorting by a property that lives in a joined dataset (the sort key `crewCount` must be looked up per captain)
- Returning a clean output shape that matches the test's expected array exactly

**Expected result (sorted by crew size: 2, 5, 44, 1012):**

```js
[
  { id: 'KZUC8', first: 'Han',      last: 'Solo',     age: 33, ship: 'Millenium Falcon'        },
  { id: 'R6TZN', first: 'Malcolm',  last: 'Reynolds', age: 34, ship: 'Serenity'                },
  { id: 'SQ2WI', first: 'Jack',     last: 'Sparrow',  age: 48, ship: 'Black Pearl'             },
  { id: 'UXWPK', first: 'Jean Luc', last: 'Picard',   age: 64, ship: 'USS Enterprise NCC-1701-D' }
]
```

**Pair tip:** Point out that the sort comparator needs to look up the ship's `crewCount` for each captain during comparison. One clean approach is to enrich the captains array first (map ship id → ship name and keep `crewCount` temporarily), sort, then strip `crewCount` from the output. Discuss trade-offs of different approaches.

---

## Wrap-Up & Reflection

**Suggested time: 10 minutes**

Walk through these discussion questions as a group or in pairs:

1. Every function in `captains-service.js` calls `getCaptains()` (and sometimes `/ships`) fresh on each invocation. What are the downsides of this in a real application? What patterns could address it (caching, a shared store, etc.)?

2. Exercises 5 and 6 perform a client-side "join" between two API responses. When would you do this on the client vs. asking the server to return pre-joined data? What are the trade-offs?

3. `Promise.all` was suggested for parallel fetching. What happens if one of the two requests fails? How would you handle that gracefully?

4. The test for Exercise 6 expects the `ship` field to contain the ship's name (a string), while the raw API data has a ship id. The output shape changed. How does this kind of data transformation affect consumers of a service module?

---

## Reference: Full Exercise Map

| # | Function to implement       | Key concept(s)                            | Test name                                     | Approx. time |
|---|-----------------------------|-------------------------------------------|-----------------------------------------------|--------------|
| 0 | Environment setup           | Dev tooling, mock API, Jest watch mode    | All of `apiClient.test.js`                    | 10 min       |
| 1 | `getCaptains()`             | async/await, axios, response.data         | `'returns data from captains endpoint'`       | 10 min       |
| 2 | `firstNames()`              | Array.map, reusing async functions        | `'captain first names'`                       | 10 min       |
| 3 | `firstNamesSorted()`        | Array.sort, mutation awareness            | `'captain first names sorted alphabetically'` | 10 min       |
| 4 | `totalAge()`                | Array.reduce, accumulator pattern         | `'captain combined total age'`                | 10 min       |
| 5 | `captainBio(captainId)`     | Promise.all, Array.find, object reshaping | `'captain and ship combined for given captain id'` | 20 min  |
| 6 | `captainsWithShipNamesBySize()` | Multi-step pipeline, join + sort      | `'Captains sorted by ship size'`              | 20 min       |
|   | Wrap-up discussion          | Architecture, error handling, trade-offs  | —                                             | 10 min       |

---

## Instructor Notes

**Enabling tests one at a time** is intentional. The `xtest` prefix tells Jest to skip that test. Pairs should only remove one `x` at a time so they stay focused on a single failing test. Resist the urge to enable all tests at once.

**Pair rotation:** If running this with multiple pairs in a classroom, consider rotating the driver/navigator roles at the start of each new exercise. A natural rotation point is any time the pair removes an `x` from a new test.

**Common mistakes to watch for:**
- Forgetting `async` on a function that uses `await` inside it.
- Returning `response` instead of `response.data` from an axios call.
- Using `Array.sort()` without a numeric comparator for Exercise 6 (lexicographic sort will give wrong crew-count ordering).
- Constructing the output object in Exercise 5 with the wrong key names (`first` instead of `firstName`, etc.).

**Stretch goals** for fast pairs who finish early:
- Add a `captainsByAge()` function that returns captains sorted youngest to oldest.
- Add a `shipByName(name)` function that searches the `/ships` endpoint for a ship by name (case-insensitive).
- Refactor `captainBio` and `captainsWithShipNamesBySize` to share a helper that fetches both resources once with `Promise.all`.
