document.addEventListener('DOMContentLoaded', () => {
    const sessionUser = localStorage.getItem('sessionUser');
    const profileImg = document.getElementById('profileImg');
    const photoInput = document.getElementById('photoInput');
    const newUsernameInput = document.getElementById('newUsername');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!sessionUser) {
        window.location.href = 'index.html';
        return;
    }

    if (newUsernameInput) {
        newUsernameInput.value = sessionUser;
    }

    const savedPhoto = localStorage.getItem('profilePhoto_' + sessionUser);
    if (savedPhoto && profileImg) {
        profileImg.src = savedPhoto;
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedName = newUsernameInput.value.trim();

            if (photoInput && photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    const imageBase64 = evt.target.result;
                    if (profileImg) profileImg.src = imageBase64;
                    localStorage.setItem('profilePhoto_' + updatedName, imageBase64);
                };
                reader.readAsDataURL(photoInput.files[0]);
            }

            if (updatedName) {
                localStorage.setItem('sessionUser', updatedName);

                const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
                if (storedUser) {
                    storedUser.username = updatedName;
                    localStorage.setItem('registeredUser', JSON.stringify(storedUser));
                }

                alert('Perfil actualizado con éxito');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('sessionUser');
            window.location.href = 'index.html';
        });
    }
});