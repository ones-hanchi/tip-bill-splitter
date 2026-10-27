
const billInput = document.getElementById("bill");
const customTipInput = document.getElementById("customTip");
const peopleInput = document.getElementById("people");

const tipButtons = document.querySelectorAll(".tip-btn");
const calculateBtn = document.getElementById("calculateBtn");
const decreasePeopleBtn = document.getElementById("decreasePeople");
const increasePeopleBtn = document.getElementById("increasePeople");
const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");

const errorElement = document.getElementById("error");
const copyMessage = document.getElementById("copyMessage");

const billResult = document.getElementById("billResult");
const tipResult = document.getElementById("tipResult");
const totalResult = document.getElementById("totalResult");
const personResult = document.getElementById("personResult");

let selectedTip = 10;
let lastResult = null;

function formatDT(amount) {
    return amount.toLocaleString("fr-TN", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    }) + " DT";
} // afficher le montant avec trois chiffres aprés la virgule.

function getTipPercentage() {
    if (customTipInput.value.trim() !== "") {
        return Number(customTipInput.value);
    }

    return selectedTip;
} // le pourcentange de pourboire utiliser 
function calculateBill() {
    errorElement.textContent = "";
    copyMessage.textContent = "";

    const bill = Number(billInput.value); //bil : montant de l'addition
    const people = Number(peopleInput.value); //people : le nombre de personne 
    const tipPercentage = getTipPercentage(); //tipPercentage: pourcentage de pourboire 

    if (billInput.value.trim() === "" || !Number.isFinite(bill) || bill <= 0) {
        errorElement.textContent = "Veuillez saisir une addition supérieure à zéro.";
        return;
    }

    if (
        peopleInput.value.trim() === "" ||
        !Number.isInteger(people) ||
        people < 1
    ) {
        errorElement.textContent = "Le nombre de personnes doit être un entier supérieur à zéro.";
        return;
    }

    if (
        !Number.isFinite(tipPercentage) ||
        tipPercentage < 0 ||
        tipPercentage > 1000
    ) {
        errorElement.textContent = "Le pourcentage doit être compris entre 0 et 1000.";
        return;
    }

    const tipAmount = bill * tipPercentage / 100;
    const total = bill + tipAmount;
    const perPerson = total / people;

    billResult.textContent = formatDT(bill);
    tipResult.textContent = formatDT(tipAmount);
    totalResult.textContent = formatDT(total);
    personResult.textContent = formatDT(perPerson);

    lastResult = {
        bill,
        tipPercentage,
        tipAmount,
        total,
        people,
        perPerson
    };
}


tipButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedTip = Number(button.dataset.tip);
        customTipInput.value = "";

        tipButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        calculateBill(); // Choisir un pourcentage prédéfini
    });
});


customTipInput.addEventListener("input", () => {
    tipButtons.forEach((button) => button.classList.remove("active"));

    if (customTipInput.value.trim() === "") {
        const defaultButton = [...tipButtons].find(
            (button) => Number(button.dataset.tip) === selectedTip
        );

        if (defaultButton) defaultButton.classList.add("active");
    }

    calculateBill(); // Pourcentage personnalisé
});

// Recalcul automatique 
billInput.addEventListener("input", calculateBill);
peopleInput.addEventListener("input", calculateBill);
calculateBtn.addEventListener("click", calculateBill);


increasePeopleBtn.addEventListener("click", () => {
    const current = Number(peopleInput.value);
    peopleInput.value = Math.max(1, Number.isInteger(current) ? current + 1 : 2);
    calculateBill();
}); // Boutons + 

decreasePeopleBtn.addEventListener("click", () => {
    const current = Number(peopleInput.value);
    peopleInput.value = Math.max(1, Number.isInteger(current) ? current - 1 : 1);
    calculateBill();
}); // Boutons -



copyBtn.addEventListener("click", async () => {
    if (!lastResult) {
        errorElement.textContent = "Calculez d'abord une addition valide.";
        return;
    }

    const text = [
        "Résumé de l'addition",
        "Montant initial : " + formatDT(lastResult.bill),
        "Pourboire (" + lastResult.tipPercentage + "%) : " + formatDT(lastResult.tipAmount),
        "Total : " + formatDT(lastResult.total),
        "Nombre de personnes : " + lastResult.people,
        "Par personne : " + formatDT(lastResult.perPerson)
    ].join("\n");

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const temporary = document.createElement("textarea");
            temporary.value = text;
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";
            document.body.appendChild(temporary);
            temporary.select();

            const copied = document.execCommand("copy");
            temporary.remove();

            if (!copied) throw new Error("Copie impossible");
        }

        copyMessage.textContent = "Résultat copié !";
    } catch {
        copyMessage.textContent = "Copie impossible. Sélectionnez le résultat manuellement.";
    }
});


resetBtn.addEventListener("click", () => {
    billInput.value = "";
    peopleInput.value = "2";
    customTipInput.value = "";
    selectedTip = 10;

    tipButtons.forEach((button) => {
        button.classList.toggle("active", Number(button.dataset.tip) === 10);
    });

    errorElement.textContent = "";
    copyMessage.textContent = "";

    billResult.textContent = formatDT(0);
    tipResult.textContent = formatDT(0);
    totalResult.textContent = formatDT(0);
    personResult.textContent = formatDT(0);

    lastResult = null;
});


calculateBill();
