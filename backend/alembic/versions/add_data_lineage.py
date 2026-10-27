"""Add data lineage tracking

Revision ID: add_data_lineage
Revises: add_mvp_models
Create Date: 2025-01-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'add_data_lineage'
down_revision: Union[str, None] = 'add_mvp_models'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'data_lineage',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('case_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_type', sa.String(length=100), nullable=False),
        sa.Column('source_id', sa.String(length=500), nullable=True),
        sa.Column('source_url', sa.String(length=1000), nullable=True),
        sa.Column('source_metadata', postgresql.JSONB(), server_default='{}', nullable=False),
        sa.Column('processing_steps', postgresql.JSONB(), server_default='[]', nullable=False),
        sa.Column('ai_provider', sa.String(length=100), nullable=True),
        sa.Column('ai_model', sa.String(length=100), nullable=True),
        sa.Column('ai_confidence', sa.Float(), nullable=True),
        sa.Column('ai_extraction_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('human_validated', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('human_validator_id', sa.String(length=500), nullable=True),
        sa.Column('human_validation_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('human_notes', sa.Text(), nullable=True),
        sa.Column('extracted_text', sa.Text(), nullable=True),
        sa.Column('original_excerpt', sa.Text(), nullable=True),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('quality_score', sa.Float(), nullable=True),
        sa.Column('has_literal_quote', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('quote_location', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_data_lineage_case_id'), 'data_lineage', ['case_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_data_lineage_case_id'), table_name='data_lineage')
    op.drop_table('data_lineage')
