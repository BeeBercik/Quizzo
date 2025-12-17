import { sendCreatedTest } from "../services/quizService.js";
import { generateError, generateSuccess } from "../ui/globalMessageBar.js";
import initView from "../router.js";
import { initQuizForm } from "./quizFormController.js";

export default function initCreateTest() {
    initQuizForm("create", null, async (finalTestData) => {
        const success = await sendCreatedTest(finalTestData);
        if (success) {
            initView("dashboard");
            generateSuccess("Quiz created");
        } else
            generateError("Error during saving to database");
    });
}