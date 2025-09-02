// ---------- helpers ----------
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

// ---------- answer key (placeholders you can change) ----------
const correct = {
    // Building 1
    "b1-year": "1998",
    "b1-fossil": "columbian mammoth skull", // case-insensitive compare
    "b1-company": "Tesla",

    // Building 2
    "b2-reno": "2016",
    "b2-facility": "Art Studios",
    "b2-instruments": ["Piano", "Drum Set"]
};

// ---------- check all (no spoilers) ----------
function checkAllAnswers(ans) {
    const lines = [];
    let allCorrect = true;

    // B1 Q1
    const b1y = (ans["b1-year"] || "").trim();
    const b1yOK = b1y === correct["b1-year"];
    lines.push(`B1 Q1 (Year): ${b1y || "—"} → ${b1yOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && b1yOK;

    // B1 Q2
    const fossil = (ans["b1-fossil"] || "").trim().toLowerCase();
    const fossilOK = fossil === correct["b1-fossil"];
    lines.push(`B1 Q2 (Fossil): "${ans["b1-fossil"] || "—"}" → ${fossilOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && fossilOK;

    // B1 Q3
    const comp = ans["b1-company"] || "";
    const compOK = comp === correct["b1-company"];
    lines.push(`B1 Q3 (Company): ${comp || "—"} → ${compOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && compOK;

    // B2 Q4
    const b2y = (ans["b2-reno"] || "").trim();
    const b2yOK = b2y === correct["b2-reno"];
    lines.push(`B2 Q4 (Year): ${b2y || "—"} → ${b2yOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && b2yOK;

    // B2 Q5
    const fac = ans["b2-facility"] || "";
    const facOK = fac === correct["b2-facility"];
    lines.push(`B2 Q5 (Facility): ${fac || "—"} → ${facOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && facOK;

    // B2 Q6
    const inst = ans["b2-instruments"] || [];
    const instOK = sameSet(inst, correct["b2-instruments"]);
    lines.push(`B2 Q6 (Instruments): [${inst.join(", ") || "—"}] → ${instOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && instOK;

    return { html: lines.join("\n"), allCorrect };
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal() {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
}
function hideModal() {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
}

// Redirect URL after OK
const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ans = collectForm(form);
    const { html, allCorrect } = checkAllAnswers(ans);
    results.innerHTML = html;
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (allCorrect) {
        showModal();
    }
});

okBtn.addEventListener("click", () => {
    hideModal();
    window.location.href = REDIRECT_URL;
});

overlay.addEventListener("click", hideModal); // close if clicking outside
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

resetAll.addEventListener("click", () => {
    form.reset();
    results.innerHTML = "";
    hideModal();
});
