import {getQuizSummary} from "../services/quizService.js";
import initSummaryView from "../views/summaryView.js";

export default async function initQuizSummary(code) {
    const summary = await getQuizSummary(code);
    initSummaryView(summary);
}