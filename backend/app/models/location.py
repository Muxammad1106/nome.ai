"""Location model."""
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Location(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Location model."""
    
    __tablename__ = "locations"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(String(500), nullable=True)
    timezone = Column(String(50), nullable=False, default="UTC")
    
    # Relationships
    organization = relationship("Organization", back_populates="locations")
    devices = relationship("Device", back_populates="location")
    visits = relationship("Visit", back_populates="location")
    orders = relationship("Order", back_populates="location")
