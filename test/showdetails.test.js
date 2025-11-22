/**
 * @jest-environment jsdom
 */
import { showdetails } from "./showdetails";

global.employees =[
      {
    "id": 1,
    "name": "Alice Dupont",
    "role": "Réceptionniste",
    "photo": "https://picsum.photos/200/300",
    "email": "alice.dupont@example.com",
    "phone": "0612345678",
    "experiences": [
      { "company": "Entreprise A", "startDate": "2018-01-01", "endDate": "2020-06-30" }
    ],
    "currentZone": "Réception"
  }
]
describe("showdetails function",()=>{
    beforeEach(()=>{
        document.body.innerHTML = `
        <div id="dialog2" class="is-hidden"></div>
        <div class="content-modal"></div>
        `
    });
    test("gha y3mer modal b data",()=>{
        showdetails(1);
        const modal = document.querySelector(".content-modal");
        expect(modal.innerHTML).toContain('src="https://picsum.photos/200/300"')
        expect(modal.innerHTML).toContain('value="Alice Dupont"')
        expect(modal.innerHTML).toContain('value="Réceptionniste"')
        expect(modal.innerHTML).toContain('value="alice.dupont@example.com"')
        expect(modal.innerHTML).toContain('value="0612345678"')
    })
    test("is-hidden",()=>{
        showdetails(1)
        const dialog = document.getElementById("dialog2")
        expect(dialog.classList.contains("is-hidden")).toBe(false)
    })
})