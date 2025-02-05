class Book():
	def __init__(self, name, author):
		self.name = name
		self.author = author


class Member():
	def __init__(self, name, email, date):
		self.name = name
		self.email = email
		self.date = date


class BookMember():
	def __init__(self, book, member):
		self.book = book
		self.member = member