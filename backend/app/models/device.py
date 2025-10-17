"""Device model."""
import enum
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class DeviceKind(str, enum.Enum):
    """Device kind enumeration."""
    CAMERA = "camera"
    SENSOR = "sensor"
    TERMINAL = "terminal"
    OTHER = "other"


class Device(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Device model."""
    
    __tablename__ = "devices"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=True, index=True)
    kind = Column(Enum(DeviceKind), nullable=False, index=True)
    serial = Column(String(255), nullable=False, unique=True, index=True)
    firmware_version = Column(String(50), nullable=True)
    public_key = Column(String(255), nullable=False, unique=True, index=True)
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="devices")
    location = relationship("Location", back_populates="devices")
    recognition_events = relationship("RecognitionEvent", back_populates="device")
