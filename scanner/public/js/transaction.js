// ============================================
// TRANSACTION DATA FETCHER & RENDERER
// ============================================

// Configuration
const API_URL = '/api/transaction';
const DEFAULT_TRANSACTION_ID = '0x8088fc966eda77adf803f9d061f59da65a6e66452d10d822c598f433ae106feb';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format number with commas
function formatNumber(num) {
    if (!num && num !== 0) return '0';
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Format BTC amount
function formatBTC(num) {
    if (!num && num !== 0) return '0.0000';
    return Number(num).toFixed(4);
}

// Format fee amount
function formatFee(num) {
    if (!num && num !== 0) return '0.00';
    return Number(num).toFixed(2);
}

// Format timestamp
function formatTimestamp(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toUTCString().replace('GMT', '+UTC');
}

// Get time ago string
function getTimeAgo(date) {
    if (!date) return 'Just now';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch(status?.toLowerCase()) {
        case 'confirmed':
            return 'bg-success bg-opacity-10 border-success text-success';
        case 'pending':
            return 'bg-warning bg-opacity-10 border-warning text-warning';
        case 'failed':
            return 'bg-danger bg-opacity-10 border-danger text-danger';
        default:
            return 'bg-secondary bg-opacity-10 border-secondary text-secondary';
    }
}

// Get status icon
function getStatusIcon(status) {
    switch(status?.toLowerCase()) {
        case 'confirmed':
            return 'fa-check-circle';
        case 'pending':
            return 'fa-clock';
        case 'failed':
            return 'fa-times-circle';
        default:
            return 'fa-question-circle';
    }
}

// ============================================
// API FUNCTIONS
// ============================================

// Fetch transaction from API
async function fetchTransaction(id) {
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Transaction not found');
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch transaction');
        }
        
        return result.data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Update transaction data
async function updateTransaction(id, data) {
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Update failed: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}

// ============================================
// DOM UPDATE FUNCTIONS
// ============================================

// Update the UI with transaction data
function updateUI(data) {
    if (!data) {
        showError('No data available');
        return;
    }
    
    try {
        // --- Basic Info ---
        setElementText('spanTxHash', data.txHash || 'N/A');
        setElementText('accountName', data.accountName || 'Unknown');
        setElementText('platform', data.platform || 'Unknown');
        setElementText('btcAddress', data.btcAddress || 'N/A');
        
        // --- Amounts ---
        setElementText('amountUSD', `$${formatNumber(data.amountUSD)}.00`);
        setElementText('amountBTC', formatBTC(data.amountBTC));
        setElementText('exchangeRate', formatNumber(data.exchangeRate));
        
        // --- Fees ---
        setElementText('gasFee', formatNumber(data.gasFee));
        setElementText('estimatedFeeUSD', formatFee(data.estimatedFeeUSD));
        setElementText('estimatedFeeBTC', data.estimatedFeeBTC ? data.estimatedFeeBTC.toFixed(5) : '0.00000');
        setElementText('totalFeeUSD', `$${formatFee(data.estimatedFeeUSD)}`);
        setElementText('totalFeeBTC', data.estimatedFeeBTC ? data.estimatedFeeBTC.toFixed(5) : '0.00000');
        setElementText('baseFee', `~$${formatFee(data.baseFee)}`);
        setElementText('priorityFee', `~$${formatFee(data.priorityFee)}`);
        setElementText('totalFeeDisplay', `$${formatFee(data.estimatedFeeUSD)}`);
        
        // --- Addresses ---
        setElementText('fromAddress', data.fromAddress || 'N/A');
        setElementText('toAddress', data.toAddress || 'N/A');
        setElementText('fromLabel', `${data.accountName || 'Unknown'} (${data.platform || 'Unknown'})`);
        setElementText('toLabel', 'External Wallet (Unknown)');
        
        // --- Status ---
        const statusBadge = document.getElementById('txStatus');
        if (statusBadge) {
            const status = data.status || 'confirmed';
            const badgeClass = getStatusBadgeClass(status);
            const icon = getStatusIcon(status);
            statusBadge.className = `badge ${badgeClass} fw-medium ms-2`;
            statusBadge.innerHTML = `<i class="fa ${icon} me-1"></i>${status.charAt(0).toUpperCase() + status.slice(1)}`;
        }
        
        // --- Block and Confirmations ---
        setElementText('blockNumberLink', `#${formatNumber(data.blockNumber)}`);
        setElementText('confirmations', data.confirmations || 0);
        setElementText('blockConfirmations', data.confirmations || 0);
        
        // Update block link
        const blockLink = document.getElementById('blockNumberLink');
        if (blockLink && data.blockNumber) {
            blockLink.href = `/block/${data.blockNumber}`;
        }
        
        // --- Timestamp ---
        if (data.timestamp) {
            setElementText('timestamp', formatTimestamp(data.timestamp));
            setElementText('timeAgo', getTimeAgo(data.timestamp));
        } else {
            setElementText('timestamp', 'N/A');
            setElementText('timeAgo', 'Unknown');
        }
        
        // --- Transaction Hash ---
        setElementText('txHashDisplay', data.txHash || 'N/A');
        
        // --- Network ---
        setElementText('network', 'Bitcoin Mainnet');
        
        // --- Input/Output ---
        const totalInput = (data.amountUSD || 0) + (data.estimatedFeeUSD || 0);
        setElementText('inputAmount', `$${formatNumber(totalInput)}`);
        setElementText('outputAmount', `$${formatNumber(data.amountUSD)}.00`);
        setElementText('netAmount', `$${formatNumber(data.amountUSD)}.00`);
        
        // --- Show content, hide spinner ---
        showContent();
        
        // --- Setup clipboard ---
        setupClipboard();
        
        // --- Setup tooltips ---
        setupTooltips();
        
    } catch (error) {
        console.error('UI Update error:', error);
        showError('Error displaying transaction data');
    }
}

// Helper to set element text content
function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// ============================================
// CLIPBOARD FUNCTIONS
// ============================================

function setupClipboard() {
    document.querySelectorAll('.js-clipboard').forEach(btn => {
        // Remove existing listeners to prevent duplicates
        btn.removeEventListener('click', handleClipboardClick);
        btn.addEventListener('click', handleClipboardClick);
    });
}

async function handleClipboardClick(e) {
    const btn = e.currentTarget;
    const text = btn.getAttribute('data-clipboard-text') || 
                 btn.getAttribute('data-clipboard-target');
    
    if (!text) {
        console.warn('No clipboard text found');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const icon = btn.querySelector('i');
        if (icon) {
            const originalClass = icon.className;
            icon.className = 'fas fa-check text-success';
            setTimeout(() => {
                icon.className = originalClass;
            }, 1500);
        }
        
        // Show toast notification
        showToast('Copied to clipboard!');
        
    } catch (err) {
        console.error('Clipboard error:', err);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Copied to clipboard!');
        } catch (fallbackErr) {
            console.error('Fallback clipboard error:', fallbackErr);
        }
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    // Check if Bootstrap toast is available
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0 show`;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.getElementById('toastContainer').appendChild(toastEl);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (toastEl.parentNode) {
            toastEl.classList.remove('show');
            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.parentNode.removeChild(toastEl);
                }
            }, 300);
        }
    }, 3000);
}

// ============================================
// TOOLTIP SETUP
// ============================================

function setupTooltips() {
    // If Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            // Dispose existing tooltip
            const tooltip = bootstrap.Tooltip.getInstance(el);
            if (tooltip) {
                tooltip.dispose();
            }
            // Create new tooltip
            new bootstrap.Tooltip(el);
        });
    }
}

// ============================================
// UI STATE FUNCTIONS
// ============================================

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('transactionContent');
    const error = document.getElementById('errorMessage');
    
    if (spinner) spinner.style.display = 'block';
    if (content) content.style.display = 'none';
    if (error) error.style.display = 'none';
}

function showContent() {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('transactionContent');
    const error = document.getElementById('errorMessage');
    
    if (spinner) spinner.style.display = 'none';
    if (content) content.style.display = 'block';
    if (error) error.style.display = 'none';
}

function showError(message) {
    const spinner = document.getElementById('loadingSpinner');
    const content = document.getElementById('transactionContent');
    const error = document.getElementById('errorMessage');
    
    if (spinner) spinner.style.display = 'none';
    if (content) content.style.display = 'none';
    
    if (error) {
        error.style.display = 'block';
        error.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Error:</strong> ${message}
                <button class="btn btn-sm btn-outline-danger ms-3" onclick="location.reload()">
                    <i class="fas fa-sync me-1"></i>Retry
                </button>
            </div>
        `;
    } else {
        // Create error element if it doesn't exist
        const card = document.querySelector('.card');
        if (card) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'text-center py-5';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
                <h5>${message}</h5>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    <i class="fas fa-sync me-1"></i>Retry
                </button>
            `;
            card.prepend(errorDiv);
        }
    }
}

// ============================================
// MAIN LOAD FUNCTION
// ============================================

async function loadTransaction(transactionId) {
    // Show loading state
    showLoading();
    
    try {
        // Get transaction ID from URL or use default
        const id = transactionId || getTransactionIdFromURL() || DEFAULT_TRANSACTION_ID;
        
        // Fetch data
        const data = await fetchTransaction(id);
        
        // Update UI with data
        if (data) {
            updateUI(data);
            console.log('✅ Transaction loaded successfully:', data.txHash);
        } else {
            throw new Error('No data received');
        }
        
    } catch (error) {
        console.error('Failed to load transaction:', error);
        showError(error.message || 'Failed to load transaction data');
        
        // Try to use server-side injected data if available
        if (window.transactionData) {
            console.log('Using server-side injected data as fallback');
            updateUI(window.transactionData);
            showContent();
        }
    }
}

// ============================================
// URL HELPERS
// ============================================

function getTransactionIdFromURL() {
    // Check if we're on a transaction page: /tx/:id
    const path = window.location.pathname;
    const match = path.match(/^\/tx\/(.+)$/);
    if (match) {
        return match[1];
    }
    
    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const txParam = params.get('tx') || params.get('hash') || params.get('id');
    if (txParam) {
        return txParam;
    }
    
    return null;
}

// ============================================
// REFRESH FUNCTION
// ============================================

function refreshTransaction() {
    const id = getTransactionIdFromURL() || DEFAULT_TRANSACTION_ID;
    loadTransaction(id);
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================

window.loadTransaction = loadTransaction;
window.refreshTransaction = refreshTransaction;
window.updateTransaction = updateTransaction;
window.fetchTransaction = fetchTransaction;
window.showToast = showToast;

// ============================================
// AUTO-INITIALIZE ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have server-side injected data
    if (window.transactionData) {
        console.log('Using server-side injected data');
        updateUI(window.transactionData);
        showContent();
    } else {
        // Load from API
        loadTransaction();
    }
});

console.log('✅ Transaction script loaded');