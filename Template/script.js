/**
 * Customer Exit Prediction System
 * JavaScript functionality for form handling and predictions
 */

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    const form = document.getElementById('customerForm');
    
    // Add form submit event listener
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input validation listeners
    addInputValidationListeners();
    
    console.log('Customer Exit Prediction System initialized');
}

// ===================================
// Form Handling
// ===================================

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    if (!validateFormData(formData)) {
        return;
    }
    
    // Generate predictions
    const predictions = generatePredictions(formData);
    
    // Update UI with predictions
    updatePredictionsDisplay(predictions);
    
    // Display customer data
    displayCustomerData(formData);
    
    // Scroll to results
    scrollToResults();
}

/**
 * Get all form data
 */
function getFormData() {
    return {
        creditScore: parseInt(document.getElementById('creditScore').value),
        country: document.getElementById('country').value,
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        tenure: parseInt(document.getElementById('tenure').value),
        balance: parseFloat(document.getElementById('balance').value),
        numProducts: parseInt(document.getElementById('numProducts').value),
        hasCreditCard: document.getElementById('hasCreditCard').value,
        isActiveMember: document.getElementById('isActiveMember').value,
        estimatedSalary: parseFloat(document.getElementById('estimatedSalary').value)
    };
}

/**
 * Validate form data
 */
function validateFormData(data) {
    // Check credit score range
    if (data.creditScore < 300 || data.creditScore > 850) {
        showNotification('Credit score must be between 300 and 850', 'error');
        return false;
    }
    
    // Check age range
    if (data.age < 18 || data.age > 100) {
        showNotification('Age must be between 18 and 100', 'error');
        return false;
    }
    
    // Check tenure range
    if (data.tenure < 0 || data.tenure > 50) {
        showNotification('Years as customer must be between 0 and 50', 'error');
        return false;
    }
    
    // Check balance is positive
    if (data.balance < 0) {
        showNotification('Account balance cannot be negative', 'error');
        return false;
    }
    
    // Check salary is positive
    if (data.estimatedSalary < 0) {
        showNotification('Estimated salary cannot be negative', 'error');
        return false;
    }
    
    return true;
}

// ===================================
// Prediction Logic
// ===================================

/**
 * Generate predictions using simulated ML models
 * In production, this would call your actual ML API
 */
function generatePredictions(data) {
    // Calculate base probability influenced by various factors
    let baseProbability = 0.5;
    
    // Factor 1: Age influence
    if (data.age > 60) {
        baseProbability += 0.12;
    } else if (data.age > 50) {
        baseProbability += 0.08;
    } else if (data.age < 25) {
        baseProbability -= 0.05;
    }
    
    // Factor 2: Tenure influence
    if (data.tenure > 10) {
        baseProbability -= 0.15;
    } else if (data.tenure > 5) {
        baseProbability -= 0.08;
    } else if (data.tenure < 2) {
        baseProbability += 0.12;
    }
    
    // Factor 3: Number of products influence
    if (data.numProducts === 1) {
        baseProbability += 0.18;
    } else if (data.numProducts >= 3) {
        baseProbability -= 0.12;
    }
    
    // Factor 4: Active membership influence
    if (data.isActiveMember === 'yes') {
        baseProbability -= 0.15;
    } else {
        baseProbability += 0.18;
    }
    
    // Factor 5: Balance influence
    if (data.balance === 0) {
        baseProbability += 0.25;
    } else if (data.balance > 150000) {
        baseProbability -= 0.15;
    } else if (data.balance > 100000) {
        baseProbability -= 0.08;
    }
    
    // Factor 6: Credit card influence
    if (data.hasCreditCard === 'yes') {
        baseProbability -= 0.05;
    }
    
    // Factor 7: Credit score influence
    if (data.creditScore < 500) {
        baseProbability += 0.10;
    } else if (data.creditScore > 750) {
        baseProbability -= 0.08;
    }
    
    // Factor 8: Salary influence
    if (data.estimatedSalary < 30000) {
        baseProbability += 0.08;
    } else if (data.estimatedSalary > 100000) {
        baseProbability -= 0.05;
    }
    
    // Generate predictions with variance for each model
    const predictions = {
        decisionTree: calculatePrediction(baseProbability, 0.22),
        knn: calculatePrediction(baseProbability, 0.28),
        logisticRegression: calculatePrediction(baseProbability, 0.18),
        randomForest: calculatePrediction(baseProbability, 0.15),
        xgboost: calculatePrediction(baseProbability, 0.12)
    };
    
    return predictions;
}

/**
 * Calculate prediction with variance
 */
function calculatePrediction(baseProbability, variance) {
    const prediction = (baseProbability + (Math.random() - 0.5) * variance) * 100;
    return Math.max(0, Math.min(100, prediction));
}

// ===================================
// UI Update Functions
// ===================================

/**
 * Update predictions display in the table
 */
function updatePredictionsDisplay(predictions) {
    const predictionElements = {
        'pred-dt': predictions.decisionTree,
        'pred-knn': predictions.knn,
        'pred-lr': predictions.logisticRegression,
        'pred-rf': predictions.randomForest,
        'pred-xgb': predictions.xgboost
    };
    
    for (const [id, value] of Object.entries(predictionElements)) {
        updatePredictionCell(id, value);
    }
}

/**
 * Update individual prediction cell with animation
 */
function updatePredictionCell(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Fade out
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        // Update value
        element.textContent = value.toFixed(1) + '%';
        
        // Apply color based on risk level
        if (value > 70) {
            element.style.color = '#ef4444'; // High risk - red
        } else if (value > 40) {
            element.style.color = '#f59e0b'; // Medium risk - orange
        } else {
            element.style.color = '#10b981'; // Low risk - green
        }
        
        // Fade in
        element.style.opacity = '1';
    }, 300);
}

/**
 * Display customer data in the record section
 */
function displayCustomerData(data) {
    const dataDisplay = document.getElementById('dataDisplay');
    if (!dataDisplay) return;
    
    const fields = [
        { label: 'Credit Score', value: data.creditScore },
        { label: 'Country', value: capitalizeFirstLetter(data.country) },
        { label: 'Gender', value: capitalizeFirstLetter(data.gender) },
        { label: 'Age', value: `${data.age} years` },
        { label: 'Years as Customer', value: `${data.tenure} years` },
        { label: 'Account Balance', value: formatCurrency(data.balance) },
        { label: 'Products Used', value: data.numProducts },
        { label: 'Has Credit Card', value: capitalizeFirstLetter(data.hasCreditCard) },
        { label: 'Active Member', value: capitalizeFirstLetter(data.isActiveMember) },
        { label: 'Estimated Salary', value: formatCurrency(data.estimatedSalary) }
    ];
    
    let html = '<div class="data-grid">';
    
    fields.forEach(field => {
        html += `
            <div class="data-item">
                <span class="data-label">${field.label}:</span>
                <span class="data-value">${field.value}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    dataDisplay.innerHTML = html;
}

/**
 * Scroll to results section
 */
function scrollToResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 400);
    }
}

// ===================================
// Input Validation
// ===================================

/**
 * Add real-time validation to input fields
 */
function addInputValidationListeners() {
    // Credit score validation
    const creditScore = document.getElementById('creditScore');
    if (creditScore) {
        creditScore.addEventListener('blur', function() {
            validateInput(this, 300, 850, 'Credit score should be between 300 and 850');
        });
    }
    
    // Age validation
    const age = document.getElementById('age');
    if (age) {
        age.addEventListener('blur', function() {
            validateInput(this, 18, 100, 'Age should be between 18 and 100');
        });
    }
    
    // Tenure validation
    const tenure = document.getElementById('tenure');
    if (tenure) {
        tenure.addEventListener('blur', function() {
            validateInput(this, 0, 50, 'Years as customer should be between 0 and 50');
        });
    }
    
    // Balance validation
    const balance = document.getElementById('balance');
    if (balance) {
        balance.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (this.value && value < 0) {
                this.style.borderColor = '#ef4444';
                showNotification('Account balance cannot be negative', 'warning');
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // Salary validation
    const salary = document.getElementById('estimatedSalary');
    if (salary) {
        salary.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (this.value && value < 0) {
                this.style.borderColor = '#ef4444';
                showNotification('Estimated salary cannot be negative', 'warning');
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

/**
 * Validate input field
 */
function validateInput(element, min, max, message) {
    const value = parseInt(element.value);
    if (element.value && (value < min || value > max)) {
        element.style.borderColor = '#ef4444';
        showNotification(message, 'warning');
    } else {
        element.style.borderColor = '';
    }
}

// ===================================
// Utility Functions
// ===================================

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str) {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format number as currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    alert(message);
    // In production, you would use a better notification system
    // like toast notifications or modal dialogs
}

/**
 * Reset form and clear results
 */
function resetForm() {
    const form = document.getElementById('customerForm');
    const dataDisplay = document.getElementById('dataDisplay');
    
    if (form) {
        form.reset();
    }
    
    // Reset predictions
    const predictionIds = ['pred-dt', 'pred-knn', 'pred-lr', 'pred-rf', 'pred-xgb'];
    predictionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '--';
            element.style.color = '';
        }
    });
    
    // Reset data display
    if (dataDisplay) {
        dataDisplay.innerHTML = '<p class="no-data">No data entered yet</p>';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Export for Module Systems (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getFormData,
        validateFormData,
        generatePredictions,
        formatCurrency,
        capitalizeFirstLetter
    };
}
