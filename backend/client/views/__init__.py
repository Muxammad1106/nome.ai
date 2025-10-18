"""
Views package for client app.
"""

from .person_views import (
    PersonVectorView,
    PersonUpdateView,
    PersonListView,
    PersonDetailView,
    PersonSummaryView,
    PersonOrderHistoryView,
)
from .cart_views import (
    CartCreateView,
    CartProductCreateView,
    BulkCartProductCreateView,
)
from .product_views import (
    ProductListView,
)
from .statistics_views import (
    VisitCountStatsView,
    BodyTypeStatsView,
    GenderStatsView,
    EmotionStatsView,
    AgeStatsView,
)

__all__ = [
    # Person views
    'PersonVectorView',
    'PersonUpdateView',
    'PersonListView',
    'PersonDetailView',
    'PersonSummaryView',
    'PersonOrderHistoryView',
    # Cart views
    'CartCreateView',
    'CartProductCreateView',
    'BulkCartProductCreateView',
    # Product views
    'ProductListView',
    # Statistics views
    'VisitCountStatsView',
    'BodyTypeStatsView',
    'GenderStatsView',
    'EmotionStatsView',
    'AgeStatsView',
]
