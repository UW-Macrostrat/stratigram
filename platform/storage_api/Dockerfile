FROM supabase/storage-api:v0.16.5

# We run all database migrations ourselves, so we need
# to disable the migrations system in the storage-api
# container.
# This removes all "single-tenant" migrations.
RUN rm -f migrations/tenant/*.sql
