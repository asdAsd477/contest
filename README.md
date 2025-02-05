# Первый день
- скачать react-router-dom
- запустить django
- установить PIL

- Лучше заранее создай пустой React и Django проекты, потому что для их создания нужен интернет, а он в дни конкурса будет отключён



# Модуль 1
- Нужно будет менять изображения (обрезать, отразить, контрастность - gimp)
- Разметка должна быть валидна
- Кастомные шрифты @font-face
- Впихнуть все страницы в один index.html
- `@media print {}` чёрно-белое
- Добавить анимации
- В конце сделать скриншот страниц



# Модуль 2
- Туториал: https://youtu.be/GNrdg3PzpJQ (3-часовой) и https://youtu.be/Ul3y1LXxzdU (про Router)
- Они дадут неудобный и кривой макет, в который надо будет встроить React

- Обязательно перед началом проверить работу сервера, послать тестовый fetch
- Утилита create-react-app: `npx create-react-app .` + `npm start` + `npm i react-router-dom`

- ЛУЧШЕ КОД ПИСАТЬ СРАЗУ НА СЕРВЕРЕ, ПОТОМУ ЧТО 50к ФАЙЛОВ БУДУТ СКИДЫВАТЬСЯ ДОЛГО!!!
- В конце надо скомпилировать `npm run build` и скинуть статические файлы в корень сайта

- Bearer token: В fetch() добавялть заголовок `Authorization: "Bearer <token>"`
- токен сохранять в localStorage



# Модуль 3
- 3 нормальная форма - https://www.youtube.com/watch?v=nsXV4PGMmrk (3 видео)
- Разница между Primary key и Foreign key

- Научиться импортировать всё что нужно НАИЗУСТЬ, т.к. подсказок в VSCode не будет!
- Сразу создавать вьюху с `<input type="file">` (не забудь `enctype="multipart/form-data"` в форме)

- django rest framefork не нужен
- django должен реагировать как на ссылку "/login", так и на "/login/" (со слешем в конце)

- Придумай стратегию тестирования (имена oleg, ivan, ann):
  ![image](https://github.com/user-attachments/assets/e15926c1-59e1-40f3-83e1-1bafda4e1972)

- models.py: https://github.com/asdAsd477/contest/blob/main/2024/module3%20django/app/models.py
  ![image](https://github.com/user-attachments/assets/125c97c5-3161-4b46-96b2-aa7750110c26)

- Знать эти команды:
```py
django-admin.exe startproject <name> .

py manage.py runserver
py manage.py startapp app

py manage.py makemigrations
py manage.py migrate
```



# Модуль 4
- Некоторые примеры в `/2024/module4/`



# Примеры
- Модуль 1: https://asdasd477.github.io/contest/2024/module1/
- Спидтаски: https://asdasd477.github.io/contest/2024/module4/16%20circles.html
- Спидтаски 2025: https://asdasd477.github.io/contest/2025/module4/6%20cube.html
