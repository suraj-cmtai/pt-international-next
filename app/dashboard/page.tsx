"use client"

import { motion } from "framer-motion"
import { Package, Settings, MessageSquare, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Products",
    value: "156",
    change: "+12%",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Active Services",
    value: "24",
    change: "+5%",
    icon: Settings,
    color: "text-green-600",
  },
  {
    title: "Contact Submissions",
    value: "89",
    change: "+23%",
    icon: MessageSquare,
    color: "text-purple-600",
  },
  {
    title: "Monthly Revenue",
    value: "$45,230",
    change: "+18%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    type: "product",
    title: "New product added: Advanced PCR Kit",
    time: "2 hours ago",
    icon: Package,
  },
  {
    type: "contact",
    title: "New contact submission from Dr. Smith",
    time: "4 hours ago",
    icon: MessageSquare,
  },
  {
    type: "service",
    title: "Service updated: Quality Control",
    time: "1 day ago",
    icon: Settings,
  },
  {
    type: "product",
    title: "Product inventory updated",
    time: "2 days ago",
    icon: Package,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
          </div>
          <Badge variant="secondary">Admin Panel</Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes to your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-2">
                    <Package className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-sm font-medium">Add Product</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-2">
                    <Settings className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-sm font-medium">Add Service</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-sm font-medium">View Messages</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-sm font-medium">Analytics</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
