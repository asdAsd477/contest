const url = "http://127.0.0.1:8000/";

export default class API {
	// Логин
	static register({email, password, first_name, last_name}, then) {
		fetch(url + "registration/", {
			method: "POST",
			body: JSON.stringify({email, password, first_name, last_name})
		}).then(x => x.json()).then(then)
	}

	static login({email, password}, then) {
		fetch(url + "authorization/", {
			method: "POST",
			body: JSON.stringify({email, password})
		}).then(x => x.json()).then(then)
	}

	static logout(then) {
		fetch(url + "logout/", {
			headers: {authorization: localStorage.getItem("token")}
		});
		localStorage.removeItem('token');
	}




	/**
	 * Загружает файлы на сервер
	 * @param {FormData} files - FormData с файлами
	 * @param {function} then - функция вызывается по окончании запроса
	 */
	static upload(files, then) {
		fetch(url + "files/", {
			method: "POST",
			headers: {authorization: localStorage.getItem("token")},
			body: files
		}).then(x => x.json()).then(then)
	}

	static download({name, file_id}) {
		fetch(url + `files/${file_id}/`, {
			headers: {authorization: localStorage.getItem("token")}
		}).then(x => x.blob()).then(blob => {
			const a = document.createElement('a');
			// document.body.appendChild(a);

			a.download = name;
			a.href = window.URL.createObjectURL(blob);
			a.click();

			window.URL.revokeObjectURL(a.href);
			// a.remove();
		})
	}



	// Файлы
	static getFiles(then) {
		fetch(url + `files/disk`, {
			headers: {authorization: localStorage.getItem("token")}
		}).then(x => x.json()).then(then)
	}

	static getSharedFiles(then) {
		fetch(url + `shared/`, {
			headers: {authorization: localStorage.getItem("token")}
		}).then(x => x.json()).then(then)
	}

	static removeFile(id, then) {
		fetch(url + `files/${id}/`, {
			method: "DELETE",
			headers: {authorization: localStorage.getItem("token")}
		}).then(x => x.json()).then(then)
	}

	static changeFilename(id, filename, then) {
		fetch(url + `files/${id}/`, {
			method: "PATH",
			headers: {authorization: localStorage.getItem("token")},
			body: JSON.stringify({name: filename})
		}).then(x => x.json()).then(then)
	}



	// Права доступа
	static getAccesses(id, then) {
		this.getFiles(files => {
			let accesses = files.find(file => file.file_id == id).accesses;
			then(accesses);
		})
	}

	static addAccess(id, email, then) {
		fetch(url + `files/${id}/accesses`, {
			method: "POST",
			headers: {authorization: localStorage.getItem("token")},
			body: JSON.stringify({email})
		}).then(x => x.json()).then(then)
	}

	static removeAccess(id, email, then) {
		fetch(url + `files/${id}/accesses`, {
			method: "DELETE",
			headers: {authorization: localStorage.getItem("token")},
			body: JSON.stringify({email})
		}).then(x => x.json()).then(then)
	}
}