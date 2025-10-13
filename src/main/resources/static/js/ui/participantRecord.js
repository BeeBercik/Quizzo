
export function generateParticipantRow(user, fmt) {
    const tbody = document.querySelector("#participants-body");

    const attempts = (user.attempts || []).slice()
        .sort((a, b) => new Date(b.attemptTime) - new Date(a.attemptTime));

    const tr = document.createElement("tr");

    const tdLogin = document.createElement("td");
    tdLogin.textContent = user.login || "-";

    const tdEmail = document.createElement("td");
    tdEmail.textContent = user.email || "-";

    const tdCount = document.createElement("td");
    tdCount.textContent = attempts.length;
    tdCount.style.textAlign = "center";

    tr.append(tdLogin, tdEmail, tdCount);
    tbody.appendChild(tr);

    if (attempts.length) {
        const trDetails = document.createElement("tr");
        trDetails.className = "row-details";

        const tdDetails = document.createElement("td");
        tdDetails.className = "cell-details";
        tdDetails.colSpan = 3;

        const title = document.createElement("div");
        title.textContent = "Attempts";
        title.className = "attempt-history";

        const ul = document.createElement("ul");
        ul.className = "attempts-list";

        for (let i = 0; i < attempts.length; i++) {
            const a = attempts[i];
            const li = document.createElement("li");
            li.textContent = `${a.score} % - ${fmt(a.attemptTime)}`;
            ul.appendChild(li);
        }

        tdDetails.append(title, ul);
        trDetails.appendChild(tdDetails);
        tbody.appendChild(trDetails);
    }
}