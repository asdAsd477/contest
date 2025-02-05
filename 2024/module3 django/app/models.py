from django.db import models
import uuid


def uuid4_token():
	return uuid.uuid4().hex  # токен - 32 символа


def uuid4_file_id():
	return uuid.uuid4().hex[:10]  # file_id - 10 символов (по заданию)


# Create your models here.
class User(models.Model):
	email = models.CharField(max_length=254, primary_key=True)  # 254 символа для email - стандарт
	password = models.CharField(max_length=64)  # Пароли не хешируются, т.к. в задании этого не требуется
	first_name = models.CharField(max_length=127)
	last_name = models.CharField(max_length=127)


class Token(models.Model):
	token = models.CharField(max_length=32, primary_key=True, default=uuid4_token)
	user = models.ForeignKey(User, on_delete=models.CASCADE)


class Access(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	file = models.ForeignKey('File', on_delete=models.CASCADE)
	is_author = models.BooleanField()


class File(models.Model):
	file_id = models.CharField(max_length=10, primary_key=True, default=uuid4_file_id)
	name = models.CharField(max_length=127)