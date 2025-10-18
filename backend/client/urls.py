"""URL patterns for client app APIs."""
from django.urls import path
from .views import (
    PersonVectorView,
    PersonUpdateView,
    PersonListView,
    PersonDetailView,
    PersonSummaryView,
    PersonOrderHistoryView,
    CartCreateView,
    CartProductCreateView,
    BulkCartProductCreateView,
    ProductListView,
    VisitCountStatsView,
    BodyTypeStatsView,
    GenderStatsView,
    EmotionStatsView,
    AgeStatsView,
)


urlpatterns = [
    # Person endpoints
    path("person/", PersonVectorView.as_view(), name="person-vector"),
    path("person/<uuid:person_id>/", PersonUpdateView.as_view(), name="person-update"),
    path("person/<uuid:person_id>/detail/", PersonDetailView.as_view(), name="person-detail"),
    path("person/<uuid:person_id>/summary/", PersonSummaryView.as_view(), name="person-summary"),
    path("person/<uuid:person_id>/orders/", PersonOrderHistoryView.as_view(), name="person-order-history"),
    path("persons/", PersonListView.as_view(), name="person-list"),

    # Cart endpoints
    path("cart-products/bulk/", BulkCartProductCreateView.as_view(), name="bulk-cart-product-create"),
    path("cart-product/", CartProductCreateView.as_view(), name="cart-product-create"),
    path("cart/", CartCreateView.as_view(), name="cart-create"),

    # Product endpoints
    path("products/", ProductListView.as_view(), name="product-list"),

    # Statistics endpoints
    path("statistics/visit-count/", VisitCountStatsView.as_view(), name="visit-count-stats"),
    path("statistics/body-type/", BodyTypeStatsView.as_view(), name="body-type-stats"),
    path("statistics/gender/", GenderStatsView.as_view(), name="gender-stats"),
    path("statistics/emotion/", EmotionStatsView.as_view(), name="emotion-stats"),
    path("statistics/age/", AgeStatsView.as_view(), name="age-stats"),
]
