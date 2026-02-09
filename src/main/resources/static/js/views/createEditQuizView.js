
export default function initCreateEditTestView(mode = "create", code = null) {
    const main = document.querySelector("main");
    main.dataset.view = mode === "edit" ? "edit-test" : "create-test";
    main.id = "create-main";

    const heading = mode === "edit" ? "Edit your test / quiz" : "Create your own test / quiz";
    const submitLabel = mode === "edit" ? "Save changes" : "Create";
    const codeInfo = mode === "edit" && code ? `<p class="quiz-code">Code: <span>${code}</span></p>` : "";

    main.innerHTML = `
    <h2>${heading}</h2>
    ${codeInfo}

    <form>
      <label for="q-title">Title:</label>
      <input type="text" id="q-title" maxlength="40">
      
      <section class="options">
        <div class="add-opt-wrapper">
          <div class="option">
            <label for="elimination">Bad options elimination</label>
            <input type="checkbox" id="elimination">
          </div>

          <div class="option">
            <label for="quantity">How many eliminations</label>
            <input type="number" id="quantity" min="1" max="99">
          </div>
        </div>

        <div class="option">
          <label for="duration">Time duration [min]</label>
          <input type="number" id="duration" min="1" max="300" step="0.1">
        </div>
      </section>

      <section id="questions">
<!--        generating      -->
      </section>
      
      <button id="new-question-btn" type="button">Add new question</button>

      <button id="cancel-quiz-btn" type="button">Cancel</button>
      <button type="submit">${submitLabel}</button>
    </form>
    `;
}
