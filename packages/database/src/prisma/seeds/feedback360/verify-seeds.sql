-- Verify feedback360 seed data

-- 1. Review summary with questions and competencies
SELECT
    u.full_name as employee,
    r.ratee_position_title as position,
    t.title as team,
    COUNT(DISTINCT rqr.id) as questions,
    COUNT(DISTINCT rqr.competence_id) as competencies,
    COUNT(DISTINCT resp.id) as respondents,
    COUNT(DISTINCT a.id) as answers,
    COUNT(DISTINCT cs.id) as cluster_scores
FROM
    feedback360_reviews r
    JOIN identity_users u ON r.ratee_id = u.id
    LEFT JOIN org_teams t ON r.team_id = t.id
    LEFT JOIN feedback360_review_question_relations rqr ON r.id = rqr.review_id
    LEFT JOIN feedback360_respondents resp ON r.id = resp.review_id
    LEFT JOIN feedback360_answers a ON r.id = a.review_id
    LEFT JOIN feedback360_clusters_scores cs ON r.id = cs.review_id
GROUP BY
    u.full_name,
    r.ratee_position_title,
    t.title
ORDER BY competencies DESC, questions DESC;

-- 2. Questions per competence breakdown (verify minimum 2 questions per competence)
SELECT
    u.full_name as employee,
    c.title as competence,
    COUNT(rqr.id) as questions_count
FROM
    feedback360_reviews r
    JOIN identity_users u ON r.ratee_id = u.id
    JOIN feedback360_review_question_relations rqr ON r.id = rqr.review_id
    JOIN library_competences c ON rqr.competence_id = c.id
GROUP BY
    u.full_name,
    c.title
HAVING
    COUNT(rqr.id) >= 2
ORDER BY u.full_name, c.title;

-- 3. Respondent breakdown by category
SELECT
    u.full_name as employee,
    resp.category,
    COUNT(*) as respondent_count,
    COUNT(
        CASE
            WHEN resp.response_status = 'COMPLETED' THEN 1
        END
    ) as completed,
    COUNT(
        CASE
            WHEN resp.response_status = 'IN_PROGRESS' THEN 1
        END
    ) as in_progress,
    COUNT(
        CASE
            WHEN resp.response_status = 'PENDING' THEN 1
        END
    ) as pending
FROM
    feedback360_reviews r
    JOIN identity_users u ON r.ratee_id = u.id
    JOIN feedback360_respondents resp ON r.id = resp.review_id
GROUP BY
    u.full_name,
    resp.category
ORDER BY u.full_name, resp.category;

-- 4. Overall statistics
SELECT 'Cycles' as entity, COUNT(*) as count
FROM feedback360_cycles
UNION ALL
SELECT 'Reviews' as entity, COUNT(*) as count
FROM feedback360_reviews
UNION ALL
SELECT 'Questions (cycle)' as entity, COUNT(*) as count
FROM feedback360_questions
UNION ALL
SELECT 'Review-Question Relations' as entity, COUNT(*) as count
FROM
    feedback360_review_question_relations
UNION ALL
SELECT 'Respondents' as entity, COUNT(*) as count
FROM feedback360_respondents
UNION ALL
SELECT 'Reviewers' as entity, COUNT(*) as count
FROM feedback360_reviewers
UNION ALL
SELECT 'Answers' as entity, COUNT(*) as count
FROM feedback360_answers
UNION ALL
SELECT 'Cluster Scores' as entity, COUNT(*) as count
FROM feedback360_clusters_scores;