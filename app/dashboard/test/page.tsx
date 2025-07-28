"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  MoreHorizontal,
  Search,
  Loader2,
  Trash2,
  Eye,
  BarChart3,
  Users,
  Clock,
  Target,
  TrendingUp,
  User,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { 
  fetchTestResults, 
  fetchTestStats,
  deleteTestResult,
  selectTestResults,
  selectTestLoading,
  selectTestError,
  selectTestStats,
  TestResult,
  TestStats
} from "@/lib/redux/features/testSlice"
import { AppDispatch } from "@/lib/redux/store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestPage() {
  const dispatch = useDispatch<AppDispatch>()
  const testResults = useSelector(selectTestResults)
  const isLoading = useSelector(selectTestLoading)
  const error = useSelector(selectTestError)
  const testStats = useSelector(selectTestStats)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchTestResults())
    dispatch(fetchTestStats())
  }, [dispatch])

  const filteredTestResults = testResults.filter(test =>
    test.userDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.userDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.userDetails.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selectedTest) return

    try {
      await dispatch(deleteTestResult(selectedTest.id)).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedTest(null)
      toast.success("Test result deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete test result")
    }
  }

  const openViewDialog = (test: TestResult) => {
    setSelectedTest(test)
    setIsViewDialogOpen(true)
  }

  const getAverageMatchPercentage = (test: TestResult) => {
    if (!test.recommendations || test.recommendations.length === 0) return 0
    const total = test.recommendations.reduce((sum, rec) => sum + rec.matchPercentage, 0)
    return Math.round(total / test.recommendations.length)
  }

  const getMostCommonCategory = (test: TestResult) => {
    const categoryCount: Record<string, number> = {}
    test.answers.forEach(answer => {
      categoryCount[answer.category] = (categoryCount[answer.category] || 0) + 1
    })
    
    const sorted = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)
    return sorted.length > 0 ? sorted[0][0] : "N/A"
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Button 
          onClick={() => dispatch(fetchTestResults())}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Test Results Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button 
            onClick={() => setIsStatsDialogOpen(true)}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
          >
            <BarChart3 className="w-4 h-4" />
            View Statistics
          </Button>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-muted-foreground">
              Psychometric assessments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(testResults.map(t => t.userDetails.email)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults.length > 0 
                ? Math.round(testResults.reduce((sum, t) => sum + (t.testDuration || 0), 0) / testResults.length)
                : 0}s
            </div>
            <p className="text-xs text-muted-foreground">
              Average test completion time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Match %</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults.length > 0 
                ? Math.round(testResults.reduce((sum, t) => sum + getAverageMatchPercentage(t), 0) / testResults.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average career match percentage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search by name, email, phone..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="pl-9" 
        />
      </div>

      {/* Responsive Table */}
      <motion.div layout className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">User Details</TableHead>
                <TableHead className="min-w-[120px]">Test Info</TableHead>
                <TableHead className="min-w-[100px]">Questions</TableHead>
                <TableHead className="min-w-[100px]">Duration</TableHead>
                <TableHead className="min-w-[150px]">Top Match</TableHead>
                <TableHead className="min-w-[120px]">Categories</TableHead>
                <TableHead className="min-w-[120px]">Created</TableHead>
                <TableHead className="text-right min-w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && testResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto"/>
                  </TableCell>
                </TableRow>
              ) : filteredTestResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">No test results found</TableCell>
                </TableRow>
              ) : (
                filteredTestResults.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium truncate" title={test.userDetails.name}>
                          {test.userDetails.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate" title={test.userDetails.email}>
                            {test.userDetails.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate" title={test.userDetails.phone}>
                            {test.userDetails.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium truncate" title={`Test #${test.id.slice(-8)}`}>
                          Test #{test.id.slice(-8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {test.recommendations.length} recommendations
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {test.totalQuestions || test.questions.length} questions
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {test.testDuration ? `${test.testDuration}s` : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {test.recommendations.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium truncate" title={test.recommendations[0].title}>
                            {test.recommendations[0].title}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {test.recommendations[0].matchPercentage}% match
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate" title={getMostCommonCategory(test)}>
                        {getMostCommonCategory(test)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {test.createdAt ? format(new Date(test.createdAt), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(test)}>
                            <Eye className="mr-2 h-4 w-4"/>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50" 
                            onSelect={() => {
                              setSelectedTest(test)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* View Test Details Dialog - Responsive */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Result Details</DialogTitle>
            <DialogDescription>
              Detailed view of the psychometric test result
            </DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-6">
              {/* User Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-muted-foreground break-words">{selectedTest.userDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground break-words">{selectedTest.userDetails.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground break-words">{selectedTest.userDetails.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Test Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Test Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Total Questions</label>
                    <p className="text-2xl font-bold">{selectedTest.totalQuestions || selectedTest.questions.length}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <p className="text-2xl font-bold">{selectedTest.testDuration || 'N/A'}s</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categories</label>
                    <p className="text-2xl font-bold">{new Set(selectedTest.answers.map(a => a.category)).size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Avg Match</label>
                    <p className="text-2xl font-bold">{getAverageMatchPercentage(selectedTest)}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Career Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Career Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTest.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h4 className="font-semibold break-words">{rec.title}</h4>
                          <Badge variant="outline">{rec.matchPercentage}% match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 break-words">{rec.description}</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Key Skills</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rec.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Education Path</label>
                            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                              {rec.educationPath.map((path, pathIndex) => (
                                <li key={pathIndex} className="break-words">• {path}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {/* Course Link */}
                        {rec.link && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div>
                                <label className="text-sm font-medium">Related Course</label>
                                <p className="text-sm text-muted-foreground">
                                  Explore this career path with our recommended course
                                </p>
                              </div>
                              <Button
                                asChild
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                              >
                                <a
                                  href={rec.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <BookOpen className="h-4 w-4" />
                                  View Course
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Answer Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Answer Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(
                      selectedTest.answers.reduce((acc, answer) => {
                        acc[answer.category] = (acc[answer.category] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => (
                      <div key={category} className="text-center p-2 border rounded">
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-xs text-muted-foreground break-words">{category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog - Responsive */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Statistics</DialogTitle>
            <DialogDescription>
              Comprehensive statistics about all test results
            </DialogDescription>
          </DialogHeader>
          {testStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testStats.totalTests}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Unique Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testStats.uniqueUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avg Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(testStats.averageQuestions)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avg Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(testStats.averageDuration)}s</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Most Common Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testStats.mostCommonCategories.map((cat, index) => (
                      <div key={cat.category} className="flex justify-between items-center">
                        <span className="text-sm break-words">{cat.category}</span>
                        <Badge variant="outline">{cat.count} answers</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Match Percentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(testStats.averageMatchPercentage)}%</div>
                  <p className="text-sm text-muted-foreground">
                    Average career match percentage across all tests
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test Result</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this test result? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 