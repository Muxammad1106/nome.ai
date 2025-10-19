"""Utilities for matching incoming vectors against existing people."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Sequence

from django.db import connection
from pgvector.django import CosineDistance, L2Distance

from .models import Organization, Person


COSINE_ACCEPT_THRESHOLD = 0.30
COSINE_REVIEW_THRESHOLD = 0.38
L2_ACCEPT_THRESHOLD = 0.55
L2_REVIEW_THRESHOLD = 0.65


@dataclass
class MatchResult:
    person: Optional[Person]
    decision: str  # "accept", "review", or "create"
    cosine_distance: Optional[float]
    l2_distance: Optional[float]


def classify_match(cosine_distance: Optional[float], l2_distance: Optional[float]) -> str:
    """Classify a match as accept, review, or create based on thresholds."""
    cos = float(cosine_distance) if cosine_distance is not None else float("inf")
    l2 = float(l2_distance) if l2_distance is not None else float("inf")

    if cos <= COSINE_ACCEPT_THRESHOLD and l2 <= L2_ACCEPT_THRESHOLD:
        return "accept"

    if cos <= COSINE_REVIEW_THRESHOLD or l2 <= L2_REVIEW_THRESHOLD:
        return "review"

    return "create"


def find_best_person_match(
    *,
    organization: Organization,
    vector: Sequence[float],
    exclude_person_id: Optional[str] = None,
) -> MatchResult:
    """
    Find the closest person by cosine and L2 distances.

    Returns a MatchResult with decision "accept", "review", or "create".
    When the database backend does not support vector operations, returns
    a result with decision "create".
    """
    if connection.vendor != "postgresql":
        return MatchResult(person=None, decision="create", cosine_distance=None, l2_distance=None)

    queryset = Person.objects.filter(organization=organization, vector__isnull=False)
    if exclude_person_id:
        queryset = queryset.exclude(id=exclude_person_id)

    queryset = queryset.annotate(
        cosine_distance=CosineDistance("vector", vector),
        l2_distance=L2Distance("vector", vector),
    ).order_by("cosine_distance")

    candidate = queryset.first()
    if not candidate or candidate.cosine_distance is None:
        return MatchResult(person=None, decision="create", cosine_distance=None, l2_distance=None)

    cos = float(candidate.cosine_distance)
    l2 = float(candidate.l2_distance) if candidate.l2_distance is not None else None
    decision = classify_match(cos, l2)

    if decision == "create":
        person = None
    else:
        person = candidate

    return MatchResult(
        person=person,
        decision=decision,
        cosine_distance=cos,
        l2_distance=l2,
    )
