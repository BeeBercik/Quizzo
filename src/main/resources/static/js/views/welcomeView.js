
export default function generateWelcomeView() {
    const main = document.querySelector("main");
    main.id = "welcome-main";
    main.dataset.view = "welcome";

    main.innerHTML =
        `
        <section class="entry-code">
                <h2>Quizzo</h2>

                <form>
                    <input type="text" maxlength="5" placeholder="Code" class="code"/>
                    <button type="submit">Enter the code</button>
                </form>

                <p>
                    .. or <a href="forms.html">log in</a>
                </p>
            </section>

            <section class="about">
                <p>
                    Quizzo is a completely free platform for creating and taking quizzes and tests. Here, you can challenge yourself and deepen your knowledge in a fun and engaging way. The only requirement to use the app is to log in - if you haven’t done that yet, create an account and jump in! Then enter the quiz or test's code and have fun!
                </p>
            </section>
        `;
}