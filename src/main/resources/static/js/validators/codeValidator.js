import generateError from "../ui/errorBar.js";

export function codeValidation(code) {
    if(code.length !== 5) {
        generateError("Code must have 5 letters");
        return false;
    } else return true;
}