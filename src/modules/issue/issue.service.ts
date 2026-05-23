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

export const issueService = {
    createIssueInDB,
};