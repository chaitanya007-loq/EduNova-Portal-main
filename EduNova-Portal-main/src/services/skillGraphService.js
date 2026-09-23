/**
 * EduNova Skill Graph Service
 * Computes graph nodes, prerequisite relationships, career goal coverage,
 * and AI recommendations for Knowledge Constellation 2.0.
 * Supports context-specific nodes, zero-state for new users, and dynamic node addition.
 */

import { CONSTELLATION_SKILLS_BY_CONTEXT, CONSTELLATION_SKILLS, CONSTELLATION_LINKS, CAREER_GOALS } from '../data/skillCategories';

class SkillGraphService {
  /**
   * Get nodes for active education context.
   * If new user (uninitialized), returns 0 nodes.
   * Otherwise returns saved user nodes for this context.
   */
  getSkillsForContext(educationContext = 'college') {
    try {
      const storageKey = `edunova_constellation_nodes_${educationContext}`;
      const initKey = `edunova_constellation_initialized_${educationContext}`;
      const isInitialized = localStorage.getItem(initKey);
      const stored = localStorage.getItem(storageKey);

      if (isInitialized === 'true' && stored) {
        return JSON.parse(stored);
      }

      // If user hasn't explicitly initialized or added nodes, check if legacy nodes exist
      if (stored) {
        return JSON.parse(stored);
      }

      // Default state for brand new user: 0 nodes
      return [];
    } catch (e) {
      console.warn('Error reading constellation skills from storage:', e);
      return [];
    }
  }

  /**
   * Check if user is new in this context
   */
  isNewUser(educationContext = 'college') {
    const nodes = this.getSkillsForContext(educationContext);
    const initKey = `edunova_constellation_initialized_${educationContext}`;
    return nodes.length === 0 && localStorage.getItem(initKey) !== 'true';
  }

  /**
   * Load default curriculum for dashboard context (e.g. school, college, exam, skills)
   */
  initializeDefaultCurriculum(educationContext = 'college') {
    const defaults = CONSTELLATION_SKILLS_BY_CONTEXT[educationContext] || CONSTELLATION_SKILLS_BY_CONTEXT.college || CONSTELLATION_SKILLS;
    const storageKey = `edunova_constellation_nodes_${educationContext}`;
    const initKey = `edunova_constellation_initialized_${educationContext}`;

    try {
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      localStorage.setItem(initKey, 'true');
    } catch (e) {
      console.error('Failed to save default curriculum:', e);
    }
    return defaults;
  }

  /**
   * Reset constellation to 0 nodes for testing / clear state
   */
  resetConstellation(educationContext = 'college') {
    const storageKey = `edunova_constellation_nodes_${educationContext}`;
    const initKey = `edunova_constellation_initialized_${educationContext}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
      localStorage.setItem(initKey, 'true');
    } catch (e) {
      console.error('Failed to reset constellation:', e);
    }
    return [];
  }

  /**
   * Add a new perfect node to the active dashboard constellation
   */
  addCustomSkillNode(educationContext = 'college', nodeData) {
    const currentNodes = this.getSkillsForContext(educationContext);
    const count = currentNodes.length;

    // Calculate orbital canvas (x, y) coordinates for a perfect balanced layout
    let x = 500;
    let y = 260;

    if (count > 0) {
      const radius = 130 + Math.floor(count / 6) * 85;
      const angle = (count * (2 * Math.PI / 6)) + (Math.floor(count / 6) * 0.4);
      x = Math.max(120, Math.min(880, Math.round(500 + Math.cos(angle) * radius)));
      y = Math.max(80, Math.min(440, Math.round(260 + Math.sin(angle) * radius)));
    }

    const score = Number(nodeData.masteryScore) || 50;
    const status = score >= 80 ? 'MASTERED' : score >= 50 ? 'ACTIVE' : 'NEEDS_REVIEW';

    const newNode = {
      id: `usr_node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: nodeData.name,
      category: nodeData.category || 'Core',
      description: nodeData.description || `Mastery node for ${nodeData.name}`,
      masteryScore: score,
      confidence: score >= 80 ? 'High' : score >= 50 ? 'Medium' : 'Low',
      evidenceCount: 1,
      trend: '+5% this week',
      status: status,
      difficulty: nodeData.difficulty || 'Intermediate',
      lastPracticedAt: 'Just now',
      estimatedTimeToMaster: '6 hours',
      prerequisites: nodeData.prerequisiteId ? [nodeData.prerequisiteId] : [],
      dependentSkills: [],
      relatedSubjects: [`${educationContext.toUpperCase()} Curriculum`],
      relatedTopics: [nodeData.name],
      nextRecommendedAction: `Practice diagnostic assessment on ${nodeData.name}`,
      context: educationContext,
      x,
      y,
      evidence: [
        { type: 'User Created', title: 'Added to Constellation', score: `${score}%`, date: 'Today' }
      ]
    };

    const updatedNodes = [...currentNodes, newNode];
    const storageKey = `edunova_constellation_nodes_${educationContext}`;
    const initKey = `edunova_constellation_initialized_${educationContext}`;

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNodes));
      localStorage.setItem(initKey, 'true');

      // If prerequisite link specified, store link
      if (nodeData.prerequisiteId) {
        const linkKey = `edunova_constellation_links_${educationContext}`;
        const existingLinks = JSON.parse(localStorage.getItem(linkKey) || '[]');
        existingLinks.push({
          source: nodeData.prerequisiteId,
          target: newNode.id,
          type: 'PREREQUISITE'
        });
        localStorage.setItem(linkKey, JSON.stringify(existingLinks));
      }
    } catch (e) {
      console.error('Failed to save new node:', e);
    }

    return { newNode, updatedNodes };
  }

  /**
   * Update mastery score, status, confidence, and evidence log for any node
   */
  updateSkillMastery(educationContext = 'college', skillId, newMasteryScore, customEvidence = null) {
    const currentNodes = this.getSkillsForContext(educationContext);
    const updated = currentNodes.map(node => {
      if (node.id === skillId) {
        const score = Math.min(100, Math.max(0, Math.round(newMasteryScore)));
        const status = score >= 80 ? 'MASTERED' : score >= 50 ? 'ACTIVE' : 'NEEDS_REVIEW';
        const evidenceList = Array.isArray(node.evidence) ? node.evidence : [];
        const newEvidenceItem = customEvidence || {
          type: 'Practice Quiz',
          title: `Diagnostic Assessment (${score}% Score)`,
          score: `${score}%`,
          date: 'Just now'
        };

        return {
          ...node,
          masteryScore: score,
          status,
          confidence: score >= 80 ? 'High' : score >= 50 ? 'Medium' : 'Low',
          evidenceCount: evidenceList.length + 1,
          lastPracticedAt: 'Just now',
          evidence: [newEvidenceItem, ...evidenceList]
        };
      }
      return node;
    });

    const storageKey = `edunova_constellation_nodes_${educationContext}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update skill mastery:', e);
    }
    return updated;
  }

  /**
   * Save updated node positions (x, y) to localStorage for a given education context
   */
  updateNodePositions(educationContext = 'college', updatedNodes) {
    const storageKey = `edunova_constellation_nodes_${educationContext}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNodes));
    } catch (e) {
      console.error('Failed to update node positions:', e);
    }
    return updatedNodes;
  }

  getGraphData(educationContext = 'college', selectedCategory = 'All', searchQuery = '') {
    const contextNodes = this.getSkillsForContext(educationContext);
    let nodes = [...contextNodes];

    if (selectedCategory && selectedCategory !== 'All') {
      nodes = nodes.filter(n => n.category === selectedCategory);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      nodes = nodes.filter(n =>
        n.name.toLowerCase().includes(q) ||
        (n.category && n.category.toLowerCase().includes(q)) ||
        (n.description && n.description.toLowerCase().includes(q)) ||
        (n.relatedTopics && n.relatedTopics.some(t => t.toLowerCase().includes(q)))
      );
    }

    const nodeIds = new Set(nodes.map(n => n.id));
    
    // Combine seed links with stored custom user links
    let customLinks = [];
    try {
      customLinks = JSON.parse(localStorage.getItem(`edunova_constellation_links_${educationContext}`) || '[]');
    } catch (e) {}

    const allLinks = [...CONSTELLATION_LINKS, ...customLinks];
    const links = allLinks.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    const categories = ['All', ...new Set(contextNodes.map(n => n.category))];

    return {
      nodes,
      links,
      categories: categories.length > 1 ? categories : ['All', 'Core', 'Frontend', 'Backend', 'AI & ML', 'Mathematics', 'Physics & Science']
    };
  }

  getSkillById(skillId, educationContext = 'college') {
    const contextNodes = this.getSkillsForContext(educationContext);
    const found = contextNodes.find(s => s.id === skillId);
    if (found) return found;

    // Search across all contexts as fallback
    for (const ctxKey in CONSTELLATION_SKILLS_BY_CONTEXT) {
      const match = CONSTELLATION_SKILLS_BY_CONTEXT[ctxKey].find(s => s.id === skillId);
      if (match) return match;
    }
    return contextNodes[0] || null;
  }

  getKPICardsData(educationContext = 'college') {
    const nodes = this.getSkillsForContext(educationContext);
    const mastered = nodes.filter(n => n.status === 'MASTERED' || n.masteryScore >= 80).length;
    const active = nodes.filter(n => n.status === 'ACTIVE' || n.status === 'STRONG').length;
    const locked = nodes.filter(n => n.status === 'LOCKED').length;
    const needsReview = nodes.filter(n => n.status === 'NEEDS_REVIEW' || (n.masteryScore > 0 && n.masteryScore < 60)).length;

    const totalMastery = nodes.reduce((acc, n) => acc + (n.masteryScore || 0), 0);
    const overallProgress = nodes.length > 0 ? Math.round(totalMastery / nodes.length) : 0;

    return {
      masteredCount: mastered,
      activeCount: active,
      toUnlockCount: locked,
      overallProgress,
      growingCount: active,
      needsReviewCount: needsReview,
      totalNodes: nodes.length
    };
  }

  getCareerGoalCoverage(careerId = 'fullstack', educationContext = 'college') {
    const career = CAREER_GOALS.find(c => c.id === careerId) || CAREER_GOALS[0];
    const requiredSkills = career.requiredSkillIds.map(id => this.getSkillById(id, educationContext)).filter(Boolean);

    const mastered = requiredSkills.filter(s => s.masteryScore >= 80);
    const developing = requiredSkills.filter(s => s.masteryScore >= 40 && s.masteryScore < 80);
    const toBuild = requiredSkills.filter(s => s.masteryScore < 40);

    const totalMasterySum = requiredSkills.reduce((acc, s) => acc + (s.masteryScore || 0), 0);
    const coveragePercentage = requiredSkills.length > 0 ? Math.round(totalMasterySum / requiredSkills.length) : 0;

    return {
      career,
      coveragePercentage,
      requiredSkills,
      mastered,
      developing,
      toBuild,
      skillGapCount: toBuild.length
    };
  }

  getNextBestSkill(educationContext = 'college') {
    const nodes = this.getSkillsForContext(educationContext);
    if (nodes.length === 0) return null;
    const activeSkills = nodes.filter(s => s.status === 'ACTIVE' || s.status === 'AVAILABLE' || s.status === 'NEEDS_REVIEW');
    const target = activeSkills[0] || nodes[0];

    return {
      skill: target,
      reason: `✓ Recommended for ${educationContext.toUpperCase()} path • High priority for target outcome`,
      estimatedHours: target.estimatedTimeToMaster || '8 hours',
      prerequisitesMet: true
    };
  }

  getWeakSkills(educationContext = 'college') {
    const nodes = this.getSkillsForContext(educationContext);
    return nodes.filter(s => s.status === 'NEEDS_REVIEW' || (s.masteryScore > 0 && s.masteryScore < 60));
  }

  getStrongSkills(educationContext = 'college') {
    const nodes = this.getSkillsForContext(educationContext);
    return nodes.filter(s => s.status === 'MASTERED' || s.status === 'STRONG' || s.masteryScore >= 80);
  }

  getSageSkillInsight(skillId = null, educationContext = 'college') {
    if (skillId) {
      const skill = this.getSkillById(skillId, educationContext);
      if (skill) {
        return `Sage AI: Your current mastery of ${skill.name} is ${skill.masteryScore}%. Focusing on "${skill.nextRecommendedAction}" will accelerate your overall learning curve.`;
      }
    }

    const nodes = this.getSkillsForContext(educationContext);
    if (nodes.length === 0) {
      return `Sage AI: Welcome to your ${educationContext.toUpperCase()} Knowledge Constellation! Add your first skill node or load the recommended curriculum to map your learning trajectory.`;
    }
    const activeSkill = nodes.find(s => s.status === 'ACTIVE') || nodes[0];
    return `Sage AI: Currently reviewing your ${educationContext.toUpperCase()} learning matrix. Your active skill is "${activeSkill?.name}". Complete recommended diagnostics to increase target readiness.`;
  }
}

export const skillGraphService = new SkillGraphService();
export default skillGraphService;

