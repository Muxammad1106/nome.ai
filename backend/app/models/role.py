"""Role and permission models."""
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


# Association tables
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
)

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", UUID(as_uuid=True), ForeignKey("permissions.id"), primary_key=True),
)


class Role(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Role model."""
    
    __tablename__ = "roles"
    
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000), nullable=True)
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="user_roles")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")


class Permission(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """Permission model."""
    
    __tablename__ = "permissions"
    
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000), nullable=True)
    
    # Relationships
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")


class UserRole(Base, UUIDMixin, TimestampMixin):
    """User role association model."""
    
    __tablename__ = "user_role_associations"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="user_roles")
    role = relationship("Role")


class RolePermission(Base, UUIDMixin, TimestampMixin):
    """Role permission association model."""
    
    __tablename__ = "role_permission_associations"
    
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, index=True)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.id"), nullable=False, index=True)
    
    # Relationships
    role = relationship("Role")
    permission = relationship("Permission")
