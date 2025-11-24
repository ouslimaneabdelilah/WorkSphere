function selectEmploye(e) {
  const contentModal = document.querySelector("#dialog2 .content-modal");
  const zone = e.dataset.zone;
  const idselect = e.dataset.id;
  const employe = employees.find((emp) => Number(emp.id) === Number(idselect));

  if (zone === "Réception" && employe.role === "Manager") {
    let countManagers = employees.filter(
      (emp) => emp.currentZone === "Réception" && emp.role === "Manager"
    ).length;

    if (countManagers >= 1) {
      alert.classList.add("alert-info");
      alert.classList.remove("is-hidden");
      alert.innerText = "Information : Un seul manager peut être dans la réception !";
      setTimeout(() => {
        alert.classList.add("is-hidden");
      }, 2000);
      return;
    }
  }

  employe.currentZone = zone;
  saveData();
  renderAffichier(employees);
  renderModalContent(zone, contentModal);
}
