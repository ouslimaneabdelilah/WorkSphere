const STORAGE_KEY = "employees";
const url = "./employees.json";
const closeModal = document.querySelector("#dialog .close-modal");
const btnAdd = document.getElementById("btn-add");
const myForm = document.getElementById("myform");
let formErrors = document.getElementById("errours-all");
const dialog = document.getElementById("dialog");
const photo = document.getElementById("image");
const email = document.getElementById("email");
const name = document.getElementById("name");
const role = document.getElementById("role");
const phone = document.getElementById("phone");
let numberInplace = null;
let employees = [];
let idEdite = null;
const searchInput = document.getElementById("search-input");
let limitations = {
  Réception: 2,
  "Salle des serveurs": 10,
  "Salle de sécurité": 4,
  "Salle d'archive": 2,
  Nettoyage: 4,
  "Salle du personnel": 3,
};

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
  console.log("hhhhh");
  dialog.classList.add("is-hidden");
  myForm.reset();
  document.getElementById("img-src").classList.add("is-hidden");
  document.querySelector(".experiences-list").innerHTML = "";
  formErrors.classList.remove("is-errours");
  document.querySelector(".btn-submit").value = "Add";
  idEdite = null;
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
		  <div class="employee-sale" >
            <div class="delete" onclick="removeInZone(${employee.id})"><i class="fa-solid fa-xmark"></i></div>
            <img src="${employee.photo}" alt="" width="50px" height="50px" onclick="showdetails(${employee.id})">
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
  let memberUnassigned = filterParZone(employees, null);
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm) {
    memberUnassigned = memberUnassigned.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  const zones = [
    { name: "Réception", selector: ".reception .zone-body" },
    { name: "Salle des serveurs", selector: ".server .zone-body" },
    { name: "Salle de sécurité", selector: ".security .zone-body" },
    { name: "Salle du personnel", selector: ".staffroom .zone-body" },
    { name: "Salle d'archive", selector: ".archive .zone-body" },
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
                        <img src="${employee.photo}" alt="" width="50px" height="50px" onclick="showdetails(${employee.id})">
                        <div class="content-employe">
                            <div class="name-employe">${employee.name}</div>
                            <div class="role-employe">${employee.role}</div>
                        </div>
                        <div class="edit" onclick="editEmploye(${employee.id})">Edit</div>
        </li>
		`;
  });
}
renderAffichier(employees);
// function Ajouter un office

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
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
      errors.push(
        `Tous les champs sont requis pour l'expérience #${index + 1}.`
      );
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
  const newEmploye = {
    id: idEdite ? idEdite : employees.length + 1,
    name: name.value.trim(),
    role: role.value.trim(),
    photo: photo.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    experiences: experiencesData,
    currentZone: null,
  };
  if (idEdite) {
    const employeEdit = employees.find((e) => Number(e.id) === Number(idEdite));
    Object.assign(employeEdit, newEmploye);
    idEdite = null;
  } else {
    employees.push(newEmploye);
  }

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

//function ajouter experience
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
// suppremier
function deleted(e) {
  e.closest(".experience-row").remove();
}
// edit employe
function editEmploye(id) {
  dialog.classList.remove("is-hidden");

  const editEmp = employees.find((e) => Number(e.id) === Number(id));
  if (!editEmp) return;
  name.value = editEmp.name;
  email.value = editEmp.email;
  photo.value = editEmp.photo;
  phone.value = editEmp.phone;
  role.value = editEmp.role;

  const afficherImage = document.getElementById("img-src");
  afficherImage.classList.remove("is-hidden");
  afficherImage.src = editEmp.photo;

  const experiences = document.querySelector(".experiences-list");
  experiences.innerHTML = "";

  editEmp.experiences.forEach((ex) => {
    experiences.innerHTML += ` 
                            <div class="experience-row">
                                <div class="ex-champ company">
                                  <label for="company">Company:</label>
                                  <input type="text" name="company" id="company" value="${ex.company}">
                                </div>
                                <div class="ex-champ ex-role">
                                  <label for="ex-role">Role:</label>
                                  <input type="text" name="ex-role" id="ex-role" value="${ex.role}">
                                </div>
                                <div class="ex-champ date-from">
                                  <label for="date-from">From:</label>
                                  <input type="date" name="date-from" id="date-from" value="${ex.startDate}">
                                </div>
                                <div class="ex-champ date-to">
                                  <label for="date-to">To:</label>
                                  <input type="date" name="date-to" id="date-to" value="${ex.endDate}">
                                </div>
                                <button type="button" class="btn btn--danger variant-row__remove" onclick="deleted(this)">Remove</button>
                              </div>
                        `;
  });
  idEdite = editEmp.id;
  document.querySelector(".btn-submit").value = "Edit";
}

// details employe

function showdetails(id) {
  const showEmp = employees.find((e) => Number(e.id) === Number(id));
  const contentModal = document.querySelector(".content-modal");
  document.getElementById("dialog2").classList.remove("is-hidden");
  contentModal.innerHTML = `
        <div class="image-afficher">
            <img src="${showEmp.photo}" alt="" id="img-src" >
        </div>
        <div class="champ">
					<label for="name" class="name">Name: </label>
					<input type="text" name="name" id="name" value="${showEmp.name}" disabled>
				</div>
        <div class="champ">
					<label for="role" class="role">Role:</label>
					<input type="text" name="role" id="role" value="${showEmp.role}" disabled>
				</div>
        <div class="champ">
					<label for="email" class="email">Email:</label>
					<input type="text" name="email" id="email" value="${showEmp.email}" disabled>
				</div>
        <div class="champ">
					<label for="phone" class="phone">Phone:</label>
					<input type="text" name="phone" id="phone" value="${showEmp.phone}" disabled>
				</div>
        
          ${
            showEmp.currentZone != null
              ? `
            <div class="champ">
              <label for="localisation" class="localisation">localisation actuelle:</label>
					    <input type="text" name="localisation" id="localisation" value="${showEmp.currentZone}" disabled>
            <div class="champ">
          `
              : ""
          }
        </div>
        
					${showEmp.experiences
            .map(
              (ex, i) => `
            <label for="phone" class="phone">Experience ${i + 1}:</label>
            <ul>
            <li>Company: ${ex.company}</li>
            <li>Role : ${ex.role}</li>
            <li>From : ${ex.startDate}</li>
            <li>To : ${ex.endDate}</li>
            </ul>
            
            `
            )
            .join("")}
				</div>

  
  `;
  closeModalDeatails();
}

// function ajouter employes dans les salles
function filterEmployeRole(employees, role) {
  return employees.filter(
    (emp) => emp.role === role && emp.currentZone === null
  );
}

function addToSalle(e) {
  const contentModal = document.querySelector(".content-modal");
  document.getElementById("dialog2").classList.remove("is-hidden");
  const zone = e.closest(".zone").dataset.zone;
  renderModalContent(zone, contentModal);
  closeModalDeatails();
}

//function  actualiser list de affichier les memberes select de chaque zone
function renderModalContent(zone, container) {
  const unassignedEmployees = employees.filter(
    (emp) => emp.currentZone === null
  );
  let employeeAcces = [];
  const uniqueZones = {
    Réception: "Réceptionnistes",
    "Salle des serveurs": "it",
    "Salle de sécurité": "Agents",
  };
  if (uniqueZones[zone]) {
    employeeAcces = unassignedEmployees.filter(
      (emp) => emp.role === uniqueZones[zone] || emp.role === "Manager"
    );
  } else if (zone === "Salle d'archive") {
    employeeAcces = unassignedEmployees.filter(
      (emp) => emp.role !== "Nettoyage"
    );
  } else {
    employeeAcces = unassignedEmployees;
  }
  container.innerHTML = "";
  if (employeeAcces.length > 0) {
    employeeAcces.forEach((employee) => {
      container.innerHTML += `
      <li class="employee" onclick="selectEmploye(this)" data-id="${employee.id}" data-zone="${zone}">
                          <img src="${employee.photo}" alt="" width="50px" height="50px">
                          <div class="content-employe">
                              <div class="name-employe">${employee.name}</div>
                              <div class="role-employe">${employee.role}</div>
                          </div>
          </li>`;
    });
  } else {
    container.innerHTML += `
          <li class="employee">n'est pas des members</li>

    `;
  }
}
//function pour select en member
function selectEmploye(e) {
  const contentModal = document.querySelector("#dialog2 .content-modal");
  const zone = e.dataset.zone
  numberInplace = employees.filter(
    (em) => em.currentZone === zone
  ).length;
  console.log(numberInplace);
  console.log(e.dataset.zone);
  if (numberInplace + 1 > Number(limitations[e.dataset.zone])) {
    alert("Place complete");
    return;
  }
  const idselect = e.dataset.id;
  const employe = employees.find((e) => Number(e.id) === Number(idselect));
  Object.assign(employe, { currentZone: e.dataset.zone });
  saveData();
  renderAffichier(employees)
  renderModalContent(zone, contentModal);
}
// event pour search par nom et role
searchInput.addEventListener("input", () => {
  renderAffichier(employees);
});

// event suppremier un memeber dans zone
function removeInZone(id) {
  const employeRemove = employees.find((em) => Number(em.id) === Number(id));
  Object.assign(employeRemove, { currentZone: null });
  saveData();
  renderAffichier(employees);
}

// function close modal pour details
function closeModalDeatails() {
  document
    .querySelector("#dialog2 .close-modal")
    .addEventListener("click", () => {
      document.getElementById("dialog2").classList.add("is-hidden");
    });
}
