export async function fetchGitHubStats() {
    const username = 'stampplus';
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch GitHub stats');
        const data = await response.json();
        return {
            repos: data.public_repos,
            followers: data.followers
        };
    } catch (error) {
        console.error('GitHub API Error:', error);
        return null;
    }
}
