"""Subscription models."""
from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class SubscriptionPlan(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Subscription plan model."""
    
    __tablename__ = "subscription_plans"
    
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    months = Column(Integer, nullable=False)
    max_users = Column(Integer, nullable=False)
    max_devices = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    
    # Relationships
    org_subscriptions = relationship("OrgSubscription", back_populates="plan")


class OrgSubscription(Base, UUIDMixin, TimestampMixin):
    """Organization subscription model."""
    
    __tablename__ = "org_subscriptions"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.id"), nullable=False, index=True)
    status = Column(String(20), nullable=False, index=True)  # active, paused, canceled, expired
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    auto_renew = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan", back_populates="org_subscriptions")
