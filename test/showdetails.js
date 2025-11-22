export function showdetails(id) {
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
}