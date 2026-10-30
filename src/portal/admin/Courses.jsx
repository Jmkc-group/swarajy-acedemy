import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { DataTable, Loaded, Page, Panel, Pill, Td, inputCls, useAction, useLoad } from '../ui'

export default function Courses() {
  const state = useLoad('/admin/courses')
  const [title, setTitle] = useState('')
  const [busy, run] = useAction()

  const add = async (e) => {
    e.preventDefault()
    const ok = await run(() => api.post('/admin/courses', { title }), 'Course added.')
    if (ok) { setTitle(''); state.reload() }
  }

  return (
    <Page title="Courses" subtitle="Courses students can be enrolled in. Notes, questions and tests belong to a course.">
      <form onSubmit={add} className="flex max-w-xl gap-2">
        <input className={inputCls} placeholder="New course name" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80} aria-label="New course name" />
        <Button type="submit" disabled={busy}><Plus /> Add</Button>
      </form>
      <Panel flush>
        <Loaded state={state}>
          {(rows) => (
            <DataTable head={['Course', 'Students', 'Notes', 'Questions', 'Tests', 'Status']}>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium">{c.title}</Td>
                  <Td className="tabular-nums">{c.students}</Td>
                  <Td className="tabular-nums">{c.notes}</Td>
                  <Td className="tabular-nums">{c.questions}</Td>
                  <Td className="tabular-nums">{c.tests}</Td>
                  <Td>
                    <button type="button" disabled={busy} title="Click to toggle"
                      onClick={async () => { await run(() => api.patch(`/admin/courses/${c.id}`, { active: !c.active })); state.reload() }}>
                      <Pill tone={c.active ? 'green' : 'slate'}>{c.active ? 'Active' : 'Hidden'}</Pill>
                    </button>
                  </Td>
                </tr>
              ))}
            </DataTable>
          )}
        </Loaded>
      </Panel>
    </Page>
  )
}
