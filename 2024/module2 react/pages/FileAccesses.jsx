import { useEffect, useRef, useState } from "react";
import API from "../API/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import AnimatedPage from "../components/AnimatedPage";

export default function FileAccesses() {
	const file_id = useParams().id;

	const [accesses, setAccesses] = useState([]);
	const [errors, setErrors] = useState([]);
	const email = useRef();

	useEffect(() => {
		API.getAccesses(file_id, setAccesses);
	}, []);

	function submit(e) {
		e.preventDefault();
		API.addAccess(file_id, email.current.value, ans => {
			console.log(ans);
			if(!ans.message) setAccesses(ans); // если всё ок (на сервере по-нормальному не обрабатывается случай "email не существует")
			setErrors(ans.message ? [ans.message] : []);
		})
	}

	function removeAccess(email) {
		API.removeAccess(file_id, email, ans => {
			if(!ans.message) setAccesses(ans); // При удалении себя может возникнуть ошибка {message: "Forbidden for you"}
		});
	}

	return <AnimatedPage>
		<h1>Права доступа</h1>
		<Link to='/filesDisk'>Назад</Link>
		<br />
		<br />

		<table border="1" cellPadding="10">
			<thead>
				<tr>
					<th>Имя</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody>
				{accesses.map(access => <tr key={Math.random()}>
					<td>{access.fullname}</td>
					<td>{access.email}</td>
					<td><button onClick={() => removeAccess(access.email)}>Удалить</button></td>
				</tr>)}
			</tbody>
		</table>

		<br />
		<br />

		<form action="#" onSubmit={submit}>
			<Input ref={email} errors={errors} placeholder="Email" />
			<button>Добавить</button>
		</form>
	</AnimatedPage>
}