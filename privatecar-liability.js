// =====================================================
// PRIVATE CAR - LIABILITY ONLY
// =====================================================


// =====================================================
// HELPER FUNCTIONS
// =====================================================

function $(id) {
    return document.getElementById(id);
}

function getValue(id) {

    const el = $(id);

    if (!el) return 0;

    return Number(el.value) || 0;
}

function getInt(id) {

    return parseInt(
        getValue(id),
        10
    ) || 0;
}

function isChecked(id) {

    const el = $(id);

    return el
        ? el.checked
        : false;
}

function round2(value) {

    return Math.round(
        (Number(value) + Number.EPSILON) * 100
    ) / 100;
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

    // =====================================================
    // INITIAL VALUES
    // =====================================================

    const cc =
        getInt('cc');

    let liabilityPremium = 0;

    const warnings = [];


    // =====================================================
    // VALIDATION - CUBIC CAPACITY
    // =====================================================

    if (!cc) {

        warnings.push(
            "• Select Cubic Capacity."
        );

    }


    // =====================================================
    // BASIC TP PREMIUM
    // =====================================================

    let basicTpPremium = 0;

    if (cc <= 1000) {

        basicTpPremium = 2094;

    } else if (cc <= 1500) {

        basicTpPremium = 3416;

    } else {

        basicTpPremium = 7897;

    }

    liabilityPremium +=
        basicTpPremium;


    // =====================================================
    // CPA OWNER-DRIVER
    // =====================================================

    let cpaPremium = 0;

    if (
        isChecked('toggleCpa')
    ) {

        cpaPremium = 275;

        liabilityPremium +=
            cpaPremium;

    }


    // =====================================================
    // PAID DRIVER
    // =====================================================

    let paidDriverPremium = 0;

    if (
        isChecked('togglePaidDriver')
    ) {

        paidDriverPremium = 50;

        liabilityPremium +=
            paidDriverPremium;

    }


    // =====================================================
    // NFPP
    // =====================================================

    let nfppPremium = 0;

    if (
        isChecked('toggleNfpp')
    ) {

        const nfppCount =
            getInt('nfppCount');


        if (
            nfppCount <= 0
        ) {

            warnings.push(
                "• Enter the number of NFPP."
            );

        } else {

            nfppPremium =
                nfppCount * 50;

            liabilityPremium +=
                nfppPremium;

        }

    }


    // =====================================================
    // UNNAMED PA
    // =====================================================

    let unnamedPaPremium = 0;

    if (
        isChecked('toggleUnnamedPa')
    ) {

        const persons =
            getInt('unnamedPersons');

        const si =
            getValue('unnamedSi');


        if (
            persons <= 0
        ) {

            warnings.push(
                "• Enter the number of persons for Unnamed PA."
            );

        }


        if (
            si <= 0
        ) {

            warnings.push(
                "• Enter the Unnamed PA Sum Insured."
            );

        }


        if (
            si > 0 &&
            (
                si % 10000 !== 0 ||
                si > 200000
            )
        ) {

            warnings.push(
                "• Unnamed PA Sum Insured must be a multiple of ₹10,000 and cannot exceed ₹2,00,000."
            );

        }


        if (
            persons > 0 &&
            si > 0 &&
            si % 10000 === 0 &&
            si <= 200000
        ) {

            unnamedPaPremium =
                round2(
                    persons *
                    (si * 0.0005)
                );

            liabilityPremium +=
                unnamedPaPremium;

        }

    }


    // =====================================================
    // SHOW WARNINGS
    // =====================================================

    if (
        warnings.length > 0
    ) {

        showWarningModal(
            warnings
        );

        return;

    }


    // =====================================================
    // TOTAL LIABILITY PREMIUM
    // =====================================================

    const grossTP =
        Math.round(
            liabilityPremium
        );


    // =====================================================
    // NET PREMIUM
    // =====================================================

    const netPremium =
        round2(
            grossTP
        );


    // =====================================================
    // GST
    // =====================================================

    const cgst =
        Math.round(
            netPremium * 0.09
        );

    const sgst =
        Math.round(
            netPremium * 0.09
        );


    // =====================================================
    // GROSS PREMIUM
    // =====================================================

    const grossPremium =
        round2(
            netPremium +
            cgst +
            sgst
        );


    // =====================================================
    // LIABILITY BREAKDOWN
    // =====================================================

    const liabilityItems = [

        {
            label:
                "Basic TP Premium",

            amount:
                basicTpPremium
        },

        {
            label:
                "CPA Cover",

            amount:
                cpaPremium
        },

        {
            label:
                "LL Paid Driver",

            amount:
                paidDriverPremium
        },

        {
            label:
                "NFPP Cover",

            amount:
                nfppPremium
        },

        {
            label:
                "Unnamed PA Cover",

            amount:
                unnamedPaPremium
        }

    ];


    // =====================================================
    // SAVE
    // =====================================================

    localStorage.setItem(

        'premiumBreakdown',

        JSON.stringify({

            policyType:
                "liability",

            cc,

            odItems:
                [],

            liabilityItems,

            totalOd:
                0,

            totalLiability:
                grossTP,

            netPremium,

            cgst,

            sgst,

            grossPremium

        })

    );


    // =====================================================
    // OPEN PREMIUM BREAKDOWN
    // =====================================================

    window.location.href =
        "premium-breakdown.html";

}
