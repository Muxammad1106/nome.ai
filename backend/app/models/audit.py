"""Audit log model."""
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin


class AuditLog(Base, UUIDMixin, TimestampMixin):
    """Audit log model."""
    
    __tablename__ = "audit_logs"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    entity = Column(String(255), nullable=False, index=True)
    action = Column(String(100), nullable=False, index=True)
    diff = Column(JSONB, nullable=True)
    ip = Column(String(45), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="audit_logs")
    actor_user = relationship("User", back_populates="audit_logs")
