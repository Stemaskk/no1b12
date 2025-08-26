// Collect form data into object
function collectForm(formEl) {
    const data = {};
    const formData = new FormData(formEl);

    for (const [name, value] of formData.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else {
            data[name] = value;
        }
    }
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!formData.has(cb.name)) data[cb.name] = [];
    });

    return data;
}

// Show summary for Building 1
function summaryB1(answers) {
    const amenities = (answers["b1-amenities"] || []).join(", ") || "None selected";
    return [
        `History year: ${answers["b1-year"] || "—"}`,
        `Primary function: ${answers["b1-function"] || "—"}`,
        `Amenities: ${amenities}`
    ].join("\n");
}

// Show summary for Building 2
function summaryB2(answers) {
    const instruments = (answers["b2-instruments"] || []).join(", ") || "None selected";
    return [
        `Renovation year: ${answers["b2-reno"] || "—"}`,
        `Facility: ${answers["b2-facility"] || "—"}`,
        `Instruments (Floor 3): ${instruments}`
    ].join("\n");
}

// Building 1 form
document.getElementById("form-b1").addEventListener("submit", (e) => {
    e.preventDefault();
    const answers = collectForm(e.target);
    document.getElementById("out-b1").textContent = "Your responses:\n" + summaryB1(answers);
});

// Building 2 form
document.getElementById("form-b2").addEventListener("submit", (e) => {
    e.preventDefault();
    const answers = collectForm(e.target);
    document.getElementById("out-b2").textContent = "Your responses:\n" + summaryB2(answers);
});

// Reset buttons
document.querySelectorAll("[data-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
        const form = document.getElementById(btn.dataset.reset);
        form.reset();
        form.parentElement.querySelector(".output").textContent = "";
    });
});
