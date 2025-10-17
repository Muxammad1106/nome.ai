"""URL patterns for client app APIs."""
from django.urls import path
from client import views


urlpatterns = [
    path("person/", views.PersonVectorView.as_view(), name="person-vector"),
    path("person/<uuid:person_id>/", views.PersonUpdateView.as_view(), name="person-update"),
    path("person/<uuid:person_id>/orders/", views.PersonOrderHistoryView.as_view(), name="person-order-history"),
    path("persons/", views.PersonListView.as_view(), name="person-list"),

    path("cart-products/bulk/", views.BulkCartProductCreateView.as_view(), name="bulk-cart-product-create"),

    path("statistics/visit-count/", views.VisitCountStatsView.as_view(), name="visit-count-stats"),
    path("statistics/body-type/", views.BodyTypeStatsView.as_view(), name="body-type-stats"),
    path("statistics/gender/", views.GenderStatsView.as_view(), name="gender-stats"),
    path("statistics/emotion/", views.EmotionStatsView.as_view(), name="emotion-stats"),
    path("statistics/age/", views.AgeStatsView.as_view(), name="age-stats"),
]
