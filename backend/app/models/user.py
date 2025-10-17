"""User models."""
import enum
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class UserKind(str, enum.Enum):
    """User kind enumeration."""
    EMPLOYEE = "employee"
    CLIENT = "client"


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Base user model."""
    
    __tablename__ = "users"
    
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    kind = Column(Enum(UserKind), nullable=False, index=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    employee = relationship("Employee", back_populates="user", uselist=False)
    client = relationship("Client", back_populates="user", uselist=False)
    user_roles = relationship("UserRole", back_populates="user")
    visits = relationship("Visit", back_populates="client")
    orders = relationship("Order", back_populates="client")
    audit_logs = relationship("AuditLog", back_populates="actor_user")


class Employee(Base, UUIDMixin, TimestampMixin):
    """Employee model."""
    
    __tablename__ = "employees"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    position = Column(String(255), nullable=True)
    meta = Column(JSONB, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="employee")


class Gender(str, enum.Enum):
    """Gender enumeration."""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class AgeCategory(str, enum.Enum):
    """Age category enumeration."""
    CHILD = "child"
    TEEN = "teen"
    ADULT = "adult"
    SENIOR = "senior"


class Client(Base, UUIDMixin, TimestampMixin):
    """Client model."""
    
    __tablename__ = "clients"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    external_id = Column(String(255), nullable=False, index=True)
    gender = Column(Enum(Gender), nullable=True)
    age_category = Column(Enum(AgeCategory), nullable=True)
    face_vector = Column(String, nullable=True)
    body_vector = Column(String, nullable=True)
    consent_given = Column(Boolean, default=False, nullable=False)
    consent_at = Column(String, nullable=True)
    vector_meta = Column(JSONB, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="client")
    visits = relationship("Visit", back_populates="client")
    orders = relationship("Order", back_populates="client")
    recognition_events = relationship("RecognitionEvent", back_populates="client")
