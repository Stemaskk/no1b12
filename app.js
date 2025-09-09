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

// ---------- answer key (unchanged) ----------
const correct = {
    "b1-year": "2019",
    "b1-fossil": "columbian mammoth skull",
    "b1-company": "Tesla",
    "b2-facility": "Art Studios",
    "b2-instruments": ["Piano", "Drum Set"]
};

// ---------- redirect (NEW) ----------
const REDIRECT_URL = "https://mamm0th.netlify.app/";

// ---------- checker ----------
function allAnswersCorrect(ans) {
    const q1 = (ans["b1-year"] || "").trim() === correct["b1-year"];
    const q2 = normalize(ans["b1-fossil"]) === correct["b1-fossil"];
    const q3 = (ans["b1-company"] || "") === correct["b1-company"];
    const q4 = (ans["b2-facility"] || "") === correct["b2-facility"];
    const q5 = sameSet(ans["b2-instruments"] || [], correct["b2-instruments"]);
    return q1 && q2 && q3 && q4 && q5;
}

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    if (ok) {
        results.textContent = "All correct! Redirecting…";
        window.location.href = REDIRECT_URL; // immediate redirect, no popup
    } else {
        results.textContent = "Not quite — try again.";
    }
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

resetAll.addEventListener("click", () => {
    form.reset();
    results.textContent = "";
});
