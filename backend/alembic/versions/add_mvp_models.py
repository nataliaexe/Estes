"""Add MVP models: Case, Evidence, Material, Hypothesis, Protocol

Revision ID: add_mvp_models
Revises:
Create Date: 2025-01-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'add_mvp_models'
down_revision: Union[str, None] = '482d8b609bc0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'cases',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('location', sa.String(length=500), nullable=False),
        sa.Column('problem_type', sa.String(length=200), nullable=False),
        sa.Column('summary', sa.String(length=2000), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('status', sa.String(length=50), server_default='draft', nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cases_problem_type'), 'cases', ['problem_type'], unique=False)
    op.create_index(op.f('ix_cases_status'), 'cases', ['status'], unique=False)

    op.create_table(
        'evidence',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('case_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_type', sa.String(length=100), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('authors', sa.String(length=500), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('doi', sa.String(length=120), nullable=True),
        sa.Column('excerpt', sa.Text(), nullable=True),
        sa.Column('url', sa.String(length=1000), nullable=True),
        sa.Column('evidence_level', sa.String(length=50), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('limitations', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evidence_case_id'), 'evidence', ['case_id'], unique=False)

    op.create_table(
        'materials',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('case_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=500), nullable=False),
        sa.Column('category', sa.String(length=200), nullable=False),
        sa.Column('region', sa.String(length=500), nullable=True),
        sa.Column('availability', sa.String(length=100), nullable=True),
        sa.Column('properties', postgresql.JSONB(), server_default='{}', nullable=False),
        sa.Column('relevance', sa.Text(), nullable=True),
        sa.Column('source', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_materials_case_id'), 'materials', ['case_id'], unique=False)

    op.create_table(
        'hypotheses',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('case_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('supporting_evidence_ids', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), server_default='{}', nullable=False),
        sa.Column('relevant_material_ids', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), server_default='{}', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='hypothesis', nullable=False),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('limitations', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hypotheses_case_id'), 'hypotheses', ['case_id'], unique=False)

    op.create_table(
        'protocols',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('case_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('steps', postgresql.JSONB(), server_default='[]', nullable=False),
        sa.Column('materials_needed', postgresql.ARRAY(sa.String()), server_default='{}', nullable=False),
        sa.Column('equipment_needed', postgresql.ARRAY(sa.String()), server_default='{}', nullable=False),
        sa.Column('objectives', sa.Text(), nullable=True),
        sa.Column('risks', sa.Text(), nullable=True),
        sa.Column('validation_plan', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_protocols_case_id'), 'protocols', ['case_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_protocols_case_id'), table_name='protocols')
    op.drop_table('protocols')
    op.drop_index(op.f('ix_hypotheses_case_id'), table_name='hypotheses')
    op.drop_table('hypotheses')
    op.drop_index(op.f('ix_materials_case_id'), table_name='materials')
    op.drop_table('materials')
    op.drop_index(op.f('ix_evidence_case_id'), table_name='evidence')
    op.drop_table('evidence')
    op.drop_index(op.f('ix_cases_status'), table_name='cases')
    op.drop_index(op.f('ix_cases_problem_type'), table_name='cases')
    op.drop_table('cases')
