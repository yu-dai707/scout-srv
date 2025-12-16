'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CompanyApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const applicationId = Number(params.id)

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(applicationId)) {
      setError('Invalid application id')
      setLoading(false)
      return
    }

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/company/applications/${applicationId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? '蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆')
        setData(json)
      } catch (e: any) {
        setError(e.message ?? '繧ｵ繝ｼ繝舌・繧ｨ繝ｩ繝ｼ')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [applicationId])

  if (loading) return <p className="p-6">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div className="p-6">
      <Link href="/company/applications">竊・蠢懷供閠・ｸ隕ｧ縺ｫ謌ｻ繧・</Link>
      <pre className="mt-4 bg-slate-100 p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
