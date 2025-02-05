import { useRef, useState } from "react";
import Input from "../components/Input";
import API from "../API/API";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

export default function Registration() {
	const email = useRef();
	const password = useRef();
	const first_name = useRef();
	const last_name = useRef();

	const [errors, setErrors] = useState({});
	const nav = useNavigate();

	function submit(e) {
		e.preventDefault();
		API.register({
			email: email.current.value,
			password: password.current.value,
			first_name: first_name.current.value,
			last_name: last_name.current.value,
		}, ans => {
			ans.success ? nav('/login') : setErrors(ans.message)
		})
	}

	return <AnimatedPage>
		<h1>Регистрация</h1>
		<form onSubmit={submit}>
			<Input ref={email} errors={errors.email} placeholder="Email" />
			<Input ref={password} errors={errors.password} placeholder="Password" />
			<Input ref={first_name} errors={errors.first_name} placeholder="First name" />
			<Input ref={last_name} errors={errors.last_name} placeholder="Last name" />
			<button>Регистрация</button>
		</form>
	</AnimatedPage>
}