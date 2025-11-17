document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "employees";
  const url = "./employees.json";
  const closeModal = document.querySelector(".close-modal")
  const btnAdd = document.getElementById("btn-add")
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
  closeModal.addEventListener('click',()=>{
	document.getElementById("dialog").classList.add('is-hidden');
  })
  // Event Click Add New Worker
  btnAdd.addEventListener("click",()=>{
	document.getElementById("dialog").classList.remove('is-hidden');
  })


  //function affichier le officers
  loadData()
  function renderAffichier(employees){
	console.log("hhhh")
	const unassigned = document.getElementById("unassigned");
	unassigned.innerHTML = "";
	employees.forEach(employee => {
		unassigned.innerHTML += `
		<li class="employee">
                        <img src="${employee.photo}" alt="" width="50px" height="50px">
                        <div class="content-employe">
                            <div class="name-employe">${employee.name}</div>
                            <div class="role-employe">${employee.role}</div>
                        </div>
                        <div class="edit">Edit</div>
        </li>
		`
	});
  }

  // function Ajouter un office 


});