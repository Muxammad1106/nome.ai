    """Organization model."""
import enum
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class OrganizationType(str, enum.Enum):
    """Organization type enumeration."""
    RESTAURANT = "restaurant"
    CAFE = "cafe"
    BARBERSHOP = "barbershop"
    SALON = "salon"
    OTHER = "other"


class Organization(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Organization model."""
    
    __tablename__ = "organizations"
    
    name = Column(String(255), nullable=False, index=True)
    type = Column(Enum(OrganizationType), nullable=False)
    secret_key = Column(String(255), nullable=False, unique=True, index=True)
    public_key = Column(String(255), nullable=False, unique=True, index=True)
    timezone = Column(String(50), nullable=False, default="UTC")
    
    # Relationships
    subscriptions = relationship("OrgSubscription", back_populates="organization")
    users = relationship("User", back_populates="organization")
    devices = relationship("Device", back_populates="organization")
    locations = relationship("Location", back_populates="organization")
    api_keys = relationship("ApiKey", back_populates="organization")
    audit_logs = relationship("AuditLog", back_populates="organization")
