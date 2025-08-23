
export function generateAttendedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.quizTitle;
    const tdResult = document.createElement("td");
    tdResult.textContent = `${data.score} %`;

    tr.append(tdTitle, tdResult);
    document.querySelector("#attendedTests tbody").appendChild(tr);
}

export function generateCreatedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.title;
    const tdCode = document.createElement("td");
    tdCode.textContent = data.code;
    tdCode.classList.add('code-td');
    const tdDelete = document.createElement("td");
    tdDelete.textContent = 'D';
    tdDelete.classList.add('q-delete');
    const tdSummary = document.createElement("td");
    tdSummary.textContent = 'S';
    tdSummary.classList.add('q-summary');

    tr.append(tdTitle, tdCode, tdDelete, tdSummary);
    document.querySelector("#createdTests tbody").appendChild(tr);
}