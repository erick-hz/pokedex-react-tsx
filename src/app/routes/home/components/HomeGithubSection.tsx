import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import { CopyBlock, FallbackImage, SectionCard } from '@shared/ui';

type HomeGithubSectionProps = Pick<
  HomePageModel,
  | 't'
  | 'githubRepoQuery'
  | 'githubCommitsQuery'
  | 'githubStats'
  | 'githubMetadata'
  | 'githubRecentCommits'
  | 'formatRepoDate'
>;

function GithubStatsGrid({ t, githubStats }: Pick<HomeGithubSectionProps, 't' | 'githubStats'>) {
  return (
    <div className="github-stat-grid">
      <article className="github-stat-card">
        <span>{t('homeDynamic.github.stars')}</span>
        <strong>{githubStats.stars}</strong>
      </article>
      <article className="github-stat-card">
        <span>{t('homeDynamic.github.forks')}</span>
        <strong>{githubStats.forks}</strong>
      </article>
      <article className="github-stat-card">
        <span>{t('homeDynamic.github.issues')}</span>
        <strong>{githubStats.issues}</strong>
      </article>
      <article className="github-stat-card">
        <span>{t('homeDynamic.github.language')}</span>
        <strong>{githubStats.language}</strong>
      </article>
    </div>
  );
}

function GithubMetaGrid({
  t,
  githubMetadata,
  formatRepoDate,
}: Pick<HomeGithubSectionProps, 't' | 'githubMetadata' | 'formatRepoDate'>) {
  return (
    <div className="github-meta-grid">
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.owner')}</span>
        <strong>{githubMetadata.owner}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.visibility')}</span>
        <strong>{githubMetadata.visibility}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.branch')}</span>
        <strong>{githubMetadata.branch}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.licenseLabel')}</span>
        <strong>{githubMetadata.license}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.watchers')}</span>
        <strong>{githubMetadata.watchers}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.size')}</span>
        <strong>{githubMetadata.sizeKb} KB</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.created')}</span>
        <strong>{formatRepoDate(githubMetadata.createdAt)}</strong>
      </article>
      <article className="github-meta-item">
        <span>{t('homeDynamic.github.updated')}</span>
        <strong>{formatRepoDate(githubMetadata.updatedAt)}</strong>
      </article>
    </div>
  );
}

function GithubTopics({ t, githubMetadata }: Pick<HomeGithubSectionProps, 't' | 'githubMetadata'>) {
  if (githubMetadata.topics.length === 0) {
    return null;
  }

  return (
    <div className="github-topic-list" aria-label={t('homeDynamic.github.topics')}>
      {githubMetadata.topics.map((topic) => (
        <span key={topic} className="github-topic-chip">
          #{topic}
        </span>
      ))}
    </div>
  );
}

function GithubCommitList({
  t,
  githubCommitsQuery,
  githubRecentCommits,
  formatRepoDate,
}: Pick<
  HomeGithubSectionProps,
  't' | 'githubCommitsQuery' | 'githubRecentCommits' | 'formatRepoDate'
>) {
  return (
    <div className="github-commit-section">
      <p className="route-mission-label">{t('homeDynamic.github.recentCommits')}</p>

      <div className="github-commit-list">
        {githubRecentCommits.map((commit) => (
          <article key={commit.id} className="github-commit-item">
            {commit.url ? (
              <a href={commit.url} target="_blank" rel="noreferrer" className="github-commit-link">
                {commit.title}
              </a>
            ) : (
              <strong className="github-commit-title">{commit.title}</strong>
            )}

            <span className="github-commit-meta">
              {t('homeDynamic.github.commitBy', {
                author: commit.author,
                date: formatRepoDate(commit.date),
              })}
            </span>
          </article>
        ))}

        {!githubCommitsQuery.isLoading &&
        !githubCommitsQuery.isError &&
        githubRecentCommits.length === 0 ? (
          <p className="route-home-copy">{t('homeDynamic.github.noCommits')}</p>
        ) : null}
      </div>
    </div>
  );
}

export function HomeGithubSection({
  t,
  githubRepoQuery,
  githubCommitsQuery,
  githubStats,
  githubMetadata,
  githubRecentCommits,
  formatRepoDate,
}: HomeGithubSectionProps) {
  return (
    <SectionCard
      eyebrow={t('homeDynamic.github.eyebrow')}
      title={t('homeDynamic.github.title')}
      className="github-panel-card"
    >
      <div className="github-panel-head">
        <FallbackImage
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
          className="github-logo"
          loading="lazy"
        />

        <div className="github-panel-meta">
          <strong>{String(githubRepoQuery.data?.full_name ?? 'pokedex-react-tsx')}</strong>
          <a
            href={String(
              githubRepoQuery.data?.html_url ?? 'https://github.com/erick-hz/pokedex-react-tsx',
            )}
            target="_blank"
            rel="noreferrer"
            className="route-cta route-cta-muted"
          >
            {t('homeDynamic.github.openRepo')}
          </a>
        </div>
      </div>

      <GithubStatsGrid t={t} githubStats={githubStats} />

      <CopyBlock className="github-description">{githubMetadata.description}</CopyBlock>

      <GithubMetaGrid t={t} githubMetadata={githubMetadata} formatRepoDate={formatRepoDate} />

      <GithubTopics t={t} githubMetadata={githubMetadata} />

      <GithubCommitList
        t={t}
        githubCommitsQuery={githubCommitsQuery}
        githubRecentCommits={githubRecentCommits}
        formatRepoDate={formatRepoDate}
      />

      {githubRepoQuery.isLoading ? (
        <p className="route-home-copy">{t('homeDynamic.github.loading')}</p>
      ) : githubRepoQuery.isError ? (
        <p className="route-home-copy">{t('homeDynamic.github.error')}</p>
      ) : null}

      {githubCommitsQuery.isLoading ? (
        <p className="route-home-copy">{t('homeDynamic.github.loadingCommits')}</p>
      ) : githubCommitsQuery.isError ? (
        <p className="route-home-copy">{t('homeDynamic.github.errorCommits')}</p>
      ) : null}
    </SectionCard>
  );
}
