# Feedback360 Seed Data Summary

## Overview
This document describes the comprehensive seed data created for the Feedback360 module in the Ukrainian company "Intra". The data covers three feedback cycles: two completed cycles from 2025and one active cycle for 2026.

## Data Structure

### 1. Cycles (`cycles.ts`)
**Three feedback cycles:**

#### Mid-Year Performance Review 2025
- **HR Manager**: Mariia Pavlenko (ID: 7)
- **Status**: FINISHED
- **Timeline**:
  - Start: May 1, 2025
  - Review Deadline: May 20, 2025
  - Approval Deadline: June 5, 2025
  - Response Deadline: June 30, 2025
  - End: July 15, 2025
- **Focus**: Leadership and management positions

#### Annual Performance Review 2025
- **HR Manager**: Mariia Pavlenko (ID: 7)
- **Status**: FINISHED
- **Timeline**:
  - Start: November 1, 2025
  - Review Deadline: November 20, 2025
  - Approval Deadline: December 5, 2025
  - Response Deadline: December 25, 2025
  - End: January 10, 2026
- **Focus**: Technical staff performance

#### Annual Performance Review 2026
- **HR Manager**: Mariia Pavlenko (ID: 7)
- **Status**: ACTIVE
- **Timeline**:
  - Start: January 15, 2026
  - Review Deadline: February 1, 2026
  - Approval Deadline: February 15, 2026
  - Response Deadline: March 15, 2026
  - End: March 31, 2026
- **Focus**: All teams comprehensive assessment

### 2. Reviews (`reviews.ts`)
- **Total**: 33 reviews across 3 cycles
- **Mid-Year 2025**: 6 reviews (leadership focus)
  - CTO, Team Leads, HR Director, Senior Designer
- **Annual 2025**: 7 reviews (technical staff)
  - Engineers and QA specialists
- **Annual 2026**: 13 reviews (comprehensive)
  - All teams including SE, QA, Design

- **All reviews have**:
  - `hr_id = 7` (Mariia Pavlenko - HR Manager)
  - `report_id = null`
  - `ratee_id`, `manager_id`, `ratee_position_id`, `ratee_position_title`, `team_id`, `team_title` populated from user data
  - Stage: FINISHED (2025 cycles) or IN_PROGRESS (2026 cycle)

### 3. Questions (`questions.ts`)
- Questions created from existing **question templates** in the library
- **Created for all cycles** - each cycle has the same set of questions
- Linked to cycles and competencies
- **Total questions per cycle**: 52 unique questions

**Questions per position** (same across all cycles):
- Senior Software Engineer: 52 questions (all 10 competencies)
- Tech Lead: 42 questions (8 competencies)
- Team Lead: 36 questions (7 competencies)
- Senior QA Engineer: 29 questions (6 competencies)
- Senior Designer: 29 questions (6 competencies)
- Middle positions: 25-29 questions (4-5 competencies)
- Junior positions: 20-24 questions (4 competencies)

All positions meet the requirement of **minimum 20 questions and 2+ questions per competence**.

### 4. Review-Question Relations (`review-question-relations.ts`)
- Links each review to questions based on the **position's competencies**
- Uses the `PositionCompetenceRelation` to determine which questions apply
- Creates denormalized copies of question and competence data for performance
- **Total**: ~500+ relations across all reviews

### 5. Respondents (`respondents.ts`)
Each review has respondents in 3 categories across all cycles:

1.  **SELF_ASSESSMENT**: The employee themselves
2. **TEAM**: 2-4 colleagues from the same team
3. **OTHER**: 1-3 colleagues from other teams (when applicable)

**Response statuses by cycle**:
- **Mid-Year 2025**: All COMPLETED (historical data)
- **Annual 2025**: All COMPLETED (historical data)
- **Annual 2026**: Mix of COMPLETED, IN_PROGRESS, and PENDING (active cycle)

**Timestamps**:
- Mid-Year 2025: Invited May 2, Responded May 18
- Annual 2025: Invited Nov 2, Responded Nov 18
- Annual 2026: Invited Jan 16, Responded Jan 20 (for completed)

**Total respondents**: ~150+ across all cycles

### 6. Reviewers (`reviewers.ts`)
- People who can **view the review results**
- Typically includes:
  1. The ratee themselves
  2. Their direct manager
  3. HR Manager (Mariia Pavlenko)

**Total**: ~60+ reviewer assignments across all cycles

### 7. Answers (`answers.ts`)
- Generated for all COMPLETED respondents **across all cycles**
- **Numerical scores (1-5 scale)**:
  - High performers (Senior/Lead): 3-5 points, critical competencies 4-5
  - Regular performers: 2-4 points, critical competencies 3-4
  - Scores vary by competence importance for the position

- **Text feedback**:
  - 70% of TEXT_FIELD questions have comments
  - 75% positive feedback, 25% constructive
  - Realistic Ukrainian company context

**Total answers**: ~2000+ across all cycles

### 8. Cluster Scores (`cluster-scores.ts`)
- Calculated from answer averages per competence
- Matches employees to performance clusters
- Links to existing clusters from library
- **Works dynamically** for all cycles and reviews

**Total cluster scores**: ~300+ across all reviews

## Cycle Comparison

| Cycle | Status | Reviews | Employees | Focus Area |
|-------|--------|---------|-----------|------------|
| Mid-Year 2025 | FINISHED | 6 | Leadership | H1 2025 performance |
| Annual 2025 | FINISHED | 7 | Technical Staff | Full year 2025 |
| Annual 2026 | ACTIVE | 13 | All Teams | Current assessment |
| **Total** | - | **26** | **16 unique** | - |

*Note: Some employees appear in multiple cycles*

## Competence Distribution

### All Positions (10 competencies)
- **Senior Software Engineer**: LEAD, COMM, TECH, PMGT, DELIV, QUAL, PROD, CUST, COLLAB, STRAT

### Leadership Positions (7-9 competencies)
- **CTO**: LEAD, COMM, TECH, PMGT, DELIV, QUAL, PROD, COLLAB, STRAT
- **Tech Lead**: LEAD, COMM, TECH, PMGT, DELIV, QUAL, COLLAB, STRAT
- **Team Lead**: LEAD, COMM, TECH, PMGT, DELIV, QUAL, COLLAB
- **HR Director**: LEAD, COMM, PMGT, DELIV, COLLAB, STRAT

### Technical Positions (4-6 competencies)
- **Middle Software Engineer**: COMM, TECH, DELIV, QUAL, COLLAB
- **Junior Software Engineer**: COMM, TECH, DELIV, COLLAB
- **Senior QA Engineer**: COMM, TECH, DELIV, QUAL, COLLAB, CUST

### Creative Positions (6 competencies)
- **Senior Designer**: COMM, PROD, CUST, COLLAB, STRAT, TECH

## Data Relationships

```
Cycles (3)
  └─> Reviews (26 total: 6+7+13)
       ├─> Review-Question Relations (based on position competences)
       │    └─> Questions (52 per cycle, same templates)
       ├─> Respondents (3 categories per review, ~150 total)
       │    └─> Answers (for COMPLETED respondents, ~2000 total)
       ├─> Reviewers (ratee + manager + HR, ~60 total)
       └─> Cluster Scores (calculated from answers, ~300 total)
```

## Key Features

1. **Realistic Ukrainian company**: Names, positions, and org structure
2. **All data in English**: As required
3. **Historical + Current data**: Two finished cycles + one active
4. **Minimum requirements met**: 
   - 20+ questions per review
   - 10+ competencies (for qualifying positions)
   - 2+ questions per competence
5. **Uses existing libraries**: 
   - Question templates from `library/question-templates.ts`
   - Competencies from `library/competences.ts`
   - Clusters from `library/clusters.ts` (all 10 competencies)
6. **Proper relationships**: All foreign keys properly populated
7. **Realistic variations**: 
   - Different response statuses by cycle
   - Score distributions based on seniority
   - Feedback quality variations
8. **Same employees across cycles**: Allows tracking performance evolution

## Seeding Order

The seeds must be executed in this order (handled by `seeds.ts`):

1. Organisation (positions, teams, hierarchies)
2. Identity (users, roles)
3. Library (competences, question templates, relations, clusters - all 10 competencies)
4. **Feedback360**:
   1. Cycles (3 cycles)
   2. Reviews (26 reviews)
   3. Questions (created for all cycles)
   4. Review-Question Relations
   5. Respondents
   6. Reviewers
   7. Answers
   8. Cluster Scores

## Data Volume Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Cycles | 3 | Mid-Year 2025, Annual 2025, Annual 2026 |
| Reviews | 26 | 6 + 7 + 13 across cycles |
| Questions (total) | 156 | 52 questions × 3 cycles |
| Review-Question Relations | ~500+ | Varies by position competences |
| Respondents | ~150+ | 3 categories per review |
| Reviewers | ~60+ | Typically 3 per review |
| Answers | ~2000+ | For COMPLETED respondents only |
| Cluster Scores | ~300+ | One per competence per review |

## Historical vs Active Data

- **Mid-Year 2025** & **Annual 2025**: Fully completed with 100% response rate
- **Annual 2026**: Active cycle with mixed statuses (ongoing)

This structure allows for:
- Historical analysis and trends
- Year-over-year comparisons
- Performance evolution tracking
- Realistic current state modeling
