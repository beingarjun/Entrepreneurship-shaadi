/**
 * ISO 27001/27002 Compliant Security Configuration
 * 
 * This file contains security configurations that comply with:
 * - ISO/IEC 27001:2013 - Information Security Management Systems
 * - ISO/IEC 27002:2013 - Code of Practice for Information Security Controls
 * - OWASP Top 10 Web Application Security Risks
 * - GDPR Data Protection Requirements
 */

// Security Headers Configuration (ISO 27002 A.13.2.1)
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.equifax.com https://api-sandbox.equifax.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Feature Policy / Permissions Policy
  'Permissions-Policy': [
    'camera=(),',
    'microphone=(),',
    'geolocation=(),',
    'payment=(),',
    'usb=(),',
    'magnetometer=(),',
    'gyroscope=(),',
    'accelerometer=()'
  ].join(' ')
};

// Rate Limiting Configuration (ISO 27002 A.13.1.1)
export const rateLimitConfig = {
  // General API rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Authentication endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true
  },
  
  // Password reset (very strict)
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Only 3 password reset attempts per hour
    message: 'Too many password reset attempts, please try again later.'
  },
  
  // Profile verification
  verification: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 verification attempts per hour
    message: 'Too many verification attempts, please try again later.'
  }
};

// Session Security Configuration (ISO 27002 A.9.4.2)
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  name: 'sessionId', // Don't use default 'connect.sid'
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiration on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS access to cookies
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const // CSRF protection
  }
};

// Password Policy Configuration (ISO 27002 A.9.4.3)
export const passwordPolicy = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  maxAttempts: 5, // Account lockout after 5 failed attempts
  lockoutDuration: 30 * 60 * 1000, // 30 minutes lockout
  passwordHistory: 12, // Remember last 12 passwords
  maxAge: 90 * 24 * 60 * 60 * 1000, // Force change after 90 days
  complexityScore: 4 // Minimum complexity score required
};

// Data Classification Levels (ISO 27002 A.8.2.1)
export enum DataClassification {
  PUBLIC = 'PUBLIC',           // No restrictions
  INTERNAL = 'INTERNAL',       // Internal use only
  CONFIDENTIAL = 'CONFIDENTIAL', // Sensitive business data
  RESTRICTED = 'RESTRICTED'    // Highly sensitive data (PII, financial)
}

// Encryption Configuration (ISO 27002 A.10.1.1)
export const encryptionConfig = {
  // AES-256 for data at rest
  dataAtRest: {
    algorithm: 'aes-256-gcm',
    keyRotationInterval: 90 * 24 * 60 * 60 * 1000, // 90 days
    tagLength: 16
  },
  
  // TLS 1.3 for data in transit
  dataInTransit: {
    minVersion: 'TLSv1.3',
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256'
    ]
  },
  
  // JWT token configuration
  jwt: {
    algorithm: 'HS256' as const,
    expiresIn: '24h',
    issuer: 'entrepreneur-shaadi',
    audience: 'entrepreneur-shaadi-users'
  },
  
  // Password hashing
  bcrypt: {
    rounds: 12 // Minimum 12 rounds for bcrypt
  }
};

// Audit Log Configuration (ISO 27002 A.12.4.1)
export const auditConfig = {
  enabled: true,
  levels: ['error', 'warn', 'info', 'debug'],
  retention: {
    days: 2555, // 7 years for compliance
    maxSize: '100gb'
  },
  events: {
    authentication: true,
    authorization: true,
    dataAccess: true,
    dataModification: true,
    systemAccess: true,
    configChanges: true,
    errors: true
  },
  sensitive: {
    maskPII: true,
    maskFinancial: true,
    maskPasswords: true
  }
};

// Access Control Configuration (ISO 27002 A.9.1.1)
export const accessControlConfig = {
  // Role-based access control
  roles: {
    ADMIN: {
      permissions: ['*'], // Full access
      level: 5
    },
    MODERATOR: {
      permissions: [
        'profiles:read',
        'profiles:moderate',
        'reports:read',
        'users:suspend'
      ],
      level: 4
    },
    PREMIUM_USER: {
      permissions: [
        'profiles:read',
        'profiles:contact',
        'matches:advanced',
        'verification:priority'
      ],
      level: 3
    },
    VERIFIED_USER: {
      permissions: [
        'profiles:read',
        'profiles:contact:limited',
        'matches:basic'
      ],
      level: 2
    },
    BASIC_USER: {
      permissions: [
        'profiles:read:limited',
        'matches:basic:limited'
      ],
      level: 1
    }
  },
  
  // Multi-factor authentication requirements
  mfaRequired: {
    ADMIN: true,
    MODERATOR: true,
    PREMIUM_USER: false,
    VERIFIED_USER: false,
    BASIC_USER: false
  },
  
  // Session management
  maxConcurrentSessions: 3,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  absoluteTimeout: 8 * 60 * 60 * 1000 // 8 hours max
};

// Data Protection Configuration (GDPR Compliance)
export const dataProtectionConfig = {
  // Data retention policies
  retention: {
    activeProfiles: 3 * 365 * 24 * 60 * 60 * 1000, // 3 years
    inactiveProfiles: 1 * 365 * 24 * 60 * 60 * 1000, // 1 year
    auditLogs: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    verificationData: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    communicationLogs: 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
  },
  
  // Anonymization settings
  anonymization: {
    enabled: true,
    scheduleInterval: 24 * 60 * 60 * 1000, // Daily
    methods: ['masking', 'generalization', 'pseudonymization']
  },
  
  // Right to be forgotten
  dataErasure: {
    immediateErasure: ['passwords', 'tokens', 'sessions'],
    scheduledErasure: ['profiles', 'communications', 'logs'],
    retainForCompliance: ['financial_records', 'verification_audit']
  }
};

// API Security Configuration
export const apiSecurityConfig = {
  // Input validation
  validation: {
    maxRequestSize: '10mb',
    maxJsonSize: '1mb',
    maxUrlLength: 2048,
    parameterPollution: false,
    strictMode: true
  },
  
  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
  },
  
  // Request sanitization
  sanitization: {
    removeHTML: true,
    removeSQLInjection: true,
    removeXSS: true,
    normalizeUnicode: true
  }
};

// Monitoring and Alerting Configuration (ISO 27002 A.12.6.1)
export const monitoringConfig = {
  realTimeAlerts: {
    enabled: true,
    channels: ['email', 'sms', 'webhook'],
    thresholds: {
      failedLogins: 5,
      dataExfiltration: 1,
      suspiciousActivity: 3,
      systemErrors: 10
    }
  },
  
  // Security metrics to track
  metrics: [
    'authentication_failures',
    'authorization_violations', 
    'data_access_patterns',
    'api_abuse_attempts',
    'privilege_escalations',
    'data_export_requests'
  ],
  
  // Incident response
  incidentResponse: {
    autoBlock: true,
    escalationLevels: 3,
    responseTime: 15 * 60 * 1000, // 15 minutes
    forensicsRetention: 90 * 24 * 60 * 60 * 1000 // 90 days
  }
};

// Backup and Recovery Configuration (ISO 27002 A.12.3.1)
export const backupConfig = {
  frequency: {
    database: '4h', // Every 4 hours
    files: '24h', // Daily
    configurations: '1h' // Hourly
  },
  
  retention: {
    daily: 30, // 30 daily backups
    weekly: 12, // 12 weekly backups
    monthly: 12, // 12 monthly backups
    yearly: 7 // 7 yearly backups
  },
  
  encryption: true,
  offsite: true,
  testing: {
    frequency: 'monthly',
    rtoTarget: 4 * 60 * 60 * 1000, // 4 hours RTO
    rpoTarget: 1 * 60 * 60 * 1000 // 1 hour RPO
  }
};

export default {
  securityHeaders,
  rateLimitConfig,
  sessionConfig,
  passwordPolicy,
  encryptionConfig,
  auditConfig,
  accessControlConfig,
  dataProtectionConfig,
  apiSecurityConfig,
  monitoringConfig,
  backupConfig,
  DataClassification
};