import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_PAT = process.env.NEXT_PUBLIC_GITHUB_PAT;

const octokit = new Octokit({
    auth: GITHUB_PAT,
});

const repo = {
    owner: "daviddossett",
    repo: "grid-playground",
};

type IssuesResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
type RepoDetailsResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
type UserResponse = Endpoints["GET /users/{username}"]["response"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { endpoint, username } = req.query;

    try {
        if (endpoint === "issues") {
            const issues = await fetchIssues();
            res.status(200).json(issues);
        } else if (endpoint === "repo") {
            const repoDetails = await fetchRepoDetails();
            res.status(200).json(repoDetails);
        } else if (endpoint === "avatar" && typeof username === "string") {
            const avatarUrl = await fetchUserAvatarUrl(username);
            res.status(200).json({ avatar_url: avatarUrl });
        } else {
            res.status(400).json({ error: "Invalid endpoint" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

const fetchIssues = async (): Promise<IssuesResponse["data"]> => {
    const response: IssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        ...repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    return response.data;
};

const fetchRepoDetails = async (): Promise<RepoDetailsResponse["data"]> => {
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
