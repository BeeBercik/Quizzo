import { getQuizForEdit, updateQuiz } from "../services/quizService.js";
import { generateError, generateSuccess } from "../ui/globalMessageBar.js";
import initView from "../router.js";
import { initQuizForm } from "./quizFormController.js";

export default async function initEditTest(code) {
    const quizData = await getQuizForEdit(code);

    if (quizData == null) {
        generateError("Quiz not found or you cannot edit it");
        initView("dashboard");
        return;
    }

    initQuizForm("edit", quizData, async (finalTestData) => {
        const success = await updateQuiz(quizData.code, finalTestData);
        if (success) {
            initView("dashboard");
            generateSuccess("Quiz updated");
        } else
            generateError("Cannot update qu'" + "iz");
    });
}
