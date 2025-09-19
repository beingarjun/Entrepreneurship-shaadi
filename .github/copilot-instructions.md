# Entrepreneur Shaadi - GitHub Copilot Instructions

## Project Overview
This is "Entrepreneur Shaadi" - a founder verification and matching platform that uses MCA (Ministry of Corporate Affairs) data to build trustable profiles and connect verified entrepreneurs.

## Architecture
- **Monorepo Structure**: Uses npm workspaces with apps/api and apps/web
- **Backend**: Node.js + TypeScript + Express + PostgreSQL + Redis
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **MCA Integration**: Abstracted provider pattern for Attestr/SurePass/AuthBridge APIs

## Key Domain Concepts

### MCA (Ministry of Corporate Affairs)
- **DIN**: Director Identification Number - unique ID for company directors
- **CIN**: Corporate Identification Number - unique ID for companies
- **Director Master**: Official director data from MCA
- **Company Master**: Official company data from MCA

### Core Entities
- **User**: Platform users (founders/entrepreneurs)
- **Director Verification**: Links user to their DIN and directorships
- **Company**: MCA company data with directors
- **Persona**: Generated profile based on MCA data and experience
- **Trust Badges**: Verification indicators (MCA-Verified Director, Active Company, etc.)

### Matching Algorithm
- Experience Score: Based on active companies and years as director
- Governance Score: Based on company status and tenure
- Industry Affinity: Derived from company NIC codes and names
- Match Score: Weighted combination of multiple factors

## Code Patterns

### Provider Pattern for MCA APIs
```typescript
export interface DirectorProvider {
  getDirectorByDIN(din: string): Promise<DirectorMaster>;
  listCompaniesByDIN(din: string): Promise<CompanySummary[]>;
}
```

### Service Layer Pattern
- Controllers handle HTTP requests
- Services contain business logic
- Providers handle external API calls
- Repositories handle database operations

## Database Schema Principles
- Use UUIDs for primary keys except for MCA identifiers (DIN/CIN)
- Store normalized MCA data with last_synced_at timestamps
- Separate verification data from user profiles
- Include audit fields (created_at, updated_at)

## Security & Compliance
- **DPDP Act 2023**: Always include data consent and purpose
- **Rate Limiting**: Implement for all MCA API calls
- **Caching**: Cache MCA responses for 7-30 days
- **PII Protection**: Encrypt sensitive data at rest
- **Audit Logging**: Log all MCA data access

## When writing code for this project:
1. Follow the established patterns and conventions
2. Consider MCA data compliance and caching
3. Implement proper error handling and logging
4. Use TypeScript strictly with proper type definitions
5. Follow the modular architecture
6. Include appropriate tests and documentation
7. Consider performance and security implications