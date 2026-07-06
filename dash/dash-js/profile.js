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

    // ─── Edit buttons (placeholder) ───
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.dataset.section || 'profile';
            alert(`✏️ Edit "${section}" section would open inline editing.`);
        });
    });

    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
    // 1. EMAIL CHANGE FUNCTIONALITY
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

    const currentEmailDisplay = document.getElementById('currentEmailDisplay');
    const personalEmailDisplay = document.getElementById('personalEmailDisplay');
    const newEmailInput = document.getElementById('newEmailInput');
    const confirmEmailInput = document.getElementById('confirmEmailInput');
    const emailCurrentPassword = document.getElementById('emailCurrentPassword');
    const updateEmailBtn = document.getElementById('updateEmailBtn');

    const newEmailFeedback = document.getElementById('newEmailFeedback');
    const confirmEmailFeedback = document.getElementById('confirmEmailFeedback');
    const emailCurrentPwFeedback = document.getElementById('emailCurrentPwFeedback');

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFeedback(el, msg, type) {
        el.textContent = msg;
        el.className = 'form-feedback ' + type;
    }

    function hideFeedback(el) {
        el.textContent = '';
        el.className = 'form-feedback hidden';
    }

    function clearEmailFields() {
        newEmailInput.value = '';
        confirmEmailInput.value = '';
        emailCurrentPassword.value = '';
        hideFeedback(newEmailFeedback);
        hideFeedback(confirmEmailFeedback);
        hideFeedback(emailCurrentPwFeedback);
        newEmailInput.classList.remove('success', 'error');
        confirmEmailInput.classList.remove('success', 'error');
        emailCurrentPassword.classList.remove('success', 'error');
    }

    // Real-time validation for email fields
    newEmailInput.addEventListener('input', function () {
        const val = this.value.trim();
        if (val && !isValidEmail(val)) {
            showFeedback(newEmailFeedback, '⚠️ Please enter a valid email address.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        } else if (val && isValidEmail(val)) {
            showFeedback(newEmailFeedback, '✅ Valid email format.', 'success');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            hideFeedback(newEmailFeedback);
            this.classList.remove('success', 'error');
        }

        const confirmVal = confirmEmailInput.value.trim();
        if (confirmVal && val !== confirmVal) {
            showFeedback(confirmEmailFeedback, '❌ Emails do not match.', 'error');
            confirmEmailInput.classList.remove('success');
            confirmEmailInput.classList.add('error');
        } else if (confirmVal && val === confirmVal && isValidEmail(val)) {
            showFeedback(confirmEmailFeedback, '✅ Emails match.', 'success');
            confirmEmailInput.classList.remove('error');
            confirmEmailInput.classList.add('success');
        }
    });

    confirmEmailInput.addEventListener('input', function () {
        const val = this.value.trim();
        const newVal = newEmailInput.value.trim();

        if (!val) {
            hideFeedback(confirmEmailFeedback);
            this.classList.remove('success', 'error');
            return;
        }

        if (val !== newVal) {
            showFeedback(confirmEmailFeedback, '❌ Emails do not match.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        } else if (isValidEmail(newVal)) {
            showFeedback(confirmEmailFeedback, '✅ Emails match.', 'success');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            showFeedback(confirmEmailFeedback, '⚠️ Please enter a valid email first.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        }
    });

    emailCurrentPassword.addEventListener('input', function () {
        if (this.value.trim()) {
            hideFeedback(emailCurrentPwFeedback);
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.remove('success');
        }
    });

    updateEmailBtn.addEventListener('click', function () {
        const newEmail = newEmailInput.value.trim();
        const confirmEmail = confirmEmailInput.value.trim();
        const currentPw = emailCurrentPassword.value.trim();

        let hasError = false;

        if (!newEmail) {
            showFeedback(newEmailFeedback, '⚠️ Please enter a new email address.', 'error');
            newEmailInput.classList.add('error');
            hasError = true;
        } else if (!isValidEmail(newEmail)) {
            showFeedback(newEmailFeedback, '⚠️ Please enter a valid email address.', 'error');
            newEmailInput.classList.add('error');
            hasError = true;
        } else {
            newEmailInput.classList.remove('error');
            newEmailInput.classList.add('success');
        }

        if (!confirmEmail) {
            showFeedback(confirmEmailFeedback, '⚠️ Please confirm your new email.', 'error');
            confirmEmailInput.classList.add('error');
            hasError = true;
        } else if (confirmEmail !== newEmail) {
            showFeedback(confirmEmailFeedback, '❌ Emails do not match.', 'error');
            confirmEmailInput.classList.add('error');
            hasError = true;
        } else if (isValidEmail(newEmail) && confirmEmail === newEmail) {
            confirmEmailInput.classList.remove('error');
            confirmEmailInput.classList.add('success');
        }

        if (!currentPw) {
            showFeedback(emailCurrentPwFeedback, '⚠️ Please enter your current password for verification.',
                'error');
            emailCurrentPassword.classList.add('error');
            hasError = true;
        } else {
            emailCurrentPassword.classList.remove('error');
            emailCurrentPassword.classList.add('success');
        }

        if (hasError) return;

        const currentEmail = currentEmailDisplay.textContent.trim();
        if (newEmail === currentEmail) {
            showFeedback(newEmailFeedback, '⚠️ New email is the same as current email.', 'error');
            newEmailInput.classList.add('error');
            return;
        }

        // Success
        currentEmailDisplay.textContent = newEmail;
        personalEmailDisplay.textContent = newEmail;

        showFeedback(newEmailFeedback, '✅ Email updated successfully!', 'success');
        setTimeout(() => {
            clearEmailFields();
            setTimeout(() => {
                hideFeedback(newEmailFeedback);
                hideFeedback(confirmEmailFeedback);
                hideFeedback(emailCurrentPwFeedback);
            }, 2000);
        }, 800);

        alert('✅ Your email has been updated to: ' + newEmail);
    });

    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
    // 2. PASSWORD CHANGE FUNCTIONALITY
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

    const changePwBtn = document.getElementById('changePwBtn');
    const pwCurrentPassword = document.getElementById('pwCurrentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const pwCurrentPwFeedback = document.getElementById('pwCurrentPwFeedback');
    const newPwFeedback = document.getElementById('newPwFeedback');
    const confirmPwFeedback = document.getElementById('confirmPwFeedback');

    // Real-time password validation
    newPasswordInput.addEventListener('input', function () {
        const val = this.value.trim();
        if (val && val.length < 6) {
            showFeedback(newPwFeedback, '⚠️ Password must be at least 6 characters.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        } else if (val && val.length >= 6) {
            showFeedback(newPwFeedback, '✅ Strong password.', 'success');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            hideFeedback(newPwFeedback);
            this.classList.remove('success', 'error');
        }

        const confirmVal = confirmPasswordInput.value.trim();
        if (confirmVal && val !== confirmVal) {
            showFeedback(confirmPwFeedback, '❌ Passwords do not match.', 'error');
            confirmPasswordInput.classList.remove('success');
            confirmPasswordInput.classList.add('error');
        } else if (confirmVal && val === confirmVal && val.length >= 6) {
            showFeedback(confirmPwFeedback, '✅ Passwords match.', 'success');
            confirmPasswordInput.classList.remove('error');
            confirmPasswordInput.classList.add('success');
        }
    });

    confirmPasswordInput.addEventListener('input', function () {
        const val = this.value.trim();
        const newVal = newPasswordInput.value.trim();

        if (!val) {
            hideFeedback(confirmPwFeedback);
            this.classList.remove('success', 'error');
            return;
        }

        if (val !== newVal) {
            showFeedback(confirmPwFeedback, '❌ Passwords do not match.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        } else if (newVal.length >= 6) {
            showFeedback(confirmPwFeedback, '✅ Passwords match.', 'success');
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            showFeedback(confirmPwFeedback, '⚠️ Password must be at least 6 characters.', 'error');
            this.classList.remove('success');
            this.classList.add('error');
        }
    });

    pwCurrentPassword.addEventListener('input', function () {
        if (this.value.trim()) {
            hideFeedback(pwCurrentPwFeedback);
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.remove('success');
        }
    });

    changePwBtn.addEventListener('click', function () {
        const currentPw = pwCurrentPassword.value.trim();
        const newPw = newPasswordInput.value.trim();
        const confirmPw = confirmPasswordInput.value.trim();

        let hasError = false;

        if (!currentPw) {
            showFeedback(pwCurrentPwFeedback, '⚠️ Please enter your current password.', 'error');
            pwCurrentPassword.classList.add('error');
            hasError = true;
        } else {
            pwCurrentPassword.classList.remove('error');
            pwCurrentPassword.classList.add('success');
        }

        if (!newPw) {
            showFeedback(newPwFeedback, '⚠️ Please enter a new password.', 'error');
            newPasswordInput.classList.add('error');
            hasError = true;
        } else if (newPw.length < 6) {
            showFeedback(newPwFeedback, '⚠️ Password must be at least 6 characters.', 'error');
            newPasswordInput.classList.add('error');
            hasError = true;
        } else {
            newPasswordInput.classList.remove('error');
            newPasswordInput.classList.add('success');
        }

        if (!confirmPw) {
            showFeedback(confirmPwFeedback, '⚠️ Please confirm your new password.', 'error');
            confirmPasswordInput.classList.add('error');
            hasError = true;
        } else if (confirmPw !== newPw) {
            showFeedback(confirmPwFeedback, '❌ Passwords do not match.', 'error');
            confirmPasswordInput.classList.add('error');
            hasError = true;
        } else if (newPw.length >= 6 && confirmPw === newPw) {
            confirmPasswordInput.classList.remove('error');
            confirmPasswordInput.classList.add('success');
        }

        if (hasError) return;

        showFeedback(newPwFeedback, '✅ Password changed successfully!', 'success');
        setTimeout(() => {
            pwCurrentPassword.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            hideFeedback(pwCurrentPwFeedback);
            hideFeedback(newPwFeedback);
            hideFeedback(confirmPwFeedback);
            pwCurrentPassword.classList.remove('success', 'error');
            newPasswordInput.classList.remove('success', 'error');
            confirmPasswordInput.classList.remove('success', 'error');
        }, 1500);

        alert('✅ Your password has been changed successfully!');
    });

    // ─── Enter key support ───
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const active = document.activeElement;
            if (active && (active.id === 'newEmailInput' || active.id === 'confirmEmailInput' ||
                active.id === 'emailCurrentPassword')) {
                updateEmailBtn.click();
            }
            if (active && (active.id === 'pwCurrentPassword' || active.id === 'newPassword' ||
                active.id === 'confirmPassword')) {
                changePwBtn.click();
            }
        }
    });

})();