// Customer Request Automation Dashboard
// Configuration
const CONFIG = {
    // Replace with your published Google Sheets CSV URL
    SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/1ZW4TpU0806fovKV1bcePmq9tocIbPnjaW3ErPMwuffY/export?format=csv&gid=0',
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_RETRIES: 3
};

// Global state
let ordersData = [];
let isRefreshing = false;
let refreshInterval;

// DOM elements
const elements = {
    totalOrders: document.getElementById('total-orders'),
    avgProcessingTime: document.getElementById('avg-processing-time'),
    successRate: document.getElementById('success-rate'),
    todayOrders: document.getElementById('today-orders'),
    ordersTbody: document.getElementById('orders-tbody'),
    loadingOverlay: document.getElementById('loading-overlay'),
    errorModal: document.getElementById('error-modal'),
    errorMessage: document.getElementById('error-message')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Customer Request Automation Dashboard initialized');
    
    // Check if CSV URL is configured
    if (CONFIG.SHEET_CSV_URL === 'PUBLISHED_SHEET_CSV_URL_HERE') {
        showError('Please configure the Google Sheets CSV URL in app.js');
        return;
    }
    
    // Load initial data
    loadData();
    
    // Set up auto-refresh
    startAutoRefresh();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Close modal when clicking X
    document.querySelector('.close').addEventListener('click', function() {
        elements.errorModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === elements.errorModal) {
            elements.errorModal.style.display = 'none';
        }
    });
}

// Load data from Google Sheets
async function loadData() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    showLoading(true);
    
    try {
        console.log('Loading data from:', CONFIG.SHEET_CSV_URL);
        
        const response = await fetch(CONFIG.SHEET_CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        ordersData = data;
        updateDashboard();
        console.log('Data loaded successfully:', data.length, 'orders');
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError(`Failed to load data: ${error.message}`);
    } finally {
        isRefreshing = false;
        showLoading(false);
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const order = {};
        
        headers.forEach((header, index) => {
            order[header] = values[index] || '';
        });
        
        return order;
    });
}

// Update dashboard with current data
function updateDashboard() {
    updateStats();
    updateOrdersTable();
    updatePipelineStatus();
}

// Update statistics
function updateStats() {
    const total = ordersData.length;
    const today = getTodayOrders().length;
    const avgTime = calculateAverageProcessingTime();
    const success = calculateSuccessRate();
    
    elements.totalOrders.textContent = total.toLocaleString();
    elements.todayOrders.textContent = today.toLocaleString();
    elements.avgProcessingTime.textContent = `${avgTime}s`;
    elements.successRate.textContent = `${success}%`;
}

// Get today's orders
function getTodayOrders() {
    const today = new Date().toDateString();
    return ordersData.filter(order => {
        const orderDate = new Date(order.Timestamp || order.timestamp || '');
        return orderDate.toDateString() === today;
    });
}

// Calculate average processing time
function calculateAverageProcessingTime() {
    // Mock calculation - in real implementation, this would be based on actual timestamps
    const processingTimes = ordersData.map(() => Math.floor(Math.random() * 30) + 5);
    const avg = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    return Math.round(avg);
}

// Calculate success rate
function calculateSuccessRate() {
    if (ordersData.length === 0) return 0;
    
    const successful = ordersData.filter(order => {
        const status = (order.Status || order.status || '').toLowerCase();
        return status === 'completed' || status === 'processed';
    }).length;
    
    return Math.round((successful / ordersData.length) * 100);
}

// Update orders table
function updateOrdersTable() {
    if (!elements.ordersTbody) return;
    
    // Sort by timestamp (newest first)
    const sortedOrders = [...ordersData].sort((a, b) => {
        const dateA = new Date(a.Timestamp || a.timestamp || '');
        const dateB = new Date(b.Timestamp || b.timestamp || '');
        return dateB - dateA;
    });
    
    // Show only last 20 orders
    const recentOrders = sortedOrders.slice(0, 20);
    
    elements.ordersTbody.innerHTML = recentOrders.map(order => {
        const timestamp = formatTimestamp(order.Timestamp || order.timestamp || '');
        const customer = order['Customer Name'] || order.customer_name || order.Customer || 'N/A';
        const phone = order['Phone Number'] || order.phone_number || order.Phone || 'N/A';
        const details = order['Order Details'] || order.order_details || order.Details || 'N/A';
        const priority = order.Priority || order.priority || 'medium';
        const status = order.Status || order.status || 'pending';
        const assigned = order['Assigned To'] || order.assigned_to || order.Assigned || 'Unassigned';
        
        return `
            <tr class="new-order">
                <td>${timestamp}</td>
                <td>${customer}</td>
                <td>${phone}</td>
                <td class="order-details">${truncateText(details, 50)}</td>
                <td><span class="priority-${priority.toLowerCase()}">${priority}</span></td>
                <td><span class="status-${status.toLowerCase()}">${status}</span></td>
                <td>${assigned}</td>
                <td>
                    <button class="btn btn-sm" onclick="viewOrder('${customer}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update pipeline status
function updatePipelineStatus() {
    // Mock status updates - in real implementation, this would check actual system status
    const statuses = ['Active', 'Active', 'Active', 'Active'];
    const statusElements = ['email-status', 'ai-status', 'storage-status', 'notification-status'];
    
    statusElements.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = statuses[index];
            element.className = `step-status ${statuses[index].toLowerCase()}`;
        }
    });
}

// Format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch (error) {
        return timestamp;
    }
}

// Truncate text
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show/hide loading overlay
function showLoading(show) {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.toggle('show', show);
    }
}

// Show error modal
function showError(message) {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
    }
    if (elements.errorModal) {
        elements.errorModal.style.display = 'block';
    }
}

// Refresh data manually
function refreshData() {
    console.log('Manual refresh triggered');
    loadData();
}

// Export data
function exportData() {
    if (ordersData.length === 0) {
        showError('No data to export');
        return;
    }
    
    try {
        const csv = convertToCSV(ordersData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customer-orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export error:', error);
        showError('Failed to export data');
    }
}

// Convert data to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// View order details
function viewOrder(customerName) {
    const order = ordersData.find(o => 
        (o['Customer Name'] || o.customer_name || o.Customer) === customerName
    );
    
    if (order) {
        alert(`Order Details:\n\nCustomer: ${customerName}\nDetails: ${order['Order Details'] || order.order_details || 'N/A'}\nStatus: ${order.Status || order.status || 'N/A'}`);
    }
}

// Start auto-refresh
function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        if (!isRefreshing) {
            loadData();
        }
    }, CONFIG.REFRESH_INTERVAL);
}

// Stop auto-refresh
function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
        loadData(); // Refresh immediately when page becomes visible
    }
});

// Handle window focus
window.addEventListener('focus', function() {
    if (!isRefreshing) {
        loadData();
    }
});

// Error handling for unhandled promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showError('An unexpected error occurred');
});

// Console logging for debugging
console.log('Dashboard configuration:', CONFIG);
console.log('Available functions: refreshData(), exportData(), viewOrder(customerName)');
