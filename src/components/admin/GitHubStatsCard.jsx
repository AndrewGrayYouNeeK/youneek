import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, GitCommit, Loader2, RefreshCw, Users, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function GitHubStatsCard() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [activeRepo, setActiveRepo] = useState(null);

  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['github-commit-stats', activeRepo?.owner, activeRepo?.repo],
    enabled: Boolean(activeRepo?.owner && activeRepo?.repo),
    refetchInterval: 300000,
    queryFn: async () => {
      const response = await base44.functions.invoke('githubCommitStats', activeRepo);
      return response.data;
    },
  });

  const highestDay = Math.max(...(data?.commitsByDay?.map((day) => day.commits) || [1]));

  return (
    <Card className="bg-white/5 border-white/10 mb-8">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            GitHub Commit Stats
          </CardTitle>
          <p className="text-sm text-white/50 mt-1">Track public repository commits from GitHub on this dashboard.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Repository owner"
            className="bg-white/5 border-white/10 text-white md:w-48"
          />
          <Input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Repository name"
            className="bg-white/5 border-white/10 text-white md:w-48"
          />
          <Button
            onClick={() => setActiveRepo({ owner: owner.trim(), repo: repo.trim() })}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            disabled={!owner.trim() || !repo.trim()}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Load Stats
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!activeRepo ? (
          <div className="text-white/40 text-sm">Enter a public GitHub repo to load the latest 30-day commit stats.</div>
        ) : error ? (
          <div className="text-red-300 text-sm">Could not load GitHub stats for {activeRepo.owner}/{activeRepo.repo}.</div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-white">{data.repository.fullName}</div>
                <div className="text-sm text-white/50">Default branch: {data.repository.defaultBranch}</div>
              </div>
              <div className="flex gap-2">
                <a href={data.repository.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Repo
                  </Button>
                </a>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" onClick={() => refetch()}>
                  {isFetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <GitCommit className="w-4 h-4 text-orange-400" />
                  Commits (30d)
                </div>
                <div className="text-3xl font-bold text-white">{data.totalCommits}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Top Author
                </div>
                <div className="text-2xl font-bold text-white">{data.authors[0]?.name || '—'}</div>
                <div className="text-sm text-white/50 mt-1">{data.authors[0]?.commits || 0} commits</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  Last Commit
                </div>
                <div className="text-2xl font-bold text-white">
                  {data.lastCommitAt ? formatDistanceToNow(new Date(data.lastCommitAt), { addSuffix: true }) : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold text-white mb-3">Top Contributors</div>
                <div className="space-y-2">
                  {data.authors.length === 0 ? (
                    <div className="text-white/40 text-sm">No commit authors found.</div>
                  ) : (
                    data.authors.map((author) => (
                      <div key={author.name} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-white">{author.name}</div>
                        <div className="text-white/60 text-sm">{author.commits} commits</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-white mb-3">Daily Activity</div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-end gap-1 h-36">
                    {data.commitsByDay.map((day) => (
                      <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-orange-500 to-yellow-400 min-h-[4px]"
                          style={{ height: `${Math.max((day.commits / highestDay) * 100, day.commits > 0 ? 8 : 4)}%` }}
                          title={`${day.date}: ${day.commits} commits`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] text-white/40 mt-3">
                    <span>30d ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}