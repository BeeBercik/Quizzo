
export default function generateTestView(testDetails) {
    const main = document.querySelector("main");
    main.id = "test-main";
    main.dataset.view = "test";

    main.innerHTML = `
        <div class="additional-info">
            <p>Bad option eliminations: <span id="eliminations">${testDetails.eliminationsCount}</span></p>
            <button id="eliminate-option">Eliminate bad option</button>
            <p>Remaining time:  <span id="time"></span></p>
        </div>

        <form>
            <section class="options">
            </section>

            <section class="q-nav-container">
                <div class="question">
                    <span id="answer-mode"></span>
                    <p></p>
                </div>
                <nav>
                    <button id="next-btn"></button>
                </nav>
            </section>
        </form>
    `;
}
