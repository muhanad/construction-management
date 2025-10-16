'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { Plus, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function IssuesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const { data: projects, isLoading } = trpc.projects.getAll.useQuery()

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

  // Get all issues from all projects
  const allIssues = projects?.flatMap(project => 
    project.issues?.map(issue => ({
      ...issue,
      projectName: project.name,
      projectStatus: project.status
    })) || []
  ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
            <p className="text-gray-600">Track and manage project issues and snags</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>

        {/* Issue Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold">{allIssues.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold">
                    {allIssues.filter(issue => issue.status === 'OPEN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">
                    {allIssues.filter(issue => issue.status === 'RESOLVED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold">
                    {allIssues.filter(issue => issue.severity === 'CRITICAL').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Issues</CardTitle>
            <CardDescription>
              View and manage all project issues and snags
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading issues...</div>
            ) : allIssues.length > 0 ? (
              <div className="space-y-4">
                {allIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{issue.title}</h3>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Project: {issue.projectName}</span>
                        {issue.assignee && (
                          <span>Assignee: {issue.assignee.name}</span>
                        )}
                        {issue.location && (
                          <span>Location: {issue.location}</span>
                        )}
                        {issue.dueDate && (
                          <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                        )}
                        <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No issues found</p>
                <p className="text-sm">Create your first issue to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
