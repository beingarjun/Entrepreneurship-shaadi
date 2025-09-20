import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { 
  encryptionConfig, 
  passwordPolicy, 
  DataClassification,
  auditConfig,
  accessControlConfig 
} from './config';

/**
 * ISO 27001/27002 Compliant Security Service
 * 
 * Implements comprehensive security controls for:
 * - Data encryption and key management
 * - Access control and authentication
 * - Audit logging and monitoring
 * - Input validation and sanitization
 * - Privacy and data protection
 */

export interface SecurityContext {
  userId: string;
  role: string;
  permissions: string[];
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  classification: DataClassification;
}

export interface AuditEvent {
  eventId: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'WARNING';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, any>;
  classification: DataClassification;
  ipAddress: string;
  userAgent: string;
}

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  tag: string;
  algorithm: string;
  keyVersion: string;
}

class SecurityService {
  private currentKeyVersion: string;
  private encryptionKeys: Map<string, Buffer>;
  private auditLogger: AuditEvent[];

  constructor() {
    this.currentKeyVersion = 'v1';
    this.encryptionKeys = new Map();
    this.auditLogger = [];
    this.initializeEncryptionKeys();
  }

  /**
   * Initialize encryption keys for data protection
   * ISO 27002 A.10.1.1 - Key Management
   */
  private initializeEncryptionKeys(): void {
    try {
      // Generate master key from environment or create new one
      const masterKeyHex = process.env.MASTER_ENCRYPTION_KEY || this.generateMasterKey();
      const masterKey = Buffer.from(masterKeyHex, 'hex');
      
      // Derive specific keys for different data types
      this.encryptionKeys.set(this.currentKeyVersion, masterKey);
      
      console.log('[SecurityService] Encryption keys initialized');
    } catch (error) {
      console.error('[SecurityService] Failed to initialize encryption keys:', error);
      throw new Error('Security initialization failed');
    }
  }

  /**
   * Generate a new master encryption key
   */
  private generateMasterKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   * ISO 27002 A.10.1.1 - Cryptographic Controls
   */
  encryptData(data: string, classification: DataClassification = DataClassification.CONFIDENTIAL): EncryptedData {
    try {
      const key = this.encryptionKeys.get(this.currentKeyVersion);
      if (!key) {
        throw new Error('Encryption key not available');
      }

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(encryptionConfig.dataAtRest.algorithm, key) as crypto.CipherGCM;
      cipher.setAAD(Buffer.from(classification));

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      const result: EncryptedData = {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: encryptionConfig.dataAtRest.algorithm,
        keyVersion: this.currentKeyVersion
      };

      // Audit encryption event
      this.auditEvent({
        action: 'DATA_ENCRYPTION',
        resource: 'sensitive_data',
        outcome: 'SUCCESS',
        riskLevel: 'LOW',
        details: { classification, algorithm: encryptionConfig.dataAtRest.algorithm },
        classification
      });

      return result;
    } catch (error) {
      this.auditEvent({
        action: 'DATA_ENCRYPTION',
        resource: 'sensitive_data',
        outcome: 'FAILURE',
        riskLevel: 'HIGH',
        details: { error: (error as Error).message, classification },
        classification
      });
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: EncryptedData, classification: DataClassification = DataClassification.CONFIDENTIAL): string {
    try {
      const key = this.encryptionKeys.get(encryptedData.keyVersion);
      if (!key) {
        throw new Error('Decryption key not available');
      }

      const decipher = crypto.createDecipher(encryptedData.algorithm, key) as crypto.DecipherGCM;
      decipher.setAAD(Buffer.from(classification));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Audit decryption event
      this.auditEvent({
        action: 'DATA_DECRYPTION',
        resource: 'sensitive_data',
        outcome: 'SUCCESS',
        riskLevel: 'MEDIUM',
        details: { classification, algorithm: encryptedData.algorithm },
        classification
      });

      return decrypted;
    } catch (error) {
      this.auditEvent({
        action: 'DATA_DECRYPTION',
        resource: 'sensitive_data',
        outcome: 'FAILURE',
        riskLevel: 'HIGH',
        details: { error: (error as Error).message, classification },
        classification
      });
      throw new Error('Decryption failed');
    }
  }

  /**
   * Hash passwords using bcrypt with salt
   * ISO 27002 A.9.4.3 - Password Management System
   */
  async hashPassword(password: string): Promise<string> {
    try {
      // Validate password complexity
      const validation = this.validatePasswordComplexity(password);
      if (!validation.isValid) {
        throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
      }

      const saltRounds = encryptionConfig.bcrypt.rounds;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      this.auditEvent({
        action: 'PASSWORD_HASH',
        resource: 'user_credential',
        outcome: 'SUCCESS',
        riskLevel: 'LOW',
        details: { saltRounds },
        classification: DataClassification.RESTRICTED
      });

      return hashedPassword;
    } catch (error) {
      this.auditEvent({
        action: 'PASSWORD_HASH',
        resource: 'user_credential',
        outcome: 'FAILURE',
        riskLevel: 'HIGH',
        details: { error: (error as Error).message },
        classification: DataClassification.RESTRICTED
      });
      throw error;
    }
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      
      this.auditEvent({
        action: 'PASSWORD_VERIFICATION',
        resource: 'user_credential',
        outcome: isValid ? 'SUCCESS' : 'FAILURE',
        riskLevel: isValid ? 'LOW' : 'MEDIUM',
        details: { verified: isValid },
        classification: DataClassification.RESTRICTED
      });

      return isValid;
    } catch (error) {
      this.auditEvent({
        action: 'PASSWORD_VERIFICATION',
        resource: 'user_credential',
        outcome: 'FAILURE',
        riskLevel: 'HIGH',
        details: { error: (error as Error).message },
        classification: DataClassification.RESTRICTED
      });
      return false;
    }
  }

  /**
   * Validate password complexity according to policy
   * ISO 27002 A.9.4.3 - Password Management System
   */
  validatePasswordComplexity(password: string): { isValid: boolean; errors: string[]; score: number } {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < passwordPolicy.minLength) {
      errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
    } else if (password.length >= passwordPolicy.minLength) {
      score += 1;
    }

    if (password.length > passwordPolicy.maxLength) {
      errors.push(`Password must not exceed ${passwordPolicy.maxLength} characters`);
    }

    // Character type checks
    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (passwordPolicy.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (passwordPolicy.requireSpecialChars && !new RegExp(`[${passwordPolicy.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      errors.push('Password must contain at least one special character');
    } else if (new RegExp(`[${passwordPolicy.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      score += 1;
    }

    // Additional complexity scoring
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 1; // Good character diversity

    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters

    // Check against common patterns
    if (!/^(.+)\1+$/.test(password)) score += 1; // Not just repeated patterns

    const isValid = errors.length === 0 && score >= passwordPolicy.complexityScore;

    return { isValid, errors, score };
  }

  /**
   * Generate secure JWT token
   * ISO 27002 A.9.4.2 - Secure Log-on Procedures
   */
  generateJWTToken(payload: any, expiresIn?: string): string {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      const token = jwt.sign(
        {
          ...payload,
          iss: encryptionConfig.jwt.issuer,
          aud: encryptionConfig.jwt.audience,
          iat: Math.floor(Date.now() / 1000)
        },
        secret
      );

      this.auditEvent({
        action: 'JWT_TOKEN_GENERATION',
        resource: 'authentication_token',
        outcome: 'SUCCESS',
        riskLevel: 'LOW',
        details: { userId: payload.userId, expiresIn },
        classification: DataClassification.CONFIDENTIAL
      });

      return token;
    } catch (error) {
      this.auditEvent({
        action: 'JWT_TOKEN_GENERATION',
        resource: 'authentication_token',
        outcome: 'FAILURE',
        riskLevel: 'HIGH',
        details: { error: (error as Error).message },
        classification: DataClassification.CONFIDENTIAL
      });
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify JWT token
   */
  verifyJWTToken(token: string): any {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT secret not configured');
      }

      const decoded = jwt.verify(token, secret, {
        issuer: encryptionConfig.jwt.issuer,
        audience: encryptionConfig.jwt.audience
      });

      this.auditEvent({
        action: 'JWT_TOKEN_VERIFICATION',
        resource: 'authentication_token',
        outcome: 'SUCCESS',
        riskLevel: 'LOW',
        details: { tokenValid: true },
        classification: DataClassification.CONFIDENTIAL
      });

      return decoded;
    } catch (error) {
      this.auditEvent({
        action: 'JWT_TOKEN_VERIFICATION', 
        resource: 'authentication_token',
        outcome: 'FAILURE',
        riskLevel: 'MEDIUM',
        details: { error: (error as Error).message },
        classification: DataClassification.CONFIDENTIAL
      });
      throw new Error('Token verification failed');
    }
  }

  /**
   * Sanitize input to prevent injection attacks
   * OWASP Top 10 - Injection Prevention
   */
  sanitizeInput(input: string, allowHtml: boolean = false): string {
    if (typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Remove null bytes
    sanitized = sanitized.replace(/\x00/g, '');

    // Basic XSS prevention
    if (!allowHtml) {
      sanitized = sanitized
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    // SQL injection prevention (basic)
    sanitized = sanitized.replace(/[';-]/g, '');

    // Command injection prevention
    sanitized = sanitized.replace(/[|&;$`'"\\<>]/g, '');

    // Normalize unicode
    sanitized = sanitized.normalize('NFC');

    return sanitized.trim();
  }

  /**
   * Check user permissions
   * ISO 27002 A.9.1.2 - Access to Networks and Network Services
   */
  hasPermission(userRole: string, requiredPermission: string): boolean {
    const role = accessControlConfig.roles[userRole as keyof typeof accessControlConfig.roles];
    if (!role) {
      return false;
    }

    // Admin has all permissions
    if (role.permissions.includes('*')) {
      return true;
    }

    // Check specific permission
    return role.permissions.includes(requiredPermission);
  }

  /**
   * Create audit log entry
   * ISO 27002 A.12.4.1 - Event Logging
   */
  auditEvent(eventData: Partial<AuditEvent>, context?: SecurityContext): void {
    if (!auditConfig.enabled) {
      return;
    }

    const event: AuditEvent = {
      eventId: crypto.randomUUID(),
      timestamp: new Date(),
      userId: context?.userId || 'system',
      action: eventData.action || 'UNKNOWN_ACTION',
      resource: eventData.resource || 'unknown',
      outcome: eventData.outcome || 'SUCCESS',
      riskLevel: eventData.riskLevel || 'LOW',
      details: eventData.details || {},
      classification: eventData.classification || DataClassification.INTERNAL,
      ipAddress: context?.ipAddress || 'unknown',
      userAgent: context?.userAgent || 'unknown'
    };

    // Mask sensitive data based on configuration
    if (auditConfig.sensitive.maskPII) {
      event.details = this.maskSensitiveData(event.details);
    }

    this.auditLogger.push(event);

    // In production, this would be sent to a secure logging service
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT]', JSON.stringify(event, null, 2));
    }

    // Alert on high-risk events
    if (event.riskLevel === 'HIGH' || event.riskLevel === 'CRITICAL') {
      this.triggerSecurityAlert(event);
    }
  }

  /**
   * Mask sensitive data in logs
   */
  private maskSensitiveData(data: any): any {
    const sensitiveFields = ['password', 'ssn', 'pan', 'creditCard', 'bankAccount', 'email'];
    const masked = { ...data };

    for (const field of sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***MASKED***';
      }
    }

    return masked;
  }

  /**
   * Trigger security alert for high-risk events
   */
  private triggerSecurityAlert(event: AuditEvent): void {
    console.warn('[SECURITY ALERT]', {
      eventId: event.eventId,
      action: event.action,
      riskLevel: event.riskLevel,
      timestamp: event.timestamp,
      userId: event.userId
    });

    // In production, this would integrate with monitoring systems
    // like PagerDuty, Slack, SMS alerts, etc.
  }

  /**
   * Generate security report
   * ISO 27002 A.12.6.1 - Management of Technical Vulnerabilities
   */
  generateSecurityReport(): any {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentEvents = this.auditLogger.filter(event => event.timestamp >= last24Hours);
    
    const report = {
      generatedAt: now.toISOString(),
      timeframe: '24 hours',
      summary: {
        totalEvents: recentEvents.length,
        successfulEvents: recentEvents.filter(e => e.outcome === 'SUCCESS').length,
        failedEvents: recentEvents.filter(e => e.outcome === 'FAILURE').length,
        warningEvents: recentEvents.filter(e => e.outcome === 'WARNING').length
      },
      riskDistribution: {
        low: recentEvents.filter(e => e.riskLevel === 'LOW').length,
        medium: recentEvents.filter(e => e.riskLevel === 'MEDIUM').length,
        high: recentEvents.filter(e => e.riskLevel === 'HIGH').length,
        critical: recentEvents.filter(e => e.riskLevel === 'CRITICAL').length
      },
      topActions: this.getTopActions(recentEvents),
      securityRecommendations: this.generateSecurityRecommendations(recentEvents)
    };

    return report;
  }

  private getTopActions(events: AuditEvent[]): Array<{ action: string; count: number }> {
    const actionCounts = events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));
  }

  private generateSecurityRecommendations(events: AuditEvent[]): string[] {
    const recommendations: string[] = [];
    
    const highRiskEvents = events.filter(e => e.riskLevel === 'HIGH' || e.riskLevel === 'CRITICAL');
    if (highRiskEvents.length > 5) {
      recommendations.push('High number of high-risk events detected. Review security policies.');
    }

    const failedLogins = events.filter(e => e.action === 'PASSWORD_VERIFICATION' && e.outcome === 'FAILURE');
    if (failedLogins.length > 10) {
      recommendations.push('Multiple failed login attempts detected. Consider implementing additional authentication measures.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Security posture appears normal. Continue monitoring.');
    }

    return recommendations;
  }
}

export default SecurityService;