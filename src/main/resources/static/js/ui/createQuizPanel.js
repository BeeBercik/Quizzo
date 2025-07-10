
export function createQuestion(qCount) {
    const qArea = document.getElementById("questions");

    const qSection = document.createElement("section");
    qSection.innerHTML = `
        <h3>Question #${qCount}</h3>

        <label for="q${qCount}">Q:</label>
        <input type="text" id="q${qCount}" name="q${qCount}"/>

        <label for="correct">Correct option:</label>
        <input type="text" id="correct" name="correct"/>

        <div class="bad-options">
          <h4>Bad options</h4>

          <div class="elements">
<!--          generating      -->
          </div>
        </div>

        <div class="center-btn">
          <button class="bad-option-btn" type="button">Add bad response</button>
        </div>
    `;
    qSection.classList.add("question");
    qSection.dataset.badOptionCount = "0";
    qArea.appendChild(qSection);
}

export function createBadOption(container, optCount) {
    const div = document.createElement("div");
    div.classList.add("element");

    div.innerHTML = `
      <label for="bad${optCount}">${optCount}.</label>
      <input type="text" id="bad${optCount}" name="bad${optCount}"/>
    `;

    container.appendChild(div);
}