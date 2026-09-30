// =====================================================
// PRIVATE CAR - LIABILITY ONLY
// =====================================================


// =====================================================
// HELPER
// =====================================================

function $(id) {
    return document.getElementById(id);
}


// =====================================================
// TOGGLE HELPER
// =====================================================

function setupToggle(toggleId, fieldsId) {

    const toggle = $(toggleId);
    const fields = fieldsId ? $(fieldsId) : null;

    if (!toggle) return;

    toggle.addEventListener('change', function () {

        if (fields) {

            fields.style.display =
                this.checked ? 'block' : 'none';

        }

    });

}


// =====================================================
// LIABILITY ONLY TOGGLES
// =====================================================

// Legal Liability to NFPP
setupToggle(
    'toggleNfpp',
    'nfppFields'
);


// Unnamed PA Cover
setupToggle(
    'toggleUnnamedPa',
    'unnamedPaFields'
);


// =====================================================
// UNNAMED PA SUM INSURED VALIDATION
// =====================================================

$('unnamedSi')
?.addEventListener('input', function () {

    const value =
        Number(this.value);

    const error =
        $('unnamedSiError');

    if (!error) return;

    if (
        value > 0 &&
        (
            value % 10000 !== 0 ||
            value > 200000
        )
    ) {

        error.style.display =
            'block';

    } else {

        error.style.display =
            'none';

    }

});


// =====================================================
// CALCULATE PREMIUM
// =====================================================

function calculatePrivateCarLiability() {

    alert(
        'Liability calculation logic will be added next.'
    );

}
