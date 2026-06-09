// =========================================================
// BUNDLED POLICY CALCULATOR (CLEAN VERSION)
// =========================================================


// =========================================================
// HELPERS
// =========================================================

const $ = (id) => document.getElementById(id);

const getValue = (id) =>
    parseFloat($(id)?.value) || 0;

const getInt = (id) =>
    parseInt($(id)?.value) || 0;

const isChecked = (id) =>
    $(id)?.checked || false;


// =========================================================
// ROUNDING
// =========================================================

function round2(value) {

    return Math.round(
        (value + Number.EPSILON) * 100
    ) / 100;
}


// =========================================================
// OD RATE
// =========================================================

function getOdRate(zone, cc) {

    const isA = zone === "A";

    let odRate = 0;

    if (cc <= 1000) {

        odRate = isA
            ? 0.03127
            : 0.03039;

    } else if (cc <= 1500) {

        odRate = isA
            ? 0.03283
            : 0.03191;

    } else {

        odRate = isA
            ? 0.03440
            : 0.03343;
    }

    // PRIVATE THREE WHEELER
    if (isChecked('chkThreeWheeler')) {
        odRate = odRate / 2;
    }

    return odRate;
}


// =========================================================
// VALIDATION
// =========================================================

function validate(condition, msg, focusId = null) {

    if (!condition) {

        alert(msg);

        if (focusId && $(focusId)) {
            $(focusId).focus();
        }

        return false;
    }

    return true;
}


// =========================================================
// TOGGLE HANDLER
// =========================================================

function setupToggle(toggleId, fieldId, resetFn) {

    const toggle = $(toggleId);
    const field = $(fieldId);

    if (!toggle || !field) return;

    function updateVisibility() {

        field.style.display =
            toggle.checked
                ? "block"
                : "none";
    }

    // Initial state
    updateVisibility();

    toggle.addEventListener("change", () => {

        updateVisibility();

        if (
            !toggle.checked &&
            typeof resetFn === "function"
        ) {
            resetFn();
        }
    });
}

// =====================================================
// ELECTRICAL DISCOUNT FUNCTION
// =====================================================

function toggleElecDiscountField() {

    const elecIdv = getValue('elecIdv');
    const elecDiscField = $('elecDisc');

    if (!elecDiscField) return;

    if (elecIdv > 0) {

        elecDiscField.disabled = false;
        elecDiscField.style.opacity = "1";

    } else {

        elecDiscField.disabled = true;
        elecDiscField.value = "";
        elecDiscField.style.opacity = "0.3";
    }
}

// =========================================================
// PAGE INIT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // TOGGLES
    // =====================================================

    setupToggle(
        'toggleAddIdv',
        'accessoriesFields',
        () => {

            $('nonElecIdv').value = "";
            $('elecIdv').value = "";
            $('elecDisc').value = "";

            $('elecDisc').disabled = true;
            $('elecDisc').style.opacity = "0.3";
        }
    );

    setupToggle(
        'toggleEngine',
        'engineFields',
        () => {
            $('engineType').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleLossOfKey',
        'lossOfKeyFields',
        () => {
            $('lossOfKeySI').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleTyreRim',
        'tyreRimFields',
        () => {
            $('tyreRimSI').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleEmi',
        'emiFields',
        () => {
            $('emiAmount').value = "";
        }
    );

    setupToggle(
        'togglePetCare',
        'petCareFields',
        () => {
            $('petCareSI').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleCourtesy',
        'courtesyFields',
        () => {
            $('courtesyDays').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleMedical',
        'medicalFields',
        () => {
            $('medicalSI').selectedIndex = 0;
        }
    );

    setupToggle(
        'togglePersonalBelongings',
        'PersonalBelongingsFields',
        () => {
            $('PersonalBelongingsSI').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleTowing',
        'towingFields',
        () => {
            $('towingAmount').value = "";
        }
    );

    setupToggle(
        'toggleCpa',
        'cpaFields',
        () => {
            $('cpaTenure').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleNfpp',
        'nfppFields',
        () => {
            $('nfppCount').value = "";
        }
    );

    setupToggle(
        'togglePlatinumPa',
        'platinumPaFields',
        () => {

            $('platSeating').value = "";
            $('platSi').selectedIndex = 0;
        }
    );

    setupToggle(
        'toggleUnnamedPa',
        'unnamedPaFields',
        () => {

            $('unnamedPersons').value = "";
            $('unnamedSi').value = "";

            const err = $('unnamedSiError');

            if (err) {
                err.style.display = "none";
            }
        }
    );

    
    toggleElecDiscountField();

    $('elecIdv')?.addEventListener(
        'input',
        toggleElecDiscountField
    );


    // =====================================================
    // LIMITERS
    // =====================================================

    $('odDisc')?.addEventListener(
        'input',
        function () {

            if (
                parseFloat(this.value) > 99.99
            ) {
                this.value = 99.99;
            }
        }
    );

    $('elecDisc')?.addEventListener(
        'input',
        function () {

            if (
                parseFloat(this.value) > 99.99
            ) {
                this.value = 99.99;
            }
        }
    );

    $('towingAmount')?.addEventListener(
        'input',
        function () {

            if (
                parseFloat(this.value) > 1500
            ) {
                this.value = 1500;
            }
        }
    );

    $('unnamedSi')?.addEventListener(
        'blur',
        function () {

            let val =
                parseFloat(this.value) || 0;

            if (val > 200000) {
                val = 200000;
            }

            if (val % 10000 !== 0) {

                val =
                    Math.round(val / 10000)
                    * 10000;

                const err =
                    $('unnamedSiError');

                if (err) {
                    err.style.display = "block";
                }

                setTimeout(() => {

                    if (err) {
                        err.style.display = "none";
                    }

                }, 3000);
            }

            this.value = val;
        }
    );

    $('elecDisc')?.addEventListener(
        'input',
        function () {

            sessionStorage.setItem(
                'elecDisc',
                this.value
            );

        }
    );

    window.addEventListener(
    "pageshow",
    function () {

        document
            .querySelectorAll(
                'input[type="checkbox"]'
            )
            .forEach(toggle => {

                toggle.dispatchEvent(
                    new Event("change")
                );
            });

    });

});

window.addEventListener(
    'pageshow',
    function () {

        setTimeout(() => {

            toggleElecDiscountField();

            const saved =
                sessionStorage.getItem(
                    'elecDisc'
                );

            if (
                saved !== null &&
                $('elecDisc')
            ) {

                $('elecDisc').value = saved;

                $('elecDisc').disabled = false;
                $('elecDisc').style.opacity = "1";
            }

        }, 100);

    }
);

// =====================================================
// PREVENT MOUSE WHEEL CHANGING NUMBER FIELDS
// =====================================================

    document
        .querySelectorAll('input[type="number"]')
        .forEach(input => {

            input.addEventListener(
                'wheel',
                function () {

                    this.blur();

                }
            );

        });


// =========================================================
// MAIN CALCULATION
// =========================================================

function calculateBundledPolicy() {

    // =====================================================
    // BASIC INPUTS
    // =====================================================
    
    const warnings = [];
    const baseIdv = getValue('idv');
    const zone = $('zone')?.value;
    const cc = getValue('cc');

    const odDiscount = getValue('odDisc');
    const elecDiscount = getValue('elecDisc');
    const ncb = getValue('ncb');

    if (
        !validate(
            baseIdv > 0,
            "Enter valid IDV",
            'idv'
        )
    ) return;


    // =====================================================
    // VARIABLES
    // =====================================================

    let addonPremium = 0;
    let liabilityPremium = 0;


    // =====================================================
    // OD RATE
    // =====================================================

    const odRate = getOdRate(zone, cc);


    // =====================================================
    // BASIC OD
    // =====================================================

    const vehicleOdPremium = round2(
        baseIdv * odRate
    );


    // =====================================================
    // NON ELECTRICAL ACCESSORIES
    // =====================================================

    let nonElecPremium = 0;

    if (isChecked('toggleAddIdv')) {

        const nonElecIdv =
            getValue('nonElecIdv');

        nonElecPremium = round2(
            nonElecIdv * odRate
        );
    }


    // =====================================================
    // ELECTRICAL ACCESSORIES
    // =====================================================

    let elecPremium = 0;
    let elecDiscountAmount = 0;
    let elecPremiumFinal = 0;

    if (isChecked('toggleAddIdv')) {

        const elecIdv =
            getValue('elecIdv');

        const elecDisc =
            getValue('elecDisc');

        if (elecIdv > 0) {

            elecPremium = round2(
                elecIdv * 0.04
            );

            elecDiscountAmount = round2(
                elecPremium * elecDisc / 100
            );

            elecPremiumFinal = round2(
                elecPremium - elecDiscountAmount
            );
        }
    }


    // =====================================================
    // OD DISCOUNT
    // =====================================================

    const odDiscountablePremium = round2(
        vehicleOdPremium +
        nonElecPremium
    );

    const odDiscountAmount = round2(
        odDiscountablePremium
        * odDiscount
        / 100
    );

    const odDiscountedPremium = round2(
        odDiscountablePremium
        - odDiscountAmount
    );


    // =====================================================
    // TOTAL OD
    // =====================================================

    let totalOdPremium = round2(
        odDiscountedPremium
        + elecPremiumFinal
    );


    // =====================================================
    // ANTI THEFT DISCOUNT
    // =====================================================

    let antiTheftDiscount = 0;

    if (isChecked('antiTheft')) {

        antiTheftDiscount = round2(
            totalOdPremium * 0.025
        );

        antiTheftDiscount = Math.min(
            antiTheftDiscount,
            500
        );

        totalOdPremium = round2(
            totalOdPremium
            - antiTheftDiscount
        );
    }


    // =====================================================
    // ADDON PREMIUM VARIABLES
    // =====================================================

    let enginePremium = 0;
    let lossOfKeyPremium = 0;
    let tyreRimPremium = 0;
    let emiPremium = 0;
    let courtesyPremium = 0;
    let medicalPremium = 0;
    let petCarePremium = 0;
    let PersonalBelongingsPremium = 0;
    let addonTowingPremium = 0;
    let nilDepPremium = 0;
    let returnToInvoicePremium = 0;
    let consumablesPremium = 0;
    let ncbProtectPremium = 0;
    let rsaPremium = 0;
    let geoExtPremium = 0;
    let cngPremium = 0;


    // =====================================================
    // ENGINE COVER
    // =====================================================

    if (isChecked('toggleEngine')) {

        const type =
            $('engineType')?.value;

        if (
            !validate(
                type,
                "Select Engine Cover type"
            )
        ) return;

        enginePremium =
            type === "platinum"
            ? round2(baseIdv * 0.0013)
            : round2(baseIdv * 0.0010);

        addonPremium += enginePremium;
    }


    // =====================================================
    // LOSS OF KEY
    // =====================================================

    if (isChecked('toggleLossOfKey')) {

        const si =
            getValue('lossOfKeySI');

        lossOfKeyPremium =
            si === 10000 ? 150 : 250;

        addonPremium += lossOfKeyPremium;
    }


    // =====================================================
    // TYRE & RIM
    // =====================================================

    if (isChecked('toggleTyreRim')) {

        const si =
            getValue('tyreRimSI');

        if (
            !validate(
                si > 0,
                "Select Tyre & Rim SI",
                'tyreRimSI'
            )
        ) return;

        switch (si) {

            case 25000:
                tyreRimPremium = 1000;
                break;

            case 50000:
                tyreRimPremium = 2000;
                break;

            case 100000:
                tyreRimPremium = 4000;
                break;

            case 200000:
                tyreRimPremium = 8000;
                break;
        }

        addonPremium += tyreRimPremium;
    }


    // =====================================================
    // EMI
    // =====================================================

    if (isChecked('toggleEmi')) {

        emiPremium = round2(
            getValue('emiAmount') * 0.066
        );

        addonPremium += emiPremium;
    }


    // =====================================================
    // COURTESY CAR
    // =====================================================

    if (isChecked('toggleCourtesy')) {

        const days =
            getInt('courtesyDays');

        if (
            !validate(
                days > 0,
                "Select Courtesy Car days",
                'courtesyDays'
            )
        ) return;

        switch (days) {

            case 3:
                courtesyPremium = 200;
                break;

            case 5:
                courtesyPremium = 300;
                break;

            case 7:
                courtesyPremium = 375;
                break;
        }

        addonPremium += courtesyPremium;
    }


    // =====================================================
    // MEDICAL
    // =====================================================

    if (isChecked('toggleMedical')) {

        const si =
            getValue('medicalSI');

        if (
            !validate(
                si > 0,
                "Select Medical Expenses SI",
                'medicalSI'
            )
        ) return;

        switch (si) {

            case 50000:
                medicalPremium = 200;
                break;

            case 100000:
                medicalPremium = 275;
                break;
        }

        addonPremium += medicalPremium;
    }


    // =====================================================
    // PET CARE
    // =====================================================

    if (isChecked('togglePetCare')) {

        const si =
            getValue('petCareSI');

        if (
            !validate(
                si > 0,
                "Select Pet Care SI",
                'petCareSI'
            )
        ) return;

        switch (si) {

            case 10000:
                petCarePremium = 100;
                break;

            case 25000:
                petCarePremium = 250;
                break;

            case 50000:
                petCarePremium = 500;
                break;
        }

        addonPremium += petCarePremium;
    }


    // =====================================================
    // PERSONAL BELONGINGS
    // =====================================================

    if (isChecked('togglePersonalBelongings')) {

        const si =
            getValue('PersonalBelongingsSI');

        if (
            !validate(
                si > 0,
                "Select Personal Belongings SI",
                'PersonalBelongingsSI'
            )
        ) return;

        switch (si) {

            case 25000:
                PersonalBelongingsPremium = 125;
                break;

            case 50000:
                PersonalBelongingsPremium = 250;
                break;
        }

        addonPremium +=
            PersonalBelongingsPremium;
    }


    // =====================================================
    // TOWING
    // =====================================================

    if (isChecked('toggleTowing')) {

        addonTowingPremium = round2(
            getValue('towingAmount')
            * 0.05
        );

        addonPremium +=
            addonTowingPremium;
    }


    // =====================================================
    // OPTIONAL COVERS
    // =====================================================

    if (isChecked('cngLpg')) {

        cngPremium = round2((odDiscountedPremium + elecPremiumFinal) * 0.05);
        addonPremium += cngPremium;
    }

    if (isChecked('geoExt')) {

        geoExtPremium = 400;
        addonPremium += geoExtPremium;
    }

    if (isChecked('rsa')) {

        rsaPremium = 50;
        addonPremium += rsaPremium;
    }


    // =====================================================
    // NIL DEP
    // =====================================================

    if (isChecked('nilDep')) {

        nilDepPremium = round2(
            (
                vehicleOdPremium
                + nonElecPremium
                + elecPremium
            ) * 0.10
        );

        addonPremium +=
            nilDepPremium;
    }


    // =====================================================
    // RETURN TO INVOICE
    // =====================================================

    if (
        isChecked('returnToInvoice')
    ) {

        const elec =
            getValue('elecIdv');

        const nonElec =
            getValue('nonElecIdv');

        const totalIdvBase =
            baseIdv
            + elec
            + nonElec;

        returnToInvoicePremium =
            round2(
                totalIdvBase * 0.0015
            );

        addonPremium +=
            returnToInvoicePremium;
    }


    // =====================================================
    // CONSUMABLES
    // =====================================================

    if (isChecked('consumables')) {

        consumablesPremium = round2(
            baseIdv * 0.0010
        );

        addonPremium += consumablesPremium;
    }


    // =====================================================
    // NCB PROTECT
    // =====================================================

    if (isChecked('ncbProtect') && ncb <= 0) {

        warnings.push(
            "• NCB Protect Cover can be selected only when NCB is above 0%."
        );
    

        ncbProtectPremium = round2(
            baseIdv * 0.00135
        );

        addonPremium += ncbProtectPremium;
    }


    // =====================================================
    // NCB DISCOUNT
    // =====================================================

    let ncbBase =
        totalOdPremium
        + addonTowingPremium
        + nilDepPremium
        + returnToInvoicePremium
        + geoExtPremium
        + cngPremium;

    ncbBase = Math.max(0, ncbBase);

    const ncbDiscount = round2(
        ncbBase * (ncb / 100)
    );

    const basicOD = round2(
        totalOdPremium - ncbDiscount
    );

    const grossOD = Math.round(
        basicOD + addonPremium
    );


    // =====================================================
    // LIABILITY
    // =====================================================

    let basicTpPremium = 0;

    if (cc <= 1000) {

        basicTpPremium = 6521;

    } else if (cc <= 1500) {

        basicTpPremium = 10640;

    } else {

        basicTpPremium = 24596;
    }

    liabilityPremium += basicTpPremium;


    // =====================================================
    // LIABILITY VARIABLES
    // =====================================================

    let cpaPremium = 0;
    let paidDriverPremium = 0;
    let nfppPremium = 0;
    let platinumPaPremium = 0;
    let unnamedPaPremium = 0;
    let cngLiabilityPremium = 0;
    let geoExtLiabilityPremium =0;


    // CPA
    if (isChecked('toggleCpa')) {

        cpaPremium =
            $('cpaTenure')?.value === "3"
            ? 705
            : 275;

        liabilityPremium += cpaPremium;
    }


    // PAID DRIVER
    if (isChecked('togglePaidDriver')) {

        paidDriverPremium = 150;

        liabilityPremium +=
            paidDriverPremium;
    }

    // =====================================================
    // PLATINUM PA VALIDATION
    // =====================================================

    if (
        isChecked('togglePlatinumPa') &&
        (
            isChecked('toggleUnnamedPa') ||
            isChecked('toggleNfpp')
        )
    ) {

        warnings.push(
            "• When Platinum PA Cover is selected, NFPP Cover and Unnamed PA Cover cannot be opted."
        );
    }

    if (warnings.length > 0) {

        alert(
            "Please correct the following:\n\n" +
            warnings.join("\n")
        );

        return;
    }


    // NFPP
    if (isChecked('toggleNfpp')) {

        nfppPremium =
            getInt('nfppCount') * 150;

        liabilityPremium +=
            nfppPremium;
    }

    // GeoExtension Liablity Loading 
    if (isChecked('geoExt')) {

        geoExtLiabilityPremium = 300;

        liabilityPremium += geoExtLiabilityPremium;
    }

    // CNG Liablity Loading
    if (isChecked('cngLpg')) {

        cngLiabilityPremium = 180;

        liabilityPremium += cngLiabilityPremium;
    }


    // PLATINUM PA
    if (
        isChecked('togglePlatinumPa')
    ) {

        const seats =
            getInt('platSeating');

        const si =
            getValue('platSi');

        if (
            !validate(
                seats > 0,
                "Enter seating capacity",
                'platSeating'
            )
        ) return;

        if (
            !validate(
                si > 0,
                "Select Platinum PA SI",
                'platSi'
            )
        ) return;

        let ratePerPerson = 0;

        switch (si) {

            case 500000:
                ratePerPerson = 224;
                break;

            case 1000000:
                ratePerPerson = 448;
                break;

            case 1500000:
                ratePerPerson = 672;
                break;
        }

        platinumPaPremium = round2(
            seats * ratePerPerson
        );

        liabilityPremium +=
            platinumPaPremium;
    }


    // UNNAMED PA
    if (
        isChecked('toggleUnnamedPa')
    ) {

        const persons =
            getInt('unnamedPersons');

        const si =
            getValue('unnamedSi');

        if (
            !validate(
                persons > 0,
                "Enter number of persons",
                'unnamedPersons'
            )
        ) return;

        if (
            !validate(
                si > 0,
                "Enter Unnamed PA SI",
                'unnamedSi'
            )
        ) return;

        unnamedPaPremium = round2(
            persons * (si * 0.0015)
        );

        liabilityPremium +=
            unnamedPaPremium;
    }

    const grossTP = Math.round(liabilityPremium);


    // =====================================================
    // NET PREMIUM
    // =====================================================

    const netPremium = round2(
        grossOD
        + grossTP
    );


    // =====================================================
    // GST
    // =====================================================

    const cgst = Math.round(
        netPremium * 0.09
    );

    const sgst = Math.round(
        netPremium * 0.09
    );

    const grossPremium = round2(
        netPremium
        + cgst
        + sgst
    );


    // =====================================================
    // OD BREAKDOWN
    // =====================================================

    const odItems = [

        {
            label: "Basic OD Premium",
            amount: vehicleOdPremium
        },

        {
            label: "Non-Electrical Accessories",
            amount: nonElecPremium
        },

        {
            label: "Electrical Accessories",
            amount: elecPremium
        },

        {
            label:
                "Geographical Extension - OD",
            amount:
                geoExtPremium
        },

        {
            label:
                "Built-in CNG / LPG OD Loading",
            amount:
                cngPremium
        },

        {
            label:
                "Nil Depreciation",
            amount: nilDepPremium
        },

        {
            label:
                "Return To Invoice",
            amount:
                returnToInvoicePremium
        },

        {
            label:
                "Consumables Cover",
            amount:
                consumablesPremium
        },

        {
            label:
                "Engine & Gearbox Protect",
            amount: enginePremium
        },

        {
            label:
                "Loss Of Key Cover",
            amount: lossOfKeyPremium
        },

        {
            label:
                "Tyre & Rim Protector",
            amount: tyreRimPremium
        },

        {
            label:
                "EMI Protect",
            amount: emiPremium
        },

        {
            label:
                "Pet Care Cover",
            amount: petCarePremium
        },

        {
            label:
                "Courtesy Car Cover",
            amount: courtesyPremium
        },

        {
            label:
                "NCB Protect Cover",
            amount:
                ncbProtectPremium
        },

        {
            label:
                "Road Side Assistance",
            amount:
                rsaPremium
        },

        {
            label:
                "Medical Expenses Cover",
            amount: medicalPremium
        },

        {
            label:
                "Personal Belongings",
            amount: PersonalBelongingsPremium
        },

        {
            label:
                "Additional Towing",
            amount: addonTowingPremium
        },
        
        {
            label:
                `OD Discount (${odDiscount}%)`,
            amount: -odDiscountAmount
        },

        {
            label: `Electrical Accessories Discount (${elecDiscount}%)`,
            amount: -elecDiscountAmount
        },

        {
            label:
                "Anti Theft Discount",
            amount: -antiTheftDiscount
        },

        {
            label:
                `NCB Discount (${ncb}%)`,
            amount: -ncbDiscount
        }       
        
    ];


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
                "Platinum PA Cover",
            amount:
                platinumPaPremium
        },

        {
            label:
                "Unnamed PA Cover",
            amount:
                unnamedPaPremium
        },

        {
            label:
                "Geographical Extension - TP",
            amount:
                geoExtLiabilityPremium
        },

        {
            label: "Built-in CNG / LPG TP Loading",
            amount: cngLiabilityPremium
        }   
    ];


    // =====================================================
    // SAVE
    // =====================================================

    localStorage.setItem(
        'premiumBreakdown',

        JSON.stringify({

            idv: baseIdv,
            zone,
            cc,
            odRate,

            odItems,
            liabilityItems,

            totalOd:
                grossOD,

            totalLiability:
                grossTP,

            netPremium,
            cgst,
            sgst,
            grossPremium
        })
    );


    // =====================================================
    // OPEN BREAKDOWN
    // =====================================================

    window.location.href =
        "premium-breakdown.html";
}