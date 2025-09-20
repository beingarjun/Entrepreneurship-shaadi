import axios, { AxiosResponse } from 'axios';

interface EquifaxCreditReportRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  ssn?: string; // For international entrepreneurs
  pan: string; // PAN for Indian entrepreneurs
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
}

interface EquifaxCreditScore {
  score: number;
  scoreRange: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastUpdated: string;
}

interface EquifaxFinancialProfile {
  creditScore: EquifaxCreditScore;
  creditHistory: {
    accountsOpen: number;
    accountsClosed: number;
    totalCreditLimit: number;
    totalBalances: number;
    creditUtilization: number;
    paymentHistory: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  };
  bankruptcyRecords: boolean;
  defaultRecords: boolean;
  verificationStatus: 'VERIFIED' | 'PARTIAL' | 'FAILED';
  financialStability: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface EquifaxBusinessVerification {
  businessName: string;
  registrationNumber: string;
  creditRating: string;
  businessAge: number;
  annualRevenue?: number;
  employeeCount?: number;
  industryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  businessCreditScore?: number;
}

interface EquifaxVerificationResult {
  success: boolean;
  personalProfile?: EquifaxFinancialProfile;
  businessProfile?: EquifaxBusinessVerification;
  riskAssessment: {
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    financialStability: number; // 1-10 scale
    creditworthiness: number; // 1-10 scale
    businessViability: number; // 1-10 scale
  };
  recommendations: string[];
  lastVerified: string;
}

class EquifaxService {
  private apiKey: string;
  private baseUrl: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.apiKey = process.env.EQUIFAX_API_KEY || '';
    this.environment = (process.env.EQUIFAX_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    this.baseUrl = this.environment === 'sandbox' 
      ? process.env.EQUIFAX_SANDBOX_URL || 'https://api-sandbox.equifax.com'
      : process.env.EQUIFAX_BASE_URL || 'https://api.equifax.com';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Environment': this.environment
    };
  }

  /**
   * Verify personal credit and financial profile
   */
  async verifyPersonalCredit(request: EquifaxCreditReportRequest): Promise<EquifaxFinancialProfile> {
    try {
      console.log(`[EquifaxService] Verifying personal credit for: ${request.firstName} ${request.lastName}`);
      
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/v1/credit-report/personal`,
        {
          ...request,
          productType: 'COMPREHENSIVE',
          includeScore: true,
          includeHistory: true
        },
        { headers: this.getHeaders() }
      );

      return this.parsePersonalCreditResponse(response.data);
    } catch (error) {
      console.error('[EquifaxService] Error verifying personal credit:', error);
      
      // Return mock data for development
      if (this.environment === 'sandbox') {
        return this.getMockPersonalProfile(request);
      }
      
      throw new Error('Failed to verify personal credit information');
    }
  }

  /**
   * Verify business credit and financial profile
   */
  async verifyBusinessCredit(businessName: string, registrationNumber: string): Promise<EquifaxBusinessVerification> {
    try {
      console.log(`[EquifaxService] Verifying business credit for: ${businessName}`);
      
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/v1/credit-report/business`,
        {
          businessName,
          registrationNumber,
          includeFinancials: true,
          includeRiskAssessment: true
        },
        { headers: this.getHeaders() }
      );

      return this.parseBusinessCreditResponse(response.data);
    } catch (error) {
      console.error('[EquifaxService] Error verifying business credit:', error);
      
      // Return mock data for development
      if (this.environment === 'sandbox') {
        return this.getMockBusinessProfile(businessName, registrationNumber);
      }
      
      throw new Error('Failed to verify business credit information');
    }
  }

  /**
   * Comprehensive entrepreneur verification combining personal and business data
   */
  async verifyEntrepreneur(
    personalRequest: EquifaxCreditReportRequest,
    businessName?: string,
    businessRegistration?: string
  ): Promise<EquifaxVerificationResult> {
    try {
      console.log(`[EquifaxService] Comprehensive entrepreneur verification for: ${personalRequest.firstName} ${personalRequest.lastName}`);
      
      const personalProfile = await this.verifyPersonalCredit(personalRequest);
      let businessProfile: EquifaxBusinessVerification | undefined;

      if (businessName && businessRegistration) {
        businessProfile = await this.verifyBusinessCredit(businessName, businessRegistration);
      }

      // Calculate risk assessment
      const riskAssessment = this.calculateRiskAssessment(personalProfile, businessProfile);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(personalProfile, businessProfile);

      return {
        success: true,
        personalProfile,
        businessProfile,
        riskAssessment,
        recommendations,
        lastVerified: new Date().toISOString()
      };
    } catch (error) {
      console.error('[EquifaxService] Error in comprehensive verification:', error);
      throw new Error('Failed to complete entrepreneur verification');
    }
  }

  private parsePersonalCreditResponse(data: any): EquifaxFinancialProfile {
    return {
      creditScore: {
        score: data.creditScore?.score || 0,
        scoreRange: data.creditScore?.range || 'Unknown',
        riskLevel: this.mapRiskLevel(data.creditScore?.riskCategory),
        lastUpdated: data.creditScore?.lastUpdated || new Date().toISOString()
      },
      creditHistory: {
        accountsOpen: data.accounts?.open || 0,
        accountsClosed: data.accounts?.closed || 0,
        totalCreditLimit: data.creditSummary?.totalLimit || 0,
        totalBalances: data.creditSummary?.totalBalance || 0,
        creditUtilization: data.creditSummary?.utilizationRate || 0,
        paymentHistory: this.mapPaymentHistory(data.paymentBehavior?.rating)
      },
      bankruptcyRecords: data.publicRecords?.bankruptcy || false,
      defaultRecords: data.publicRecords?.defaults || false,
      verificationStatus: data.verification?.status || 'FAILED',
      financialStability: this.assessFinancialStability(data)
    };
  }

  private parseBusinessCreditResponse(data: any): EquifaxBusinessVerification {
    return {
      businessName: data.businessInfo?.name || '',
      registrationNumber: data.businessInfo?.registrationNumber || '',
      creditRating: data.creditRating?.grade || 'Not Available',
      businessAge: data.businessInfo?.ageInYears || 0,
      annualRevenue: data.financials?.annualRevenue,
      employeeCount: data.businessInfo?.employeeCount,
      industryRisk: this.mapRiskLevel(data.industryAnalysis?.riskLevel),
      businessCreditScore: data.creditScore?.score
    };
  }

  private calculateRiskAssessment(
    personal: EquifaxFinancialProfile, 
    business?: EquifaxBusinessVerification
  ) {
    const creditScore = personal.creditScore.score;
    const paymentHistory = personal.creditHistory.paymentHistory;
    const utilization = personal.creditHistory.creditUtilization;
    
    let financialStability = 5; // Default middle score
    let creditworthiness = 5;
    let businessViability = 5;

    // Calculate financial stability (1-10)
    if (creditScore >= 750) financialStability += 3;
    else if (creditScore >= 650) financialStability += 1;
    else if (creditScore < 550) financialStability -= 2;

    if (paymentHistory === 'EXCELLENT') financialStability += 2;
    else if (paymentHistory === 'POOR') financialStability -= 2;

    // Calculate creditworthiness (1-10)
    creditworthiness = Math.min(10, Math.max(1, Math.round(creditScore / 80)));
    
    if (utilization < 30) creditworthiness += 1;
    else if (utilization > 70) creditworthiness -= 1;

    // Calculate business viability (1-10)
    if (business) {
      if (business.businessAge >= 5) businessViability += 2;
      else if (business.businessAge >= 2) businessViability += 1;
      
      if (business.industryRisk === 'LOW') businessViability += 1;
      else if (business.industryRisk === 'HIGH') businessViability -= 1;
      
      if (business.businessCreditScore && business.businessCreditScore >= 70) {
        businessViability += 1;
      }
    }

    // Normalize scores
    financialStability = Math.min(10, Math.max(1, financialStability));
    creditworthiness = Math.min(10, Math.max(1, creditworthiness));
    businessViability = Math.min(10, Math.max(1, businessViability));

    // Calculate overall risk
    const avgScore = (financialStability + creditworthiness + businessViability) / 3;
    let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    
    if (avgScore >= 7) overallRisk = 'LOW';
    else if (avgScore >= 5) overallRisk = 'MEDIUM';
    else overallRisk = 'HIGH';

    return {
      overallRisk,
      financialStability,
      creditworthiness,
      businessViability
    };
  }

  private generateRecommendations(
    personal: EquifaxFinancialProfile,
    business?: EquifaxBusinessVerification
  ): string[] {
    const recommendations: string[] = [];

    if (personal.creditScore.score < 650) {
      recommendations.push('Consider improving credit score before seeking business partnerships');
    }

    if (personal.creditHistory.creditUtilization > 70) {
      recommendations.push('Reduce credit utilization to improve financial profile');
    }

    if (personal.defaultRecords) {
      recommendations.push('Address any outstanding defaults to improve trustworthiness');
    }

    if (business && business.businessAge < 2) {
      recommendations.push('Business is relatively new - consider highlighting growth potential');
    }

    if (business && business.industryRisk === 'HIGH') {
      recommendations.push('Industry has higher risk profile - emphasize unique value proposition');
    }

    if (recommendations.length === 0) {
      recommendations.push('Excellent financial profile - great candidate for partnership matching');
    }

    return recommendations;
  }

  private mapRiskLevel(risk: any): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (typeof risk === 'string') {
      const lowerRisk = risk.toLowerCase();
      if (lowerRisk.includes('low')) return 'LOW';
      if (lowerRisk.includes('high')) return 'HIGH';
    }
    return 'MEDIUM';
  }

  private mapPaymentHistory(rating: any): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    if (typeof rating === 'string') {
      const lowerRating = rating.toLowerCase();
      if (lowerRating.includes('excellent')) return 'EXCELLENT';
      if (lowerRating.includes('good')) return 'GOOD';
      if (lowerRating.includes('fair')) return 'FAIR';
    }
    return 'POOR';
  }

  private assessFinancialStability(data: any): 'HIGH' | 'MEDIUM' | 'LOW' {
    const score = data.creditScore?.score || 0;
    if (score >= 750) return 'HIGH';
    if (score >= 650) return 'MEDIUM';
    return 'LOW';
  }

  private getMockPersonalProfile(_request: EquifaxCreditReportRequest): EquifaxFinancialProfile {
    // Generate realistic mock data for development
    const mockScore = 650 + Math.floor(Math.random() * 150);
    
    return {
      creditScore: {
        score: mockScore,
        scoreRange: '300-850',
        riskLevel: mockScore >= 700 ? 'LOW' : mockScore >= 600 ? 'MEDIUM' : 'HIGH',
        lastUpdated: new Date().toISOString()
      },
      creditHistory: {
        accountsOpen: 3 + Math.floor(Math.random() * 5),
        accountsClosed: Math.floor(Math.random() * 3),
        totalCreditLimit: 100000 + Math.floor(Math.random() * 900000),
        totalBalances: Math.floor(Math.random() * 50000),
        creditUtilization: Math.floor(Math.random() * 80),
        paymentHistory: mockScore >= 700 ? 'EXCELLENT' : mockScore >= 650 ? 'GOOD' : 'FAIR'
      },
      bankruptcyRecords: false,
      defaultRecords: Math.random() < 0.1,
      verificationStatus: 'VERIFIED',
      financialStability: mockScore >= 700 ? 'HIGH' : mockScore >= 600 ? 'MEDIUM' : 'LOW'
    };
  }

  private getMockBusinessProfile(businessName: string, registrationNumber: string): EquifaxBusinessVerification {
    const mockAge = 1 + Math.floor(Math.random() * 10);
    
    return {
      businessName,
      registrationNumber,
      creditRating: 'B+',
      businessAge: mockAge,
      annualRevenue: 1000000 + Math.floor(Math.random() * 10000000),
      employeeCount: 5 + Math.floor(Math.random() * 95),
      industryRisk: Math.random() < 0.7 ? 'LOW' : Math.random() < 0.5 ? 'MEDIUM' : 'HIGH',
      businessCreditScore: 60 + Math.floor(Math.random() * 35)
    };
  }
}

export default EquifaxService;