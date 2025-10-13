import {getQuizSummary} from "../services/quizService.js";
import generateSummaryView from "../views/summaryView.js";
import {generateError} from "../ui/globalMessageBar.js";

export default async function initQuizSummary(code) {
    const summary = await getQuizSummary(code);
    if (summary)
        generateSummaryView(summary);
    else
        generateError('Quiz summary cannot be shown');
}