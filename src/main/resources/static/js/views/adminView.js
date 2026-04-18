export default function generateAdminView(users, quizzes, currentUserId) {
    const main = document.querySelector("main");
    main.id = "admin-main";
    main.dataset.view = "admin";

    main.innerHTML = `
        <h2>Admin panel</h2>

        <section class="admin-section">
            <fieldset>
                <legend>Users</legend>
                <table id="admin-users">
                    <thead>
                        <tr>
                            <th>Login</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Active</th>
                            <th>Created</th>
                            <th>Attempts</th>
                            <th>Quizzes</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </fieldset>
        </section>

        <section class="admin-section">
            <fieldset>
                <legend>Quizzes</legend>
                <table id="admin-quizzes">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Code</th>
                            <th>Owner</th>
                            <th>Active</th>
                            <th>Multiple choice</th>
                            <th>Questions</th>
                            <th>Attempts</th>
                            <th>Deactivate</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </fieldset>
        </section>
    `;

    renderUsers(users, currentUserId);
    renderQuizzes(quizzes);
}

function renderUsers(users, currentUserId) {
    const tbody = document.querySelector("#admin-users tbody");
    tbody.innerHTML = "";

    for (const user of users) {
        const tr = document.createElement("tr");
        tr.dataset.userId = user.id;

        const tdLogin = document.createElement("td");
        tdLogin.dataset.label = "Login";
        tdLogin.textContent = user.login;

        const tdEmail = document.createElement("td");
        tdEmail.dataset.label = "Email";
        tdEmail.textContent = user.email;

        const tdRole = document.createElement("td");
        tdRole.dataset.label = "Role";
        const roleSelect = document.createElement("select");
        roleSelect.classList.add("role-select");
        roleSelect.innerHTML = `
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
        `;
        roleSelect.value = user.role;
        roleSelect.disabled = user.id === currentUserId;
        tdRole.appendChild(roleSelect);

        const tdActive = document.createElement("td");
        tdActive.dataset.label = "Active";
        tdActive.textContent = user.active ? "Yes" : "No";

        const tdCreated = document.createElement("td");
        tdCreated.dataset.label = "Created";
        tdCreated.textContent = formatDate(user.createTime);

        const tdAttempts = document.createElement("td");
        tdAttempts.dataset.label = "Attempts";
        tdAttempts.textContent = user.attemptsCount;

        const tdQuizzes = document.createElement("td");
        tdQuizzes.dataset.label = "Quizzes";
        tdQuizzes.textContent = user.createdQuizzesCount;

        const tdStatus = document.createElement("td");
        tdStatus.dataset.label = "Status";
        if (user.id === currentUserId)
            tdStatus.textContent = "Current user";
        else {
            const button = document.createElement("button");
            button.classList.add("toggle-user-status-btn");
            button.type = "button";
            button.dataset.active = String(user.active);
            button.textContent = user.active ? "Deactivate" : "Activate";
            tdStatus.appendChild(button);
        }

        tr.append(tdLogin, tdEmail, tdRole, tdActive, tdCreated, tdAttempts, tdQuizzes, tdStatus);
        tbody.appendChild(tr);
    }
}

function renderQuizzes(quizzes) {
    const tbody = document.querySelector("#admin-quizzes tbody");
    tbody.innerHTML = "";

    for (const quiz of quizzes) {
        const tr = document.createElement("tr");
        tr.dataset.code = quiz.code;

        const tdTitle = document.createElement("td");
        tdTitle.dataset.label = "Title";
        tdTitle.textContent = quiz.title;

        const tdCode = document.createElement("td");
        tdCode.dataset.label = "Code";
        tdCode.textContent = quiz.code;

        const tdOwner = document.createElement("td");
        tdOwner.dataset.label = "Owner";
        tdOwner.textContent = quiz.ownerLogin;

        const tdActive = document.createElement("td");
        tdActive.dataset.label = "Active";
        tdActive.textContent = quiz.active ? "Yes" : "No";

        const tdMultipleChoice = document.createElement("td");
        tdMultipleChoice.dataset.label = "Multiple choice";
        tdMultipleChoice.textContent = quiz.multipleChoice ? "Yes" : "No";

        const tdQuestions = document.createElement("td");
        tdQuestions.dataset.label = "Questions";
        tdQuestions.textContent = quiz.questionsCount;

        const tdAttempts = document.createElement("td");
        tdAttempts.dataset.label = "Attempts";
        tdAttempts.textContent = quiz.attemptsCount;

        const tdDeactivate = document.createElement("td");
        tdDeactivate.dataset.label = "Status";
        const button = document.createElement("button");
        button.classList.add("toggle-quiz-status-btn");
        button.type = "button";
        button.dataset.active = String(quiz.active);
        button.textContent = quiz.active ? "Deactivate" : "Activate";
        tdDeactivate.appendChild(button);

        tr.append(tdTitle, tdCode, tdOwner, tdActive, tdMultipleChoice, tdQuestions, tdAttempts, tdDeactivate);
        tbody.appendChild(tr);
    }
}

function formatDate(iso) {
    if (!iso)
        return "-";

    return new Date(iso).toLocaleString();
}
