/**
 * State Tax Portal - PYUSD Payment Integration
 * Professional PayPal-themed JavaScript
 * Version: 2.0
 */

// ============================================
// State Management
// ============================================

const AppState = {
    currentScreen: 'paymentSelection',
    selectedPaymentMethod: null,
    rateTimer: null,
    rateTimerSeconds: 900, // 15 minutes
    processingProgress: 0,
    processingStep: 1,
    paymentData: {
        amount: 1234.56,
        pyusdAmount: 1234.56,
        transactionId: null,
        confirmationTime: null
    }
};

// ============================================
// Screen Navigation
// ============================================

function showScreen(screenId) {
    // Hide all sections
    document.querySelectorAll('.payment-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        AppState.currentScreen = screenId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// Payment Method Selection
// ============================================

function initializePaymentSelection() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const continueBtn = document.getElementById('continueBtn');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('.payment-radio');
            if (radio) {
                radio.checked = true;
                AppState.selectedPaymentMethod = radio.value;

                // Update UI
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Enable continue button
                continueBtn.disabled = false;
            }
        });
    });

    continueBtn.addEventListener('click', function() {
        if (AppState.selectedPaymentMethod === 'pyusd') {
            showScreen('pyusdDetails');
            initializeRateTimer();
            generateQRCode();
        } else {
            alert('Other payment methods coming soon!');
        }
    });
}

// ============================================
// Rate Timer Management
// ============================================

function initializeRateTimer() {
    AppState.rateTimerSeconds = 900; // Reset to 15 minutes
    updateTimerDisplay();

    // Clear existing timer if any
    if (AppState.rateTimer) {
        clearInterval(AppState.rateTimer);
    }

    // Start countdown
    AppState.rateTimer = setInterval(() => {
        AppState.rateTimerSeconds--;
        updateTimerDisplay();

        if (AppState.rateTimerSeconds <= 0) {
            clearInterval(AppState.rateTimer);
            handleTimerExpiration();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(AppState.rateTimerSeconds / 60);
    const seconds = AppState.rateTimerSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const timerElement = document.getElementById('timerDisplay');
    if (timerElement) {
        timerElement.textContent = display;

        // Change color when timer is running low
        const timerContainer = document.getElementById('rateTimer');
        if (AppState.rateTimerSeconds < 60) {
            timerContainer.style.color = '#DC3545';
        } else if (AppState.rateTimerSeconds < 300) {
            timerContainer.style.color = '#FFC107';
        }
    }
}

function handleTimerExpiration() {
    alert('Rate lock has expired. Please start a new payment.');
    showScreen('paymentSelection');
}

// ============================================
// QR Code Generation
// ============================================

function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;

    // In a real implementation, you would use a QR code library like qrcode.js
    // For this demo, we'll create a placeholder

    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.flexDirection = 'column';
    placeholder.style.gap = '16px';
    placeholder.style.color = '#6C757D';

    // Create QR placeholder pattern
    const qrPattern = document.createElement('div');
    qrPattern.style.width = '200px';
    qrPattern.style.height = '200px';
    qrPattern.style.background = `
        repeating-linear-gradient(90deg, #000 0px, #000 10px, #fff 10px, #fff 20px),
        repeating-linear-gradient(0deg, #000 0px, #000 10px, #fff 10px, #fff 20px)
    `;
    qrPattern.style.backgroundBlendMode = 'difference';
    qrPattern.style.borderRadius = '8px';

    const text = document.createElement('div');
    text.textContent = 'Scan with PYUSD wallet';
    text.style.fontSize = '14px';
    text.style.fontWeight = '500';

    placeholder.appendChild(qrPattern);
    placeholder.appendChild(text);
    qrContainer.appendChild(placeholder);
}

// ============================================
// Wallet Address Management
// ============================================

function initializeAddressCopy() {
    const copyBtn = document.getElementById('copyAddressBtn');
    const addressInput = document.getElementById('walletAddress');

    if (copyBtn && addressInput) {
        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(addressInput.value);

                // Visual feedback
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                `;
                this.style.backgroundColor = '#28A745';

                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy address');
            }
        });
    }
}

// ============================================
// Payment Confirmation Flow
// ============================================

function initializePaymentActions() {
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    const backBtn = document.getElementById('backBtn');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // Clear rate timer
            if (AppState.rateTimer) {
                clearInterval(AppState.rateTimer);
            }

            // Start processing
            showScreen('processingScreen');
            simulatePaymentProcessing();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this payment?')) {
                if (AppState.rateTimer) {
                    clearInterval(AppState.rateTimer);
                }
                showScreen('paymentSelection');
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (AppState.rateTimer) {
                clearInterval(AppState.rateTimer);
            }
            showScreen('paymentSelection');
        });
    }
}

// ============================================
// Payment Processing Simulation
// ============================================

function simulatePaymentProcessing() {
    AppState.processingProgress = 0;
    AppState.processingStep = 1;

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Step 1: Transaction Received (0-33%)
    updateProcessingStep(1, 'completed');
    animateProgress(0, 33, 1500, 'Confirming transaction...', () => {

        // Step 2: Blockchain Confirmation (33-66%)
        setTimeout(() => {
            updateProcessingStep(2, 'completed');
            updateProcessingStep(3, 'active');
            animateProgress(33, 66, 2000, 'Verifying on blockchain...', () => {

                // Step 3: Payment Verification (66-100%)
                setTimeout(() => {
                    updateProcessingStep(3, 'completed');
                    animateProgress(66, 100, 1500, 'Finalizing payment...', () => {

                        // Complete
                        setTimeout(() => {
                            completePayment();
                        }, 500);
                    });
                }, 500);
            });
        }, 500);
    });
}

function updateProcessingStep(stepNumber, status) {
    const step = document.getElementById(`step${stepNumber}`);
    if (!step) return;

    step.classList.remove('active', 'completed');

    if (status === 'completed') {
        step.classList.add('completed');
        const timeElement = step.querySelector('.step-time');
        if (timeElement) {
            timeElement.textContent = 'Completed';
        }
    } else if (status === 'active') {
        step.classList.add('active');
        const timeElement = step.querySelector('.step-time');
        if (timeElement) {
            timeElement.textContent = 'In progress...';
        }
    }
}

function animateProgress(startPercent, endPercent, duration, message, callback) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercent = startPercent + (endPercent - startPercent) * progress;

        if (progressFill) {
            progressFill.style.width = `${currentPercent}%`;
        }

        if (progressText) {
            progressText.textContent = `${message} ${Math.round(currentPercent)}%`;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else if (callback) {
            callback();
        }
    }

    update();
}

function completePayment() {
    // Generate transaction data
    AppState.paymentData.transactionId = '0x9f2' + Math.random().toString(16).substr(2, 8) + 'a8c4';
    AppState.paymentData.confirmationTime = new Date().toLocaleString();

    // Show success screen
    showScreen('successScreen');
    updateSuccessScreen();
}

// ============================================
// Success Screen Management
// ============================================

function updateSuccessScreen() {
    const confirmationTimeElement = document.getElementById('confirmationTime');
    if (confirmationTimeElement) {
        confirmationTimeElement.textContent = AppState.paymentData.confirmationTime;
    }
}

function initializeSuccessActions() {
    const downloadBtn = document.getElementById('downloadReceiptBtn');
    const dashboardBtn = document.getElementById('returnDashboardBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            generateReceipt();
        });
    }

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            // In a real app, this would navigate to the dashboard
            alert('Returning to dashboard...');
            window.location.href = '/dashboard';
        });
    }
}

function generateReceipt() {
    // In a real implementation, this would generate a PDF receipt
    const receiptData = {
        transactionId: AppState.paymentData.transactionId,
        amount: AppState.paymentData.amount,
        pyusdAmount: AppState.paymentData.pyusdAmount,
        confirmationTime: AppState.paymentData.confirmationTime,
        taxPeriod: 'Q4 2025',
        taxType: 'Excise Tax'
    };

    const receiptText = `
PAYMENT RECEIPT
State Tax Portal

Transaction ID: ${receiptData.transactionId}
Date: ${receiptData.confirmationTime}

Tax Period: ${receiptData.taxPeriod}
Tax Type: ${receiptData.taxType}

Amount Paid: ${receiptData.pyusdAmount} PYUSD
USD Equivalent: $${receiptData.amount}

Payment Method: PayPal USD (PYUSD)
Status: CONFIRMED
    `.trim();

    // Create and download text file
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-receipt-${receiptData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Visual feedback
    const btn = document.getElementById('downloadReceiptBtn');
    if (btn) {
        const originalText = btn.textContent;
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            DOWNLOADED
        `;

        setTimeout(() => {
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                DOWNLOAD RECEIPT
            `;
        }, 2000);
    }
}

// ============================================
// Utility Functions
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatCrypto(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(amount);
}

// ============================================
// Accessibility Enhancements
// ============================================

function initializeAccessibility() {
    // Add keyboard navigation for payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.setAttribute('tabindex', '0');
        option.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add ARIA labels where needed
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.getAttribute('aria-label') && btn.textContent) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
}

// ============================================
// Performance Optimization
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Error Handling
// ============================================

function handleError(error, userMessage = 'An error occurred. Please try again.') {
    console.error('Application Error:', error);
    alert(userMessage);
}

// Add global error handler
window.addEventListener('error', function(event) {
    handleError(event.error, 'An unexpected error occurred. Please refresh the page.');
});

// ============================================
// Application Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('PYUSD Payment Integration - Professional Theme Loaded');

    try {
        // Initialize all components
        initializePaymentSelection();
        initializeAddressCopy();
        initializePaymentActions();
        initializeSuccessActions();
        initializeAccessibility();

        // Show initial screen
        showScreen('paymentSelection');

        console.log('Application initialized successfully');
    } catch (error) {
        handleError(error, 'Failed to initialize application. Please refresh the page.');
    }
});

// ============================================
// Cleanup on page unload
// ============================================

window.addEventListener('beforeunload', function() {
    if (AppState.rateTimer) {
        clearInterval(AppState.rateTimer);
    }
});

// ============================================
// Export for testing (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        showScreen,
        formatCurrency,
        formatCrypto
    };
}
