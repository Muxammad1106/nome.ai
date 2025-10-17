"""Order models."""
import enum
from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin


class OrderStatus(str, enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class Order(Base, UUIDMixin, TimestampMixin):
    """Order model."""
    
    __tablename__ = "orders"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False, index=True)
    visit_id = Column(UUID(as_uuid=True), ForeignKey("visits.id"), nullable=True, index=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    status = Column(String(20), nullable=False, index=True)  # pending, confirmed, in_progress, completed, cancelled, refunded
    
    # Relationships
    organization = relationship("Organization")
    client = relationship("User", back_populates="orders")
    location = relationship("Location", back_populates="orders")
    visit = relationship("Visit", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base, UUIDMixin, TimestampMixin):
    """Order item model."""
    
    __tablename__ = "order_items"
    
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    qty = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    tags = Column(String(500), nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="items")
