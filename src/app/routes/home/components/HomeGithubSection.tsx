import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import { CopyBlock, FallbackImage, LabeledValueCard, SectionCard, StatusMessage } from '@shared/ui';

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
      <LabeledValueCard
        label={t('homeDynamic.github.stars')}
        value={githubStats.stars}
        className="github-stat-card"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.forks')}
        value={githubStats.forks}
        className="github-stat-card"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.issues')}
        value={githubStats.issues}
        className="github-stat-card"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.language')}
        value={githubStats.language}
        className="github-stat-card"
      />
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
      <LabeledValueCard
        label={t('homeDynamic.github.owner')}
        value={githubMetadata.owner}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.visibility')}
        value={githubMetadata.visibility}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.branch')}
        value={githubMetadata.branch}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.licenseLabel')}
        value={githubMetadata.license}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.watchers')}
        value={githubMetadata.watchers}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.size')}
        value={`${githubMetadata.sizeKb} KB`}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.created')}
        value={formatRepoDate(githubMetadata.createdAt)}
        className="github-meta-item"
      />
      <LabeledValueCard
        label={t('homeDynamic.github.updated')}
        value={formatRepoDate(githubMetadata.updatedAt)}
        className="github-meta-item"
      />
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
          <StatusMessage>{t('homeDynamic.github.noCommits')}</StatusMessage>
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
        <StatusMessage>{t('homeDynamic.github.loading')}</StatusMessage>
      ) : githubRepoQuery.isError ? (
        <StatusMessage>{t('homeDynamic.github.error')}</StatusMessage>
      ) : null}

      {githubCommitsQuery.isLoading ? (
        <StatusMessage>{t('homeDynamic.github.loadingCommits')}</StatusMessage>
      ) : githubCommitsQuery.isError ? (
        <StatusMessage>{t('homeDynamic.github.errorCommits')}</StatusMessage>
      ) : null}
    </SectionCard>
  );
}
