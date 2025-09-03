// ---------- helpers ----------
function collectForm(formEl) {
    const data = {};
    const fd = new FormData(formEl);
    for (const [name, value] of fd.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else data[name] = value;
    }
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });
    return data;
}
function sameSet(a = [], b = []) {
    const A = [...a].sort(); const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}
function normalize(s){ return (s||"").trim().toLowerCase(); }

// ---------- answer key (from your current B1&2 site) ----------
const correct = {
    // Q1: When did Building 1 & 2 get renovated?
    "b1-year": "2019",
    // Q2: fossil name (typed, case-insensitive)
    "b1-fossil": "columbian mammoth skull",
    // Q3: company on B1 floor 2
    "b1-company": "Tesla",
    // Q4: B2 facility
    "b2-facility": "Art Studios",
    // Q5: B2 instruments
    "b2-instruments": ["Piano", "Drum Set"]
};

// Redirect & modal ids (unchanged)
const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- overall checker ----------
function allAnswersCorrect(ans) {
    const q1 = (ans["b1-year"] || "").trim() === correct["b1-year"];
    const q2 = normalize(ans["b1-fossil"]) === correct["b1-fossil"];
    const q3 = (ans["b1-company"] || "") === correct["b1-company"];
    const q4 = (ans["b2-facility"] || "") === correct["b2-facility"];
    const q5 = sameSet(ans["b2-instruments"] || [], correct["b2-instruments"]);
    return q1 && q2 && q3 && q4 && q5;
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal(){ overlay.classList.remove("hidden"); modal.classList.remove("hidden"); overlay.setAttribute("aria-hidden","false"); }
function hideModal(){ overlay.classList.add("hidden"); modal.classList.add("hidden"); overlay.setAttribute("aria-hidden","true"); }

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    results.textContent = ok ? "All correct! 🎉" : "Not quite — try again.";
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (ok) showModal(); // shows 5KULL (already in your HTML)
});

okBtn.addEventListener("click", () => { hideModal(); window.location.href = REDIRECT_URL; });
overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });
resetAll.addEventListener("click", () => { form.reset(); results.textContent = ""; hideModal(); });
