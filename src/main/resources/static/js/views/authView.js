

export default function generateAuthView()
{
    const main = document.querySelector("main");
    main.id = "auth-main";
    main.dataset.view = "auth";

    main.innerHTML = `
        <section>
            <fieldset>
                <legend>Log in</legend>
    
                <form id="login-form">
                    <div class="form-field">
                        <label for="login-username">Login</label>
                        <input type="text" name="login" id="login-login"/>
                    </div>
    
                    <div class="form-field">
                        <label for="login-password">Password</label>
                        <input type="password" name="password" id="login-password"/>
                    </div>
    
                    <button type="submit">Login</button>
                </form>
            </fieldset>
        </section>
    
        <section>
            <fieldset>
                <legend>Register</legend>
    
                <form id="register-form">
                    <div class="form-field">
                        <label for="register-login">Login</label>
                        <input type="text" name="login" id="register-login"/>
                    </div>
    
                    <div class="form-field">
                        <label for="register-email">E-mail</label>
                        <input type="email" name="register-email" id="register-email"/>
                    </div>
    
                    <div class="form-field">
                        <label for="register-password">Password</label>
                        <input type="password" name="password" id="register-password"/>
                    </div>
    
                    <button type="submit">Register</button>
                </form>
            </fieldset>
        </section>
    `;
}