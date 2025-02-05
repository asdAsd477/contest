import { useRef, useState } from "react";
import Input from "../components/Input";
import API from "../API/API";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

export default function Login() {
	const email = useRef();
	const password = useRef();

	const [errors, setErrors] = useState({});
	const nav = useNavigate();

	/**
	 * Попытка войти в аккаунт при отправке формы
	 * @param {SubmitEvent} e - объект ивента при отправке формы
	 */
	function submit(e) {
		e.preventDefault();
		API.login({
			email: email.current.value,
			password: password.current.value,
		}, ans => {
			if(ans.success) {
				localStorage.setItem("token", ans.token);
				nav('/filesDisk');
			} else {
				setErrors({
					email: [''], // Чтобы поле email тоже подсветилось красным
					password: ['Invalid email or password']
				})
			}
		})
	}

	return <AnimatedPage>
		<h1>Логин</h1>
		<form onSubmit={submit}>
			<Input ref={email} errors={errors.email} placeholder="Email" />
			<Input ref={password} errors={errors.password} placeholder="Password" />
			<button>Логин</button>
		</form>
	</AnimatedPage>
}