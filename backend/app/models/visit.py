"""Visit model."""
import enum
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin


class VisitSource(str, enum.Enum):
    """Visit source enumeration."""
    RECOGNITION = "recognition"
    MANUAL = "manual"
    API = "api"
    OTHER = "other"


class Visit(Base, UUIDMixin, TimestampMixin):
    """Visit model."""
    
    __tablename__ = "visits"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False, index=True)
    arrived_at = Column(DateTime(timezone=True), nullable=False, index=True)
    left_at = Column(DateTime(timezone=True), nullable=True, index=True)
    source = Column(String(20), nullable=False, index=True)  # recognition, manual, api, other
    
    # Relationships
    organization = relationship("Organization")
    client = relationship("User", back_populates="visits")
    location = relationship("Location", back_populates="visits")
    orders = relationship("Order", back_populates="visit")
