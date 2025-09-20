# 🔑 Environment Setup Guide

## API Keys and Configuration

This project requires several API keys to be fully functional. The `.env` files have been created with development placeholders, but you'll need to replace them with actual values for production or full functionality.

### Required API Keys

#### 1. Google OAuth (Required for Google Sign-in)
```bash
GOOGLE_CLIENT_ID="your-actual-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`

#### 2. Database (Required for data persistence)
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/entrepreneur_shaadi_dev"
```

**Setup:**
1. Install PostgreSQL locally or use a cloud provider
2. Create a database named `entrepreneur_shaadi_dev`
3. Update the connection string with your credentials

#### 3. MCA Verification APIs (Optional - for business verification)

**Attestr API:**
```bash
ATTESTR_API_KEY="your-attestr-api-key"
```

**SurePass API:**
```bash
SUREPASS_API_KEY="your-surepass-api-key" 
```

**AuthBridge API:**
```bash
AUTHBRIDGE_API_KEY="your-authbridge-api-key"
```

#### 4. Redis (Optional - for caching and background jobs)
```bash
REDIS_URL="redis://localhost:6379"
BULL_REDIS_URL="redis://localhost:6379"
```

**Setup:**
1. Install Redis locally or use a cloud provider
2. Update connection strings if needed

### Security Configuration

Update these values for production:

```bash
JWT_SECRET="your-super-secure-jwt-secret-min-32-chars"
SESSION_SECRET="your-super-secure-session-secret-min-32-chars"
```

### Current Status

✅ **TypeScript compilation**: All errors resolved  
✅ **Build process**: Both API and web apps build successfully  
✅ **Environment files**: Created with development defaults  
🔄 **API keys**: Need to be configured for full functionality  

### Quick Start

1. **For development without external APIs:**
   - The current setup will work for basic functionality
   - Google OAuth will show errors but won't break the app
   - MCA verification features will be disabled

2. **For full functionality:**
   - Set up Google OAuth credentials
   - Configure PostgreSQL database
   - Optionally set up Redis and MCA API keys

3. **Start development servers:**
   ```bash
   npm run dev        # Starts both API and web servers
   # OR separately:
   npm run dev:api    # API server on :3001
   npm run dev:web    # Web server on :3000
   ```

### Next Steps

1. Configure Google OAuth for social login
2. Set up PostgreSQL database and run migrations
3. Test the authentication flow
4. Configure MCA APIs for business verification features