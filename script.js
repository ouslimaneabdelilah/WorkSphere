const STORAGE_KEY = "employees";
const url = "./employees.json";
const closeModal = document.querySelector(".close-modal");
const btnAdd = document.getElementById("btn-add");
const myForm = document.getElementById("myform");
let formErrors = document.getElementById("errours-all");
const dialog = document.getElementById("dialog")
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
  const rowsExper = document.querySelectorAll(".experience-row");
  formErrors.innerHTML = "";
  formErrors.classList.add("is-hidden");
  let errors = [];
  const newEvent = {
    id: employees.length + 1,
    name: name.value.trim(),
    role: role.value.trim(),
    photo: photo.value.trim(),
    email: email.value.trim(),
    experiences: [],
    currentZone :null
  };
  if (rowsExper.length >= 1) {
    rowsExper.forEach((row) => {
      const company = row.querySelector('[name="company"]').value;
      const role = row.querySelector('[name="ex-role"]').value;
      const dateFrom = row.querySelector('[name="date-from"]').value;
      const dateTo = row.querySelector('[name="date-to"]').value;
      newEvent.experiences.push({
        company: company,
        role: role,
        startDate: dateFrom,
        endDate: dateTo,
      });
    });
  }
  console.log(newEvent)
  employees.push(newEvent);
  saveData();
  renderAffichier(employees);
  dialog.classList.add("is-hidden");
  myForm.reset();
  document.querySelector(".experiences-list").innerHTML = "";
});


  // Event pour affichier image 
  photo.addEventListener("change",(e)=>{
    const afficherImage = document.getElementById("img-src")
    afficherImage.classList.remove("is-hidden")
    afficherImage.src = e.target.value
  })

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
