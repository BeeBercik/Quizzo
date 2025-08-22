import {generateAttendedTestRecord, generateCreatedTestRecord} from "../ui/quizRecord.js";

export default function initDashboardView(userData) {
    const attended = userData.attempts;
    const created = userData.createdQuizzes;

    const main = document.querySelector("main");
    main.id = "dashboard-main";
    main.dataset.view = "dashboard";
    main.innerHTML = `
    <h2>Welcome, <span id="user-login"></span>!</h2>

    <div class="dashboard-wrapper">
      <section class="actions">

        <div>
          <form>
            <input type="text" maxlength="5" class="code" placeholder="Code"/>
            <button type="submit">Enter the code</button>
          </form>
        </div>

        <div>
          <button id="create-test"><a href="create.html">Create test/quiz</a></button>
        </div>

      </section>

      <section class="summary">
        <fieldset>
          <legend>Test & quiz's history</legend>

          <table id="attendedTests">
            <thead>
            <tr>
              <th>Title</th>
              <th>Result</th>
            </tr>
            </thead>
            <tbody>
<!--         generating from function   -->
            </tbody>
          </table>

        </fieldset>

        <fieldset>
          <legend>Your active tests/quizzes</legend>

          <table id="createdTests">
            <thead>
            <tr>
              <th>Title</th>
              <th>Code</th>
<!--           delete and summary options       -->
            </tr>
            </thead>
            <tbody>
<!--         generating from function   -->
            </tbody>
          </table>
        </fieldset>

      </section>
    </div>`;
    attended.forEach(record => generateAttendedTestRecord(record));
    created.forEach(record => generateCreatedTestRecord(record));
    document.getElementById('user-login').textContent = userData.login;
}