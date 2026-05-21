// app.js — application logic
// Depends on `greetings` array being loaded from greetings.js before this script.

(function () {
  // Track the index of the last greeting shown so we never repeat back-to-back.
  let lastIndex = -1;

  /**
   * Returns a random greeting that is different from the one shown last time.
   * @returns {string}
   */
  function getRandomGreeting() {
    if (greetings.length === 1) return greetings[0];

    let index;
    do {
      index = Math.floor(Math.random() * greetings.length);
    } while (index === lastIndex);

    lastIndex = index;
    return greetings[index];
  }

  /**
   * Displays a single new greeting in the message box and triggers the
   * pop-in animation by toggling a CSS class.
   */
  function showGreeting() {
    const messageEl = document.getElementById('message');

    // Remove the animation class so re-adding it triggers the keyframe again.
    messageEl.classList.remove('pop-in');

    // Force a reflow so the browser registers the class removal before re-adding.
    void messageEl.offsetWidth;

    messageEl.textContent = getRandomGreeting();
    messageEl.classList.add('pop-in');
  }

  // Wire up the button once the DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('greet-btn');
    btn.addEventListener('click', showGreeting);
  });
})();
