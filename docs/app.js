// Customer Request Automation Dashboard
// JavaScript for dynamic content and interactions

// Sample data for demonstration
const sampleOrders = [
    {
        timestamp: '2025-09-22 15:30',
        customer: 'John Doe',
        phone: '+1-555-0123',
        details: 'Product inquiry - Premium Package',
        priority: 'High',
        status: 'Processing',
        assignedTo: 'Team A',
        id: 1
    },
    {
        timestamp: '2025-09-22 14:45',
        customer: 'Jane Smith',
        phone: '+1-555-0124',
        details: 'Support request - Installation help',
        priority: 'Medium',
        status: 'Completed',
        assignedTo: 'Team B',
        id: 2
    },
    {
        timestamp: '2025-09-22 13:20',
        customer: 'Bob Johnson',
        phone: '+1-555-0125',
        details: 'Sales inquiry - Bulk order',
        priority: 'Low',
        status: 'Pending',
        assignedTo: 'Team C',
        id: 3
    }
];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadSampleData();
    updateStats();
    hideLoadingOverlay();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('Initializing Customer Request Automation Dashboard...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize system status
    updateSystemStatus();
}

// Setup event listeners
function setupEventListeners() {
    // Close modal functionality
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('error-modal').style.display = 'none';
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('error-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load sample data into the table
function loadSampleData() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sampleOrders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
}

// Create a table row for an order
function createOrderRow(order) {
    const row = document.createElement('tr');
    
    const priorityClass = getPriorityClass(order.priority);
    const statusClass = getStatusClass(order.status);
    
    row.innerHTML = `
        <td>${order.timestamp}</td>
        <td>${order.customer}</td>
        <td>${order.phone}</td>
        <td>${order.details}</td>
        <td><span class="priority ${priorityClass}">${order.priority}</span></td>
        <td><span class="status ${statusClass}">${order.status}</span></td>
        <td>${order.assignedTo}</td>
        <td>
            <button class="btn btn-sm" onclick="viewOrder(${order.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm" onclick="editOrder(${order.id})">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Get CSS class for priority
function getPriorityClass(priority) {
    switch(priority.toLowerCase()) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return '';
    }
}

// Get CSS class for status
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'completed': return 'status-completed';
        case 'processing': return 'status-processing';
        case 'pending': return 'status-pending';
        default: return '';
    }
}

// Update dashboard statistics
function updateStats() {
    const totalOrders = sampleOrders.length;
    const completedOrders = sampleOrders.filter(order => order.status === 'Completed').length;
    const processingOrders = sampleOrders.filter(order => order.status === 'Processing').length;
    const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    
    // Update DOM elements
    updateElement('total-orders', totalOrders);
    updateElement('avg-processing-time', '2.5s');
    updateElement('success-rate', `${successRate}%`);
    updateElement('today-orders', processingOrders);
}

// Update DOM element safely
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Update system status indicators
function updateSystemStatus() {
    const statusElements = [
        'email-status',
        'ai-status', 
        'storage-status',
        'notification-status'
    ];
    
    statusElements.forEach(id => {
        updateElement(id, 'Active');
    });
}

// Refresh data function
function refreshData() {
    showLoadingOverlay();
    
    // Simulate API call delay
    setTimeout(() => {
        loadSampleData();
        updateStats();
        hideLoadingOverlay();
        console.log('Data refreshed successfully');
    }, 1000);
}

// Export data function
function exportData() {
    try {
        const csvContent = convertToCSV(sampleOrders);
        downloadCSV(csvContent, 'orders-export.csv');
        console.log('Data exported successfully');
    } catch (error) {
        showError('Failed to export data: ' + error.message);
    }
}

// Convert data to CSV format
function convertToCSV(data) {
    const headers = ['Timestamp', 'Customer', 'Phone', 'Details', 'Priority', 'Status', 'Assigned To'];
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(order => {
        const row = [
            order.timestamp,
            order.customer,
            order.phone,
            order.details,
            order.priority,
            order.status,
            order.assignedTo
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// Download CSV file
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// View order details
function viewOrder(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nCustomer: ${order.customer}\nPhone: ${order.phone}\nDetails: ${order.details}\nStatus: ${order.status}`);
    }
}

// Edit order
function editOrder(orderId) {
    alert(`Edit functionality for order ${orderId} would be implemented here.`);
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Show error modal
function showError(message) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    
    if (modal && errorMessage) {
        errorMessage.textContent = message;
        modal.style.display = 'block';
    }
}

// Utility function to format timestamp
function formatTimestamp(date) {
    return new Date(date).toLocaleString();
}

// Console log for debugging
console.log('Customer Request Automation Dashboard JavaScript loaded successfully');
