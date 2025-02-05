import { useRef, useState } from "react";
import API from "../API/API";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

export default function FilesUpload() {
	const [files, setFiles] = useState([]);

	function upload(e) {
		const fd = new FormData;
		for(let file of e.target.files) fd.append("files", file);

		API.upload(fd, ans => {
			setFiles([...files, ...ans]);
		})
	}

	return <AnimatedPage>
		<h1>Загрузка файлов</h1>
		<Link to="/filesDisk">Назад</Link>
		<br />
		<br />

		<input type="file" multiple onChange={upload} />
		<br />
		<br />

		<table border="1" cellPadding="10">
			<thead>
				<tr>
					<th>Имя</th>
					<th>Загружен</th>
					<th>Скачать</th>
				</tr>
			</thead>
			<tbody>
				{files.map(file => <tr key={Math.random()}>
					<td>{file.name}</td>
					<td>{file.success ? "загружен" : "не загружен"}</td>
					{file.success && <td><button onClick={() => API.download(file)}>Скачать</button></td>}
				</tr>)}
			</tbody>
		</table>
	</AnimatedPage>
}