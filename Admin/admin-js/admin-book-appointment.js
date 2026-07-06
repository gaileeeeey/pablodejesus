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

    // ─── Dropdown toggle for Oral Prophylaxis ───
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownToggle && dropdownContent) {
        dropdownToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('open');
            this.textContent = dropdownContent.classList.contains('open') ? 'Less Info' : 'More Info';
        });
    }

    // ─── Service Selection ───
    const mainCheckboxes = document.querySelectorAll('.service-checkbox');
    const subCheckboxes = document.querySelectorAll('.sub-service-checkbox');
    const selectedContainer = document.getElementById('selectedServicesContainer');
    const totalCount = document.getElementById('totalCount');
    const totalDuration = document.getElementById('totalDuration');
    const totalCost = document.getElementById('totalCost');
    const clearBtn = document.getElementById('clearBtn');
    const proceedBtn = document.getElementById('proceedBtn');

    function formatCurrency(amount) {
        return '₱' + amount.toLocaleString();
    }

    function getSelectedServices() {
        const selected = [];
        mainCheckboxes.forEach(cb => {
            if (cb.checked) {
                const item = cb.closest('.service-item');
                const name = item.dataset.name;
                const price = parseInt(item.dataset.price);
                const duration = parseInt(item.dataset.duration);
                selected.push({ name, price, duration });
            }
        });
        subCheckboxes.forEach(cb => {
            if (cb.checked) {
                const subItem = cb.closest('.sub-service-item');
                const name = subItem.dataset.name;
                const price = parseInt(subItem.dataset.price);
                const duration = parseInt(subItem.dataset.duration);
                selected.push({ name, price, duration });
            }
        });
        return selected;
    }

    function updateSummary() {
        const selected = getSelectedServices();
        let count = selected.length;
        let duration = 0;
        let cost = 0;
        selected.forEach(s => {
            duration += s.duration;
            cost += s.price;
        });

        if (selected.length === 0) {
            selectedContainer.innerHTML =
                '<div class="selected-placeholder">No services selected yet.</div>';
        } else {
            let html = '';
            selected.forEach(s => {
                html += `
                            <div class="selected-service-item">
                                <span class="sel-name">${s.name}</span>
                                <span class="sel-meta"><span class="sel-price">${formatCurrency(s.price)}</span> · ${s.duration} mins</span>
                            </div>
                        `;
            });
            selectedContainer.innerHTML = html;
        }

        totalCount.textContent = count;
        totalDuration.textContent = duration + ' min';
        totalCost.textContent = formatCurrency(cost);

        mainCheckboxes.forEach(cb => {
            const item = cb.closest('.service-item');
            if (cb.checked) item.classList.add('checked');
            else item.classList.remove('checked');
        });
        subCheckboxes.forEach(cb => {
            const subItem = cb.closest('.sub-service-item');
            if (cb.checked) subItem.classList.add('checked');
            else subItem.classList.remove('checked');
        });
    }

    mainCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));
    subCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));

    clearBtn.addEventListener('click', function () {
        mainCheckboxes.forEach(cb => { cb.checked = false; });
        subCheckboxes.forEach(cb => { cb.checked = false; });
        updateSummary();
        if (currentStep > 1) goToStep(1);
    });

    // ─── Step Management ───
    const stepPanels = {
        1: document.getElementById('step1'),
        2: document.getElementById('step2'),
        3: document.getElementById('step3'),
        4: document.getElementById('step4')
    };
    const stepItems = document.querySelectorAll('.step-progress .step');
    const stepLines = document.querySelectorAll('.step-progress .step-line');
    let currentStep = 1;

    // data storage
    let selectedDate = '';
    let selectedTime = '';

    // Time slots
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM'
    ];

    function renderTimeSlots() {
        const grid = document.getElementById('timeGrid');
        grid.innerHTML = '';
        timeSlots.forEach(time => {
            const label = document.createElement('label');
            label.className = 'time-slot';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'apptTime';
            radio.value = time;
            radio.addEventListener('change', function () {
                document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
                this.closest('.time-slot').classList.add('selected');
                selectedTime = this.value;
            });
            label.appendChild(radio);
            label.appendChild(document.createTextNode(time));
            grid.appendChild(label);
        });
    }
    renderTimeSlots();

    // Set min date
    const dateInput = document.getElementById('apptDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.addEventListener('change', function () {
        selectedDate = this.value;
    });

    function goToStep(step) {
        // Validation
        if (step === 2 && getSelectedServices().length === 0) {
            alert('Please select at least one service before proceeding.');
            return;
        }
        if (step === 3) {
            if (!selectedDate || !selectedTime) {
                alert('Please select both a date and time.');
                return;
            }
        }
        if (step === 4) {
            const requiredFields = [
                'fullName', 'dob', 'email', 'occupation', 'address', 'gender', 'contact',
                'physicianName', 'clinicAddress', 'officeNumber',
                'goodHealth', 'medicalTreatment', 'seriousIllness', 'hospitalized'
            ];
            let valid = true;
            requiredFields.forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.value.trim()) {
                    valid = false;
                    el.style.borderColor = '#e74c3c';
                } else if (el) {
                    el.style.borderColor = '';
                }
            });
            if (!valid) {
                alert('Please fill in all required fields (marked with *).');
                return;
            }
            if (!selectedDate || !selectedTime) {
                alert('Please select a date and time.');
                return;
            }
            populateReview();
        }

        // Hide all panels
        Object.values(stepPanels).forEach(p => p.classList.remove('active'));
        stepPanels[step].classList.add('active');

        // Update progress steps
        stepItems.forEach((item, idx) => {
            const num = idx + 1;
            item.classList.remove('active', 'completed');
            if (num === step) item.classList.add('active');
            else if (num < step) item.classList.add('completed');
        });
        stepLines.forEach((line, idx) => {
            const num = idx + 1;
            line.classList.toggle('completed', num < step);
        });

        currentStep = step;
        // Update page title/subtitle
        const titles = {
            1: { title: 'Select Your Services', sub: 'Choose one or more services to add to your treatment plan' },
            2: { title: 'Schedule Your Appointment', sub: 'Set your preferred appointment date and time.' },
            3: { title: 'Patient Information', sub: 'Provide your personal and medical information.' },
            4: { title: 'Review & Confirm', sub: 'Please review all the information below before confirming.' }
        };
        document.getElementById('pageTitle').textContent = titles[step].title;
        document.getElementById('pageSub').textContent = titles[step].sub;

        const card = document.querySelector('.services-card');
        if (card && window.innerWidth <= 768) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ─── Navigation ───
    document.getElementById('step1Next').addEventListener('click', () => goToStep(2));
    document.getElementById('step2Prev').addEventListener('click', () => goToStep(1));
    document.getElementById('step2Next').addEventListener('click', () => goToStep(3));
    document.getElementById('step3Prev').addEventListener('click', () => goToStep(2));
    document.getElementById('step3Next').addEventListener('click', () => goToStep(4));
    document.getElementById('step4Prev').addEventListener('click', () => goToStep(3));

    proceedBtn.addEventListener('click', function () {
        if (getSelectedServices().length === 0) {
            alert('Please select at least one service.');
            return;
        }
        goToStep(2);
    });

    // ─── Review Populate ───
    function populateReview() {
        const services = getSelectedServices();
        let servicesHtml = services.map(s => `<span>${s.name}</span>`).join(' ') || '—';
        let totalDur = services.reduce((sum, s) => sum + s.duration, 0);
        let totalCostVal = services.reduce((sum, s) => sum + s.price, 0);
        const dateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
        const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric',
            month: 'short', day: 'numeric'
        }) : '—';

        document.getElementById('reviewAppointment').innerHTML = `
                    <div class="review-row"><span class="review-label">Services</span><span class="review-value review-services">${servicesHtml}</span></div>
                    <div class="review-row"><span class="review-label">Total Cost</span><span class="review-value highlight">${formatCurrency(totalCostVal)}</span></div>
                    <div class="review-row"><span class="review-label">Est. Duration</span><span class="review-value">${totalDur} min</span></div>
                    <div class="review-row"><span class="review-label">Date</span><span class="review-value">${dateStr}</span></div>
                    <div class="review-row"><span class="review-label">Time</span><span class="review-value">${selectedTime || '—'}</span></div>
                `;

        // Patient info
        document.getElementById('reviewPatient').innerHTML = `
                    <div class="review-row"><span class="review-label">Full Name</span><span class="review-value">${document.getElementById('fullName').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Date of Birth</span><span class="review-value">${document.getElementById('dob').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Email</span><span class="review-value">${document.getElementById('email').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Occupation</span><span class="review-value">${document.getElementById('occupation').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Address</span><span class="review-value">${document.getElementById('address').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Gender</span><span class="review-value">${document.getElementById('gender').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Contact Number</span><span class="review-value">${document.getElementById('contact').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Dental Insurance</span><span class="review-value">${document.getElementById('dentalInsurance').value || 'None'}</span></div>
                    <div class="review-row"><span class="review-label">Effective Date</span><span class="review-value">${document.getElementById('effectiveDate').value || 'None'}</span></div>
                `;

        // Medical history (updated)
        document.getElementById('reviewMedical').innerHTML = `
                    <div class="review-row"><span class="review-label">Previous Dentist</span><span class="review-value">${document.getElementById('previousDentist').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Last Dentist Visit</span><span class="review-value">${document.getElementById('lastDentistVisit').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Physician Name</span><span class="review-value">${document.getElementById('physicianName').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Clinic Address</span><span class="review-value">${document.getElementById('clinicAddress').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Office Number</span><span class="review-value">${document.getElementById('officeNumber').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Good Health</span><span class="review-value">${document.getElementById('goodHealth').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Serious Illness / Surgery</span><span class="review-value">${document.getElementById('seriousIllness').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Specialty</span><span class="review-value">${document.getElementById('physicianSpecialty').value || 'N/A'}</span></div>
                    <div class="review-row"><span class="review-label">Medical Treatment</span><span class="review-value">${document.getElementById('medicalTreatment').value || '—'}</span></div>
                    <div class="review-row"><span class="review-label">Hospitalized</span><span class="review-value">${document.getElementById('hospitalized').value || '—'}</span></div>
                `;
    }

    document.getElementById('reviewEdit').addEventListener('click', function () {
        goToStep(1);
    });

    document.getElementById('reviewConfirm').addEventListener('click', function () {
        const services = getSelectedServices();
        const bookingData = {
            services: services,
            date: selectedDate,
            time: selectedTime,
            patient: {
                fullName: document.getElementById('fullName').value,
                dob: document.getElementById('dob').value,
                email: document.getElementById('email').value,
                occupation: document.getElementById('occupation').value,
                address: document.getElementById('address').value,
                gender: document.getElementById('gender').value,
                contact: document.getElementById('contact').value,
                dentalInsurance: document.getElementById('dentalInsurance').value,
                effectiveDate: document.getElementById('effectiveDate').value,
            },
            medical: {
                previousDentist: document.getElementById('previousDentist').value,
                lastDentistVisit: document.getElementById('lastDentistVisit').value,
                physicianName: document.getElementById('physicianName').value,
                clinicAddress: document.getElementById('clinicAddress').value,
                officeNumber: document.getElementById('officeNumber').value,
                goodHealth: document.getElementById('goodHealth').value,
                seriousIllness: document.getElementById('seriousIllness').value,
                physicianSpecialty: document.getElementById('physicianSpecialty').value,
                medicalTreatment: document.getElementById('medicalTreatment').value,
                hospitalized: document.getElementById('hospitalized').value,
            }
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        alert('✅ Appointment booked successfully!');
        window.location.href = 'appointment.html';
    });

    // ─── Init ───
    updateSummary();
    goToStep(1);

})();