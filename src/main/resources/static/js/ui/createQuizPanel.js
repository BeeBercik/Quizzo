
export function createQuestion(qCount) {
    const qArea = document.getElementById("questions");
    const deleteIcon = qCount === 1 ? "" : '<i class="fa-solid fa-trash delete-icon"></i>';

    const qSection = document.createElement("section");
    qSection.innerHTML = `
        <h3>Question #${qCount} ${deleteIcon}</h3>

        <label for="q${qCount}">Q:</label>
        <input type="text" id="q${qCount}" name="q${qCount}" maxlength="70"/>

        <div class="correct-options">
          <h4>Correct options</h4>

          <div class="elements">
            <div class="element">
              <label for="correct${qCount}">1.</label>
              <input type="text" id="correct${qCount}" name="correct${qCount}" maxlength="70"/>
            </div>
          </div>
        </div>

        <div class="center-btn">
          <button class="correct-option-btn" type="button">Add correct response</button>
        </div>

        <div class="bad-options">
          <h4>Bad options</h4>

          <div class="elements">
            <div class="element">
              <label for="bad${qCount}-1">1.</label>
              <input type="text" id="bad${qCount}-1" name="bad${qCount}-1" maxlength="70"/>
            </div>
          </div>
        </div>

        <div class="center-btn">
          <button class="bad-option-btn" type="button">Add bad response</button>
        </div>
    `;
    qSection.classList.add("question");
    qSection.dataset.badOptionCount = "1";
    qSection.dataset.correctOptionCount = "1";
    qArea.appendChild(qSection);
}

export function createCorrectOption(container, questionCount, optCount) {
    const div = document.createElement("div");
    div.classList.add("element");

    div.innerHTML = `
      <label for="correct${questionCount}-${optCount}">${optCount}. <i class="fa-solid fa-trash delete-icon"></i></label>
      <input type="text" id="correct${questionCount}-${optCount}" name="correct${questionCount}-${optCount}" maxlength="70"/>
    `;

    container.appendChild(div);
}

export function createBadOption(container, questionCount, optCount) {
    const div = document.createElement("div");
    div.classList.add("element");

    div.innerHTML = `
      <label for="bad${questionCount}-${optCount}">${optCount}. <i class="fa-solid fa-trash delete-icon"></i></label>
      <input type="text" id="bad${questionCount}-${optCount}" name="bad${questionCount}-${optCount}" maxlength="70"/>
    `;

    container.appendChild(div);
}
