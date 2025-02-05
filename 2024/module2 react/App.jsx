import { Link, Navigate, Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import FilesUpload from "./pages/FilesUpload";
import FilesDisk from "./pages/FilesDisk";
import FileEdit from "./pages/FileEdit";
import FileAccesses from "./pages/FileAccesses";
import FilesShared from "./pages/FilesShared";
import API from "./API/API";
import { useState } from "react";

const routes = [
	{path: '/registration',     text: 'Регистрация',       elem: <Registration />, guest: true, navLink: true},
	{path: '/login',            text: 'Логин',             elem: <Login />,        guest: true, navLink: true},
	{path: '/filesUpload',      text: 'Загрузка',          elem: <FilesUpload />,  guest: false, navLink: true},
	{path: '/filesDisk',        text: 'Файлы',             elem: <FilesDisk />,    guest: false, navLink: true},
	{path: '/fileEdit/:id',     text: '❌ Редактировать', elem: <FileEdit />,     guest: false, navLink: false},
	{path: '/fileAccesses/:id', text: '❌ Права доступа', elem: <FileAccesses />, guest: false, navLink: false},
	{path: '/filesShared',      text: 'Shared',            elem: <FilesShared />,  guest: false, navLink: true},
];

/**
 * Главный компонент всего приложения
 * @component
 * @returns {JSX.Element} отрендеренная страница
 */
export default function App() {
	const guest = !localStorage.getItem('token');
	
	// Костыль для перерисовки
	const [token, setToken] = useState(localStorage.getItem('token'));
	setInterval(() => {
		let t = localStorage.getItem('token');
		if(t != token) setToken(t);
	});

	return <>
		<nav style={{display: 'flex', gap: '20px', background: 'lightgray', padding: '15px'}}>
			{routes.map(r => guest == r.guest && r.navLink && <Link key={Math.random()} to={r.path}>{r.text}</Link>)}
			{!guest && <Link to='*' onClick={API.logout}>Выйти</Link>}
		</nav>

		<Routes>
			{routes.map(r => guest == r.guest && <Route key={Math.random()} path={r.path} element={r.elem} />)}
			<Route path='*' element={<Navigate to={guest ? '/registration' : '/filesUpload'} />} />
		</Routes>
	</>
}