import { pool } from "../../db";

const createIssueInDB = async (payload: any, reporterId: number) => {
    const { title, description, type } = payload;

    if (!title || title.length > 150) {
        throw new Error("Title is required and must be maximum 150 characters");
    }
    if (!description || description.length < 20) {
        throw new Error("Description must be at least 20 characters long");
    }
    if (!['bug', 'feature_request'].includes(type)) {
        throw new Error("Type must be either 'bug' or 'feature_request'");
    }

    const query = `
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, 'open', $4)
        RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `;

    const values = [title, description, type, reporterId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getAllIssuesFromDB = async (filters: any) => {
    const { sort, type, status } = filters;

    let queryText = "SELECT * FROM issues WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (type) {
        queryText += ` AND type = $${paramIndex}`;
        queryParams.push(type);
        paramIndex++;
    }
    if (status) {
        queryText += ` AND status = $${paramIndex}`;
        queryParams.push(status);
        paramIndex++;
    }

    if (sort === "oldest") {
        queryText += " ORDER BY created_at ASC";
    } else {
        queryText += " ORDER BY created_at DESC";
    }

    const issuesResult = await pool.query(queryText, queryParams);
    const issues = issuesResult.rows;

    if (issues.length === 0) return [];

    const reporterIds = Array.from(new Set(issues.map((issue) => issue.reporter_id)));

    const usersQuery = `SELECT id, name, role FROM users WHERE id = ANY($1)`;
    const usersResult = await pool.query(usersQuery, [reporterIds]);

    const userMap: Record<number, any> = {};
    usersResult.rows.forEach((user) => {
        userMap[user.id] = user;
    });

    const finalData = issues.map((issue) => {
        const { reporter_id, ...issueData } = issue;
        return {
            ...issueData,
            reporter: userMap[reporter_id] || null
        };
    });

    return finalData;
};

const getSingleIssueFromDB = async (issueId: number) => {
    const issueQuery = "SELECT * FROM issues WHERE id = $1";
    const issueResult = await pool.query(issueQuery, [issueId]);
    const issue = issueResult.rows[0];

    if (!issue) {
        const error: any = new Error("Issue not found");
        error.statusCode = 404;
        throw error;
    }

    const userQuery = "SELECT id, name, role FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [issue.reporter_id]);
    const reporter = userResult.rows[0];

    const { reporter_id, ...issueData } = issue;
    return {
        ...issueData,
        reporter: reporter || null
    };
};

export const issueService = {
    createIssueInDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB
};