/*
 * LCC Company Portal - Company Dashboard JavaScript
 * Version 2.0 - PayPal Professional Theme
 * Handles manufacturer report submission and tracking
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let currentCompany = null;
let myReports = [];

// Report form number mappings
const FORM_NUMBERS = {
    'beer-production': '35-7136',
    'beer-inventory': '35-7137',
    'beer-sales': '35-7138',
    'beer-annual': '35-7127',
    'wine-production': '35-7131',
    'wine-inventory': '35-7135',
    'wine-sales': '35-7142',
    'wine-annual': '35-7130',
    'spirits-production': '35-7150',
    'spirits-inventory': '35-7155',
    'spirits-sales': '35-7147',
    'spirits-bottling': '35-7153',
    'spirits-annual': '35-7145'
};

// Report type display names
const REPORT_TYPE_NAMES = {
    'beer-production': 'Beer Production Report',
    'beer-inventory': 'Beer Inventory Report',
    'beer-sales': 'Beer Sales Report',
    'beer-annual': 'Beer Annual Summary',
    'wine-production': 'Wine Production Report',
    'wine-inventory': 'Wine Inventory Report',
    'wine-sales': 'Wine Sales Report',
    'wine-annual': 'Wine Annual Summary',
    'spirits-production': 'Spirits Production Report',
    'spirits-inventory': 'Spirits Inventory Report',
    'spirits-sales': 'Spirits Sales Report',
    'spirits-bottling': 'Spirits Bottling Report',
    'spirits-annual': 'Spirits Annual Summary'
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if company is logged in
    const companySession = localStorage.getItem('currentCompany');

    if (companySession) {
        currentCompany = JSON.parse(companySession);
        showDashboard();
    } else {
        showLoginScreen();
    }

    // Set up event listeners
    setupEventListeners();

    // Initialize demo data
    initializeDemoData();
}

// ============================================
// DEMO DATA INITIALIZATION
// ============================================

function initializeDemoData() {
    // Initialize company accounts
    if (!localStorage.getItem('companyAccounts')) {
        const companies = [
            {
                id: 'demo-001',
                taxId: '12-3456789',
                password: 'demo123',
                name: 'Pacific Distillery Co.',
                licenseNumber: 'DSP-NE-54321',
                type: 'Distillery'
            }
        ];
        localStorage.setItem('companyAccounts', JSON.stringify(companies));
    }

    // Manufacturer reports are initialized in admin-dashboard.js
    // We just need to ensure they exist
    if (!localStorage.getItem('manufacturerReports')) {
        localStorage.setItem('manufacturerReports', JSON.stringify([]));
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation links
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Report type selector
    const reportType = document.getElementById('report-type');
    if (reportType) {
        reportType.addEventListener('change', updateFormFields);
    }

    // Report form submission
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }

    // My reports filters
    const myFilterType = document.getElementById('my-filter-type');
    const myFilterStatus = document.getElementById('my-filter-status');
    if (myFilterType) myFilterType.addEventListener('change', filterMyReports);
    if (myFilterStatus) myFilterStatus.addEventListener('change', filterMyReports);

    // Modal close buttons
    const closeReportDetail = document.getElementById('close-report-detail');
    if (closeReportDetail) {
        closeReportDetail.addEventListener('click', closeReportDetailModal);
    }

    const closeDetailBtn = document.getElementById('close-detail-btn');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeReportDetailModal);
    }
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
    e.preventDefault();

    const taxId = document.getElementById('tax-id').value;
    const password = document.getElementById('password').value;

    const companies = JSON.parse(localStorage.getItem('companyAccounts') || '[]');
    const company = companies.find(c => c.taxId === taxId && c.password === password);

    if (company) {
        currentCompany = company;
        localStorage.setItem('currentCompany', JSON.stringify(company));
        showDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function handleLogout() {
    currentCompany = null;
    localStorage.removeItem('currentCompany');
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('dashboard-screen').classList.remove('active');
}

function showDashboard() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');

    // Display company info
    if (currentCompany) {
        document.getElementById('company-name').textContent = currentCompany.name;
        document.getElementById('license-number').textContent = currentCompany.licenseNumber;
    }

    // Load data and show submit report
    loadMyReports();
    showSection('submit-report');
}

// ============================================
// SECTION NAVIGATION
// ============================================

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }

    // Activate corresponding nav link
    const navLink = document.querySelector(`.nav-link[data-section="${sectionName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    // Load section data
    switch(sectionName) {
        case 'my-reports':
            filterMyReports();
            break;
    }
}

// ============================================
// REPORT FORM - DYNAMIC FIELDS
// ============================================

function updateFormFields() {
    const reportType = document.getElementById('report-type').value;
    const dynamicFields = document.getElementById('dynamic-fields');

    if (!reportType) {
        dynamicFields.innerHTML = '';
        return;
    }

    // Generate fields based on report type
    const fields = getFieldsForReportType(reportType);
    dynamicFields.innerHTML = generateFieldsHTML(fields);
}

function getFieldsForReportType(reportType) {
    // Define fields for each report type
    const fieldDefinitions = {
        'beer-production': [
            { name: 'production_total', label: 'Total Production (gallons)', type: 'number', required: true },
            { name: 'materials_used', label: 'Materials Used (gallons)', type: 'number', required: true },
            { name: 'waste_loss', label: 'Waste/Loss (gallons)', type: 'number', required: true }
        ],
        'beer-inventory': [
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'received', label: 'Received (gallons)', type: 'number', required: true },
            { name: 'removed', label: 'Removed (gallons)', type: 'number', required: true }
        ],
        'beer-sales': [
            { name: 'total_sales', label: 'Total Sales (gallons)', type: 'number', required: true },
            { name: 'taxable_sales', label: 'Taxable Sales (gallons)', type: 'number', required: true },
            { name: 'in_state_sales', label: 'In-State Sales (gallons)', type: 'number', required: true },
            { name: 'out_of_state_sales', label: 'Out-of-State Sales (gallons)', type: 'number', required: true }
        ],
        'beer-annual': [
            { name: 'total_production', label: 'Total Annual Production (gallons)', type: 'number', required: true },
            { name: 'total_sales', label: 'Total Annual Sales (gallons)', type: 'number', required: true },
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'total_tax_paid', label: 'Total Excise Tax Paid ($)', type: 'number', required: true, step: '0.01' }
        ],
        'wine-production': [
            { name: 'production_total', label: 'Total Production (gallons)', type: 'number', required: true },
            { name: 'production_proof', label: 'Proof Gallons', type: 'number', required: true },
            { name: 'materials_used', label: 'Materials Used (gallons)', type: 'number', required: true },
            { name: 'waste_loss', label: 'Waste/Loss (gallons)', type: 'number', required: true }
        ],
        'wine-inventory': [
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'received', label: 'Received (gallons)', type: 'number', required: true },
            { name: 'removed', label: 'Removed (gallons)', type: 'number', required: true }
        ],
        'wine-sales': [
            { name: 'total_sales', label: 'Total Sales (gallons)', type: 'number', required: true },
            { name: 'taxable_sales', label: 'Taxable Sales (gallons)', type: 'number', required: true },
            { name: 'in_state_sales', label: 'In-State Sales (gallons)', type: 'number', required: true },
            { name: 'out_of_state_sales', label: 'Out-of-State Sales (gallons)', type: 'number', required: true }
        ],
        'wine-annual': [
            { name: 'total_production', label: 'Total Annual Production (gallons)', type: 'number', required: true },
            { name: 'total_sales', label: 'Total Annual Sales (gallons)', type: 'number', required: true },
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'total_tax_paid', label: 'Total Excise Tax Paid ($)', type: 'number', required: true, step: '0.01' }
        ],
        'spirits-production': [
            { name: 'production_total', label: 'Total Production (gallons)', type: 'number', required: true },
            { name: 'production_proof', label: 'Proof Gallons', type: 'number', required: true },
            { name: 'materials_used', label: 'Materials Used (gallons)', type: 'number', required: true },
            { name: 'waste_loss', label: 'Waste/Loss (gallons)', type: 'number', required: true }
        ],
        'spirits-inventory': [
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'received', label: 'Received (gallons)', type: 'number', required: true },
            { name: 'removed', label: 'Removed (gallons)', type: 'number', required: true }
        ],
        'spirits-sales': [
            { name: 'total_sales', label: 'Total Sales (gallons)', type: 'number', required: true },
            { name: 'taxable_sales', label: 'Taxable Sales (gallons)', type: 'number', required: true },
            { name: 'in_state_sales', label: 'In-State Sales (gallons)', type: 'number', required: true },
            { name: 'out_of_state_sales', label: 'Out-of-State Sales (gallons)', type: 'number', required: true }
        ],
        'spirits-bottling': [
            { name: 'total_bottled', label: 'Total Bottled (gallons)', type: 'number', required: true },
            { name: 'proof_gallons', label: 'Proof Gallons', type: 'number', required: true },
            { name: 'bottles_produced', label: 'Number of Bottles Produced', type: 'number', required: true },
            { name: 'cases_produced', label: 'Number of Cases Produced', type: 'number', required: true }
        ],
        'spirits-annual': [
            { name: 'total_production', label: 'Total Annual Production (gallons)', type: 'number', required: true },
            { name: 'total_sales', label: 'Total Annual Sales (gallons)', type: 'number', required: true },
            { name: 'beginning_inventory', label: 'Beginning Inventory (gallons)', type: 'number', required: true },
            { name: 'ending_inventory', label: 'Ending Inventory (gallons)', type: 'number', required: true },
            { name: 'total_tax_paid', label: 'Total Excise Tax Paid ($)', type: 'number', required: true, step: '0.01' }
        ]
    };

    return fieldDefinitions[reportType] || [];
}

function generateFieldsHTML(fields) {
    if (fields.length === 0) return '';

    return `
        <div class="field-section">
            <div class="field-section-title">Report Data</div>
            <div class="form-grid">
                ${fields.map(field => `
                    <div class="form-group">
                        <label for="field-${field.name}" ${field.required ? 'class="required"' : ''}>
                            ${field.label}
                        </label>
                        <input
                            type="${field.type}"
                            id="field-${field.name}"
                            name="${field.name}"
                            class="form-control"
                            ${field.required ? 'required' : ''}
                            ${field.step ? `step="${field.step}"` : 'step="0.001"'}
                            placeholder="0.00"
                        >
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// REPORT SUBMISSION
// ============================================

function handleReportSubmit(e) {
    e.preventDefault();

    const reportType = document.getElementById('report-type').value;
    const period = document.getElementById('report-period').value;
    const frequency = document.getElementById('report-frequency').value;
    const notes = document.getElementById('report-notes').value;

    // Collect dynamic field data
    const data = {};
    const dynamicFields = document.querySelectorAll('#dynamic-fields input');
    dynamicFields.forEach(input => {
        data[input.name] = parseFloat(input.value) || 0;
    });

    // Create report object
    const report = {
        id: 'RPT-' + Date.now(),
        manufacturerId: currentCompany.id,
        manufacturerName: currentCompany.name,
        licenseNumber: currentCompany.licenseNumber,
        reportType: reportType,
        formNumber: FORM_NUMBERS[reportType],
        period: period,
        frequency: frequency,
        submitDate: new Date().toISOString(),
        status: 'waiting',
        data: data,
        notes: notes,
        comments: [],
        auditTrail: [
            {
                action: 'submitted',
                user: 'System',
                timestamp: new Date().toISOString(),
                details: 'Report submitted by manufacturer'
            }
        ]
    };

    // Save to localStorage
    const allReports = JSON.parse(localStorage.getItem('manufacturerReports') || '[]');
    allReports.push(report);
    localStorage.setItem('manufacturerReports', JSON.stringify(allReports));

    // Show success message
    alert('Report submitted successfully! You can track its status in "My Reports".');

    // Reset form and navigate to My Reports
    resetForm();
    showSection('my-reports');
}

function resetForm() {
    document.getElementById('report-form').reset();
    document.getElementById('dynamic-fields').innerHTML = '';
}

// Make resetForm globally accessible
window.resetForm = resetForm;

// ============================================
// MY REPORTS
// ============================================

function loadMyReports() {
    const allReports = JSON.parse(localStorage.getItem('manufacturerReports') || '[]');
    myReports = allReports.filter(r => r.manufacturerId === currentCompany.id);
}

function filterMyReports() {
    loadMyReports();

    const typeFilter = document.getElementById('my-filter-type').value;
    const statusFilter = document.getElementById('my-filter-status').value;

    let filtered = [...myReports];

    if (typeFilter) {
        filtered = filtered.filter(r => r.reportType === typeFilter);
    }

    if (statusFilter) {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Sort by submit date (newest first)
    filtered.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));

    displayMyReports(filtered);
}

function displayMyReports(reports) {
    const tbody = document.getElementById('my-reports-tbody');

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No reports found</td></tr>';
        return;
    }

    tbody.innerHTML = reports.map(report => {
        // Calculate last update date
        const lastUpdate = report.auditTrail.length > 0 ?
            report.auditTrail[report.auditTrail.length - 1].timestamp :
            report.submitDate;

        return `
            <tr>
                <td>${formatDate(report.submitDate)}</td>
                <td>
                    ${REPORT_TYPE_NAMES[report.reportType]}
                    <br>
                    <small>${report.formNumber}</small>
                </td>
                <td>${formatPeriod(report.period)}</td>
                <td>${getStatusBadge(report.status)}</td>
                <td>${formatDate(lastUpdate)}</td>
                <td>
                    <button class="btn btn-primary btn-table" onclick="viewReportDetail('${report.id}')">
                        VIEW DETAILS
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// REPORT DETAIL VIEW
// ============================================

function viewReportDetail(reportId) {
    const report = myReports.find(r => r.id === reportId);

    if (!report) {
        alert('Report not found');
        return;
    }

    const modalBody = document.getElementById('report-detail-body');
    modalBody.innerHTML = generateReportDetailHTML(report);

    document.getElementById('report-detail-modal').classList.add('active');
}

function generateReportDetailHTML(report) {
    return `
        <div class="info-box">
            <strong>Report Status:</strong> ${getStatusText(report.status)}
        </div>

        <div class="detail-grid">
            <div class="detail-item">
                <label>Report ID</label>
                <div class="value">${report.id}</div>
            </div>
            <div class="detail-item">
                <label>Submit Date</label>
                <div class="value">${formatDate(report.submitDate)}</div>
            </div>
            <div class="detail-item">
                <label>Report Type</label>
                <div class="value">${REPORT_TYPE_NAMES[report.reportType]}</div>
            </div>
            <div class="detail-item">
                <label>Form Number</label>
                <div class="value">${report.formNumber}</div>
            </div>
            <div class="detail-item">
                <label>Reporting Period</label>
                <div class="value">${formatPeriod(report.period)}</div>
            </div>
            <div class="detail-item">
                <label>Frequency</label>
                <div class="value">${report.frequency.toUpperCase()}</div>
            </div>
        </div>

        <div class="field-section">
            <div class="field-section-title">Report Data</div>
            <div class="detail-grid">
                ${Object.entries(report.data).map(([key, value]) => `
                    <div class="detail-item">
                        <label>${formatFieldName(key)}</label>
                        <div class="value">${value}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${report.notes ? `
            <div class="field-section">
                <div class="field-section-title">Your Notes</div>
                <p>${report.notes}</p>
            </div>
        ` : ''}

        ${report.comments.length > 0 ? `
            <div class="field-section">
                <div class="field-section-title">LCC Comments</div>
                <div class="comments-section">
                    ${report.comments.map(comment => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <span class="comment-author">${comment.user}</span>
                                <span class="comment-date">${formatDate(comment.timestamp)}</span>
                            </div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <div class="field-section">
            <div class="field-section-title">History</div>
            ${report.auditTrail.map(entry => `
                <div style="margin-bottom: 12px;">
                    <strong>${entry.action.replace('_', ' ').toUpperCase()}</strong> by ${entry.user}
                    <br>
                    <small style="color: var(--medium-gray);">${formatDate(entry.timestamp)}</small>
                    <br>
                    <small>${entry.details}</small>
                </div>
            `).join('<hr style="margin: 12px 0; border: none; border-top: 1px solid var(--border-light);">')}
        </div>
    `;
}

function closeReportDetailModal() {
    document.getElementById('report-detail-modal').classList.remove('active');
}

// Make viewReportDetail globally accessible
window.viewReportDetail = viewReportDetail;

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatPeriod(period) {
    const [year, month] = period.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function formatFieldName(fieldName) {
    return fieldName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getStatusBadge(status) {
    const badges = {
        'waiting': '<span class="badge badge-waiting">WAITING FOR APPROVAL</span>',
        'needs-correction': '<span class="badge badge-correction">NEEDS CORRECTION</span>',
        'approved': '<span class="badge badge-approved">APPROVED</span>'
    };
    return badges[status] || status;
}

function getStatusText(status) {
    const texts = {
        'waiting': 'Your report is waiting for LCC review.',
        'needs-correction': 'LCC has requested corrections. Please review the comments below.',
        'approved': 'Your report has been approved by LCC.'
    };
    return texts[status] || status;
}
