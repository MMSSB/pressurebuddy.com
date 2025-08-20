// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const currentDateTime = document.getElementById('currentDateTime');
const readingsCount = document.getElementById('readingsCount');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const systolicInput = document.getElementById('systolic');
const diastolicInput = document.getElementById('diastolic');
const commentInput = document.getElementById('comment');
const addReadingButton = document.getElementById('addReading');
const readingsList = document.getElementById('readingsList');
const resetButton = document.getElementById('resetButton');
const exportImageButton = document.getElementById('exportImage');
const exportPDFButton = document.getElementById('exportPDF');
const exportContent = document.getElementById('exportContent');
const exportTitle = document.getElementById('exportTitle');
const trendsMessage = document.getElementById('trendsMessage');
const saveButton = document.getElementById('saveButton');
const importButton = document.getElementById('importButton');
const fileInput = document.getElementById('fileInput');
const userWelcomeName = document.getElementById('userWelcomeName');

// Set default date and time
const now = new Date();
dateInput.value = now.toISOString().split('T')[0];
timeInput.value = now.toTimeString().slice(0, 5);

// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentDateTime.textContent = now.toLocaleDateString('en-US', options);
}

// Update the date and time immediately and every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Check for existing user
const savedName = localStorage.getItem('userName');
if (savedName) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'block';
    userWelcomeName.textContent = savedName;
}

// Handle name submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'block';
        userWelcomeName.textContent = name;
    }
});

// Load saved readings
let readings = JSON.parse(localStorage.getItem('bpReadings') || '[]');
updateReadingsList();

// Add new reading
addReadingButton.addEventListener('click', () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const systolic = parseInt(systolicInput.value);
    const diastolic = parseInt(diastolicInput.value);
    const comment = commentInput.value.trim();

    if (date && time && systolic && diastolic) {
        readings.push({ date, time, systolic, diastolic, comment });
        localStorage.setItem('bpReadings', JSON.stringify(readings));
        updateReadingsList();
        systolicInput.value = '';
        diastolicInput.value = '';
        commentInput.value = '';

        // Update trends message
        if (readings.length >= 2) {
            trendsMessage.textContent = 'Tracking your blood pressure trends over time';
        }
    }
});

// Update readings list
function updateReadingsList() {
    readingsList.innerHTML = '';
    readingsCount.textContent = `${readings.length} Readings`;

    if (readings.length === 0) {
        readingsList.innerHTML = '<div class="reading-item">No readings yet. Add your first reading above.</div>';
        return;
    }

    readings.slice().reverse().forEach((reading, index) => {
        const readingDate = new Date(`${reading.date}T${reading.time}`);
        const formattedDate = readingDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const readingItem = document.createElement('div');
        readingItem.className = 'reading-item';
        readingItem.innerHTML = `
            <div class="reading-value">${reading.systolic}/${reading.diastolic} mmHg</div>
            <div class="reading-date">${formattedDate}</div>
            ${reading.comment ? `<div class="reading-comment">${reading.comment}</div>` : ''}
            <div class="reading-actions">
                <button class="menu-button">⋮</button>
                <div class="dropdown-menu">
                    <button class="edit-button" data-index="${readings.length - 1 - index}">Edit</button>
                    <button class="delete-button" data-index="${readings.length - 1 - index}">Delete</button>
                </div>
            </div>
        `;
        readingsList.appendChild(readingItem);
    });

    // Add event listeners for the "three dots" menu
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.reading-actions').forEach(actions => {
                if (actions !== e.target.closest('.reading-actions')) {
                    actions.classList.remove('active');
                }
            });

            const actions = e.target.closest('.reading-actions');
            actions.classList.toggle('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.reading-actions')) {
            document.querySelectorAll('.reading-actions').forEach(actions => {
                actions.classList.remove('active');
            });
        }
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const reading = readings[index];
            dateInput.value = reading.date;
            timeInput.value = reading.time;
            systolicInput.value = reading.systolic;
            diastolicInput.value = reading.diastolic;
            commentInput.value = reading.comment || '';

            readings.splice(index, 1);
            localStorage.setItem('bpReadings', JSON.stringify(readings));
            updateReadingsList();
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            readings.splice(index, 1);
            localStorage.setItem('bpReadings', JSON.stringify(readings));
            updateReadingsList();

            if (readings.length < 2) {
                trendsMessage.textContent = 'Add at least two readings to see your trends';
            }
        });
    });
}

// Reset all data
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all readings? This cannot be undone.')) {
        readings = [];
        localStorage.setItem('bpReadings', JSON.stringify(readings));
        updateReadingsList();
        trendsMessage.textContent = 'Add at least two readings to see your trends';
    }
});

// Prepare export content
function prepareExportContent() {
    const userName = localStorage.getItem('userName');
    exportTitle.textContent = `Blood Pressure Data - ${userName}`;

    const table = exportContent.querySelector('table tbody');
    table.innerHTML = '';

    readings.forEach(reading => {
        const row = document.createElement('tr');
        const formattedTime = formatTime12Hour(reading.time);
        row.innerHTML = `
            <td>${reading.date}</td>
            <td>${formattedTime}</td>
            <td>${reading.systolic}</td>
            <td>${reading.diastolic}</td>
            <td>${reading.comment || ''}</td>
        `;
        table.appendChild(row);
    });

    exportContent.style.display = 'block';
    const result = { element: exportContent };
    exportContent.style.display = 'none';
    return result;
}

// Customizable variables for export image
const EXPORT_IMAGE_CONFIG = {
    width: 800,
    heightPerRow: 30,
    fontSizeTitle: 24,
    fontSizeText: 16,
    margin: 30,
    textColor: '#000000',
    backgroundColor: '#FFFFFF'
};

exportImageButton.addEventListener('click', async () => {
    const userName = localStorage.getItem('userName');
    const sortedReadings = readings.slice().reverse();
    const { width, heightPerRow, fontSizeTitle, fontSizeText, margin, textColor, backgroundColor } = EXPORT_IMAGE_CONFIG;

    // Calculate canvas height based on data rows
    const height = margin * 2 + heightPerRow * (sortedReadings.length + 3);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = textColor;
    ctx.font = `${fontSizeTitle}px Arial`;
    ctx.fillText(`Blood Pressure Data - ${userName}`, margin, margin + fontSizeTitle);

    // Draw table headers
    const headers = ['Date', 'Time', 'Systolic', 'Diastolic', 'Comment'];
    const columnWidths = [120, 80, 80, 80, width - 400];
    let yPosition = margin + heightPerRow + fontSizeTitle;
    ctx.font = `${fontSizeText}px Arial`;
    headers.forEach((header, index) => {
        ctx.fillText(header, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += heightPerRow;

    // Draw table data
    sortedReadings.forEach(reading => {
        const formattedTime = formatTime12Hour(reading.time);
        const rowData = [reading.date, formattedTime, reading.systolic.toString(), reading.diastolic.toString(), reading.comment || ''];
        rowData.forEach((cell, index) => {
            ctx.fillText(cell, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += heightPerRow;
    });

    // Export canvas as image
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `blood-pressure-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
});

// Export as PDF
exportPDFButton.addEventListener('click', () => {
    const userName = localStorage.getItem('userName');
    const readings = JSON.parse(localStorage.getItem('bpReadings') || '[]');

    // Initialize jsPDF with A4 dimensions
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    const websiteName = 'PressureBuddy.com';
    // const websiteLinkText = 'Visit our website';
    // const weblink = 'https://mmssb.github.io/pressurebuddy.com';
    // const websiteURL = 'https://mmssb.github.io/pressurebuddy.com';
    
    pdf.setFontSize(25);
    pdf.text(websiteName, 5, 20);
    // pdf.setFontSize(10);
    // pdf.text(weblink, 5, 25);
    // pdf.setFontSize(10);
    // pdf.setTextColor(0, 0, 255);
    // pdf.textWithLink(websiteLinkText, 5, 30, { url: websiteURL });
    // pdf.setTextColor(0, 0, 0);
    // pdf.setFontSize(14);

    // Set font styles
    pdf.setFont('helvetica');
    pdf.setFontSize(12);

    // Define A4 dimensions in millimeters
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.text(`Blood Pressure Data - ${userName}`, 10, 40);

    // Table headers
    const headers = ['Date', 'Time', 'Systolic', 'Diastolic', 'Comment'];
    const columnWidths = [40, 30, 25, 25, 70];
    const headerHeight = 10;

    // Start position for the table
    let yPosition = 50;

    // Draw table headers
    headers.forEach((header, index) => {
        pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += headerHeight;

    // Add table rows
    readings.forEach((reading, rowIndex) => {
        const formattedTime = formatTime12Hour(reading.time);
        const rowData = [reading.date, formattedTime, reading.systolic.toString(), reading.diastolic.toString(), reading.comment || ''];

        // Check if there's enough space for the next row
        if (yPosition + headerHeight > pageHeight) {
            pdf.addPage();
            yPosition = 20;

            // Redraw table headers on the new page
            headers.forEach((header, index) => {
                pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += headerHeight;
        }

        // Draw table row
        rowData.forEach((cell, colIndex) => {
            pdf.text(cell, 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += headerHeight;
    });

    // Save the PDF
    pdf.save(`blood-pressure-${new Date().toISOString().split('T')[0]}.pdf`);
});

// Save user data as a .hype file
saveButton.addEventListener('click', () => {
    const userName = localStorage.getItem('userName');
    const bpReadings = JSON.parse(localStorage.getItem('bpReadings') || '[]');

    const data = {
        userName,
        bpReadings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Data.hype`;
    link.click();

    URL.revokeObjectURL(url);
});

// Import button functionality
importButton.addEventListener('click', () => {
    fileInput.click();
});

// Handle file upload
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.hype')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (data.userName && Array.isArray(data.bpReadings)) {
                    localStorage.setItem('userName', data.userName);
                    localStorage.setItem('bpReadings', JSON.stringify(data.bpReadings));

                    readings = data.bpReadings;
                    updateReadingsList();

                    if (readings.length >= 2) {
                        trendsMessage.textContent = 'Tracking your blood pressure trends over time';
                    } else {
                        trendsMessage.textContent = 'Add at least two readings to see your trends';
                    }
                } else {
                    alert('Invalid data format in the file.');
                }
            } catch (error) {
                alert('Error parsing the file. Please ensure the file is valid.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Invalid file format. Please upload a valid .hype file.');
    }
});

// Helper function to convert 24-hour time to 12-hour time with AM/PM
function formatTime12Hour(time) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
        period = 'PM';
        if (hours12 > 12) {
            hours12 -= 12;
        }
    } else if (hours12 === 0) {
        hours12 = 12;
    }

    return `${hours12}:${minutes} ${period}`;
}
// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !hamburgerBtn || !closeBtn || !mainContent) return;
    
    // Load sidebar state
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    
    if (isSidebarCollapsed && !isMobile) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Hamburger button (mobile)
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    // Close button (mobile)
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Toggle collapse (desktop)
    if (toggleCollapse) {
        toggleCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            if (window.matchMedia('(min-width: 993px)').matches) {
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
        if (isMobileNow) {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('expanded');
        } else {
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 992px)').matches) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-theme', prefersDark);
        } else {
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
            applyTheme('system');
        }
    });
});

