document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const recoveryForm = document.getElementById('recoveryForm');

    const toLoginLink = document.getElementById('toLoginLink');
    const toRegisterLink = document.getElementById('toRegisterLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const cancelRecoveryLink = document.getElementById('cancelRecoveryLink');

    const statusMessage = document.getElementById('statusMessage');
    const recoveryQuestionText = document.getElementById('recoveryQuestionText');

    const PASSWORD_ADMIN = "adminPass123";
    const PASSWORD_EMPLEADO = "empPass123";
    const PASSWORD_USUARIO = "userPass123";

    const slides = document.querySelectorAll('.carousel-slides .slide');
    let currentSlide = 0;

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        currentSlide = index;
    }

    if (slides.length > 0) {
        setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 4000);
    }

    function showForm(formToShow) {
        registerForm.hidden = true;
        loginForm.hidden = true;
        recoveryForm.hidden = true;
        statusMessage.textContent = '';

        formToShow.hidden = false;
    }

    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(loginForm);
    });

    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(registerForm);
    });

    cancelRecoveryLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(loginForm);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const question = document.getElementById('regQuestion').value.trim();
        const answer = document.getElementById('regAnswer').value.trim().toLowerCase();

        if (!question || !answer) {
            statusMessage.textContent = 'La pregunta y respuesta de seguridad son obligatorias.';
            return;
        }

        const user = { username, password, question, answer };

        localStorage.setItem('registeredUser', JSON.stringify(user));
        localStorage.setItem('sessionUser', username);
        
        window.location.href = 'Profile.html';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
        const inputUser = document.getElementById('loginUsername').value.trim();
        const inputPass = document.getElementById('loginPassword').value;

        let isValid = false;

        if (storedUser && inputUser === storedUser.username && inputPass === storedUser.password) {
            isValid = true;
        } else if (inputPass === PASSWORD_ADMIN || inputPass === PASSWORD_EMPLEADO || inputPass === PASSWORD_USUARIO) {
            isValid = true;
        }

        if (isValid) {
            localStorage.setItem('sessionUser', inputUser);
            loginForm.reset();
            window.location.href = 'Profile.html';
        } else {
            statusMessage.textContent = 'Nombre de usuario o contraseña incorrectos.';
        }
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

        if (!storedUser) {
            statusMessage.textContent = 'No hay ninguna cuenta registrada para recuperar.';
            return;
        }

        recoveryQuestionText.textContent = `Pregunta registrada: ${storedUser.question}`;
        showForm(recoveryForm);
    });

    recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
        const inputAnswer = document.getElementById('recoveryAnswer').value.trim().toLowerCase();

        if (storedUser && inputAnswer === storedUser.answer) {
            alert(`Tu contraseña guardada es: ${storedUser.password}`);
            recoveryForm.reset();
            showForm(loginForm);
        } else {
            statusMessage.textContent = 'La respuesta ingresada no coincide.';
        }
    });
});