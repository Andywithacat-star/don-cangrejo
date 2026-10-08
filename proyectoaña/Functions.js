(function initAdminAccount() {
  let users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];
  const adminExists = users.some(u => u.username.toLowerCase() === 'admin');
  
  if (!adminExists) {
    users.push({
      username: 'admin',
      password: 'admin123',
      question: '¿Cuál es el nombre de la florería?',
      answer: 'lunarbloom',
      role: 'admin'
    });
    localStorage.setItem('lunarBloomUsers', JSON.stringify(users));
  }
})();

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slides .slide');
  if (slides.length === 0) return;

  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 3500); 
}

document.addEventListener('DOMContentLoaded', () => {

  initCarousel();

  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const recoveryForm = document.getElementById('recoveryForm');
  const statusMessage = document.getElementById('statusMessage');

  const toLoginLink = document.getElementById('toLoginLink');
  const toRegisterLink = document.getElementById('toRegisterLink');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const cancelRecoveryLink = document.getElementById('cancelRecoveryLink');

  if (toLoginLink) {
    toLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerForm) registerForm.hidden = true;
      if (loginForm) loginForm.hidden = false;
      if (recoveryForm) recoveryForm.hidden = true;
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  if (toRegisterLink) {
    toRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginForm) loginForm.hidden = true;
      if (registerForm) registerForm.hidden = false;
      if (recoveryForm) recoveryForm.hidden = true;
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('loginUsername').value.trim();
      const users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];
      const user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());

      if (!user) {
        if (statusMessage) {
          statusMessage.textContent = 'Ingresa un nombre de usuario válido en la casilla primero.';
          statusMessage.style.color = '#FC9C51';
        }
        return;
      }

      document.getElementById('recoveryQuestionText').textContent = user.question;
      recoveryForm.dataset.username = user.username;
      loginForm.hidden = true;
      recoveryForm.hidden = false;
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  if (cancelRecoveryLink) {
    cancelRecoveryLink.addEventListener('click', (e) => {
      e.preventDefault();
      recoveryForm.hidden = true;
      loginForm.hidden = false;
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const question = document.getElementById('regQuestion').value.trim();
      const answer = document.getElementById('regAnswer').value.trim().toLowerCase();

      let users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];

      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        statusMessage.textContent = 'El nombre de usuario ya está registrado.';
        statusMessage.style.color = '#FC9C51';
        return;
      }

      users.push({ username, password, question, answer, role: 'client' });
      localStorage.setItem('lunarBloomUsers', JSON.stringify(users));

      statusMessage.textContent = '¡Cuenta creada con éxito! Ahora inicia sesión.';
      statusMessage.style.color = '#999A57';

      registerForm.reset();
      registerForm.hidden = true;
      loginForm.hidden = false;
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('loginUsername').value.trim();
      const passwordInput = document.getElementById('loginPassword').value.trim();

      const users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];
      const user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

      if (!user) {
        statusMessage.textContent = 'Usuario o contraseña incorrectos.';
        statusMessage.style.color = '#FC9C51';
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));

      statusMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
      statusMessage.style.color = '#999A57';

      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = 'pro2.html';
        } else {
          window.location.href = 'pagCliente.html';
        }
      }, 900);
    });
  }

  if (recoveryForm) {
    recoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const answerInput = document.getElementById('recoveryAnswer').value.trim().toLowerCase();
      const username = recoveryForm.dataset.username;

      const users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (user && user.answer === answerInput) {
        statusMessage.textContent = `Tu contraseña es: ${user.password}`;
        statusMessage.style.color = '#999A57';
      } else {
        statusMessage.textContent = 'Respuesta de seguridad incorrecta.';
        statusMessage.style.color = '#FC9C51';
      }
    });
  }

  const logoBtn = document.getElementById('secretGardenLogoBtn');
  const dropdownMenu = document.getElementById('secretGardenDropdown');
  const btnLogoutClient = document.getElementById('btnLogoutClient');
  const btnEditProfile = document.getElementById('btnEditProfile');
  const modalEdit = document.getElementById('editProfileModal');
  const btnCancelEdit = document.getElementById('btnCancelEdit');
  const editProfileForm = document.getElementById('editProfileForm');

  if (logoBtn && dropdownMenu) {
    logoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.add('hidden');
    });
  }

  if (btnLogoutClient) {
    btnLogoutClient.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'Login.html';
    });
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const clientNameEl = document.getElementById('clientDisplayName');
    const clientHandleEl = document.getElementById('clientDisplayHandle');
    const clientAvatarEl = document.getElementById('clientAvatar');

    if (clientNameEl) clientNameEl.textContent = currentUser.username;
    if (clientHandleEl) clientHandleEl.textContent = `@${currentUser.username.toLowerCase()}`;
    if (clientAvatarEl && currentUser.avatar) {
      clientAvatarEl.src = currentUser.avatar;
    }
  }

  if (btnEditProfile && modalEdit) {
    btnEditProfile.addEventListener('click', () => {
      if (currentUser) {
        document.getElementById('editUsername').value = currentUser.username;
      }
      modalEdit.classList.remove('hidden');
    });
  }

  if (btnCancelEdit && modalEdit) {
    btnCancelEdit.addEventListener('click', () => {
      modalEdit.classList.add('hidden');
    });
  }

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUsername = document.getElementById('editUsername').value.trim();
      const avatarInput = document.getElementById('editAvatar');

      if (!newUsername) return;

      let users = JSON.parse(localStorage.getItem('lunarBloomUsers')) || [];
      const userIndex = users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());

      const saveUpdatedData = (avatarSrc) => {
        currentUser.username = newUsername;
        if (avatarSrc) currentUser.avatar = avatarSrc;

        if (userIndex !== -1) {
          users[userIndex].username = newUsername;
          if (avatarSrc) users[userIndex].avatar = avatarSrc;
          localStorage.setItem('lunarBloomUsers', JSON.stringify(users));
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        const clientNameEl = document.getElementById('clientDisplayName');
        const clientHandleEl = document.getElementById('clientDisplayHandle');
        const clientAvatarEl = document.getElementById('clientAvatar');

        if (clientNameEl) clientNameEl.textContent = newUsername;
        if (clientHandleEl) clientHandleEl.textContent = `@${newUsername.toLowerCase()}`;
        if (clientAvatarEl && avatarSrc) clientAvatarEl.src = avatarSrc;

        modalEdit.classList.add('hidden');
      };

      if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          saveUpdatedData(evt.target.result);
        };
        reader.readAsDataURL(avatarInput.files[0]);
      } else {
        saveUpdatedData(null);
      }
    });
  }

});