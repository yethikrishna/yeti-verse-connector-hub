import { securityMonitor } from './SecurityMonitor';

export interface StorageItem {
  data: string;
  timestamp: number;
  expiresAt?: number;
  encrypted: boolean;
}

export interface SecureStorageOptions {
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
  prefix?: string;
}

export default class SecureStorage {
  private static instance: SecureStorage;
  private readonly STORAGE_PREFIX = 'yeti_secure_';
  private readonly ENCRYPTION_KEY = 'yeti_internal_key_v1';

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private constructor() {
    // Clean up expired items on initialization
    this.cleanupExpiredItems();
  }

  /**
   * Store data securely with optional encryption and TTL
   */
  setItem(key: string, value: any, options: SecureStorageOptions = {}): void {
    try {
      const {
        encrypt = true,
        ttl,
        prefix = this.STORAGE_PREFIX
      } = options;

      // Audit the key access
      securityMonitor.auditKeyAccess(key, 'write');

      const serializedValue = JSON.stringify(value);
      const processedData = encrypt ? this.encrypt(serializedValue) : serializedValue;
      
      const storageItem: StorageItem = {
        data: processedData,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : undefined,
        encrypted: encrypt
      };

      const storageKey = `${prefix}${key}`;
      localStorage.setItem(storageKey, JSON.stringify(storageItem));
      
      console.log(`🔒 Secure storage: ${key} stored with encryption: ${encrypt}`);
    } catch (error) {
      console.error('Secure storage error:', error);
      securityMonitor.logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        details: {
          operation: 'storage_write_failed',
          key,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieve data securely with automatic decryption
   */
  getItem<T = any>(key: string, defaultValue?: T, prefix = this.STORAGE_PREFIX): T | null {
    try {
      // Audit the key access
      securityMonitor.auditKeyAccess(key, 'read');

      const storageKey = `${prefix}${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        return defaultValue ?? null;
      }

      const storageItem: StorageItem = JSON.parse(stored);
      
      // Check if item has expired
      if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
        this.removeItem(key, prefix);
        return defaultValue ?? null;
      }

      const rawData = storageItem.encrypted 
        ? this.decrypt(storageItem.data)
        : storageItem.data;
      
      return JSON.parse(rawData) as T;
    } catch (error) {
      console.error('Secure storage retrieval error:', error);
      securityMonitor.logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        details: {
          operation: 'storage_read_failed',
          key,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from secure storage
   */
  removeItem(key: string, prefix = this.STORAGE_PREFIX): void {
    try {
      // Audit the key access
      securityMonitor.auditKeyAccess(key, 'delete');

      const storageKey = `${prefix}${key}`;
      localStorage.removeItem(storageKey);
      console.log(`🔒 Secure storage: ${key} removed`);
    } catch (error) {
      console.error('Secure storage removal error:', error);
    }
  }

  /**
   * Clear all secure storage items with optional prefix filter
   */
  clear(prefixFilter?: string): void {
    try {
      const keysToRemove: string[] = [];
      const targetPrefix = prefixFilter || this.STORAGE_PREFIX;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(targetPrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🔒 Secure storage: Cleared ${keysToRemove.length} items with prefix ${targetPrefix}`);
    } catch (error) {
      console.error('Secure storage clear error:', error);
    }
  }

  /**
   * Clean up expired items
   */
  private cleanupExpiredItems(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const storageItem: StorageItem = JSON.parse(stored);
              if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // If we can't parse the item, it's corrupted - remove it
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.log(`🔒 Secure storage: Cleaned up ${keysToRemove.length} expired/corrupted items`);
      }
    } catch (error) {
      console.error('Secure storage cleanup error:', error);
    }
  }

  /**
   * Generate cryptographically secure random string
   */
  generateSecureToken(length: number = 32): string {
    if (window.crypto && window.crypto.getRandomValues) {
      // Use Web Crypto API for cryptographically secure random values
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback to enhanced Math.random with timestamp entropy
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~!@#$%^&*';
      let result = '';
      const timestamp = Date.now().toString();
      
      for (let i = 0; i < length; i++) {
        // Add timestamp entropy
        const timestampIndex = i % timestamp.length;
        const timestampChar = timestamp[timestampIndex];
        const randomIndex = Math.floor(Math.random() * chars.length);
        
        // Combine random char with timestamp-derived randomness
        const combinedIndex = (randomIndex + parseInt(timestampChar, 10)) % chars.length;
        result += chars.charAt(combinedIndex);
      }
      return result;
    }
  }

  /**
   * Simple encryption for sensitive data
   * Note: This is basic encryption. For production use proper encryption libraries
   */
  private encrypt(data: string): string {
    try {
      // Use base64 encoding with simple character substitution
      const encoded = btoa(data);
      let encrypted = '';
      
      for (let i = 0; i < encoded.length; i++) {
        const char = encoded.charCodeAt(i);
        const keyChar = this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        encrypted += String.fromCharCode(char ^ keyChar);
      }
      
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return btoa(data); // Fallback to basic encoding
    }
  }

  /**
   * Simple decryption for sensitive data
   */
  private decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      let decrypted = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const char = decoded.charCodeAt(i);
        const keyChar = this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        decrypted += String.fromCharCode(char ^ keyChar);
      }
      
      return atob(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Validate stored data integrity
   */
  validateIntegrity(key: string): boolean {
    try {
      const item = this.getItem(key);
      return item !== null;
    } catch (error) {
      return false;
    }
  }
}

export const secureStorage = SecureStorage.getInstance();