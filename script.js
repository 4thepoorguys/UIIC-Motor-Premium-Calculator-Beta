// =========================================================
// MOTOR SELECTION SCRIPT (CLEAN VERSION)
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const getStoredCategory = () => localStorage.getItem('selectedCategory');


// =========================================================
// NAVIGATION: CATEGORY SELECTION
// =========================================================

function goToVehicleSelection(category) {

    if (!category) return;

    localStorage.setItem('selectedCategory', category);

    window.location.href = 'motor-selection.html';
}


// =========================================================
// VEHICLE SELECTION HANDLER
// =========================================================

function selectVehicle(type) {

    const category = getStoredCategory();

    if (type === "Private Car") {

        window.location.href = "privatecar-menu.html";

        return;
    }

    alert(`${category || "Vehicle"} ${type} calculator coming soon`);
}


// =========================================================
// DYNAMIC UI UPDATE
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    const badge = document.getElementById('dynamic-badge');

    const category = getStoredCategory();

    if (badge && category) {

        badge.innerText = `${category.toUpperCase()} VEHICLES SELECTION`;
    }
});