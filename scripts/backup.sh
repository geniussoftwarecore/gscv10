#!/bin/bash

# GSC Database Backup Script
# This script creates a backup of the PostgreSQL database

set -e

# Configuration
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${POSTGRES_DB:-gsc_production}
DB_USER=${POSTGRES_USER:-postgres}
BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/gsc_backup_${TIMESTAMP}.sql"

echo "Starting database backup..."
echo "Database: ${DB_NAME}"
echo "Host: ${DB_HOST}:${DB_PORT}"
echo "Backup file: ${BACKUP_FILE}"

# Create database backup
pg_dump \
    --host=${DB_HOST} \
    --port=${DB_PORT} \
    --username=${DB_USER} \
    --dbname=${DB_NAME} \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    --file=${BACKUP_FILE}

# Compress the backup
gzip ${BACKUP_FILE}
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

echo "Backup completed: ${BACKUP_FILE_GZ}"

# Calculate backup file size
BACKUP_SIZE=$(du -h ${BACKUP_FILE_GZ} | cut -f1)
echo "Backup size: ${BACKUP_SIZE}"

# Clean up old backups (older than RETENTION_DAYS)
if [ ${RETENTION_DAYS} -gt 0 ]; then
    echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find ${BACKUP_DIR} -name "gsc_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
    echo "Old backups cleaned up."
fi

echo "Backup process completed successfully!"

# Optional: Upload to S3 if configured
if [ ! -z "${S3_BACKUP_BUCKET}" ] && [ ! -z "${AWS_ACCESS_KEY_ID}" ]; then
    echo "Uploading backup to S3..."
    aws s3 cp ${BACKUP_FILE_GZ} s3://${S3_BACKUP_BUCKET}/database-backups/
    echo "Backup uploaded to S3: s3://${S3_BACKUP_BUCKET}/database-backups/$(basename ${BACKUP_FILE_GZ})"
fi