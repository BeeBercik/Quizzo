
export default function eliminateOption(testDetails, options, eliminated) {
    let random;
    do {
        random = Math.floor(Math.random() * options.length);
    } while(eliminated.includes(random));

    eliminated.push(random);
    options[random].classList.remove("selected");
    options[random].classList.add("eliminated-option");
    options[random].disabled = true;

    const eliminations = document.getElementById("eliminations");
    testDetails.eliminationsCount--;
    eliminations.textContent = testDetails.eliminationsCount;
}