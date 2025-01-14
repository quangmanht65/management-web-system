"""migration

Revision ID: bdb8133d6eaa
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision: str = 'bdb8133d6eaa'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Add columns with default values
    op.add_column('positions', sa.Column('description', sa.String(255), nullable=True))
    op.add_column('positions', sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False))
    op.add_column('positions', sa.Column('updated_at', sa.DateTime(), nullable=True))

def downgrade() -> None:
    # Remove columns
    op.drop_column('positions', 'description')
    op.drop_column('positions', 'created_at')
    op.drop_column('positions', 'updated_at') 