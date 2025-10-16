'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { 
  FolderOpen, 
  CheckSquare, 
  AlertTriangle, 
  CreditCard,
  TrendingUp,
  Users
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getAll.useQuery()

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

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderOpen,
      description: 'Active construction projects',
    },
    {
      title: 'Active Tasks',
      value: projects?.reduce((acc, project) => acc + (project._count?.tasks || 0), 0) || 0,
      icon: CheckSquare,
      description: 'Tasks in progress',
    },
    {
      title: 'Open Issues',
      value: projects?.reduce((acc, project) => acc + (project._count?.issues || 0), 0) || 0,
      icon: AlertTriangle,
      description: 'Issues requiring attention',
    },
    {
      title: 'Total Invoices',
      value: projects?.reduce((acc, project) => acc + (project._count?.invoices || 0), 0) || 0,
      icon: CreditCard,
      description: 'Invoices generated',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user?.name || 'User'}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest construction projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="text-center py-4">Loading projects...</div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.status}</p>
                      <p className="text-xs text-gray-600">
                        {project.budget ? `£${project.budget.toLocaleString()}` : 'No budget set'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No projects found. Create your first project to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
