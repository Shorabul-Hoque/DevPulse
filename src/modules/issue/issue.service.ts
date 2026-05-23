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

const updateIssueInDB = async (issueId: number, payload: any, user: { id: number; role: string }) => {
    const { title, description, type, status } = payload;

    const checkQuery = "SELECT * FROM issues WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [issueId]);
    const issue = checkResult.rows[0];

    if (!issue) {
        const error: any = new Error("Issue not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "contributor") {

        if (issue.reporter_id !== user.id) {
            const error: any = new Error("You do not have permission to update this issue");
            error.statusCode = 403;
            throw error;
        }

        if (issue.status !== "open") {
            const error: any = new Error("Cannot edit an issue that is already in progress or resolved");
            error.statusCode = 409;
            throw error;
        }

        if (status && status !== issue.status) {
            const error: any = new Error("Contributors are not allowed to change workflow status");
            error.statusCode = 403;
            throw error;
        }
    }

    const updatedTitle = title !== undefined ? title : issue.title;
    const updatedDescription = description !== undefined ? description : issue.description;
    const updatedType = type !== undefined ? type : issue.type;
    const updatedStatus = status !== undefined ? status : issue.status;

    if (updatedTitle.length > 150) throw new Error("Title must be maximum 150 characters");
    if (updatedDescription.length < 20) throw new Error("Description must be at least 20 characters");

    const updateQuery = `
        UPDATE issues 
        SET title = $1, description = $2, type = $3, status = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, [
        updatedTitle,
        updatedDescription,
        updatedType,
        updatedStatus,
        issueId
    ]);

    return result.rows[0];
};

export const issueService = {
    createIssueInDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueInDB
};