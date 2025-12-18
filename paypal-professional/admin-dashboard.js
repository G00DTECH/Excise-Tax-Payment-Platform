/*
 * LCC Admin Portal - Admin Dashboard JavaScript
 * Version 2.0 - PayPal Professional Theme
 * Handles all admin functionality for report management
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let currentAdmin = null;
let allReports = [];
let allSizes = [];
let allWineries = [];
let allNotifications = [];
let currentReportId = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('currentAdmin');

    if (adminSession) {
        currentAdmin = JSON.parse(adminSession);
        showDashboard();
    } else {
        showLoginScreen();
    }

    // Set up event listeners
    setupEventListeners();

    // Initialize demo data if needed
    initializeDemoData();
}

// ============================================
// DEMO DATA INITIALIZATION
// ============================================

function initializeDemoData() {
    // Initialize admin users
    if (!localStorage.getItem('adminUsers')) {
        const adminUsers = [
            {
                id: 'admin-001',
                username: 'admin@lcc.state.gov',
                password: 'admin123',
                name: 'Sarah Johnson',
                role: 'Super Admin'
            },
            {
                id: 'admin-002',
                username: 'reviewer@lcc.state.gov',
                password: 'review123',
                name: 'Michael Chen',
                role: 'Reviewer'
            }
        ];
        localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
    }

    // Initialize product sizes
    if (!localStorage.getItem('productSizes')) {
        const sizes = {
            barrels: [
                { id: 'br-001', name: '5 Gallon Barrel', gallons: 5.000, status: 'active', category: 'barrel' },
                { id: 'br-002', name: '10 Gallon Barrel', gallons: 10.000, status: 'active', category: 'barrel' },
                { id: 'br-003', name: '15 Gallon Barrel', gallons: 15.000, status: 'active', category: 'barrel' },
                { id: 'br-004', name: '30 Gallon Barrel', gallons: 30.000, status: 'active', category: 'barrel' },
                { id: 'br-005', name: '53 Gallon Barrel', gallons: 53.000, status: 'active', category: 'barrel' }
            ],
            bottles: [
                { id: 'bt-001', name: '50ml (Mini)', gallons: 0.013, status: 'active', category: 'bottle' },
                { id: 'bt-002', name: '375ml (Half Bottle)', gallons: 0.099, status: 'active', category: 'bottle' },
                { id: 'bt-003', name: '750ml (Standard)', gallons: 0.198, status: 'active', category: 'bottle' },
                { id: 'bt-004', name: '1L (Liter)', gallons: 0.264, status: 'active', category: 'bottle' },
                { id: 'bt-005', name: '1.5L (Magnum)', gallons: 0.396, status: 'active', category: 'bottle' },
                { id: 'bt-006', name: '1.75L (Handle)', gallons: 0.462, status: 'active', category: 'bottle' }
            ],
            cases: [
                { id: 'cs-001', name: '12-Pack (750ml)', gallons: 2.378, status: 'active', category: 'case' },
                { id: 'cs-002', name: '24-Pack (12oz)', gallons: 2.250, status: 'active', category: 'case' }
            ]
        };
        localStorage.setItem('productSizes', JSON.stringify(sizes));
    }

    // Initialize winery settings
    if (!localStorage.getItem('winerySettings')) {
        const wineries = [
            {
                id: 'winery-001',
                name: 'Prairie Sunset Winery',
                licenseNumber: 'WNY-NE-12345',
                frequency: 'monthly',
                lastUpdated: new Date().toISOString(),
                notes: 'Standard monthly reporting'
            },
            {
                id: 'winery-002',
                name: 'Heartland Vineyards',
                licenseNumber: 'WNY-NE-23456',
                frequency: 'annual',
                lastUpdated: new Date().toISOString(),
                notes: 'Qualifies for annual reporting due to low production volume'
            }
        ];
        localStorage.setItem('winerySettings', JSON.stringify(wineries));
    }

    // Initialize manufacturer reports
    if (!localStorage.getItem('manufacturerReports')) {
        const reports = [
            {
                id: 'RPT-' + Date.now() + '-001',
                manufacturerId: 'demo-001',
                manufacturerName: 'Pacific Distillery Co.',
                licenseNumber: 'DSP-NE-54321',
                reportType: 'spirits-production',
                formNumber: '35-7150',
                period: '2025-03',
                frequency: 'monthly',
                submitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'waiting',
                data: {
                    production_total: 1000,
                    production_proof: 800,
                    materials_used: 1050,
                    waste_loss: 50
                },
                notes: 'March 2025 production report',
                comments: [],
                auditTrail: [
                    {
                        action: 'submitted',
                        user: 'System',
                        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        details: 'Report submitted by manufacturer'
                    }
                ]
            },
            {
                id: 'RPT-' + Date.now() + '-002',
                manufacturerId: 'demo-002',
                manufacturerName: 'Prairie Sunset Winery',
                licenseNumber: 'WNY-NE-12345',
                reportType: 'wine-production',
                formNumber: '35-7131',
                period: '2025-02',
                frequency: 'monthly',
                submitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'approved',
                data: {
                    production_total: 750,
                    production_proof: 90,
                    materials_used: 800,
                    waste_loss: 50
                },
                notes: 'February 2025 production',
                comments: [
                    {
                        user: 'Sarah Johnson',
                        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        text: 'Report looks good. Approved.'
                    }
                ],
                auditTrail: [
                    {
                        action: 'submitted',
                        user: 'System',
                        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                        details: 'Report submitted by manufacturer'
                    },
                    {
                        action: 'approved',
                        user: 'Sarah Johnson',
                        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        details: 'Report approved'
                    }
                ]
            },
            {
                id: 'RPT-' + Date.now() + '-003',
                manufacturerId: 'demo-003',
                manufacturerName: 'Craftsman Brewing Co.',
                licenseNumber: 'BRW-NE-78901',
                reportType: 'beer-production',
                formNumber: '35-7136',
                period: '2025-03',
                frequency: 'monthly',
                submitDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'needs-correction',
                data: {
                    production_total: 2500,
                    materials_used: 2600,
                    waste_loss: 200
                },
                notes: 'March production - high waste',
                comments: [
                    {
                        user: 'Michael Chen',
                        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        text: 'Waste/loss figures seem unusually high. Please provide additional documentation explaining the 200 gallon loss.'
                    }
                ],
                auditTrail: [
                    {
                        action: 'submitted',
                        user: 'System',
                        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        details: 'Report submitted by manufacturer'
                    },
                    {
                        action: 'correction_requested',
                        user: 'Michael Chen',
                        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        details: 'Correction requested for waste/loss documentation'
                    }
                ]
            }
        ];
        localStorage.setItem('manufacturerReports', JSON.stringify(reports));
    }

    // Initialize notifications
    if (!localStorage.getItem('emailNotifications')) {
        const notifications = [
            {
                id: 'NOTIF-001',
                type: 'approved',
                recipient: 'contact@prairiesunsetwinery.com',
                recipientName: 'Prairie Sunset Winery',
                reportId: 'RPT-' + Date.now() + '-002',
                sentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'sent',
                subject: 'Report Approved - Form 35-7131'
            },
            {
                id: 'NOTIF-002',
                type: 'needs-correction',
                recipient: 'admin@craftsmanbrewing.com',
                recipientName: 'Craftsman Brewing Co.',
                reportId: 'RPT-' + Date.now() + '-003',
                sentDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                status: 'sent',
                subject: 'Corrections Requested - Form 35-7136'
            }
        ];
        localStorage.setItem('emailNotifications', JSON.stringify(notifications));
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

    // Go to reports button
    const gotoReportsBtn = document.getElementById('go-to-reports-btn');
    if (gotoReportsBtn) {
        gotoReportsBtn.addEventListener('click', () => showSection('view-reports'));
    }

    // Filter inputs
    const filterInputs = [
        'filter-frequency', 'filter-type', 'filter-status',
        'filter-date-from', 'filter-date-to', 'filter-manufacturer'
    ];
    filterInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', filterReports);
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.addEventListener('keyup', filterReports);
            }
        }
    });

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Size management buttons
    document.querySelectorAll('[data-size-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-size-type');
            openSizeModal(category);
        });
    });

    // Modal close buttons
    const closeSizeModal = document.getElementById('close-size-modal');
    if (closeSizeModal) {
        closeSizeModal.addEventListener('click', () => {
            document.getElementById('size-modal').classList.remove('active');
        });
    }

    const cancelSizeBtn = document.getElementById('cancel-size-btn');
    if (cancelSizeBtn) {
        cancelSizeBtn.addEventListener('click', () => {
            document.getElementById('size-modal').classList.remove('active');
        });
    }

    // Size form submit
    const sizeForm = document.getElementById('size-form');
    if (sizeForm) {
        sizeForm.addEventListener('submit', handleSizeSave);
    }

    // Winery search
    const winerySearch = document.getElementById('winery-search');
    if (winerySearch) {
        winerySearch.addEventListener('keyup', filterWineries);
    }

    // Winery modal close
    const closeWineryModal = document.getElementById('close-winery-modal');
    if (closeWineryModal) {
        closeWineryModal.addEventListener('click', () => {
            document.getElementById('winery-modal').classList.remove('active');
        });
    }

    const cancelWineryBtn = document.getElementById('cancel-winery-btn');
    if (cancelWineryBtn) {
        cancelWineryBtn.addEventListener('click', () => {
            document.getElementById('winery-modal').classList.remove('active');
        });
    }

    // Winery form submit
    const wineryForm = document.getElementById('winery-form');
    if (wineryForm) {
        wineryForm.addEventListener('submit', handleWinerySave);
    }

    // Notification filters
    const notifType = document.getElementById('notif-type');
    const notifDate = document.getElementById('notif-date');
    if (notifType) notifType.addEventListener('change', filterNotifications);
    if (notifDate) notifDate.addEventListener('change', filterNotifications);

    // Table sorting
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-sort');
            sortReports(sortBy);
        });
    });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const admin = adminUsers.find(u => u.username === username && u.password === password);

    if (admin) {
        currentAdmin = admin;
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        showDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function handleLogout() {
    currentAdmin = null;
    localStorage.removeItem('currentAdmin');
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('dashboard-screen').classList.remove('active');
}

function showDashboard() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');

    // Display admin info
    if (currentAdmin) {
        document.getElementById('admin-name').textContent = currentAdmin.name;
        document.getElementById('admin-role').textContent = currentAdmin.role;
    }

    // Load data and show overview
    loadAllData();
    showSection('overview');
}

// ============================================
// DATA LOADING
// ============================================

function loadAllData() {
    // Load reports
    allReports = JSON.parse(localStorage.getItem('manufacturerReports') || '[]');

    // Load sizes
    const sizes = JSON.parse(localStorage.getItem('productSizes') || '{}');
    allSizes = [...(sizes.barrels || []), ...(sizes.bottles || []), ...(sizes.cases || [])];

    // Load wineries
    allWineries = JSON.parse(localStorage.getItem('winerySettings') || '[]');

    // Load notifications
    allNotifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
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
        case 'overview':
            loadDashboardStats();
            loadRecentReports();
            break;
        case 'view-reports':
            loadReports();
            break;
        case 'setup-sizes':
            loadSizes();
            break;
        case 'winery-settings':
            loadWinerySettings();
            break;
        case 'notifications':
            loadNotifications();
            break;
    }
}

// ============================================
// DASHBOARD OVERVIEW
// ============================================

function loadDashboardStats() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate stats
    const waiting = allReports.filter(r => r.status === 'waiting').length;
    const correction = allReports.filter(r => r.status === 'needs-correction').length;
    const approved = allReports.filter(r => {
        const reportDate = new Date(r.submitDate);
        return r.status === 'approved' &&
               reportDate.getMonth() === thisMonth &&
               reportDate.getFullYear() === thisYear;
    }).length;
    const yearTotal = allReports.filter(r => {
        const reportDate = new Date(r.submitDate);
        return reportDate.getFullYear() === thisYear;
    }).length;

    // Update UI
    document.getElementById('stat-waiting').textContent = waiting;
    document.getElementById('stat-correction').textContent = correction;
    document.getElementById('stat-approved').textContent = approved;
    document.getElementById('stat-year-total').textContent = yearTotal;
    document.getElementById('current-year').textContent = thisYear;
}

function loadRecentReports() {
    const tbody = document.getElementById('recent-reports-tbody');

    // Get 5 most recent reports
    const recent = [...allReports]
        .sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate))
        .slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No recent reports</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(report => `
        <tr>
            <td>${formatDate(report.submitDate)}</td>
            <td>${report.manufacturerName}</td>
            <td>${getReportTypeName(report.reportType)} (${report.formNumber})</td>
            <td>${formatPeriod(report.period)}</td>
            <td>${getStatusBadge(report.status)}</td>
            <td>
                <button class="btn btn-primary btn-table" onclick="reviewReport('${report.id}')">
                    REVIEW
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// VIEW REPORTS
// ============================================

function loadReports() {
    filterReports();
}

function filterReports() {
    const frequency = document.getElementById('filter-frequency').value;
    const type = document.getElementById('filter-type').value;
    const status = document.getElementById('filter-status').value;
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const manufacturer = document.getElementById('filter-manufacturer').value.toLowerCase();

    let filtered = [...allReports];

    // Apply filters
    if (frequency) {
        filtered = filtered.filter(r => r.frequency === frequency);
    }
    if (type) {
        filtered = filtered.filter(r => r.reportType === type);
    }
    if (status) {
        filtered = filtered.filter(r => r.status === status);
    }
    if (dateFrom) {
        filtered = filtered.filter(r => new Date(r.submitDate) >= new Date(dateFrom));
    }
    if (dateTo) {
        filtered = filtered.filter(r => new Date(r.submitDate) <= new Date(dateTo));
    }
    if (manufacturer) {
        filtered = filtered.filter(r =>
            r.manufacturerName.toLowerCase().includes(manufacturer) ||
            r.licenseNumber.toLowerCase().includes(manufacturer)
        );
    }

    // Sort by priority: waiting, needs-correction, approved
    const priorityOrder = { 'waiting': 1, 'needs-correction': 2, 'approved': 3 };
    filtered.sort((a, b) => {
        const aPriority = priorityOrder[a.status] || 999;
        const bPriority = priorityOrder[b.status] || 999;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(b.submitDate) - new Date(a.submitDate);
    });

    displayReports(filtered);
}

function displayReports(reports) {
    const tbody = document.getElementById('reports-tbody');

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No reports match the current filters</td></tr>';
        return;
    }

    tbody.innerHTML = reports.map(report => `
        <tr>
            <td>${formatDate(report.submitDate)}</td>
            <td>${report.manufacturerName}<br><small>${report.licenseNumber}</small></td>
            <td>${getReportTypeName(report.reportType)}<br><span class="badge">${report.formNumber}</span></td>
            <td>${formatPeriod(report.period)}</td>
            <td><span class="badge">${report.frequency.toUpperCase()}</span></td>
            <td>${getStatusBadge(report.status)}</td>
            <td>
                <button class="btn btn-primary btn-table" onclick="reviewReport('${report.id}')">
                    REVIEW
                </button>
            </td>
        </tr>
    `).join('');
}

function clearFilters() {
    document.getElementById('filter-frequency').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-manufacturer').value = '';
    filterReports();
}

function sortReports(sortBy) {
    // Implement sorting logic if needed
    console.log('Sort by:', sortBy);
}

// ============================================
// REPORT REVIEW
// ============================================

function reviewReport(reportId) {
    currentReportId = reportId;
    const report = allReports.find(r => r.id === reportId);

    if (!report) {
        alert('Report not found');
        return;
    }

    const container = document.getElementById('report-detail-container');
    container.innerHTML = generateReportDetailHTML(report);

    // Set up action buttons
    document.getElementById('approve-report-btn').addEventListener('click', () => approveReport(reportId));
    document.getElementById('request-correction-btn').addEventListener('click', () => requestCorrection(reportId));
    document.getElementById('back-to-reports-btn').addEventListener('click', () => showSection('view-reports'));

    // Set up add comment
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
        addCommentBtn.addEventListener('click', () => addComment(reportId));
    }

    showSection('report-review');
}

function generateReportDetailHTML(report) {
    return `
        <div class="card">
            <div class="card-header">
                <div>
                    <h3>Report Details - ${report.formNumber}</h3>
                    <p class="description">
                        ${report.manufacturerName} | ${report.licenseNumber} | ${formatPeriod(report.period)}
                    </p>
                </div>
                <div>
                    ${getStatusBadge(report.status)}
                </div>
            </div>
            <div class="card-body">
                <div class="filter-grid">
                    <div>
                        <label>Report ID</label>
                        <p class="form-value">${report.id}</p>
                    </div>
                    <div>
                        <label>Submit Date</label>
                        <p class="form-value">${formatDate(report.submitDate)}</p>
                    </div>
                    <div>
                        <label>Report Type</label>
                        <p class="form-value">${getReportTypeName(report.reportType)}</p>
                    </div>
                    <div>
                        <label>Frequency</label>
                        <p class="form-value">${report.frequency.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Report Data</h3>
            </div>
            <div class="card-body">
                <div class="filter-grid">
                    ${Object.entries(report.data).map(([key, value]) => `
                        <div>
                            <label>${formatFieldName(key)}</label>
                            <p class="form-value">${value}</p>
                        </div>
                    `).join('')}
                </div>
                ${report.notes ? `
                    <div class="mt-lg">
                        <label>Notes</label>
                        <p class="form-value">${report.notes}</p>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Comments & Communication</h3>
            </div>
            <div class="card-body">
                ${report.comments.length > 0 ? `
                    <div class="mb-lg">
                        ${report.comments.map(comment => `
                            <div class="alert alert-info mb-md">
                                <strong>${comment.user}</strong> - ${formatDate(comment.timestamp)}
                                <p style="margin-top: 8px;">${comment.text}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="description mb-lg">No comments yet</p>'}

                <div class="form-group">
                    <label for="new-comment">Add Comment</label>
                    <textarea id="new-comment" class="form-control" rows="3"
                              placeholder="Add a comment or request additional information..."></textarea>
                </div>
                <button id="add-comment-btn" class="btn btn-secondary-outline">ADD COMMENT</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Audit Trail</h3>
            </div>
            <div class="card-body">
                ${report.auditTrail.map(entry => `
                    <div class="mb-md">
                        <strong>${entry.action.replace('_', ' ').toUpperCase()}</strong> by ${entry.user}
                        <br>
                        <small class="description">${formatDate(entry.timestamp)}</small>
                        <br>
                        <small>${entry.details}</small>
                    </div>
                `).join('<hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border-light);">')}
            </div>
        </div>

        <div class="card">
            <div class="card-body" style="display: flex; gap: 16px; justify-content: flex-end;">
                <button id="back-to-reports-btn" class="btn btn-secondary-outline">
                    BACK TO REPORTS
                </button>
                ${report.status !== 'approved' ? `
                    <button id="request-correction-btn" class="btn btn-secondary-outline">
                        REQUEST CORRECTIONS
                    </button>
                    <button id="approve-report-btn" class="btn btn-primary">
                        APPROVE REPORT
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function addComment(reportId) {
    const commentText = document.getElementById('new-comment').value.trim();

    if (!commentText) {
        alert('Please enter a comment');
        return;
    }

    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    const comment = {
        user: currentAdmin.name,
        timestamp: new Date().toISOString(),
        text: commentText
    };

    report.comments.push(comment);

    report.auditTrail.push({
        action: 'comment_added',
        user: currentAdmin.name,
        timestamp: new Date().toISOString(),
        details: 'Comment added to report'
    });

    saveReports();
    reviewReport(reportId);
}

function approveReport(reportId) {
    if (!confirm('Are you sure you want to approve this report?')) {
        return;
    }

    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    report.status = 'approved';
    report.auditTrail.push({
        action: 'approved',
        user: currentAdmin.name,
        timestamp: new Date().toISOString(),
        details: 'Report approved by admin'
    });

    // Send notification
    sendNotification({
        type: 'approved',
        reportId: reportId,
        recipient: 'manufacturer@example.com',
        recipientName: report.manufacturerName
    });

    saveReports();
    alert('Report approved successfully!');
    showSection('view-reports');
}

function requestCorrection(reportId) {
    const commentText = document.getElementById('new-comment').value.trim();

    if (!commentText) {
        alert('Please add a comment explaining what corrections are needed');
        return;
    }

    if (!confirm('Request corrections for this report?')) {
        return;
    }

    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    report.status = 'needs-correction';
    report.comments.push({
        user: currentAdmin.name,
        timestamp: new Date().toISOString(),
        text: commentText
    });

    report.auditTrail.push({
        action: 'correction_requested',
        user: currentAdmin.name,
        timestamp: new Date().toISOString(),
        details: 'Corrections requested by admin'
    });

    // Send notification
    sendNotification({
        type: 'needs-correction',
        reportId: reportId,
        recipient: 'manufacturer@example.com',
        recipientName: report.manufacturerName
    });

    saveReports();
    alert('Correction request sent to manufacturer');
    showSection('view-reports');
}

// ============================================
// SETUP SIZES
// ============================================

function loadSizes() {
    const sizes = JSON.parse(localStorage.getItem('productSizes') || '{}');

    loadSizeCategory('barrels', sizes.barrels || []);
    loadSizeCategory('bottles', sizes.bottles || []);
    loadSizeCategory('cases', sizes.cases || []);
}

function loadSizeCategory(category, items) {
    const tbody = document.getElementById(category + '-tbody');

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No sizes defined</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.gallons.toFixed(3)}</td>
            <td>${item.status === 'active' ?
                '<span class="badge badge-active">ACTIVE</span>' :
                '<span class="badge badge-inactive">INACTIVE</span>'
            }</td>
            <td>
                <button class="btn-action" onclick='editSize(${JSON.stringify(item)})'>EDIT</button>
                <button class="btn-action" onclick="toggleSizeStatus('${item.id}')">
                    ${item.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
            </td>
        </tr>
    `).join('');
}

function openSizeModal(category, sizeData = null) {
    const modal = document.getElementById('size-modal');
    const title = document.getElementById('size-modal-title');

    title.textContent = sizeData ? 'Edit Size' : 'Add Size';

    document.getElementById('size-id').value = sizeData ? sizeData.id : '';
    document.getElementById('size-category').value = category;
    document.getElementById('size-name').value = sizeData ? sizeData.name : '';
    document.getElementById('size-gallons').value = sizeData ? sizeData.gallons : '';
    document.getElementById('size-status').value = sizeData ? sizeData.status : 'active';

    modal.classList.add('active');
}

function editSize(sizeData) {
    openSizeModal(sizeData.category, sizeData);
}

function handleSizeSave(e) {
    e.preventDefault();

    const id = document.getElementById('size-id').value || 'size-' + Date.now();
    const category = document.getElementById('size-category').value;
    const name = document.getElementById('size-name').value;
    const gallons = parseFloat(document.getElementById('size-gallons').value);
    const status = document.getElementById('size-status').value;

    const sizes = JSON.parse(localStorage.getItem('productSizes') || '{}');
    if (!sizes[category + 's']) sizes[category + 's'] = [];

    const existingIndex = sizes[category + 's'].findIndex(s => s.id === id);
    const sizeData = { id, name, gallons, status, category };

    if (existingIndex >= 0) {
        sizes[category + 's'][existingIndex] = sizeData;
    } else {
        sizes[category + 's'].push(sizeData);
    }

    localStorage.setItem('productSizes', JSON.stringify(sizes));

    document.getElementById('size-modal').classList.remove('active');
    loadSizes();
}

function toggleSizeStatus(sizeId) {
    const sizes = JSON.parse(localStorage.getItem('productSizes') || '{}');

    ['barrels', 'bottles', 'cases'].forEach(category => {
        const items = sizes[category] || [];
        const item = items.find(s => s.id === sizeId);
        if (item) {
            item.status = item.status === 'active' ? 'inactive' : 'active';
        }
    });

    localStorage.setItem('productSizes', JSON.stringify(sizes));
    loadSizes();
}

// ============================================
// WINERY SETTINGS
// ============================================

function loadWinerySettings() {
    filterWineries();
}

function filterWineries() {
    const search = document.getElementById('winery-search').value.toLowerCase();

    let filtered = [...allWineries];

    if (search) {
        filtered = filtered.filter(w =>
            w.name.toLowerCase().includes(search) ||
            w.licenseNumber.toLowerCase().includes(search)
        );
    }

    const tbody = document.getElementById('wineries-tbody');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No wineries found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(winery => `
        <tr>
            <td>${winery.name}</td>
            <td>${winery.licenseNumber}</td>
            <td><span class="badge">${winery.frequency.toUpperCase()}</span></td>
            <td>${formatDate(winery.lastUpdated)}</td>
            <td>
                <button class="btn-action" onclick='editWinery(${JSON.stringify(winery)})'>
                    CHANGE FREQUENCY
                </button>
            </td>
        </tr>
    `).join('');
}

function editWinery(wineryData) {
    document.getElementById('winery-id').value = wineryData.id;
    document.getElementById('winery-name-display').textContent = wineryData.name;
    document.getElementById('winery-frequency').value = wineryData.frequency;
    document.getElementById('winery-notes').value = '';

    document.getElementById('winery-modal').classList.add('active');
}

function handleWinerySave(e) {
    e.preventDefault();

    const id = document.getElementById('winery-id').value;
    const frequency = document.getElementById('winery-frequency').value;
    const notes = document.getElementById('winery-notes').value;

    const wineries = JSON.parse(localStorage.getItem('winerySettings') || '[]');
    const winery = wineries.find(w => w.id === id);

    if (winery) {
        winery.frequency = frequency;
        winery.lastUpdated = new Date().toISOString();
        winery.notes = notes || winery.notes;
    }

    localStorage.setItem('winerySettings', JSON.stringify(wineries));
    allWineries = wineries;

    document.getElementById('winery-modal').classList.remove('active');
    loadWinerySettings();
}

// ============================================
// NOTIFICATIONS
// ============================================

function loadNotifications() {
    filterNotifications();
}

function filterNotifications() {
    const type = document.getElementById('notif-type').value;
    const days = parseInt(document.getElementById('notif-date').value);

    let filtered = [...allNotifications];

    if (type) {
        filtered = filtered.filter(n => n.type === type);
    }

    if (days) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(n => new Date(n.sentDate) >= cutoff);
    }

    const tbody = document.getElementById('notifications-tbody');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No notifications found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(notif => `
        <tr>
            <td>${formatDate(notif.sentDate)}</td>
            <td>${notif.recipientName}<br><small>${notif.recipient}</small></td>
            <td><span class="badge">${notif.type.toUpperCase()}</span></td>
            <td>${notif.reportId}</td>
            <td>${notif.status === 'sent' ?
                '<span class="badge badge-active">SENT</span>' :
                '<span class="badge badge-inactive">FAILED</span>'
            }</td>
            <td>
                <button class="btn-action" onclick="viewNotification('${notif.id}')">VIEW</button>
            </td>
        </tr>
    `).join('');
}

function sendNotification(data) {
    const notification = {
        id: 'NOTIF-' + Date.now(),
        type: data.type,
        recipient: data.recipient,
        recipientName: data.recipientName,
        reportId: data.reportId,
        sentDate: new Date().toISOString(),
        status: 'sent',
        subject: data.type === 'approved' ?
            'Report Approved' :
            'Corrections Requested'
    };

    allNotifications.push(notification);
    localStorage.setItem('emailNotifications', JSON.stringify(allNotifications));
}

function viewNotification(notifId) {
    const notif = allNotifications.find(n => n.id === notifId);
    if (notif) {
        alert(`Notification Details:\n\nType: ${notif.type}\nRecipient: ${notif.recipientName}\nSent: ${formatDate(notif.sentDate)}\nStatus: ${notif.status}`);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function saveReports() {
    localStorage.setItem('manufacturerReports', JSON.stringify(allReports));
}

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

function getReportTypeName(type) {
    const names = {
        'beer-production': 'Beer Production',
        'beer-inventory': 'Beer Inventory',
        'beer-sales': 'Beer Sales',
        'beer-annual': 'Beer Annual Summary',
        'wine-production': 'Wine Production',
        'wine-inventory': 'Wine Inventory',
        'wine-sales': 'Wine Sales',
        'wine-annual': 'Wine Annual Summary',
        'spirits-production': 'Spirits Production',
        'spirits-inventory': 'Spirits Inventory',
        'spirits-sales': 'Spirits Sales',
        'spirits-bottling': 'Spirits Bottling',
        'spirits-annual': 'Spirits Annual Summary'
    };
    return names[type] || type;
}

function getStatusBadge(status) {
    const badges = {
        'waiting': '<span class="badge badge-waiting">WAITING FOR APPROVAL</span>',
        'needs-correction': '<span class="badge badge-correction">NEEDS CORRECTION</span>',
        'approved': '<span class="badge badge-approved">APPROVED</span>'
    };
    return badges[status] || status;
}

// Make functions globally accessible
window.reviewReport = reviewReport;
window.approveReport = approveReport;
window.requestCorrection = requestCorrection;
window.editSize = editSize;
window.toggleSizeStatus = toggleSizeStatus;
window.editWinery = editWinery;
window.viewNotification = viewNotification;
