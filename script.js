const url = "./employees.json"
let employees = []
document.addEventListener('DOMContentLoaded', function () {
	const STORAGE_KEY = "employees"
	async function loadData(){
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				employees = JSON.parse(stored)
				return employees
			}
			const res = await fetch(url)
			const data = await res.json()
			employees = Array.isArray(data) ? data : []
			localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
			return employees
		} catch (err) {
			console.error('probleme pour loading data:', err)
		}
	}

	function saveData(){
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
		} catch (err) {
			console.error('probleme pour save data:', err)
		}
	}

})
