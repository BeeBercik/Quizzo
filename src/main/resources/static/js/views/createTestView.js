
export default function initCreateTestView() {
    const main = document.querySelector("main");
    main.dataset.view = "create-test";
    main.id = "create-main";

    main.innerHTML = `
            
    <h2>Create your own test / quiz</h2>

    <form>
      <section class="options">
        <div class="add-opt-wrapper">
          <div class="option">
            <label for="elimination">Bad options elimination</label>
            <input type="checkbox" id="elimination">
          </div>

          <div class="option"> <!-- jesli checkbox nie active to disabled -->
            <label for="quantity">How many eliminations</label>
            <input type="number" id="quantity" min="1">
          </div>
        </div>

        <div class="option">
          <label for="duration">Time duration [min]</label>
          <input type="number" id="duration" min="1" max="300">
        </div>
      </section>

      <section id="questions">
<!--        generating      -->
      </section>
      
      <button id="new-question-btn" type="button">Add new question</button>

      <button type="submit">Create</button>
    </form>
    `;
}