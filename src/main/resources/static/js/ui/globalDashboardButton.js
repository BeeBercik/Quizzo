import {getLoggedUserData} from "../services/quizService.js";

export default async function updateDashboardButton() {
    const response = await getLoggedUserData();
    if(!response)
        document.getElementById('dashboard-btn').textContent = "User's dashboard";
    else
        document.getElementById('dashboard-btn').textContent = `${response.login}'s panel`;
}