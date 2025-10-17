"""API key model."""
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin


class ApiKey(Base, UUIDMixin, TimestampMixin):
    """API key model."""
    
    __tablename__ = "api_keys"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    public_key = Column(String(255), nullable=False, unique=True, index=True)
    secret_hash = Column(String(255), nullable=False)
    scope = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="api_keys")
