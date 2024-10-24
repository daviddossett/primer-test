import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_PAT = process.env.GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

export type IssuesResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
type RepoDetailsResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
type UserResponse = Endpoints["GET /users/{username}"]["response"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { endpoint, username, page, owner, repo, path } = req.query;

    try {
        if (endpoint === "issues" && req.method === "GET") {
            const issues = await fetchIssues({ owner: owner as string, repo: repo as string }, Number(page) || 1);
            res.status(200).json(issues);
        } else if (endpoint === "issues" && req.method === "POST") {
            const { title, body } = req.body;
            const newIssue = await createIssue({ owner: owner as string, repo: repo as string }, title, body);
            res.status(201).json(newIssue);
        } else if (endpoint === "repo") {
            const repoDetails = await fetchRepoDetails({ owner: owner as string, repo: repo as string });
            res.status(200).json(repoDetails);
        } else if (endpoint === "avatar" && typeof username === "string") {
            const avatarUrl = await fetchUserAvatarUrl(username);
            res.status(200).json({ avatar_url: avatarUrl });
        } else if (endpoint === "content" && typeof path === "string") {
            const content = await fetchFileContent({ owner: owner as string, repo: repo as string }, path);
            res.status(200).json(content);
        } else {
            res.status(400).json({ error: "Invalid endpoint" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

const fetchIssues = async (repo: { owner: string, repo: string }, page: number): Promise<IssuesResponse["data"]> => {
    const response: IssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        state: "open",
        per_page: 30,
        page: page
    });

    return response.data;
};

const fetchRepoDetails = async (repo: { owner: string, repo: string }): Promise<RepoDetailsResponse["data"]> => {
    const response: RepoDetailsResponse = await octokit.request("GET /repos/{owner}/{repo}", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data;
};

const fetchUserAvatarUrl = async (username: string): Promise<string> => {
    const response: UserResponse = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data.avatar_url;
};

const createIssue = async (repo: { owner: string, repo: string }, title: string, body: string) => {
    const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        ...repo,
        title,
        body,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });

    return response.data;
};

const fetchFileContent = async (repo: { owner: string, repo: string }, path: string) => {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        ...repo,
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });

    return response.data;
};

