import {getQuizSummary} from "../services/quizService.js";
import generateSummaryView from "../views/summaryView.js";

export default async function initQuizSummary(code) {
    const summary = await getQuizSummary(code);
    if(summary) generateSummaryView(summary);
    console.log(summary);
}