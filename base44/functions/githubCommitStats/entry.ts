import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { owner, repo } = await req.json();

    if (!owner || !repo) {
      return Response.json({ error: 'owner and repo are required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Base44-GitHub-Stats',
    };

    const repoUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    const commitsUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=100&since=${encodeURIComponent(since)}`;

    const [repoResponse, commitsResponse] = await Promise.all([
      fetch(repoUrl, { headers }),
      fetch(commitsUrl, { headers }),
    ]);

    if (!repoResponse.ok) {
      const details = await repoResponse.text();
      console.error('githubCommitStats repo error', details);
      return Response.json({ error: 'Could not load repository details' }, { status: repoResponse.status });
    }

    if (!commitsResponse.ok) {
      const details = await commitsResponse.text();
      console.error('githubCommitStats commits error', details);
      return Response.json({ error: 'Could not load commit stats' }, { status: commitsResponse.status });
    }

    const repoData = await repoResponse.json();
    const commitsData = await commitsResponse.json();

    if (!Array.isArray(commitsData)) {
      console.error('githubCommitStats unexpected commits payload', commitsData);
      return Response.json({ error: 'Unexpected GitHub response' }, { status: 500 });
    }

    const dayMap = {};
    for (let i = 29; i >= 0; i -= 1) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - i);
      const key = date.toISOString().slice(0, 10);
      dayMap[key] = 0;
    }

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

    const commitsByDay = Object.entries(dayMap).map(([date, commits]) => ({ date, commits }));

    return Response.json({
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
      commitsByDay,
    });
  } catch (error) {
    console.error('githubCommitStats error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});