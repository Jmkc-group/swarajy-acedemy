import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { EmptyState } from '@/components/common/EmptyState'
import { AchievementCard } from '@/components/common/AchievementCard'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { ACHIEVEMENTS, ACHIEVEMENT_POSTS, ACHIEVEMENT_YEARS, ALUMNI } from '@/data/achievements'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// "Our Alumni" page (route /alumni).
export default function AchievementsPage() {
  const { t } = useLanguage()
  const [year, setYear] = useState('all')
  const [post, setPost] = useState('all')

  const filtered = useMemo(
    () =>
      ALUMNI.filter((r) => (year === 'all' || String(r.year) === year) && (post === 'all' || r.post === post)).sort(
        (a, b) => b.year - a.year,
      ),
    [year, post],
  )

  // Selection counts per post — only from real records, never from samples.
  const counts = ACHIEVEMENT_POSTS.map((p) => [p, ACHIEVEMENTS.filter((r) => r.post === p).length]).filter(([, n]) => n > 0)

  return (
    <>
      <Seo page="achievements" />
      <PageHero eyebrow={t('achievements.eyebrow')} title={t('achievements.title')} subtitle={t('achievements.subtitle')}>
        {counts.length > 0 && (
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {counts.map(([p, n]) => (
              <li key={p} className="rounded-xl border border-gold/40 bg-white/5 px-5 py-2.5 text-white">
                <span className="text-2xl font-extrabold text-gold tabular-nums">{n}</span>{' '}
                <span className="font-semibold">{t(`achievements.posts.${p}`)}</span>
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <section className="section-y bg-surface" aria-label={t('achievements.title')}>
        <div className="container-page">
          {/* Year filter as chips, post filter as a select */}
          <div className="flex flex-col gap-5 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 md:flex-row md:items-end md:justify-between">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{t('achievements.filterYear')}</legend>
              <div className="flex flex-wrap gap-2">
                {['all', ...ACHIEVEMENT_YEARS.map(String)].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={year === value ? 'default' : 'outline'}
                    aria-pressed={year === value}
                    onClick={() => setYear(value)}
                    className={cn('h-9 px-4', year !== value && 'text-forest')}
                  >
                    {value === 'all' ? t('achievements.allYears') : value}
                  </Button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2 md:w-60">
              <Label htmlFor="achievement-post">{t('achievements.filterPost')}</Label>
              <Select value={post} onValueChange={setPost}>
                <SelectTrigger id="achievement-post" className="h-10 w-full text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">{t('achievements.allPosts')}</SelectItem>
                  {ACHIEVEMENT_POSTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`achievements.posts.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-10" aria-live="polite">
            {filtered.length === 0 ? (
              <EmptyState icon={SearchX} title={t('achievements.noMatchTitle')} description={t('achievements.noMatchDesc')} />
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((record, index) => (
                  <Reveal as="li" key={record.id} delay={(index % 4) * 0.05}>
                    <AchievementCard record={record} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
