from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse, FileResponse

from .models import *
import json, hashlib, os, re

# Для дебага отправки файлов
def index(req: HttpRequest):
	try_login(req)
	return HttpResponse('<input type="file" multiple id="files">')



# Общие функции
def try_login(req):
	auth = req.headers.get('authorization', '').replace('Bearer', '').strip()
	token = Token.objects.filter(token=auth).first()
	msg = JsonResponse({
		"message": "Login failed"
	}, status=403)

	return token, msg


def forbidden(req):
	return JsonResponse({
		"message": "Forbidden for you"
	}, status=403)


def not_found(req):
	return JsonResponse({
		"message": "Not found"
	}, status=404)

def not_found_page(req, path):
	return JsonResponse({
		"message": "Not found"
	}, status=404)


# Регистрация
def registration(req: HttpRequest):
	body = json.loads(req.body.decode())

	email = body.get('email', '')
	password = body.get('password', '')
	first_name = body.get('first_name', '')
	last_name = body.get('last_name', '')

	# Проверка email
	errors = {}
	if not re.match(r"\w+@\w+\.\w+", email) or len(email) > 254:
		errors['email'] = ['invalid email']
	elif User.objects.filter(email=email).exists():
		errors['email'] = ['email must be unique']
	
	# Проверка пароля (тут может быть более 1 ошибки, поэтому я юзаю setdefault и НЕ юзаю elif)
	if not any(filter(str.islower, password)):
		errors.setdefault('password', []).append('password must contain lowercase letters')
	if not any(filter(str.isupper, password)):
		errors.setdefault('password', []).append('password must contain uppercase letters')
	if not any(filter(str.isdigit, password)):
		errors.setdefault('password', []).append('password must contain digist')
	if len(password) > 64:
		errors.setdefault('password', []).append('too long password (max length = 64)')

	# Проверка first_name и last_name
	if not first_name:
		errors['first_name'] = ['empty first_name']
	if len(first_name) > 127:
		errors['first_name'] = ['too long first_name (max length = 127)']

	if not last_name:
		errors['last_name'] = ['empty last_name']
	if len(last_name) > 127:
		errors['last_name'] = ['too long last_name (max length = 127)']

	if errors:
		return JsonResponse({
			'success': False,
			'message': errors
		}, status=422)
	
	user = User.objects.create(email=email, password=password, first_name=first_name, last_name=last_name)
	token = Token.objects.create(user=user)

	return JsonResponse({
		'success': True,
		'message': 'Success',
		'token': token.token
	})



# Авторизация
def authorization(req: HttpRequest):
	body = json.loads(req.body.decode())

	email = body.get('email', '')
	password = body.get('password', '')

	user = User.objects.filter(email=email, password=password).first()
	if not user:
		return JsonResponse({
			"success": False,
			"message": "Login failed"
		}, status=401)

	token = Token.objects.create(user=user)
	return JsonResponse({
		'success': True,
		'message': 'Success',
		'token': token.token
	})



# Сброс авторизации
def logout(req: HttpRequest):
	token, msg = try_login(req)
	if not token:
		return msg

	token.delete()

	return JsonResponse({
		'success': True,
		'message': 'Logout'
	})



# Загрузка файлов
def append_id(filename, n):
	name, ext = os.path.splitext(filename)
	return f"{name} ({n}){ext}"


def get_unique_filename(names, name):
	unique_name = name

	n = 1
	while unique_name in names:
		unique_name = append_id(name, n)
		n += 1
	
	return unique_name


def upload(f, file_id):
	with open(f"uploads/{file_id}", 'wb+') as file:
		for chunk in f.chunks():
			file.write(chunk)


def files(req: HttpRequest):
	token, msg = try_login(req)
	if not token:
		return msg
	
	EXTENSIONS = ['doc', 'pdf', 'docx', 'zip', 'jpeg', 'jpg', 'png']
	MAX_SIZE = 2 * 1024 * 1024  # 2 Мегабайта

	filenames = [access.file.name for access in Access.objects.filter(user=token.user, is_author=True)]

	messages = []
	for f in req.FILES.getlist('files'):
		if f.size <= MAX_SIZE and os.path.splitext(f.name)[1][1:] in EXTENSIONS:
			name = get_unique_filename(filenames, f.name)

			file = File.objects.create(name=name)
			access = Access.objects.create(user=token.user, file=file, is_author=True)
			upload(f, file.file_id)

			messages.append({
				'success': True,
				'message': 'Success',
				'name': f.name,

				'url': '{{host}}/files/' + file.file_id,
				'file_id': file.file_id,
			})
		else:
			messages.append({
				'success': False,
				'message': 'File not loaded',
				'name': f.name
			})

	return JsonResponse(messages, safe=False)


# Редактирование файла
def files_id(req: HttpRequest, file_id):
	token, msg = try_login(req)
	if not token:
		return msg


	# Изменение имени файла
	if req.method == "PATH":
		body = json.loads(req.body.decode())
		name = body.get('name', '')

		if not name or len(name) > 127:
			return JsonResponse({
				'success': False,
				'message': {'name': ['invalid file name']}
			}, status=422)
		
		# Существует ли файл
		file = File.objects.filter(file_id=file_id).first()
		if not file:
			return not_found(req)
		
		# Существует ли доступ владельца к файлу
		access = Access.objects.filter(user=token.user, file=file, is_author=True).first()
		if not access:
			return forbidden(req)

		file.name = name
		file.save()
		
		return JsonResponse({
			'success': True,
			'message': 'Renamed'
		})


	# Удаление файла
	if req.method == "DELETE":
		# Существует ли файл
		file = File.objects.filter(file_id=file_id).first()
		if not file:
			return not_found(req)
		
		# Существует ли доступ владельца к файлу
		access = Access.objects.filter(user=token.user, file=file, is_author=True).first()
		if not access:
			return forbidden(req)

		os.remove(f"uploads/{file.file_id}")
		file.delete()
		
		return JsonResponse({
			'success': True,
			'message': 'File already deleted'
		})


	# Скачивание файла
	if req.method == "GET":
		# Существует ли файл
		file = File.objects.filter(file_id=file_id).first()
		if not file:
			return not_found(req)
		
		# Существует ли доступ к файлу (необязательно владельца)
		access = Access.objects.filter(user=token.user, file=file).first()
		if not access:
			return forbidden(req)
		
		f = open(f"uploads/{file_id}", 'rb')

		return FileResponse(f, filename=file.name, as_attachment=True)



# Права доступа
def files_id_accesses(req: HttpRequest, file_id):
	token, msg = try_login(req)
	if not token:
		return msg
	
	body = json.loads(req.body.decode())
	email = body.get('email', '')  # email не валидирую, т.к. в задании этого нет

	# Если я пытаюсь добавить несуществующий email - эта ошибка по заданию никак не обрабатывается
	user = User.objects.filter(email=email).first()
	if not user:
		return JsonResponse({
			'message': 'email not found'
		}, status=422)


	# Добавление прав доступа
	if req.method == "POST":
		# Существует ли файл
		file = File.objects.filter(file_id=file_id).first()
		if not file:
			return not_found(req)
		
		# Существует ли доступ владельца к файлу
		access = Access.objects.filter(user=token.user, file=file, is_author=True).first()
		if not access:
			return forbidden(req)

		Access.objects.create(user=user, file=file, is_author=False)

		return JsonResponse([{
			'fullname': access.user.first_name + ' ' + access.user.last_name,
			'email': access.user.email,
			'type': 'author' if access.is_author else 'co-author'
		} for access in Access.objects.filter(file=file)], safe=False)


	# Удаление прав доступа
	if req.method == "DELETE":
		# Существует ли файл
		file = File.objects.filter(file_id=file_id).first()
		if not file:
			return not_found(req)
		
		# Существует ли доступ владельца к файлу
		access = Access.objects.filter(user=token.user, file=file, is_author=True).first()
		if not access:
			return forbidden(req)
		

		# Попытка удалить себя
		if email == token.user.email:
			return forbidden(req)
		
		# Попытка удалить пользователя, которого нет в списке соавторов
		access = Access.objects.filter(user=user, file=file).first()
		if not access:
			return not_found(req)

		access.delete()

		return JsonResponse([{
			'fullname': access.user.first_name + ' ' + access.user.last_name,
			'email': access.user.email,
			'type': 'author' if access.is_author else 'co-author'
		} for access in Access.objects.filter(file=file)], safe=False)



# Просмотр файлов пользователя
def files_disk(req: HttpRequest):
	token, msg = try_login(req)
	if not token:
		return msg

	return JsonResponse([{
		'file_id': access.file.file_id,
		'name': access.file.name,
		'url': '{{host}}/files/' + access.file.file_id,
		'accesses': [{
			'fullname': a.user.first_name + ' ' + a.user.last_name,
			'email': a.user.email,
			'type': 'author' if a.is_author else 'co-author'
		} for a in Access.objects.filter(file=access.file)]
	} for access in Access.objects.filter(user=token.user, is_author=True)], safe=False)


# Просмотр файлов, к которым имеет доступ пользователь
def shared(req: HttpRequest):
	token, msg = try_login(req)
	if not token:
		return msg

	return JsonResponse([{
		'file_id': access.file.file_id,
		'name': access.file.name,
		'url': '{{host}}/files/' + access.file.file_id,
	} for access in Access.objects.filter(user=token.user, is_author=False)], safe=False)