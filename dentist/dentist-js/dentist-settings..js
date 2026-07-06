(function () {
    'use strict';

    // ─── Sidebar logic ───
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        toggleBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
    }

    toggleBtn.addEventListener('click', function () {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            closeSidebar();
        }
    });

    sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 900) {
                if (!this.classList.contains('logout')) {
                    closeSidebar();
                }
            }
        });
    });

    // ─── Logout modal logic ───
    const logoutModal = document.getElementById('logoutModal');
    const stayBtn = document.getElementById('stayBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    const logoutLink = document.querySelector('.sidebar-nav a.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeLogoutModal() {
        logoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    stayBtn.addEventListener('click', closeLogoutModal);

    confirmLogoutBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    logoutModal.addEventListener('click', function (e) {
        if (e.target === logoutModal) {
            closeLogoutModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && logoutModal.classList.contains('active')) {
            closeLogoutModal();
        }
    });

    // ─── Edit Profile Modal ───
    const editModal = document.getElementById('editProfileModal');
    const editModalClose = document.getElementById('editModalClose');
    const editModalCancel = document.getElementById('editModalCancel');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    // Profile data
    const profileData = {
        name: 'Womark Salita',
        role: 'Dentist',
        email: 'womarksalita@gmail.com',
        avatar: 'W'
    };

    // DOM refs
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    const editEmailDisplay = document.getElementById('editEmailDisplay');

    function openEditModal() {
        // Populate modal with current data
        editEmailDisplay.value = profileData.email;
        document.getElementById('editCurrentEmail').value = '';
        document.getElementById('editNewEmail').value = '';
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    editProfileBtn.addEventListener('click', openEditModal);
    editModalClose.addEventListener('click', closeEditModal);
    editModalCancel.addEventListener('click', closeEditModal);

    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeEditModal();
        }
    });

    // ─── Edit Profile Form Submit ───
    editProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentEmail = document.getElementById('editCurrentEmail').value.trim();
        const newEmail = document.getElementById('editNewEmail').value.trim();

        if (!currentEmail) {
            alert('Please enter your current email.');
            return;
        }

        if (!newEmail) {
            alert('Please enter a new email address.');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (currentEmail !== profileData.email) {
            alert('Current email does not match our records.');
            return;
        }

        if (newEmail === profileData.email) {
            alert('New email is the same as your current email.');
            return;
        }

        // Update profile
        profileData.email = newEmail;
        profileEmail.textContent = newEmail;
        editEmailDisplay.value = newEmail;

        alert('✅ Email updated successfully to: ' + newEmail);

        closeEditModal();
        // Clear modal fields
        document.getElementById('editCurrentEmail').value = '';
        document.getElementById('editNewEmail').value = '';
    });

    // ─── Change Password ───
    const passwordForm = document.getElementById('passwordForm');

    passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const current = document.getElementById('currentPassword').value.trim();
        const newPw = document.getElementById('newPassword').value.trim();
        const confirm = document.getElementById('confirmPassword').value.trim();

        if (!current || !newPw || !confirm) {
            alert('Please fill in all password fields.');
            return;
        }

        if (newPw.length < 8) {
            alert('New password must be at least 8 characters long.');
            return;
        }

        if (newPw !== confirm) {
            alert('New password and confirmation do not match.');
            return;
        }

        alert('✅ Password changed successfully!');
        this.reset();
    });

})();