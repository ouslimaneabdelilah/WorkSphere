const STORAGE_KEY = "employees";
const url = "./employees.json";
const closeModal = document.querySelector(".close-modal");
const btnAdd = document.getElementById("btn-add");
const myForm = document.getElementById("myform");
let formErrors = document.getElementById("errours-all");
const dialog = document.getElementById("dialog");
let employees = [];
// function pour loadData
async function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      employees = JSON.parse(stored);
      return employees;
    }
    const res = await fetch(url);
    const data = await res.json();
    employees = Array.isArray(data) ? data : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return employees;
  } catch (err) {
    console.error("probleme pour loading data:", err);
  }
}
// function pour saveData

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error("probleme pour save data:", err);
  }
}

// event pour close modal
closeModal.addEventListener("click", () => {
  dialog.classList.add("is-hidden");
});
// Event Click Add New Worker
btnAdd.addEventListener("click", () => {
  dialog.classList.remove("is-hidden");
});

loadData();

//function pour injection chaque members dans ton salle
function InjectHtml(list, selector) {
  selector.innerHTML = "";
  list.forEach((employee) => {
    selector.innerHTML += `
		  <div class="employee-sale">
            <div class="delete">X</div>
            <img src="${employee.photo}" alt="" width="50px" height="50px">
            <div class="content-employe">
                <div class="name-employe">${employee.name}</div>
                <div class="role-employe">${employee.role}</div>
            </div>
        </div>
		`;
  });
}

function filterParZone(listemployees, currentZone) {
  return listemployees.filter((e) => e.currentZone === currentZone);
}

//function affichier le officers

function renderAffichier(employees) {
  const unassigned = document.getElementById("unassigned");
  const memberUnassigned = filterParZone(employees, null);

  const zones = [
    { name: "Réception", selector: ".reception .zone-body" },
    { name: "Salle des serveurs", selector: ".server .zone-body" },
    { name: "Salle de sécurité", selector: ".security .zone-body" },
    { name: "Salle du personnel", selector: ".staffroom .zone-body" },
    { name: "Archive", selector: ".archive .zone-body" },
    { name: "Salle de conférence", selector: ".conference .zone-body" },
  ];

  zones.forEach((zone) => {
    const members = filterParZone(employees, zone.name);
    const zoneElement = document.querySelector(zone.selector);
    InjectHtml(members, zoneElement);
  });

  unassigned.innerHTML = "";
  memberUnassigned.forEach((employee) => {
    unassigned.innerHTML += `
		<li class="employee">
                        <img src="${employee.photo}" alt="" width="50px" height="50px">
                        <div class="content-employe">
                            <div class="name-employe">${employee.name}</div>
                            <div class="role-employe">${employee.role}</div>
                        </div>
                        <div class="edit">Edit</div>
        </li>
		`;
  });
}
renderAffichier(employees);
// function Ajouter un office

const photo = document.getElementById("image");
myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const name = document.getElementById("name");
  const role = document.getElementById("role");
  const phone = document.getElementById("phone");
  const rowsExper = document.querySelectorAll(".experience-row");
  formErrors.innerHTML = "";
  let errors = [];

  // Validation
  if (name.value.trim() === "") {
    errors.push("Le nom du membre est requis.");
  }
  if (role.value.trim() === "") {
    errors.push("Le rôle du membre est requis.");
  }
  if (email.value.trim() === "") {
    errors.push("L'email est requis.");
  } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
    errors.push("L'email n'est pas valide.");
  }
  if (photo.value.trim() === "") {
    errors.push("L'URL de la photo est requise.");
  }

  if (phone.value.trim() === "") {
    errors.push("Le numéro de téléphone est requis.");
  } else if (!/^0[5-7][0-9]{8}$/.test(phone.value.trim())) {
    errors.push("Le numéro de téléphone n'est pas valide.");
  }

  const experiencesData = [];
  rowsExper.forEach((row, index) => {
    const company = row.querySelector('[name="company"]').value.trim();
    const exRole = row.querySelector('[name="ex-role"]').value.trim();
    const dateFrom = row.querySelector('[name="date-from"]').value;
    const dateTo = row.querySelector('[name="date-to"]').value;

    if (company === "" || exRole === "" || dateFrom === "" || dateTo === "") {
      errors.push(`Tous les champs sont requis pour l'expérience #${index + 1}.`);
    } else {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (from >= to) {
        errors.push(
          `'Date de début' doit être antérieure à 'Date de fin' pour l'expérience #${
            index + 1
          }.`
        );
      }
      experiencesData.push({
        company: company,
        role: exRole,
        startDate: dateFrom,
        endDate: dateTo,
      });
    }
  });

  if (errors.length > 0) {
    formErrors.innerHTML = errors.join("<br>");
    formErrors.classList.add("is-errours");
    return;
  }

  formErrors.innerHTML = "";

  const newEvent = {
    id: employees.length + 1,
    name: name.value.trim(),
    role: role.value.trim(),
    photo: photo.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    experiences: experiencesData,
    currentZone: null,
  };

  employees.push(newEvent);
  saveData();
  renderAffichier(employees);
  dialog.classList.add("is-hidden");
  myForm.reset();
  document.getElementById("img-src").classList.add("is-hidden");
  document.querySelector(".experiences-list").innerHTML = "";
  formErrors.classList.remove("is-errours");
});

// Event pour affichier image
photo.addEventListener("change", (e) => {
  const afficherImage = document.getElementById("img-src");
  afficherImage.classList.remove("is-hidden");
  afficherImage.src = e.target.value;
});

function addExperienceRow() {
  const experiences = document.querySelector(".experiences-list");
  experiences.innerHTML += ` 
                            <div class="experience-row">
                                <div class="ex-champ company">
                                  <label for="company">Company:</label>
                                  <input type="text" name="company" id="company">
                                </div>
                                <div class="ex-champ ex-role">
                                  <label for="ex-role">Role:</label>
                                  <input type="text" name="ex-role" id="ex-role">
                                </div>
                                <div class="ex-champ date-from">
                                  <label for="date-from">From:</label>
                                  <input type="date" name="date-from" id="date-from">
                                </div>
                                <div class="ex-champ date-to">
                                  <label for="date-to">To:</label>
                                  <input type="date" name="date-to" id="date-to">
                                </div>
                                <button type="button" class="btn btn--danger variant-row__remove" onclick="deleted(this)">Remove</button>
                              </div>
                        `;
}

function deleted(e) {
  e.closest(".experience-row").remove();
}
