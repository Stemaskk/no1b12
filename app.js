// Utility: read values from form elements in a friendly structure
function collectForm(formEl) {
    const data = {};
    const formData = new FormData(formEl);

    // Include checkboxes with the same name as arrays
    for (const [name, value] of formData.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else {
            data[name] = value;
        }
    }
    // Also include unchecked checkboxes as empty arrays
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!formData.has(cb.name)) data[cb.name] = [];
    });

    return data;
}

// Simple validator for year inputs (optional but nice)
function validateYear(inputEl) {
    const re = /^(1|2)\d{3}$/;
    if (!re.test(inputEl.value.trim())) {
        inputEl.setCustomValidity("Please enter a valid 4-digit year.");
    } else {
        inputEl.setCustomValidity("");
    }
    return inputEl.reportValidity();
}

// Render a friendly summary string
function summaryForBuilding(buildingId, answers) {
    if (buildingId === 'b1') {
        const amenities = (answers["b1-amenities"] || []).join(", ") || "None selected";
        return [
            `History year: ${answers["b1-year"] || "—"}`,
            `Primary function: ${answers["b1-function"] || "—"}`,
            `Amenities: ${amenities}`
        ].join("\n");
    }
    if (buildingId === 'b2') {
        return [
            `Renovation year: ${answers["b2-reno"] || "—"}`,
            `Preferred entrance: ${answers["b2-entrance"] || "—"}`,
            `Accessibility rating: ${answers["b2-access"] || "—"}`
        ].join("\n");
    }
    return "";
}

// Persist to localStorage (per browser)
function saveAnswers(key, obj) {
    const existing = JSON.parse(localStorage.getItem("buildingAnswers") || "{}");
    existing[key] = obj;
    localStorage.setItem("buildingAnswers", JSON.stringify(existing));
}

function getAllAnswers() {
    return JSON.parse(localStorage.getItem("buildingAnswers") || "{}");
}

// Hook up Building 1
const formB1 = document.getElementById("form-b1");
const outB1  = document.getElementById("out-b1");
formB1.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate year
    const yearInput = document.getElementById("b1-year");
    if (!validateYear(yearInput)) return;

    const answers = collectForm(formB1);
    saveAnswers("Building 1", answers);

    outB1.textContent = "Your responses:\n" + summaryForBuilding("b1", answers);
    outB1.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Hook up Building 2
const formB2 = document.getElementById("form-b2");
const outB2  = document.getElementById("out-b2");
formB2.addEventListener("submit", (e) => {
    e.preventDefault();

    const renoInput = document.getElementById("b2-reno");
    if (!validateYear(renoInput)) return;

    const answers = collectForm(formB2);
    saveAnswers("Building 2", answers);

    outB2.textContent = "Your responses:\n" + summaryForBuilding("b2", answers);
    outB2.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Reset buttons
document.querySelectorAll("[data-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-reset");
        const form = document.getElementById(id);
        if (form) {
            form.reset();
            const output = form.parentElement.querySelector(".output");
            if (output) output.textContent = "";
        }
    });
});

// CSV download (combines both buildings if available)
document.getElementById("downloadCsv").addEventListener("click", () => {
    const all = getAllAnswers();
    // Prepare a flat CSV with predictable columns
    const headers = [
        "Building",
        "HistoryYear/ConstructionOrReno",
        "Function(OnlyB1)",
        "Amenities(OnlyB1)",
        "PreferredEntrance(OnlyB2)",
        "Accessibility(OnlyB2)"
    ];

    const rows = [];
    // Building 1
    if (all["Building 1"]) {
        const a = all["Building 1"];
        rows.push([
            "Building 1",
            a["b1-year"] || "",
            a["b1-function"] || "",
            (a["b1-amenities"] || []).join("; "),
            "",
            ""
        ]);
    }
    // Building 2
    if (all["Building 2"]) {
        const a = all["Building 2"];
        rows.push([
            "Building 2",
            a["b2-reno"] || "",
            "",
            "",
            a["b2-entrance"] || "",
            a["b2-access"] || ""
        ]);
    }

    if (!rows.length) {
        alert("No responses yet. Please submit at least one form.");
        return;
    }

    const csv = [headers.join(",")]
        .concat(rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "building_responses.csv";
    a.click();
    URL.revokeObjectURL(url);
});