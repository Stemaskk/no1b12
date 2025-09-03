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

// ---------- answer key (updated) ----------
const correct = {
    // Building 1 Q1 is now "When did Building 1 & 2 get renovated?"
    "b1-year": "2019",                      // <-- updated to 2019
    "b1-fossil": "columbian mammoth skull", // case-insensitive compare
    "b1-company": "Tesla",

    // Building 2 (no separate renovation question anymore)
    "b2-facility": "Art Studios",
    "b2-instruments": ["Piano", "Drum Set"]
};

const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- check all (no spoilers) ----------
function checkAllAnswers(ans) {
    const lines = [];
    let allCorrect = true;

    // B1 Q1: Renovation of both buildings
    const reno = (ans["b1-year"] || "").trim();
    const renoOK = reno === correct["b1-year"];
    lines.push(`Q1 (Renovation year for 1 & 2): ${reno || "—"} → ${renoOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && renoOK;

    // B1 Q2: Fossil (typed)
    const fossil = (ans["b1-fossil"] || "").trim().toLowerCase();
    const fossilOK = fossil === correct["b1-fossil"];
    lines.push(`Q2 (Fossil name B1): "${ans["b1-fossil"] || "—"}" → ${fossilOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && fossilOK;

    // B1 Q3: Company on Floor 2
    const comp = ans["b1-company"] || "";
    const compOK = comp === correct["b1-company"];
    lines.push(`Q3 (Company on Floor 2 B1): ${comp || "—"} → ${compOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && compOK;

    // B2 Q4: Facility (renumbered to 4 in UI)
    const fac = ans["b2-facility"] || "";
    const facOK = fac === correct["b2-facility"];
    lines.push(`Q4 (Facility B2): ${fac || "—"} → ${facOK ? spanOk("Correct") : spanBad("Wrong")}`);
    allCorrect = allCorrect && facOK;

    // B2 Q5: Instruments set
    const inst = ans["b2-instruments"] || [];
    const instOK = sameSet(inst, correct["b2-instruments"]);
    lines.push(`Q5 (Instruments B2): [${inst.join(", ") || "—"}] → ${instOK ? spanOk("Correct") : spanBad("Wrong")}`);
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
        showModal(); // shows 5KULL
    }
});

document.getElementById("modal-ok").addEventListener("click", () => {
    hideModal();
    window.location.href = REDIRECT_URL; // go back to main page
});

overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

resetAll.addEventListener("click", () => {
    form.reset();
    results.innerHTML = "";
    hideModal();
});
