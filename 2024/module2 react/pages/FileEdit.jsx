import { useEffect, useRef, useState } from "react";
import API from "../API/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import AnimatedPage from "../components/AnimatedPage";

export default function FileEdit() {
	const file_id = useParams().id;

	const [errors, setErrors] = useState([]);
	const filename = useRef();

	function submit(e) {
		e.preventDefault();
		API.changeFilename(file_id, filename.current.value, ans => {
			console.log(ans);
			setErrors(ans.success ? [] : ans.message.name);
		})
	}

	return <AnimatedPage>
		<h1>Редактировать файл</h1>
		<Link to='/filesDisk'>Назад</Link>
		<br />
		<br />

		<form action="#" onSubmit={submit}>
			<Input ref={filename} errors={errors} placeholder="Имя файла" />
			<button>Сохранить</button>
		</form>
	</AnimatedPage>
}