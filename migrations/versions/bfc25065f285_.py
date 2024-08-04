"""empty message

Revision ID: bfc25065f285
Revises: 70b8e0866e39
Create Date: 2024-08-04 22:06:40.349357

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bfc25065f285'
down_revision = '70b8e0866e39'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('categoria', schema=None) as batch_op:
        batch_op.add_column(sa.Column('imagen', sa.String(length=400), nullable=True))

    with op.batch_alter_table('plato', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorito', sa.Boolean(), nullable=False))
        batch_op.add_column(sa.Column('imagen', sa.String(length=400), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('plato', schema=None) as batch_op:
        batch_op.drop_column('imagen')
        batch_op.drop_column('favorito')

    with op.batch_alter_table('categoria', schema=None) as batch_op:
        batch_op.drop_column('imagen')

    # ### end Alembic commands ###
