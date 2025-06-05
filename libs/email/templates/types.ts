/**
 * Comprehensive type definitions for email template system
 * Provides type safety and consistency across the ecommerce email infrastructure
 */

/**
 * Enum for standardized order statuses across the application
 * Ensures consistent status tracking throughout the order lifecycle
 */
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

/**
 * Enum for standardized payment statuses
 * Tracks payment processing states for accurate order management
 */
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  CANCELLED = "cancelled",
}

/**
 * Enum for supported payment methods
 * Expandable list of payment options for the ecommerce platform
 */
export enum PaymentMethod {
  CREDIT_CARD = "Credit Card",
  DEBIT_CARD = "Debit Card",
  MOBILE_MONEY = "Mobile Money",
  BANK_TRANSFER = "Bank Transfer",
  PAYPAL = "PayPal",
  STRIPE = "Stripe",
  CASH_ON_DELIVERY = "Cash on Delivery",
}

/**
 * Enum for shipping methods available to customers
 * Defines delivery options with clear naming for customer communication
 */
export enum ShippingMethod {
  STANDARD = "Standard Shipping",
  EXPRESS = "Express Shipping",
  OVERNIGHT = "Overnight Delivery",
  PICKUP = "Store Pickup",
  SAME_DAY = "Same Day Delivery",
}

/**
 * Supported currency codes following ISO 4217 standard
 * Enables international commerce with proper currency formatting
 */
export enum Currency {
  USD = "USD",
  GHS = "GHS", // Ghana Cedi
  EUR = "EUR",
  GBP = "GBP",
  NGN = "NGN", // Nigerian Naira
  ZAR = "ZAR", // South African Rand
}

/**
 * Template type for different email communications
 * Allows for easy extension of email template system
 */
export enum EmailTemplate {
  ORDER_CONFIRMATION = "order_confirmation",
  SHIPPING_NOTIFICATION = "shipping_notification",
  DELIVERY_CONFIRMATION = "delivery_confirmation",
  ORDER_CANCELLED = "order_cancelled",
  PAYMENT_FAILED = "payment_failed",
  REFUND_PROCESSED = "refund_processed",
}

/**
 * Email generation result interface
 * Standard structure for all email template outputs
 */
export interface EmailResult {
  subject: string; // Email subject line for the message
  body: string; // Complete HTML email body ready for sending
  textBody?: string; // Plain text version for accessibility and fallback
  metadata?: EmailMetadata; // Additional email processing information
}

/**
 * Email metadata for tracking and analytics
 * Helps with email delivery monitoring and customer engagement tracking
 */
export interface EmailMetadata {
  templateVersion: string; // Version of email template used for generation
  generatedAt: Date; // Timestamp when email was generated
  orderId: string; // Associated order ID for tracking
  customerId: string; // Customer ID for personalization tracking
  emailType: EmailTemplate; // Type of email for categorization
  priority: EmailPriority; // Email priority level for delivery queue
}

/**
 * Email priority levels for delivery queue management
 * Ensures critical emails are delivered with appropriate urgency
 */
export enum EmailPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

/**
 * Brand configuration for email customization
 * Allows for white-label and multi-brand email template usage
 */
export interface BrandConfig {
  brandName: string; // Brand name for email headers and signatures
  brandColor: string; // Primary brand color for email styling (hex code)
  logoUrl?: string; // Brand logo URL for email headers
  websiteUrl: string; // Brand website URL for email links
  supportEmail: string; // Customer support email address
  supportPhone: string; // Customer support phone number
  socialLinks?: SocialLinks; // Social media links for email footers
}

/**
 * Social media links for brand presence in emails
 * Helps build brand community and customer engagement
 */
export interface SocialLinks {
  facebook?: string; // Facebook page URL
  instagram?: string; // Instagram profile URL
  twitter?: string; // Twitter profile URL
  linkedin?: string; // LinkedIn company page URL
  youtube?: string; // YouTube channel URL
}

/**
 * Email delivery configuration interface
 * Handles email service provider settings and delivery options
 */
export interface EmailDeliveryConfig {
  provider: EmailProvider; // Email service provider selection
  fromEmail: string; // Sender email address for outgoing emails
  fromName: string; // Sender name displayed in email clients
  replyToEmail?: string; // Reply-to email address for customer responses
  bccEmail?: string; // BCC email for internal order tracking
  trackOpens: boolean; // Enable email open tracking for analytics
  trackClicks: boolean; // Enable link click tracking for engagement metrics
}

/**
 * Supported email service providers
 * Enables integration with various email delivery services
 */
export enum EmailProvider {
  SENDGRID = "sendgrid",
  MAILGUN = "mailgun",
  SES = "aws_ses",
  SMTP = "smtp",
  POSTMARK = "postmark",
}

/**
 * Localization settings for international email support
 * Enables multi-language email templates for global commerce
 */
export interface LocalizationConfig {
  language: string; // Language code (ISO 639-1)
  locale: string; // Locale code for formatting (e.g., en-US, fr-FR)
  currency: Currency; // Default currency for the locale
  dateFormat: string; // Date format preference for the locale
  timeFormat: string; // Time format preference (12hr/24hr)
  timezone: string; // Timezone for order timestamps
}

/**
 * Email validation result interface
 * Provides feedback on email template validation and testing
 */
export interface EmailValidationResult {
  isValid: boolean; // Overall validation status
  errors: string[]; // Array of validation error messages
  warnings: string[]; // Array of validation warning messages
  performance: EmailPerformanceMetrics; // Performance analysis of email template
}

/**
 * Email performance metrics for optimization
 * Helps analyze and improve email template effectiveness
 */
export interface EmailPerformanceMetrics {
  renderTime: number; // Time taken to generate email (milliseconds)
  htmlSize: number; // Size of HTML email in bytes
  textSize?: number; // Size of text email in bytes
  imageCount: number; // Number of images in email template
  linkCount: number; // Number of links in email template
  estimatedLoadTime: number; // Estimated email load time in email clients
}
