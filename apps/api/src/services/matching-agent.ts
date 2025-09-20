import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

export interface CompatibilityScore {
  overall: number;
  entrepreneurialAlignment: number;
  personalValues: number;
  lifestyleCompatibility: number;
  businessUnderstanding: number;
  familyGoals: number;
  reasons: string[];
  recommendations: string[];
}

export interface MatchingCriteria {
  userId: string;
  ageRange?: { min: number; max: number };
  locationPreference?: string[];
  industryPreference?: string[];
  stagePreference?: string[];
  educationPreference?: string[];
  incomeRange?: { min: number; max: number };
  maritalStatus?: string[];
  excludeContacted?: boolean;
}

export class EntrepreneurMatchingAgent {
  
  /**
   * Main AI matching function that calculates compatibility between two entrepreneurs
   */
  async calculateCompatibility(user1Id: string, user2Id: string): Promise<CompatibilityScore> {
    try {
      const [user1, user2] = await Promise.all([
        this.getEnhancedUserProfile(user1Id),
        this.getEnhancedUserProfile(user2Id)
      ]);

      if (!user1 || !user2) {
        throw new Error('User profile not found');
      }

      // Calculate different compatibility dimensions
      const entrepreneurialAlignment = this.calculateEntrepreneurialAlignment(user1, user2);
      const personalValues = this.calculatePersonalValuesAlignment(user1, user2);
      const lifestyleCompatibility = this.calculateLifestyleCompatibility(user1, user2);
      const businessUnderstanding = this.calculateBusinessUnderstanding(user1, user2);
      const familyGoals = this.calculateFamilyGoalsAlignment(user1, user2);

      // Weighted overall score (AI-tuned weights)
      const overall = (
        entrepreneurialAlignment * 0.25 +
        personalValues * 0.25 +
        lifestyleCompatibility * 0.20 +
        businessUnderstanding * 0.15 +
        familyGoals * 0.15
      );

      const reasons = this.generateCompatibilityReasons(user1, user2, {
        entrepreneurialAlignment,
        personalValues,
        lifestyleCompatibility,
        businessUnderstanding,
        familyGoals
      });

      const recommendations = this.generateRelationshipRecommendations(user1, user2, overall);

      return {
        overall: Math.round(overall * 100) / 100,
        entrepreneurialAlignment: Math.round(entrepreneurialAlignment * 100) / 100,
        personalValues: Math.round(personalValues * 100) / 100,
        lifestyleCompatibility: Math.round(lifestyleCompatibility * 100) / 100,
        businessUnderstanding: Math.round(businessUnderstanding * 100) / 100,
        familyGoals: Math.round(familyGoals * 100) / 100,
        reasons,
        recommendations
      };

    } catch (error) {
      logger.error('Error calculating compatibility:', error);
      throw error;
    }
  }

  /**
   * Find best matches for a user using AI scoring
   */
  async findMatches(criteria: MatchingCriteria, limit = 20): Promise<any[]> {
    try {
      const user = await this.getEnhancedUserProfile(criteria.userId);
      if (!user) throw new Error('User not found');

      // Build dynamic filters based on criteria
      const filters: any = {
        id: { not: criteria.userId },
        isActive: true,
      };

      // Age filtering
      if (criteria.ageRange) {
        const currentYear = new Date().getFullYear();
        filters.birthYear = {
          gte: currentYear - criteria.ageRange.max,
          lte: currentYear - criteria.ageRange.min
        };
      }

      // Location preference
      if (criteria.locationPreference?.length) {
        filters.location = { in: criteria.locationPreference };
      }

      // Industry preference
      if (criteria.industryPreference?.length) {
        filters.industry = { in: criteria.industryPreference };
      }

      // Business stage preference
      if (criteria.stagePreference?.length) {
        filters.stage = { in: criteria.stagePreference };
      }

      // Get potential matches
      const potentialMatches = await prisma.user.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          location: true,
          industry: true,
          stage: true,
          companyName: true,
          education: true,
          age: true,
          maritalStatus: true,
          income: true,
          values: true,
          interests: true,
          entrepreneurialGoals: true,
          workLifeBalance: true,
          familyPlans: true,
          communicationStyle: true,
          profilePicture: true,
          lastActive: true,
          createdAt: true,
        },
        take: 100 // Get more than needed for AI filtering
      });

      // Calculate compatibility scores for all potential matches
      const matchesWithScores = await Promise.all(
        potentialMatches.map(async (match: any) => {
          const compatibility = await this.calculateCompatibility(criteria.userId, match.id);
          return {
            ...match,
            compatibility
          };
        })
      );

      // Sort by compatibility score and return top matches
      return matchesWithScores
        .filter(match => match.compatibility.overall >= 0.6) // Only return good matches
        .sort((a, b) => b.compatibility.overall - a.compatibility.overall)
        .slice(0, limit);

    } catch (error) {
      logger.error('Error finding matches:', error);
      throw error;
    }
  }

  /**
   * AI-powered entrepreneurial mindset alignment calculation
   */
  private calculateEntrepreneurialAlignment(user1: any, user2: any): number {
    let score = 0;
    let factors = 0;

    // Business stage compatibility
    if (user1.stage && user2.stage) {
      const stageCompatibility = this.getStageCompatibility(user1.stage, user2.stage);
      score += stageCompatibility * 0.3;
      factors += 0.3;
    }

    // Industry synergy
    if (user1.industry && user2.industry) {
      const industryScore = user1.industry === user2.industry ? 0.8 : 
                           this.getIndustrySynergy(user1.industry, user2.industry);
      score += industryScore * 0.2;
      factors += 0.2;
    }

    // Entrepreneurial goals alignment
    if (user1.entrepreneurialGoals && user2.entrepreneurialGoals) {
      const goalsAlignment = this.calculateArraySimilarity(
        user1.entrepreneurialGoals, 
        user2.entrepreneurialGoals
      );
      score += goalsAlignment * 0.3;
      factors += 0.3;
    }

    // Risk tolerance (derived from stage and goals)
    const riskAlignment = this.calculateRiskToleranceAlignment(user1, user2);
    score += riskAlignment * 0.2;
    factors += 0.2;

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Personal values and life philosophy alignment
   */
  private calculatePersonalValuesAlignment(user1: any, user2: any): number {
    let score = 0;
    let factors = 0;

    // Core values alignment
    if (user1.values && user2.values) {
      const valuesAlignment = this.calculateArraySimilarity(user1.values, user2.values);
      score += valuesAlignment * 0.4;
      factors += 0.4;
    }

    // Family plans alignment
    if (user1.familyPlans && user2.familyPlans) {
      const familyAlignment = this.calculateFamilyPlansCompatibility(
        user1.familyPlans, 
        user2.familyPlans
      );
      score += familyAlignment * 0.3;
      factors += 0.3;
    }

    // Communication style compatibility
    if (user1.communicationStyle && user2.communicationStyle) {
      const commScore = this.calculateCommunicationCompatibility(
        user1.communicationStyle, 
        user2.communicationStyle
      );
      score += commScore * 0.3;
      factors += 0.3;
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Lifestyle and work-life balance compatibility
   */
  private calculateLifestyleCompatibility(user1: any, user2: any): number {
    let score = 0;
    let factors = 0;

    // Work-life balance preferences
    if (user1.workLifeBalance && user2.workLifeBalance) {
      const balanceScore = this.calculateWorkLifeBalanceCompatibility(
        user1.workLifeBalance, 
        user2.workLifeBalance
      );
      score += balanceScore * 0.4;
      factors += 0.4;
    }

    // Location compatibility
    if (user1.location && user2.location) {
      const locationScore = this.calculateLocationCompatibility(user1.location, user2.location);
      score += locationScore * 0.3;
      factors += 0.3;
    }

    // Shared interests
    if (user1.interests && user2.interests) {
      const interestsAlignment = this.calculateArraySimilarity(user1.interests, user2.interests);
      score += interestsAlignment * 0.3;
      factors += 0.3;
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Business understanding and support compatibility
   */
  private calculateBusinessUnderstanding(user1: any, user2: any): number {
    let score = 0.7; // Base score since both are entrepreneurs

    // Similar industry experience adds understanding
    if (user1.industry === user2.industry) {
      score += 0.2;
    }

    // Similar business stage adds empathy
    if (user1.stage === user2.stage) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Family goals and future plans alignment
   */
  private calculateFamilyGoalsAlignment(user1: any, user2: any): number {
    if (!user1.familyPlans || !user2.familyPlans) return 0.5;

    return this.calculateFamilyPlansCompatibility(user1.familyPlans, user2.familyPlans);
  }

  // Helper methods for specific calculations
  private getStageCompatibility(stage1: string, stage2: string): number {
    const stageMatrix: { [key: string]: { [key: string]: number } } = {
      'IDEA': { 'IDEA': 0.9, 'MVP': 0.8, 'EARLY_STAGE': 0.6, 'GROWTH': 0.4, 'MATURE': 0.3 },
      'MVP': { 'IDEA': 0.8, 'MVP': 0.9, 'EARLY_STAGE': 0.8, 'GROWTH': 0.6, 'MATURE': 0.4 },
      'EARLY_STAGE': { 'IDEA': 0.6, 'MVP': 0.8, 'EARLY_STAGE': 0.9, 'GROWTH': 0.8, 'MATURE': 0.6 },
      'GROWTH': { 'IDEA': 0.4, 'MVP': 0.6, 'EARLY_STAGE': 0.8, 'GROWTH': 0.9, 'MATURE': 0.8 },
      'MATURE': { 'IDEA': 0.3, 'MVP': 0.4, 'EARLY_STAGE': 0.6, 'GROWTH': 0.8, 'MATURE': 0.9 }
    };

    return stageMatrix[stage1]?.[stage2] || 0.5;
  }

  private getIndustrySynergy(industry1: string, industry2: string): number {
    // Define industry synergies - industries that work well together
    const synergies: { [key: string]: { [key: string]: number } } = {
      'TECHNOLOGY': { 'FINTECH': 0.8, 'HEALTHTECH': 0.7, 'EDTECH': 0.7 },
      'FINTECH': { 'TECHNOLOGY': 0.8, 'ECOMMERCE': 0.6 },
      'HEALTHTECH': { 'TECHNOLOGY': 0.7, 'BIOTECH': 0.8 },
      'ECOMMERCE': { 'TECHNOLOGY': 0.6, 'RETAIL': 0.7, 'LOGISTICS': 0.8 }
    };

    return synergies[industry1]?.[industry2] || 0.4;
  }

  private calculateArraySimilarity(arr1: string[], arr2: string[]): number {
    if (!arr1?.length || !arr2?.length) return 0.5;

    const intersection = arr1.filter(item => arr2.includes(item));
    const union = [...new Set([...arr1, ...arr2])];
    
    return intersection.length / union.length;
  }

  private calculateFamilyPlansCompatibility(plans1: any, plans2: any): number {
    // This would be more complex in real implementation
    // For now, a simple compatibility check
    if (plans1.wantsChildren !== plans2.wantsChildren) return 0.2;
    if (plans1.timelineForFamily !== plans2.timelineForFamily) return 0.6;
    return 0.9;
  }

  private calculateCommunicationCompatibility(style1: string, style2: string): number {
    const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
      'DIRECT': { 'DIRECT': 0.8, 'DIPLOMATIC': 0.6, 'ANALYTICAL': 0.7 },
      'DIPLOMATIC': { 'DIRECT': 0.6, 'DIPLOMATIC': 0.9, 'ANALYTICAL': 0.5 },
      'ANALYTICAL': { 'DIRECT': 0.7, 'DIPLOMATIC': 0.5, 'ANALYTICAL': 0.8 }
    };

    return compatibilityMatrix[style1]?.[style2] || 0.5;
  }

  private calculateWorkLifeBalanceCompatibility(balance1: string, balance2: string): number {
    const balanceMatrix: { [key: string]: { [key: string]: number } } = {
      'WORK_FOCUSED': { 'WORK_FOCUSED': 0.9, 'BALANCED': 0.6, 'LIFE_FOCUSED': 0.3 },
      'BALANCED': { 'WORK_FOCUSED': 0.6, 'BALANCED': 0.9, 'LIFE_FOCUSED': 0.6 },
      'LIFE_FOCUSED': { 'WORK_FOCUSED': 0.3, 'BALANCED': 0.6, 'LIFE_FOCUSED': 0.9 }
    };

    return balanceMatrix[balance1]?.[balance2] || 0.5;
  }

  private calculateLocationCompatibility(loc1: string, loc2: string): number {
    if (loc1 === loc2) return 1.0;
    
    // Define location clusters that are compatible
    const locationClusters = [
      ['Mumbai', 'Pune', 'Bangalore'],
      ['Delhi', 'Gurgaon', 'Noida'],
      ['Chennai', 'Hyderabad', 'Bangalore'],
      ['San Francisco', 'San Jose', 'Palo Alto'],
      ['New York', 'Jersey City', 'Brooklyn']
    ];

    for (const cluster of locationClusters) {
      if (cluster.includes(loc1) && cluster.includes(loc2)) {
        return 0.8;
      }
    }

    return 0.3; // Different regions
  }

  private calculateRiskToleranceAlignment(user1: any, user2: any): number {
    // Risk tolerance based on business stage and entrepreneurial goals
    const riskScores: { [key: string]: number } = {
      'IDEA': 0.9,
      'MVP': 0.7,
      'EARLY_STAGE': 0.6,
      'GROWTH': 0.4,
      'MATURE': 0.3
    };

    const risk1 = riskScores[user1.stage] || 0.5;
    const risk2 = riskScores[user2.stage] || 0.5;

    return 1 - Math.abs(risk1 - risk2);
  }

  private generateCompatibilityReasons(user1: any, user2: any, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.entrepreneurialAlignment > 0.8) {
      reasons.push('Strong entrepreneurial mindset alignment');
    }
    if (scores.personalValues > 0.8) {
      reasons.push('Shared personal values and life philosophy');
    }
    if (scores.lifestyleCompatibility > 0.8) {
      reasons.push('Compatible lifestyle preferences');
    }
    if (user1.industry === user2.industry) {
      reasons.push('Same industry experience - mutual understanding');
    }
    if (user1.location === user2.location) {
      reasons.push('Same location - no distance barriers');
    }

    return reasons;
  }

  private generateRelationshipRecommendations(_user1: any, _user2: any, overallScore: number): string[] {
    const recommendations: string[] = [];

    if (overallScore > 0.8) {
      recommendations.push('Highly compatible match - consider connecting');
      recommendations.push('Strong potential for understanding each other\'s entrepreneurial journey');
    } else if (overallScore > 0.6) {
      recommendations.push('Good compatibility - worth exploring further');
      recommendations.push('Take time to understand each other\'s business goals');
    } else {
      recommendations.push('Some compatibility challenges - proceed with awareness');
      recommendations.push('Focus on shared interests outside of business');
    }

    return recommendations;
  }

  private async getEnhancedUserProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        industry: true,
        stage: true,
        companyName: true,
        education: true,
        age: true,
        birthYear: true,
        maritalStatus: true,
        income: true,
        values: true,
        interests: true,
        entrepreneurialGoals: true,
        workLifeBalance: true,
        familyPlans: true,
        communicationStyle: true,
        isActive: true,
      }
    });
  }
}

export const matchingAgent = new EntrepreneurMatchingAgent();