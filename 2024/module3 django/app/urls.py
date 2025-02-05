from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
	path('', views.index),

	path('registration/', views.registration),
	path('authorization/', views.authorization),
	path('logout/', views.logout),

	path('files/', views.files),
	path('files/disk', views.files_disk),
	path('shared/', views.shared),

	path('files/<str:file_id>/', views.files_id),
	path('files/<str:file_id>/accesses', views.files_id_accesses),
	path('<path:path>', views.not_found_page),
]
