const data = JSON.parse(
    localStorage.getItem('premiumBreakdown')
);

// =====================================================
// NO DATA SAFETY
// =====================================================

if (!data) {

    document.body.innerHTML = `
        <div style="
            color:white;
            text-align:center;
            margin-top:80px;
            font-size:22px;
        ">
            No Premium Data Found
        </div>
    `;

    throw new Error("No premiumBreakdown data found");
}


// =====================================================
// VEHICLE DETAILS
// =====================================================

function getCcLabel(cc) {

    cc = Number(cc);

    if (cc <= 1000) return "Up to 1000 CC";

    if (cc <= 1500) return "1000 - 1500 CC";

    return "Above 1500 CC";
}

function money(value) {

    return Number(value)
        .toLocaleString(
            'en-IN',
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        );
}

document.getElementById('bdIdv').innerText =
    money(data.idv || 0);

document.getElementById('bdCc').innerText =
    getCcLabel(data.cc);

document.getElementById('bdZone').innerText =
    data.zone || "-";

document.getElementById('bdOdRate').innerText =
    `${((data.odRate || 0) * 100).toFixed(3)}%`;


// =====================================================
// OD SECTION
// =====================================================

const odContainer =
    document.getElementById('odBreakdown');

if (odContainer && Array.isArray(data.odItems)) {

    data.odItems.forEach(item => {

        if ((item.amount || 0) !== 0) {

            odContainer.innerHTML += `
                <div class="breakdown-row">
                    <span>${item.label}</span>
                    <strong>
                        ₹${Number(item.amount).toFixed(2)}
                    </strong>
                </div>
            `;
        }
    });
}


// =====================================================
// LIABILITY SECTION
// =====================================================

const liabilityContainer =
    document.getElementById('liabilityBreakdown');

if (
    liabilityContainer &&
    Array.isArray(data.liabilityItems)
) {

    data.liabilityItems.forEach(item => {

        if ((item.amount || 0) !== 0) {

            liabilityContainer.innerHTML += `
                <div class="breakdown-row">
                    <span>${item.label}</span>
                    <strong>
                        ₹${Number(item.amount).toFixed(2)}
                    </strong>
                </div>
            `;
        }
    });
}


// =====================================================
// TOTALS
// =====================================================

document.getElementById('totalOd').innerText =
    Number(data.totalOd || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById('totalLiability').innerText =
    Number(data.totalLiability || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById('netPremium').innerText =
    Number(data.netPremium || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById('cgstAmount').innerText =
    Number(data.cgst || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById('sgstAmount').innerText =
    Number(data.sgst || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

document.getElementById('grossPremium').innerText =
    `₹${Number(data.grossPremium || 0)
        .toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

// =====================================================
///PDF GENERATION AND SHARING
// =====================================================

async function generateQuotePdf() {

    const data = JSON.parse(
        localStorage.getItem('premiumBreakdown')
    );

    if (!data) {

        alert('Premium data not found');
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF(
        'p',
        'mm',
        'a4'
    );

    const today =
        new Date().toLocaleDateString('en-IN');

    function money(value) {

        return Number(value || 0)
            .toLocaleString(
                'en-IN',
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            );
    }

    function getCcBand(cc) {

        cc = Number(cc);

        if (cc <= 1000)
            return "Up to 1000 CC";

        if (cc <= 1500)
            return "1001 CC - 1500 CC";

        return "Above 1500 CC";
    }

    const odRateText =
        `${((data.odRate || 0) * 100).toFixed(3)}%`;

    // =====================================================
    // HEADER
    // =====================================================

    doc.setFontSize(16);
    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.text(
        'PRIVATE CAR BUNDLED POLICY QUOTATION',
        105,
        15,
        { align: 'center' }
    );

    doc.setFontSize(9);
    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.text(
        '*** This is only a quotation for reference purpose ***',
        105,
        21,
        { align: 'center' }
    );

    doc.text(
        `Generated On : ${today}`,
        105,
        27,
        { align: 'center' }
    );

    // =====================================================
    // VEHICLE DETAILS
    // =====================================================

    doc.autoTable({

        startY: 32,

        theme: 'grid',

        head: [
            [
                {
                    content: 'VEHICLE BASIC DETAILS',
                    colSpan: 2,
                    styles: {
                        halign: 'center'
                    }
                }
            ]
        ],

        body: [

            ['IDV', money(data.idv)],
            ['Zone', data.zone],
            ['Engine Capacity', getCcBand(data.cc)],
            ['OD Rate', odRateText]
            

        ],

        styles: {
            fontSize: 9,
            fontStyle: 'bold',
            textColor: [15,15,15],
            lineWidth: 0.2,
            lineColor: [100,100,100]
        },

        headStyles: {

            fillColor: [0, 70, 140],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },

        columnStyles: {

            0: {
                cellWidth: 148,
                halign: 'left',
                fontStyle: 'bold'
            },

            1: {
                cellWidth: 35,
                halign: 'right'
            }
        }
    });

    // =====================================================
    // OD ROWS
    // =====================================================

    const odRows = [];

    data.odItems.forEach(item => {

        if (Number(item.amount || 0) !== 0) {

            odRows.push([
                item.label,
                Number(item.amount).toFixed(2)
            ]);
        }
    });

    // =====================================================
    // TP ROWS
    // =====================================================

    const tpRows = [];

    data.liabilityItems.forEach(item => {

        if (Number(item.amount || 0) !== 0) {

            tpRows.push([
                item.label,
                Number(item.amount).toFixed(2)
            ]);
        }
    });

    const tableStartY =
        doc.lastAutoTable.finalY + 6;

    // =====================================================
    // OD TABLE
    // =====================================================

    const odTable = doc.autoTable({

        startY: tableStartY,

        margin: {
            left: 14
        },

        tableWidth: 92,

        theme: 'grid',

        head: [
            [
                {
                    content: 'OWN DAMAGE PREMIUM (A)',
                    colSpan: 2,
                    styles: {
                        halign: 'center'
                    }
                }
            ]
        ],

        body: odRows,

        styles: {
            fontSize: 8.5,
            fontStyle: 'bold',
            textColor: [15,15,15],
            lineWidth: 0.2,
            lineColor: [100,100,100]
        },
        
        headStyles: {

            fillColor: [0, 70, 140],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },

        columnStyles: {

            0: {
                cellWidth: 60
            },

            1: {
                cellWidth: 31,
                halign: 'right'
            }
        }
    });

    const odFinalY = doc.lastAutoTable.finalY;

            
    // =====================================================
    // TP TABLE
    // =====================================================

    const tpTable = doc.autoTable({

        startY: tableStartY,

        margin: {
            left: 106
        },

        tableWidth: 91,

        theme: 'grid',

        head: [
            [
                {
                    content: 'LIABILITY PREMIUM (B)',
                    colSpan: 2,
                    styles: {
                        halign: 'center'
                    }
                }
            ]
        ],

        body: tpRows,

        styles: {
            fontSize: 8.5,
            fontStyle: 'bold',
            textColor: [15,15,15],
            lineWidth: 0.2,
            lineColor: [100,100,100]
        },        

        headStyles: {

            fillColor: [0, 70, 140],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },

        columnStyles: {

            0: {
                cellWidth: 56
            },

            1: {
                cellWidth: 35,
                halign: 'right'
            }
        }
    });

    const tpFinalY = doc.lastAutoTable.finalY;

    const netPremiumY =
    Math.max(
        odFinalY,
        tpFinalY
    ) + 2;

    doc.autoTable({startY: netPremiumY,

            margin: { left: 14 },

            tableWidth: 183,

            theme: 'grid',

            body: [[
                'NET OD PREMIUM (A)',
                'NET TP PREMIUM (B)'
            ]],

            styles: {
                fontSize: 10,
                fontStyle: 'bold',
                textColor: [15,15,15],
                lineWidth: 0.2,
                lineColor: [100,100,100]
            },

            didDrawCell: function(dataCell) {

                if (dataCell.row.index === 0) {

                    const y =
                        dataCell.cell.y +
                        dataCell.cell.height / 2 + 1;

                    if (dataCell.column.index === 0) {

                        doc.text(
                            Number(data.totalOd).toFixed(2),
                            dataCell.cell.x +
                            dataCell.cell.width - 3,
                            y,
                            { align: 'right' }
                        );
                    }

                    if (dataCell.column.index === 1) {

                        doc.text(
                            Number(data.totalLiability).toFixed(2),
                            dataCell.cell.x +
                            dataCell.cell.width - 3,
                            y,
                            { align: 'right' }
                        );
                    }
                }
            }
        });

    
    // =====================================================
    // SUMMARY
    // =====================================================

    const summaryY =
    doc.lastAutoTable.finalY + 5;

    doc.autoTable({

        startY: summaryY,

        theme: 'grid',

        head: [
            [
                {
                    content: 'PREMIUM SUMMARY',
                    colSpan: 2,
                    styles: {
                        halign: 'center'
                    }
                }
            ]
        ],

        body: [

            [
                'Net Premium (A+B)',
                `${Number(data.netPremium).toFixed(2)}`
            ],

            [
                'CGST @ 9%',
                `${Number(data.cgst).toFixed(2)}`
            ],

            [
                'SGST @ 9%',
                `${Number(data.sgst).toFixed(2)}`
            ],

            [
                'Gross Premium',
                `${Number(data.grossPremium).toFixed(2)}`
            ]
        ],

        styles: {
            fontSize: 11,
            fontStyle: 'bold',
            textColor: [15,15,15],
            lineWidth: 0.2,
            lineColor: [100,100,100]
        },

        headStyles: {

            fillColor: [0, 70, 140],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },

        columnStyles: {

            0: {
                cellWidth: 148
            },

            1: {
                cellWidth: 35,
                halign: 'right'
            }
        },

        bodyStyles: {
            fontStyle: 'bold'
        },

        didParseCell: function(cellData) {

            if (
                cellData.row.section === 'body' &&
                cellData.row.index === 3
            ) {

                cellData.cell.styles.fillColor =
                    [0, 70, 140];

                cellData.cell.styles.textColor =
                    255;

                cellData.cell.styles.fontStyle =
                    'bold';
            }
        }
    });

    // =====================================================
    // DISCLAIMER
    // =====================================================

    const footerY =
        doc.lastAutoTable.finalY + 8;

    doc.setFont(
        'helvetica',
        'normal'
    );

    doc.setFontSize(8);

    doc.text(
        'Premium shown above is indicative and subject to underwriting acceptance.',
        14,
        footerY
    );

    doc.text(
        'Applicable policy terms and conditions will apply.',
        14,
        footerY + 4
    );

    // =====================================================
    // OPEN PDF IN NEW TAB
    // =====================================================

    const blob =
        doc.output('blob');

    const url =
        URL.createObjectURL(blob);

    window.open(
        url,
        '_blank'
    );
}

function goBack() {

    window.history.back();

}
