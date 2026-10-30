import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { DataTable, Empty, Loaded, Page, Panel, Pill, Select, Stat, Td, fmtDate, money, useLoad, waLink } from '../ui'
import { IndianRupee } from 'lucide-react'

export default function Fees() {
  const state = useLoad('/admin/fees')
  const [filter, setFilter] = useState('due')
  const rows = useMemo(() => {
    const all = (state.data ?? []).filter((s) => s.active)
    if (filter === 'due') return all.filter((s) => s.total > s.paid)
    if (filter === 'clear') return all.filter((s) => s.total <= s.paid && s.total > 0)
    return all
  }, [state.data, filter])
  const totals = useMemo(() => {
    const all = (state.data ?? []).filter((s) => s.active)
    const total = all.reduce((a, s) => a + s.total, 0)
    const paid = all.reduce((a, s) => a + s.paid, 0)
    return { total, paid, due: Math.max(0, total - paid) }
  }, [state.data])

  return (
    <Page title="Fees" subtitle="Who has paid, who is pending — send reminders on WhatsApp"
      actions={
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
          <option value="due">Pending only</option>
          <option value="clear">Fully paid</option>
          <option value="all">Everyone</option>
        </Select>
      }>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={IndianRupee} tone="navy" label="Total fees" value={money(totals.total)} />
        <Stat icon={IndianRupee} label="Collected" value={money(totals.paid)} />
        <Stat icon={IndianRupee} tone="red" label="Pending" value={money(totals.due)} />
      </div>
      <Panel flush>
        <Loaded state={state}>
          {() =>
            rows.length === 0 ? (
              <Empty>Nothing to show for this filter.</Empty>
            ) : (
              <DataTable head={['Student', 'Total', 'Paid', 'Due', 'Last payment', '']}>
                {rows.map((s) => {
                  const due = s.total - s.paid
                  const wa = waLink(s.parent_phone || s.phone, `Namaste, Swarajya Career Academy kadun reminder: ${s.name} (${s.login_id}) yanchi ${money(due)} fee baaki aahe. Krupaya bharna karave. Dhanyavaad.`)
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <Td><Link to={`/admin/students/${s.id}`} className="font-medium text-navy hover:underline">{s.name}</Link><div className="text-xs text-muted-foreground">{s.login_id}</div></Td>
                      <Td className="tabular-nums">{money(s.total)}</Td>
                      <Td className="tabular-nums text-leaf">{money(s.paid)}</Td>
                      <Td className="tabular-nums">{due > 0 ? <b className="text-red-600">{money(due)}</b> : <Pill tone="green">Paid</Pill>}</Td>
                      <Td>{fmtDate(s.last_paid)}</Td>
                      <Td className="text-right">
                        {due > 0 && wa && (
                          <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2.5 py-1.5 text-xs font-semibold text-green-700">
                            <MessageCircle className="size-3.5" /> Remind
                          </a>
                        )}
                      </Td>
                    </tr>
                  )
                })}
              </DataTable>
            )
          }
        </Loaded>
      </Panel>
    </Page>
  )
}
