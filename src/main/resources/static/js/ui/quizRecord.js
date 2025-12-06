
export function generateAttendedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.quizTitle;
    const tdResult = document.createElement("td");
    tdResult.textContent = `${data.score} %`;
    const tdDate = document.createElement("td");
    let formattedDate = "-";
    if (data.attemptTime) {
        const parsedDate = new Date(data.attemptTime);
        formattedDate = isNaN(parsedDate.getTime()) ? data.attemptTime : parsedDate.toLocaleString();
    }
    tdDate.textContent = formattedDate;

    tr.append(tdTitle, tdResult, tdDate);
    document.querySelector("#attendedTests tbody").appendChild(tr);
}

export function generateCreatedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.title;
    const tdCode = document.createElement("td");
    tdCode.textContent = data.code;
    tdCode.classList.add('code-td');
    const tdEdit = document.createElement("td");
    tdEdit.textContent = 'E';
    tdEdit.classList.add('q-edit');
    const tdDelete = document.createElement("td");
    tdDelete.textContent = 'D';
    tdDelete.classList.add('q-delete');
    const tdSummary = document.createElement("td");
    tdSummary.textContent = 'S';
    tdSummary.classList.add('q-summary');

    tr.append(tdTitle, tdCode, tdEdit, tdSummary, tdDelete);
    document.querySelector("#createdTests tbody").appendChild(tr);
}
