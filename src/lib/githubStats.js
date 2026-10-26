function buildDayMap() {
  const dayMap = {};
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    dayMap[date.toISOString().slice(0, 10)] = 0;
  }
  return dayMap;
}

export async function fetchGithubCommitStats({ owner, repo }) {
  if (!owner || !repo) {
    throw new Error('owner and repo are required');
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const headers = {
    Accept: 'application/vnd.github+json',
  };
  const repoUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const commitsUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=100&since=${encodeURIComponent(since)}`;

  const [repoResponse, commitsResponse] = await Promise.all([
    fetch(repoUrl, { headers }),
    fetch(commitsUrl, { headers }),
  ]);

  if (!repoResponse.ok) {
    throw new Error('Could not load repository details');
  }
  if (!commitsResponse.ok) {
    throw new Error('Could not load commit stats');
  }

  const repoData = await repoResponse.json();
  const commitsData = await commitsResponse.json();
  if (!Array.isArray(commitsData)) {
    throw new Error('Unexpected GitHub response');
  }

  const dayMap = buildDayMap();
  const authorMap = {};

  for (const commit of commitsData) {
    const commitDate = commit?.commit?.author?.date;
    const dateKey = commitDate ? commitDate.slice(0, 10) : null;
    const authorName = commit?.author?.login || commit?.commit?.author?.name || 'Unknown';

    if (dateKey && dayMap[dateKey] !== undefined) {
      dayMap[dateKey] += 1;
    }

    authorMap[authorName] = (authorMap[authorName] || 0) + 1;
  }

  const authors = Object.entries(authorMap)
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);

  return {
    repository: {
      name: repoData.name,
      fullName: repoData.full_name,
      url: repoData.html_url,
      stars: repoData.stargazers_count,
      defaultBranch: repoData.default_branch,
    },
    totalCommits: commitsData.length,
    lastCommitAt: commitsData[0]?.commit?.author?.date || null,
    authors,
    commitsByDay: Object.entries(dayMap).map(([date, commits]) => ({ date, commits })),
  };
}
