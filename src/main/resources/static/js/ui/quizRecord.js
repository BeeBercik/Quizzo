
export function generateAttendedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.title;
    const tdResult = document.createElement("td");
    tdResult.textContent = data.result;

    tr.append(tdTitle, tdResult);
    document.querySelector("#attendedTests tbody").appendChild(tr);
}

export function generateCreatedTestRecord(data) {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = data.title;
    const tdCode = document.createElement("td");
    tdCode.textContent = data.code;
    // DELETE option

    tr.append(tdTitle, tdCode);
    document.querySelector("#createdTests tbody").appendChild(tr);
}