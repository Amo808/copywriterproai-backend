const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Configure dotenv to load environment variables from a specific path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('production'),
    PORT: Joi.number().default(8080),
    MONGODB_URL: Joi.string().default('mongodb://localhost:27017/copywriterpro'),
    JWT_SECRET: Joi.string().default('fallback-jwt-secret-change-in-production'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
    JWT_EXTENSION_ACCESS_EXPIRATION_MONTHS: Joi.number().default(6),
    OPENAI_API_KEY: Joi.string().default(''),
    COPYSCAPE_USERNAME: Joi.string().default('demo'),
    COPYSCAPE_API_KEY: Joi.string().default('demo'),
    STRIPE_SECRET_KEY: Joi.string().default(''),
    STRIPE_WEBHOOK_SECRET_KEY: Joi.string().default(''),
    SMTP_HOST: Joi.string().default('localhost'),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USERNAME: Joi.string().default(''),
    SMTP_PASSWORD: Joi.string().default(''),
    EMAIL_FROM: Joi.string().default('noreply@copywriterpro.ai'),
    GOOGLE_OAUTH2_CLIENT_ID: Joi.string().default('demo'),
    GOOGLE_OAUTH2_SECRET_ID: Joi.string().default('demo'),
    FACEBOOK_APP_ID: Joi.string().default('demo'),
    FACEBOOK_APP_SECRET: Joi.string().default('demo'),
    PASSPORT_SECRET_JWT_KEY: Joi.string().default('fallback-passport-secret'),
    PASSPORT_AUTH_EXPIRES_TIME: Joi.string().default('1h'),
    WEB_CLIENT_URL: Joi.string().default('http://localhost:3000'),
    MAIL_VERIFY_TOKEN_SECRET: Joi.string().default('fallback-mail-verify-secret'),
    MAIL_VERIFY_TOKEN_EXPIRE: Joi.string().default('10m'),
    CORS_WHITELIST: Joi.string().default('*'),
    SENTRY_DNS_URL: Joi.string().default(''),
    TRIAL_DAYS: Joi.number().default(7),
    TRIAL_WORDS: Joi.number().default(700),
    TRIAL_PLAGIARISM_CHECKER_WORDS: Joi.number().default(0),
    PACKAGES: Joi.string().default('FREEMIUM,BASIC_1MONTH,BASIC_6MONTH'),
    INPUT_CHARACTER_RATE: Joi.string().default('1,1,1'),
    PLAGIARISM_CHECKER_ALLOWED_PACKAGES: Joi.string().default('FREEMIUM'),
    IGNORE_CONTENT_SAVING_EMAIL: Joi.string().allow('').default(''),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  console.warn(`Config validation warning: ${error.message}. Using default values.`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    extensionAccessExpirationMonths: envVars.JWT_EXTENSION_ACCESS_EXPIRATION_MONTHS,
  },
  passportConfig: {
    authSecretKey: envVars.PASSPORT_SECRET_JWT_KEY,
    authExpireTime: envVars.PASSPORT_AUTH_EXPIRES_TIME,
  },
  googleOauth2: {
    clientId: envVars.GOOGLE_OAUTH2_CLIENT_ID,
    secretId: envVars.GOOGLE_OAUTH2_SECRET_ID,
  },
  facebookOauth: {
    appId: envVars.FACEBOOK_APP_ID,
    appSecret: envVars.FACEBOOK_APP_SECRET,
  },
  openAI: {
    openAIAPIKey: envVars.OPENAI_API_KEY,
  },
  copyscape: {
    copyscapeUsername: envVars.COPYSCAPE_USERNAME,
    copyscapeAPIKey: envVars.COPYSCAPE_API_KEY,
  },
  stripe: {
    stripeSecretKey: envVars.STRIPE_SECRET_KEY,
    webHookSecretKey: envVars.STRIPE_WEBHOOK_SECRET_KEY,
  },
  verifyMail: {
    jwtSecret: envVars.MAIL_VERIFY_TOKEN_SECRET,
    jwtExpires: envVars.MAIL_VERIFY_TOKEN_EXPIRE,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  frontendUrl: {
    web: envVars.WEB_CLIENT_URL,
  },
  cors: {
    whitelist: envVars.CORS_WHITELIST.split(',').map(url => url.trim()),
  },
  sentry: {
    dns: envVars.SENTRY_DNS_URL,
  },
  trial: {
    days: envVars.TRIAL_DAYS,
    words: envVars.TRIAL_WORDS,
    plagiarismCheckerWords: envVars.TRIAL_PLAGIARISM_CHECKER_WORDS,
  },
  inputLimit: {
    packages: envVars.PACKAGES.split(',').map((pkg) => pkg.trim()),
    inputCharacterRate: envVars.INPUT_CHARACTER_RATE.split(',').map((rate) => parseInt(rate.trim(), 10)),
  },
  plagiarismChecker: {
    allowedPackages: envVars.PLAGIARISM_CHECKER_ALLOWED_PACKAGES.split(',').map((pkg) => pkg.trim()),
  },
  content: {
    ignoresavingdb: envVars.IGNORE_CONTENT_SAVING_EMAIL ? envVars.IGNORE_CONTENT_SAVING_EMAIL.split(',').map((email) => email.trim()) : [],
  },
};
