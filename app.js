// ------- helpers -------
function collectForm(formEl) {
    const data = {};
    const fd = new FormData(formEl);

    for (const [name, value] of fd.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else {
            data[name] = value;
        }
    }
    // include unchecked checkbox groups as empty arrays
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });

    return data;
}

function sameSet(a = [], b = []) {
    const A = [...a].sort();
    const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}
function spanOk(text)  { return `<span class="ok">${text}</span>`; }
function spanBad(text) { return `<span class="bad">${text}</span>`; }

// ------- answer key -------
const correct = {
    // Building 1
    "b1-year": "1998",
    "b1-fossil": "columbian mammoth skull",     // case-insensitive check
    "b1-company": "Tesla",

    // Building 2
    "b2-reno": "2016",
    "b2-facility": "Art Studios",
    "b2-instruments": ["Piano", "Drum Set"]
};

// ------- checkers -------
function checkB1(ans) {
    const out = [];

    // Q1
    const y = (ans["b1-year"] || "").trim();
    out.push(
        `Q1: Year = ${y || "—"} → ` +
        (y === correct["b1-year"] ? spanOk("Correct") : spanBad(`Wrong (Correct: ${correct["b1-year"]})`))
    );

    // Q2
    const fossilTyped = (ans["b1-fossil"] || "").trim().toLowerCase();
    const fossilOK = fossilTyped === correct["b1-fossil"];
    out.push(
        `Q2: Fossil = "${ans["b1-fossil"] || "—"}" → ` +
        (fossilOK ? spanOk("Correct") : spanBad(`Wrong (Correct: Columbian Mammoth Skull)`))
    );

    // Q3
    const comp = ans["b1-company"] || "";
    out.push(
        `Q3: Company = ${comp || "—"} → ` +
        (comp === correct["b1-company"] ? spanOk("Correct") : spanBad(`Wrong (Correct: ${correct["b1-company"]})`))
    );

    return out.join("\n");
}

function checkB2(ans) {
    const out = [];

    // Q1
    const y = (ans["b2-reno"] || "").trim();
    out.push(
        `Q1: Year = ${y || "—"} → ` +
        (y === correct["b2-reno"] ? spanOk("Correct") : spanBad(`Wrong (Correct: ${correct["b2-reno"]})`))
    );

    // Q2
    const fac = ans["b2-facility"] || "";
    out.push(
        `Q2: Facility = ${fac || "—"} → ` +
        (fac === correct["b2-facility"] ? spanOk("Correct") : spanBad(`Wrong (Correct: ${correct["b2-facility"]})`))
    );

    // Q3
    const inst = ans["b2-instruments"] || [];
    const instOK = sameSet(inst, correct["b2-instruments"]);
    out.push(
        `Q3: Instruments = [${inst.join(", ") || "—"}] → ` +
        (instOK ? spanOk("Correct") : spanBad(`Wrong (Correct: ${correct["b2-instruments"].join(", ")})`))
    );

    return out.join("\n");
}

// ------- wire up forms -------
document.getElementById("form-b1").addEventListener("submit", (e) => {
    e.preventDefault();
    const ans = collectForm(e.target);
    document.getElementById("out-b1").innerHTML = checkB1(ans);
});

document.getElementById("form-b2").addEventListener("submit", (e) => {
    e.preventDefault();
    const ans = collectForm(e.target);
    document.getElementById("out-b2").innerHTML = checkB2(ans);
});

document.querySelectorAll("[data-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-reset");
        const form = document.getElementById(id);
        if (form) {
            form.reset();
            const out = form.parentElement.querySelector(".output");
            if (out) out.innerHTML = "";
        }
    });
});
