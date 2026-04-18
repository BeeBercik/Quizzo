import {generateParticipantRow} from "../ui/participantRecord.js";

export default function generateSummaryView(summary) {
    const main = document.querySelector("main");
    main.id = "summary-main";
    main.dataset.view = "summary";

    const { title, code, creationDate, multipleChoice, users = [] } = summary;

    let attempts = [];
    for (const user of users) {
        if (user.attempts) {
            for (const a of user.attempts) {
                attempts.push(a);
                }
        }
    }

    const scoreAvg = attempts.length
        ? Math.round(attempts.reduce((sum, currEl) => sum + (currEl.score || 0), 0) / attempts.length)
        : 0;

    const dateFormat = (iso) =>
        iso
            ? new Date(iso).toLocaleString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "-";

    main.innerHTML = `
    <h2 class="page-title">Summary - <span id="quiz-title"></span></h2>

    <section class="summary">
      <fieldset class="section">
        <legend>Quiz details</legend>
        <table class="summary-table">
          <tbody>
            <tr><th>Title</th><td>${title}</td></tr>
            <tr><th>Code</th><td><strong>${code}</strong></td></tr>
            <tr><th>Multiple choice</th><td>${multipleChoice ? "Yes" : "No"}</td></tr>
            <tr><th>Created</th><td>${dateFormat(creationDate)}</td></tr>
            <tr><th>Users</th><td>${users.length}</td></tr>
            <tr><th>Attempts</th><td>${attempts.length}</td></tr>
            <tr><th>Average score</th><td>${scoreAvg} %</td></tr>
          </tbody>
        </table>
      </fieldset>

      <fieldset class="section">
        <legend>Participants</legend>
        ${users.length === 0 ? `<p>No participants</p>` : `
          <table id="participants" class="summary-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody id="participants-body"></tbody>
          </table>
        `}
      </fieldset>
    </section>
`;

    document.getElementById("quiz-title").textContent = title;
    if (users.length)
        users.forEach((u) => generateParticipantRow(u, dateFormat));
}