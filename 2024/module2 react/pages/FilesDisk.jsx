import { useEffect, useState } from "react";
import API from "../API/API";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

export default function FilesDisk() {
	const [files, setFiles] = useState([]);
	const nav = useNavigate();

	useEffect(() => {
		API.getFiles(setFiles)
	}, []);

	function remove(id) {
		API.removeFile(id, ans => {
			setFiles(files => files.filter(file => file.file_id != id));
		})
	}

	function edit(id) {
		nav(`/fileEdit/${id}`);
	}

	function changeAccess(id) {
		nav(`/fileAccesses/${id}`);
	}

	return <AnimatedPage>
		<h1>Список файлов</h1>
		<br />
		<br />

		<table border="1" cellPadding="10">
			<thead>
				<tr>
					<th>Имя</th>
					<th>id</th>
				</tr>
			</thead>
			<tbody>
				{files.map(file => <tr key={Math.random()}>
					<td>{file.name}</td>
					<td>{file.file_id}</td>
					<td><button onClick={() => remove(file.file_id)}>Удалить</button></td>
					<td><button onClick={() => edit(file.file_id)}>Редактировать</button></td>
					<td><button onClick={() => changeAccess(file.file_id)}>Изменить права</button></td>
					<td><button onClick={() => API.download(file)}>Скачать</button></td>
				</tr>)}
			</tbody>
		</table>
	</AnimatedPage>
}