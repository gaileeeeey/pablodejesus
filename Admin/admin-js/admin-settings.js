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

    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
    // 1. EMAIL CHANGE FUNCTIONALITY
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

    const currentEmailDisplay = document.getElementById('currentEmailDisplay');
    const newEmailInput = document.getElementById('newEmail');
    const confirmEmailInput = document.getElementById('confirmEmail');
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

        currentEmailDisplay.textContent = newEmail;

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
    // 2. CHANGE PASSWORD
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

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

        alert('Password changed successfully!');
        this.reset();
    });

    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───
    // 3. DENTIST MANAGEMENT - VIEW & EDIT MODALS
    // ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ─── ───

    const viewModal = document.getElementById('viewDentistModal');
    const editModal = document.getElementById('editDentistModal');
    const viewModalClose = document.getElementById('viewModalClose');
    const viewModalBack = document.getElementById('viewModalBack');
    const viewModalEdit = document.getElementById('viewModalEdit');
    const editModalClose = document.getElementById('editModalClose');
    const editModalCancel = document.getElementById('editModalCancel');
    const editForm = document.getElementById('editDentistForm');

    let currentDentistId = null;
    let currentDentistData = {};

    // ─── Dentist data store ───
    const dentistData = {
        1: {
            name: 'Dr. Rosa Garcia',
            contact: '0812345698',
            email: 'rosagarcia@gmail.com',
            specialization: 'General Dentistry',
            experience: '5',
            days: ['Monday', 'Tuesday'],
            startTime: '09:00',
            endTime: '17:00',
            status: 'Active',
            schedule: 'Mon-Tue, 9:00AM-5:00PM'
        },
        2: {
            name: 'Dr. Jeniffer Gomez',
            contact: '0986543261',
            email: 'jengomez@gmail.com',
            specialization: 'Orthodontics',
            experience: '7',
            days: ['Wednesday', 'Thursday'],
            startTime: '09:00',
            endTime: '17:00',
            status: 'Active',
            schedule: 'Wed-Thu, 9:00AM-5:00PM'
        },
        3: {
            name: 'Dr. Carlos Mendoza',
            contact: '0988765435',
            email: 'cmendiza@gmail.com',
            specialization: 'Periodontics',
            experience: '4',
            days: ['Friday', 'Saturday'],
            startTime: '09:00',
            endTime: '17:00',
            status: 'Active',
            schedule: 'Fri-Sat, 9:00AM-5:00PM'
        },
        4: {
            name: 'Dr. Anna Lim',
            contact: '0912345678',
            email: 'annalim@dental.com',
            specialization: 'Endodontics',
            experience: '3',
            days: ['Monday', 'Tuesday', 'Wednesday'],
            startTime: '10:00',
            endTime: '18:00',
            status: 'Inactive',
            schedule: 'Mon-Wed, 10:00AM-6:00PM'
        }
    };

    // ─── Populate View Modal ───
    function populateViewModal(id) {
        const data = dentistData[id];
        if (!data) return;

        document.getElementById('viewName').textContent = data.name;
        document.getElementById('viewContact').textContent = data.contact;
        document.getElementById('viewEmail').textContent = data.email;
        document.getElementById('viewSpecialization').textContent = data.specialization;
        document.getElementById('viewExperience').textContent = data.experience + ' years';

        // Days
        const daysHtml = data.days.map(d => `<span>${d}</span>`).join('');
        document.getElementById('viewDays').innerHTML = daysHtml;

        document.getElementById('viewSchedule').textContent = data.schedule;

        // Status
        const statusEl = document.getElementById('viewStatus');
        statusEl.textContent = data.status;
        statusEl.className = 'view-status' + (data.status === 'Inactive' ? ' inactive' : '');
    }

    // ─── Populate Edit Modal ───
    function populateEditModal(id) {
        const data = dentistData[id];
        if (!data) return;

        document.getElementById('editName').value = data.name;
        document.getElementById('editContact').value = data.contact;
        document.getElementById('editEmail').value = data.email;
        document.getElementById('editSpecialization').value = data.specialization;
        document.getElementById('editExperience').value = data.experience;

        // Days checkboxes
        const dayCheckboxes = document.querySelectorAll('#editDaysGrid input[type="checkbox"]');
        dayCheckboxes.forEach(cb => {
            cb.checked = data.days.includes(cb.value);
            cb.closest('label').classList.toggle('checked', cb.checked);
        });

        // Time
        document.getElementById('editStartTime').value = data.startTime;
        document.getElementById('editEndTime').value = data.endTime;

        // Status radio
        const statusRadios = document.querySelectorAll('input[name="editStatus"]');
        statusRadios.forEach(radio => {
            radio.checked = radio.value === data.status;
        });

        // Store current ID
        currentDentistId = id;
        currentDentistData = { ...data };
    }

    // ─── Day checkbox toggle styling ───
    document.querySelectorAll('#editDaysGrid input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function () {
            this.closest('label').classList.toggle('checked', this.checked);
        });
    });

    // ─── Open View Modal ───
    function openViewModal(id) {
        populateViewModal(id);
        viewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ─── Open Edit Modal ───
    function openEditModal(id) {
        populateEditModal(id);
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ─── Close View Modal ───
    function closeViewModal() {
        viewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ─── Close Edit Modal ───
    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ─── View Modal Events ───
    viewModalClose.addEventListener('click', closeViewModal);
    viewModalBack.addEventListener('click', closeViewModal);

    viewModal.addEventListener('click', function (e) {
        if (e.target === viewModal) {
            closeViewModal();
        }
    });

    viewModalEdit.addEventListener('click', function () {
        if (currentDentistId) {
            closeViewModal();
            setTimeout(() => {
                openEditModal(currentDentistId);
            }, 200);
        }
    });

    // ─── Edit Modal Events ───
    editModalClose.addEventListener('click', closeEditModal);
    editModalCancel.addEventListener('click', closeEditModal);

    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // ─── Edit Form Submit ───
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('editName').value.trim();
        const contact = document.getElementById('editContact').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const password = document.getElementById('editPassword').value;
        const confirmPw = document.getElementById('editConfirmPassword').value;
        const specialization = document.getElementById('editSpecialization').value.trim();
        const experience = document.getElementById('editExperience').value.trim();
        const startTime = document.getElementById('editStartTime').value;
        const endTime = document.getElementById('editEndTime').value;

        // Validate
        if (!name) { alert('Please enter dentist name.'); return; }
        if (!contact) { alert('Please enter contact number.'); return; }
        if (!email) { alert('Please enter email.'); return; }
        if (!isValidEmail(email)) { alert('Please enter a valid email.'); return; }
        if (password && password !== confirmPw) { alert('Passwords do not match.'); return; }
        if (password && password.length < 8) { alert('Password must be at least 8 characters.'); return; }

        // Get selected days
        const selectedDays = [];
        document.querySelectorAll('#editDaysGrid input[type="checkbox"]:checked').forEach(cb => {
            selectedDays.push(cb.value);
        });
        if (selectedDays.length === 0) { alert('Please select at least one duty day.'); return; }

        const statusEl = document.querySelector('input[name="editStatus"]:checked');
        const status = statusEl ? statusEl.value : 'Active';

        // Format schedule
        const dayStr = selectedDays.join('-');
        const startFormatted = formatTime(startTime);
        const endFormatted = formatTime(endTime);
        const schedule = `${dayStr}, ${startFormatted}-${endFormatted}`;

        // Update data
        if (currentDentistId) {
            dentistData[currentDentistId] = {
                name,
                contact,
                email,
                specialization,
                experience: experience || '0',
                days: selectedDays,
                startTime,
                endTime,
                status,
                schedule
            };

            // Update table row
            updateTableRow(currentDentistId);

            alert('✅ Dentist account updated successfully!');
            closeEditModal();
        }
    });

    function formatTime(time) {
        if (!time) return '12:00';
        const parts = time.split(':');
        const hour = parseInt(parts[0]);
        const min = parts[1];
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${min}${ampm}`;
    }

    function updateTableRow(id) {
        const data = dentistData[id];
        if (!data) return;

        const row = document.querySelector(`#dentistTableBody tr[data-id="${id}"]`);
        if (!row) return;

        const cells = row.querySelectorAll('td');
        // Name (first cell)
        const nameSpan = cells[0].querySelector('.dentist-name-link');
        if (nameSpan) nameSpan.textContent = data.name;

        // Email
        cells[1].textContent = data.email;

        // Contact
        cells[2].textContent = data.contact;

        // Schedule
        cells[3].textContent = data.schedule;

        // Status
        const statusBadge = cells[4].querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = data.status;
            statusBadge.className = 'status-badge' + (data.status === 'Inactive' ? ' inactive' : '');
        }

        // Actions - keep as is
    }

    // ─── Event listeners for View and Edit buttons ───
    document.querySelectorAll('.dentist-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            openViewModal(id);
        });
    });

    document.querySelectorAll('.dentist-table .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            openEditModal(id);
        });
    });

    document.querySelectorAll('.dentist-name-link').forEach(link => {
        link.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            openViewModal(id);
        });
    });

    // ─── Create Dentist ───
    document.getElementById('createDentistBtn').addEventListener('click', function () {
        alert('🦷 Create Dentist Account form would open here.');
    });

    // ─── Suspend / Delete actions ───
    document.querySelectorAll('.dentist-table .action-btn.suspend').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const name = row.querySelector('td:first-child').textContent.trim();
            if (confirm('⚠️ Are you sure you want to suspend ' + name + '?')) {
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge) {
                    const id = parseInt(this.dataset.id);
                    if (dentistData[id]) {
                        dentistData[id].status = 'Inactive';
                        dentistData[id].schedule = dentistData[id].schedule; // keep same
                        updateTableRow(id);
                    }
                }
            }
        });
    });

    document.querySelectorAll('.dentist-table .action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const name = row.querySelector('td:first-child').textContent.trim();
            if (confirm('🗑️ Permanently delete ' + name + '? This action cannot be undone.')) {
                const id = parseInt(this.dataset.id);
                delete dentistData[id];
                row.style.transition = 'all 0.3s';
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });

    // ─── Keyboard shortcuts ───
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (editModal.classList.contains('active')) {
                closeEditModal();
            }
            if (viewModal.classList.contains('active')) {
                closeViewModal();
            }
        }
    });

})();