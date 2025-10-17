"""Recognition event model."""
import enum
from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin


class RecognitionType(str, enum.Enum):
    """Recognition type enumeration."""
    FACE = "face"
    BODY = "body"


class RecognitionEvent(Base, UUIDMixin, TimestampMixin):
    """Recognition event model."""
    
    __tablename__ = "recognition_events"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id"), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True, index=True)
    rec_type = Column(String(20), nullable=False, index=True)  # face, body
    score = Column(Float, nullable=False, index=True)
    snapshot_url = Column(String(500), nullable=True)
    latency_ms = Column(Integer, nullable=True)
    payload = Column(JSONB, nullable=True)
    
    # Relationships
    organization = relationship("Organization")
    device = relationship("Device", back_populates="recognition_events")
    client = relationship("Client", back_populates="recognition_events")
