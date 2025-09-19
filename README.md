# Entrepreneur Shaadi

A founder verification and matching platform that verifies founders via MCA (Ministry of Corporate Affairs) data and builds rich, trustable profiles.

## 🎯 Overview

Entrepreneur Shaadi connects verified founders and entrepreneurs by leveraging official MCA data to build trust and enable meaningful professional relationships. The platform verifies Directors via DIN (Director Identification Number) and Companies via CIN (Corporate Identification Number) to create trustable profiles with verified credentials.

## 🚀 Features

- **MCA Verification**: Verify founders using official DIN and CIN data
- **Trust Badges**: Display verification status and credibility indicators
- **Rich Profiles**: Comprehensive founder profiles with company history
- **Smart Matching**: AI-powered matching based on industry, experience, and goals
- **Persona Generation**: Automated persona creation from MCA data
- **Discovery**: Filter and browse verified founders
- **Compliance**: DPDP Act 2023 compliant data handling

## 🏗️ Architecture

### Backend (`apps/api`)
- **Framework**: Node.js + TypeScript + Express
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with Argon2id password hashing
- **MCA Integration**: Abstracted provider pattern (Attestr/SurePass/AuthBridge)
- **Features**: Director/Company verification, persona generation, matching algorithm

### Frontend (`apps/web`)
- **Framework**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **Features**: Authentication, onboarding, profile management, discovery

### Shared (`packages/`)
- **Types**: Shared TypeScript definitions
- **Utils**: Common utilities and helpers

## 📁 Project Structure

```
entrepreneur-shaadi/
├── apps/
│   ├── api/                 # Backend API server
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/    # Authentication & authorization
│   │   │   │   ├── mca/     # MCA data integration
│   │   │   │   ├── profile/ # User profile management
│   │   │   │   ├── persona/ # Persona generation
│   │   │   │   └── match/   # Matching algorithm
│   │   │   ├── middleware/  # Express middleware
│   │   │   ├── utils/       # Utilities
│   │   │   └── types/       # Type definitions
│   │   └── package.json
│   └── web/                 # Frontend Next.js app
│       ├── pages/
│       │   ├── auth/        # Login/signup pages
│       │   ├── onboarding/  # User onboarding flow
│       │   ├── profile/     # Profile management
│       │   └── browse/      # Discovery & matching
│       ├── components/      # React components
│       └── package.json
├── packages/
│   └── shared/              # Shared types and utilities
└── package.json
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT + Argon2id
- **Validation**: Zod
- **ORM**: Prisma
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

## 🔐 Security & Compliance

- **DPDP Act 2023**: Compliant data handling with clear consent
- **Data Minimization**: Store only necessary data
- **Encryption**: PII encrypted at rest
- **Rate Limiting**: API rate limiting and caching
- **Audit Logs**: Complete audit trail for MCA data access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Entrepreneurship-shaadi.git
   cd entrepreneur-shaadi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   
   # Configure your database, Redis, and MCA API keys
   ```

4. **Set up the database**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - API server: http://localhost:3001
   - Web app: http://localhost:3000

## 📈 Development

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all apps for production
- `npm run start` - Start all production servers
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run type-check` - Type check all TypeScript

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the entrepreneurial ecosystem in India.