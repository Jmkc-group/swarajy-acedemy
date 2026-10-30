import { Bar, DataTable, Empty, Loaded, Page, Panel, Pill, Stat, Td, fmtDate, money, pct, useLoad } from '../ui'
import { CalendarCheck, IndianRupee } from 'lucide-react'

const LABEL = { P: ['Present', 'green'], A: ['Absent', 'red'], L: ['Leave', 'gold'] }

export function MyAttendance() {
  const state = useLoad('/student/attendance')
  return (
    <Page title="My attendance">
      <Loaded state={state}>
        {(d) => {
          const p = pct(d.summary.present, d.summary.marked)
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <Stat icon={CalendarCheck} tone={p >= 75 || !d.summary.marked ? 'green' : 'red'} label="Attendance" value={d.summary.marked ? `${p}%` : '—'} />
                <Stat label="Present" value={d.summary.present} />
                <Stat tone="red" label="Absent" value={d.summary.absent} />
                <Stat tone="gold" label="Leave" value={d.summary.leave} />
              </div>
              {d.summary.marked > 0 && p < 75 && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Your attendance is below 75%. Please attend regularly.</p>}
              <Panel title="Day by day" flush>
                {d.records.length === 0 ? <Empty>Attendance has not been marked yet.</Empty> : (
                  <DataTable head={['Date', 'Status']}>
                    {d.records.map((r) => <tr key={r.date}><Td>{fmtDate(r.date)}</Td><Td><Pill tone={LABEL[r.status][1]}>{LABEL[r.status][0]}</Pill></Td></tr>)}
                  </DataTable>
                )}
              </Panel>
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}

export function MyFees() {
  const state = useLoad('/student/fees')
  return (
    <Page title="My fees">
      <Loaded state={state}>
        {(d) => {
          const paid = d.payments.reduce((a, x) => a + x.amount, 0)
          const due = Math.max(0, d.fee.total - paid)
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat icon={IndianRupee} tone="navy" label="Total fee" value={money(d.fee.total)} />
                <Stat icon={IndianRupee} label="Paid" value={money(paid)} />
                <Stat icon={IndianRupee} tone={due ? 'red' : 'green'} label="Remaining" value={due ? money(due) : 'Clear'} />
              </div>
              <Bar value={pct(paid, d.fee.total)} tone="bg-gold" />
              <Panel title="Payment history" flush>
                {d.payments.length === 0 ? <Empty>No payments recorded yet.</Empty> : (
                  <DataTable head={['Receipt', 'Date', 'Mode', 'Amount']}>
                    {d.payments.map((p) => <tr key={p.id}><Td className="font-mono text-xs">{p.receipt_no}</Td><Td>{fmtDate(p.paid_on)}</Td><Td>{p.mode}</Td><Td className="font-semibold tabular-nums">{money(p.amount)}</Td></tr>)}
                  </DataTable>
                )}
              </Panel>
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}
