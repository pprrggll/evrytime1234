// Matching algorithm based on the specifications

export interface UserProfile {
  id: string;
  name: string;
  major: string;
  year: number;
  intro: string;
  skills: string[];
  interests: string[];
  timePref: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  rolePref: string;
  personality: {
    agreeableness: number;
    conscientiousness: number;
    openness: number;
  };
}

export interface MatchScore {
  userId: string;
  name: string;
  major: string;
  score: number;
  matchedOn: string[];
  details: {
    timeCompat: number;
    skillOverlap: number;
    interestSimilarity: number;
    personalityCompat: number;
  };
}

// Jaccard similarity for sets
function jaccardSimilarity(set1: string[], set2: string[]): number {
  if (set1.length === 0 && set2.length === 0) return 0;
  
  const intersection = set1.filter(item => set2.includes(item)).length;
  const union = new Set([...set1, ...set2]).size;
  
  return union === 0 ? 0 : intersection / union;
}

// Time compatibility - ratio of overlapping time preferences
function computeTimeCompatibility(
  time1: UserProfile['timePref'],
  time2: UserProfile['timePref']
): number {
  const slots = ['morning', 'afternoon', 'evening', 'night'] as const;
  let overlaps = 0;
  let totalActive = 0;

  slots.forEach(slot => {
    if (time1[slot] && time2[slot]) overlaps++;
    if (time1[slot] || time2[slot]) totalActive++;
  });

  return totalActive === 0 ? 0 : overlaps / totalActive;
}

// Cosine similarity for personality vectors
function cosineSimilarity(
  p1: UserProfile['personality'],
  p2: UserProfile['personality']
): number {
  const v1 = [p1.agreeableness, p1.conscientiousness, p1.openness];
  const v2 = [p2.agreeableness, p2.conscientiousness, p2.openness];

  const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

  return mag1 === 0 || mag2 === 0 ? 0 : dotProduct / (mag1 * mag2);
}

// Main matching algorithm
export function recommendCandidates(
  targetProfile: UserProfile,
  candidatePool: UserProfile[],
  topN: number = 10,
  weights = {
    time: 0.3,
    skill: 0.3,
    interest: 0.2,
    personality: 0.2
  }
): MatchScore[] {
  const scores: MatchScore[] = candidatePool
    .filter(candidate => candidate.id !== targetProfile.id)
    .map(candidate => {
      const timeCompat = computeTimeCompatibility(
        targetProfile.timePref,
        candidate.timePref
      );
      
      const skillOverlap = jaccardSimilarity(
        targetProfile.skills,
        candidate.skills
      );
      
      const interestSimilarity = jaccardSimilarity(
        targetProfile.interests,
        candidate.interests
      );
      
      const personalityCompat = cosineSimilarity(
        targetProfile.personality,
        candidate.personality
      );

      const score =
        weights.time * timeCompat +
        weights.skill * skillOverlap +
        weights.interest * interestSimilarity +
        weights.personality * personalityCompat;

      // Determine what they matched on
      const matchedOn: string[] = [];
      if (timeCompat > 0.5) matchedOn.push('시간대');
      if (skillOverlap > 0.3) matchedOn.push('스킬');
      if (interestSimilarity > 0.3) matchedOn.push('관심사');
      if (personalityCompat > 0.7) matchedOn.push('성향');
      if (targetProfile.rolePref === candidate.rolePref) matchedOn.push('역할');

      return {
        userId: candidate.id,
        name: candidate.name,
        major: candidate.major,
        score,
        matchedOn,
        details: {
          timeCompat,
          skillOverlap,
          interestSimilarity,
          personalityCompat
        }
      };
    });

  // Sort by score descending and return top N
  return scores.sort((a, b) => b.score - a.score).slice(0, topN);
}
