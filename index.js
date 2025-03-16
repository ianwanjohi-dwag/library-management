document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupLanguageSelector();
    updateTranslations();
    setupLoginForm(); // Initialize login functionality
    setupAccessibilityHub(); // Initialize Accessibility Hub
    setupDropdown(); // Initialize dropdown functionality
});

function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });
}


function setupDropdown() {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownMenu = document.querySelector(".dropdown-content");

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent immediate closing when clicking button
            dropdownMenu.classList.toggle("show");
            dropdownBtn.classList.toggle("open"); // Toggles arrow direction
        });

        document.addEventListener("click", (event) => {
            if (!dropdownMenu.contains(event.target) && !dropdownBtn.contains(event.target)) {
                dropdownMenu.classList.remove("show");
                dropdownBtn.classList.remove("open"); // Reset arrow direction
            }
        });
    }
}
