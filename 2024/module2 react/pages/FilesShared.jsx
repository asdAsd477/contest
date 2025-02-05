import { useEffect, useRef, useState } from "react";
import API from "../API/API";
import AnimatedPage from "../components/AnimatedPage";

export default function FilesShared() {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		API.getSharedFiles(setFiles);
	}, []);

	return <AnimatedPage>
		<h1>Shared файлы</h1>
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
					<td><button onClick={() => API.download(file)}>Скачать</button></td>
				</tr>)}
			</tbody>
		</table>
	</AnimatedPage>
}