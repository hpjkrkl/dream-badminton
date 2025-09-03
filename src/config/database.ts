/**
 * Shared Database Configuration
 * 
 * This ensures all developers use the same database instance
 * for real-time data synchronization and collaboration.
 */

export const DATABASE_CONFIG = {
  // Shared PostgreSQL database - embedded for consistency
  url: 'postgres://9607f0c924b30f70cae243484f1c4e8013edee12dd36cdb836e4a54de80701bf:sk_LwltxLG8B3rjz1yPyJlMX@db.prisma.io:5432/postgres?sslmode=require',
  
  // Database info for reference
  provider: 'postgresql',
  platform: 'Prisma Cloud',
  environment: 'shared-development',
  
  // Connection settings
  ssl: true,
  connectionLimit: 10,
  
  // Development settings
  enableLogging: process.env.NODE_ENV === 'development',
  
} as const;

// Validation
if (typeof window !== 'undefined') {
  // Client-side validation
  console.log('🗃️  Database Config Loaded:', {
    provider: DATABASE_CONFIG.provider,
    platform: DATABASE_CONFIG.platform,
    environment: DATABASE_CONFIG.environment,
    ssl: DATABASE_CONFIG.ssl
  });
}

export default DATABASE_CONFIG;