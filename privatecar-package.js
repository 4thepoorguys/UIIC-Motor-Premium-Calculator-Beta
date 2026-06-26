// =========================================================
// PRIVATE CAR PACKAGE POLICY CALCULATOR
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

const isUiicRenewal =
    document.getElementById(
        'chkUiicRenewal'
    ).checked;

// =====================================================
// WARNING MODAL
// =====================================================

function showWarningModal(warnings){

    const list =
        document.getElementById(
            "warningList"
        );

    list.innerHTML = "";

    warnings.forEach(msg=>{

        const div =
            document.createElement("div");

        div.className =
            "warning-item";

        div.innerHTML =
            msg;

        list.appendChild(div);

    });

    document
        .getElementById(
            "warningModal"
        )
        .style.display =
        "flex";
}

function closeWarningModal() {

    document
        .getElementById("warningModal")
        .style.display = "none";

    window.location.href =
        "premium-breakdown.html";
}

// =========================================================
// ROUNDING
// =========================================================

function round2(value) {

    return Math.round(
        (value + Number.EPSILON) * 100
    ) / 100;
}

// =====================================================
// DATE PICKERS
// =====================================================

const invoicePicker = flatpickr("#invoiceDate", {

    dateFormat: "d/m/Y",

    allowInput: true,

    clickOpens: true,
    
});

const renewalPicker = flatpickr("#renewalDate", {

    dateFormat: "d/m/Y",

    allowInput: true,

    clickOpens: true
});

// =====================================================
// AUTO FORMAT DD/MM/YYYY
// =====================================================

function formatDateInput(input, picker) {

    input.addEventListener('input', function () {

        let value =
            this.value.replace(/\D/g, '');

        if (value.length > 2) {

            value =
                value.slice(0, 2)
                + '/'
                + value.slice(2);
        }

        if (value.length > 5) {

            value =
                value.slice(0, 5)
                + '/'
                + value.slice(5, 9);
        }

        this.value = value;

        // Update Flatpickr when full date entered

        if (value.length === 10) {

            picker.setDate(
                value,
                false,
                "d/m/Y"
            );
        }
    });
}

formatDateInput(
    document.getElementById('invoiceDate'),
    invoicePicker
);

formatDateInput(
    document.getElementById('renewalDate'),
    renewalPicker
);


// =====================================================
// DATE PARSER
// =====================================================

function parseDate(dateStr) {

    if (!dateStr) return null;

    const parts =
        dateStr.split('/');

    if (parts.length !== 3) return null;

    return new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
    );
}

function validateRenewalDate() {

    const invoice =
        parseDate(
            document.getElementById(
                'invoiceDate'
            ).value
        );

    const renewal =
        parseDate(
            document.getElementById(
                'renewalDate'
            ).value
        );

    if (
        invoice &&
        renewal &&
        renewal < invoice
    ) {

        alert(
            "Renewal Date cannot be earlier than Invoice Date."
        );

        document.getElementById(
            'renewalDate'
        ).value = "";

        renewalPicker.clear();
    }
}

document.getElementById('renewalDate')
    .addEventListener(
        'change',
        validateRenewalDate
    );

document.getElementById('renewalDate')
    .addEventListener(
        'blur',
        validateRenewalDate
    );


// =====================================================
// VEHICLE AGE
// =====================================================

function getVehicleAgeYears() {
   
    const invoice =
        parseDate(
            document.getElementById(
                'invoiceDate'
            ).value
        );

    const renewal =
        parseDate(
            document.getElementById(
                'renewalDate'
            ).value
        );

    if (!invoice || !renewal) {

        return 0;
    }

    return (
        (renewal - invoice)
        /
        (1000 * 60 * 60 * 24 * 365.25)
    );
}

// =========================================================
// OD RATE (AGE BASED)
// =========================================================

function getOdRate(zone, cc, vehicleAge) {

    const isA = zone === "A";

    let odRate = 0;

    // =========================
    // UP TO 1000 CC
    // =========================
    if (cc <= 1000) {

        if (vehicleAge <= 5) {

            odRate = isA
                ? 0.03127
                : 0.03039;

        } else if (vehicleAge <= 10) {

            odRate = isA
                ? 0.03283
                : 0.03191;

        } else {

            odRate = isA
                ? 0.03362
                : 0.03267;
        }
    }

    // =========================
    // 1000 - 1500 CC
    // =========================
    else if (cc <= 1500) {

        if (vehicleAge <= 5) {

            odRate = isA
                ? 0.03283
                : 0.03191;

        } else if (vehicleAge <= 10) {

            odRate = isA
                ? 0.03447
                : 0.03351;

        } else {

            odRate = isA
                ? 0.03529
                : 0.03430;
        }
    }

    // =========================
    // ABOVE 1500 CC
    // =========================
    else {

        if (vehicleAge <= 5) {

            odRate = isA
                ? 0.03440
                : 0.03343;

        } else if (vehicleAge <= 10) {

            odRate = isA
                ? 0.03612
                : 0.03510;

        } else {

            odRate = isA
                ? 0.03698
                : 0.03594;
        }
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

function calculatePrivateCarPolicy() {

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

   // =====================================================
    // BASIC INPUT VALIDATION
    // =====================================================
    
    const validationErrors = [];
    
    if (!zone) {
    
        validationErrors.push(
            "• Select Zone"
        );
    }
    
    if (cc <= 0) {
    
        validationErrors.push(
            "• Select Cubic Capacity"
        );
    }
    
    if (baseIdv <= 0) {
    
        validationErrors.push(
            "• Enter valid IDV"
        );
    }
    
    if (!document.getElementById('invoiceDate').value) {
    
        validationErrors.push(
            "• Select Invoice Date"
        );
    }
    
    if (!document.getElementById('renewalDate').value) {
    
        validationErrors.push(
            "• Select Renewal Date"
        );
    }
    
    if (validationErrors.length > 0) {
    
        showWarningModal(validationErrors, "Please Fill the Following");
    
        return;
    }


    // =====================================================
    // VARIABLES
    // =====================================================

    let addonPremium = 0;
    let liabilityPremium = 0;


    // =====================================================
    // OD RATE
    // =====================================================

    const vehicleAge = getVehicleAgeYears();

    localStorage.setItem(
        'vehicleAge',
        vehicleAge.toFixed(3)
    );

    const odRate =
        getOdRate(
            zone,
            cc,
            vehicleAge
        );

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
    // ENGINE & GEARBOX PROTECTION COVER
    // =====================================================

    if (isChecked('toggleEngine')) {

        const type =
            $('engineType')?.value;

        if (!type) {

            warnings.push(
                "• Select Engine & GB Protection Cover type."
            );

        } else {

            let engineRate = 0;

            const vehicleAge =
                getVehicleAgeYears();

            if (type === "platinum") {

                if (vehicleAge <= 1.5)
                    engineRate = 0.0016;

                else if (vehicleAge <= 2.5)
                    engineRate = 0.0021;

                else if (vehicleAge <= 3.5)
                    engineRate = 0.0027;

                else if (vehicleAge <= 4.5)
                    engineRate = 0.0032;

                else {

                    warnings.push(
                        "• Engine & Gearbox Protection Cover is not applicable for vehicles aged above 4.5 years."
                    );

                    $('toggleEngine').checked = false;

                    $('toggleEngine')
                        .dispatchEvent(
                            new Event('change')
                        );
                }
            }

            else if (type === "standard") {

                if (vehicleAge <= 0.5)
                    engineRate = 0.0010;

                else if (vehicleAge <= 1.5)
                    engineRate = 0.0011;

                else if (vehicleAge <= 2.5)
                    engineRate = 0.0012;

                else if (vehicleAge <= 3.5)
                    engineRate = 0.0013;

                else if (vehicleAge <= 4.5)
                    engineRate = 0.0015;

                else {

                    warnings.push(
                        "• Engine & Gearbox Protection Cover is not applicable for vehicles aged above 4.5 years."
                    );

                    $('toggleEngine').checked = false;

                    $('toggleEngine')
                        .dispatchEvent(
                            new Event('change')
                        );
                }
            }

            if (engineRate > 0) {

                enginePremium =
                    round2(
                        baseIdv * engineRate
                    );

                addonPremium +=
                    enginePremium;
            }
        }
    }

       
    // =====================================================
    // LOSS OF KEY
    // =====================================================
    
    if (isChecked('toggleLossOfKey')) {
    
        const vehicleAge =
            getVehicleAgeYears();
    
        if (vehicleAge > 4.5) {
    
            warnings.push(
                "• Loss of Key Cover is not applicable for vehicles aged above 4.5 years."
            );
    
            $('toggleLossOfKey').checked = false;
    
            $('toggleLossOfKey')
                .dispatchEvent(
                    new Event('change')
                );
        }
    
        else {
    
            const si =
                getValue('lossOfKeySI');
    
            if (
                !validate(
                    si > 0,
                    "Select Loss of Key Sum Insured",
                    'lossOfKeySI'
                )
            ) return;
    
            lossOfKeyPremium =
                si === 10000
                    ? 150
                    : 250;
    
            addonPremium +=
                lossOfKeyPremium;
        }
    }
    
    // =====================================================
    // TYRE & RIM PROTECT COVER
    // =====================================================
    
    if (isChecked('toggleTyreRim')) {
    
        const vehicleAge =
            getVehicleAgeYears();
    
        if (vehicleAge > 4.5) {
    
            warnings.push(
                "• Tyre & Rim Protect Cover is not applicable for vehicles aged above 4.5 years."
            );
    
            $('toggleTyreRim').checked = false;
    
            $('toggleTyreRim')
                .dispatchEvent(
                    new Event('change')
                );
        }
    
        else {
    
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
    
            addonPremium +=
                tyreRimPremium;
        }
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

        const vehicleAge =
            getVehicleAgeYears();

        // UP TO 0.5 YEARS

        if (vehicleAge <= 0.5) {

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
        }

        // 0.5 TO 5 YEARS

        else if (vehicleAge <= 5) {

            switch (days) {

                case 3:
                    courtesyPremium = 250;
                    break;

                case 5:
                    courtesyPremium = 360;
                    break;

                case 7:
                    courtesyPremium = 450;
                    break;
            }
        }

        // ABOVE 5 YEARS

        else {

            switch (days) {

                case 3:
                    courtesyPremium = 350;
                    break;

                case 5:
                    courtesyPremium = 500;
                    break;

                case 7:
                    courtesyPremium = 600;
                    break;
            }
        }

        addonPremium +=
            courtesyPremium;
    }  

    // =====================================================
    // MEDICAL EXPENSES COVER
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

        const vehicleAge =
            getVehicleAgeYears();

        // UP TO 0.5 YEARS

        if (vehicleAge <= 0.5) {

            switch (si) {

                case 50000:
                    medicalPremium = 200;
                    break;

                case 100000:
                    medicalPremium = 275;
                    break;
            }
        }

        // 0.5 TO 5 YEARS

        else if (vehicleAge <= 5) {

            switch (si) {

                case 50000:
                    medicalPremium = 250;
                    break;

                case 100000:
                    medicalPremium = 325;
                    break;
            }
        }

        // ABOVE 5 YEARS

        else {

            switch (si) {

                case 50000:
                    medicalPremium = 325;
                    break;

                case 100000:
                    medicalPremium = 450;
                    break;
            }
        }

        addonPremium +=
            medicalPremium;
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

        let nilDepRate = 0;

        if (vehicleAge <= 0.5) {

            nilDepRate = 0.10;

        } else if (vehicleAge <= 1.5) {

            nilDepRate = 0.20;

        } else if (vehicleAge <= 4.5) {

            nilDepRate = 0.30;

        } else if (vehicleAge <= 4.6) {

            nilDepRate = 0.40;

        } else if (vehicleAge <= 6.5) {

            const ncb =
                Number(
                    document.getElementById(
                        'ncb'
                    ).value
                );

            const isUiicRenewal =
                document.getElementById(
                    'chkUiicRenewal'
                ).checked;

            let eligible = false;

            // UIIC Renewal
            if (
                isUiicRenewal &&
                ncb >= 25
            ) {

                eligible = true;
            }

            // Rollover
            if (
                !isUiicRenewal &&
                ncb >= 35
            ) {

                eligible = true;
            }

            if (eligible) {

                nilDepRate = 0.40;

            } else {

                warnings.push(
                    "• Nil Dep is not permissible for vehicles aged above 4.6 years unless:\n" +
                    "   • UIIC Renewal - Minimum 25% NCB\n" +
                    "   • Rollover - Minimum 35% NCB"
                );

                document.getElementById(
                    'nilDep'
                ).checked = false;

                nilDepRate = 0;
            }
        }

        nilDepPremium = round2(

            (
                vehicleOdPremium
                + nonElecPremium
                + elecPremium
            )

            * nilDepRate
        );

        addonPremium +=
            nilDepPremium;
    }    

    // =====================================================
    // RETURN TO INVOICE
    // =====================================================

    if (isChecked('returnToInvoice')) {

        const elec =
            getValue('elecIdv');

        const nonElec =
            getValue('nonElecIdv');

        const totalIdvBase =
            baseIdv +
            elec +
            nonElec;

        const vehicleAge =
            getVehicleAgeYears();

        let rtiRate = 0;

        // 0 - 0.5 Years
        if (vehicleAge <= 0.5) {

            rtiRate = 0.0015; // 0.15%
        }

        // 0.5 - 1.5 Years
        else if (vehicleAge <= 1.5) {

            rtiRate = 0.0020; // 0.20%
        }

        // 1.5 - 2.5 Years
        else if (vehicleAge <= 2.5) {

            rtiRate = 0.0025; // 0.25%
        }

        // Above 2.5 Years
        else {

            warnings.push(
                "• Return to Invoice Cover is not applicable for vehicles aged above 2.5 years."
            );

            document.getElementById(
                'returnToInvoice'
            ).checked = false;
        }

        if (rtiRate > 0) {

            returnToInvoicePremium =
                round2(
                    totalIdvBase * rtiRate
                );

            addonPremium +=
                returnToInvoicePremium;
        }
    }

    // =====================================================
    // CONSUMABLES
    // =====================================================

    if (isChecked('consumables')) {

        const vehicleAge =
            getVehicleAgeYears();

        let consumablesRate = 0;

        if (vehicleAge <= 0.5)
            consumablesRate = 0.0010;

        else if (vehicleAge <= 1.5)
            consumablesRate = 0.0012;

        else if (vehicleAge <= 2.5)
            consumablesRate = 0.0015;

        else if (vehicleAge <= 3.5)
            consumablesRate = 0.0017;

        else if (vehicleAge <= 4.5)
            consumablesRate = 0.0020;

        else {

            warnings.push(
                "• Consumables Cover is not applicable for vehicles aged above 4.5 years."
            );

            $('consumables').checked = false;
        }

        if (consumablesRate > 0) {

            consumablesPremium =
                round2(
                    baseIdv * consumablesRate
                );

            addonPremium +=
                consumablesPremium;
        }
    }


    // =====================================================
    // NCB PROTECT
    // =====================================================

    if (isChecked('ncbProtect')) {

        if (ncb <= 0) {

            warnings.push(
                "• NCB Protect Cover can be selected only when NCB is above 0%."
            );

            $('ncbProtect').checked = false;
        }

        else {

            ncbProtectPremium = round2(
                baseIdv * 0.00135
            );

            addonPremium +=
                ncbProtectPremium;
        }
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

        basicTpPremium = 2094;

    } else if (cc <= 1500) {

        basicTpPremium = 3416;

    } else {

        basicTpPremium = 7897;
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
             275;

        liabilityPremium += cpaPremium;
    }


    // PAID DRIVER
    if (isChecked('togglePaidDriver')) {

        paidDriverPremium = 50;

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

    // NFPP
    if (isChecked('toggleNfpp')) {

        nfppPremium =
            getInt('nfppCount') * 50;

        liabilityPremium +=
            nfppPremium;
    }

    // GeoExtension Liablity Loading 
    if (isChecked('geoExt')) {

        geoExtLiabilityPremium = 100;

        liabilityPremium += geoExtLiabilityPremium;
    }

    // CNG Liablity Loading
    if (isChecked('cngLpg')) {

        cngLiabilityPremium = 60;

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
                ratePerPerson = 90;
                break;

            case 1000000:
                ratePerPerson = 180;
                break;

            case 1500000:
                ratePerPerson = 270;
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
            persons * (si * 0.0005)
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
    
    if (warnings.length > 0) {
    
        showWarningModal(warnings);
    
    } else {
    
        window.location.href =
            "premium-breakdown.html";
    }    
}
