'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function TimesheetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
            <p className="text-gray-600">Manage timesheets</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Timesheets
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Timesheets</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">Coming Soon</p>
              <p className="text-sm">This feature is currently under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
