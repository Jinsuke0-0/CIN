"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function OfficialEventsPage() {
  const ongoingEvents = [
    {
      name: "Portfolio Performance Competition",
      description: "A competition to see who can achieve the best investment performance. Prizes for the top performers!",
      details: "The Portfolio Performance Competition is a month-long event where participants compete to achieve the highest return on their crypto portfolio. The competition starts on the first day of the month and ends on the last. Participants must register before the start date. Prizes will be awarded to the top three performers. The prize pool consists of $10,000 in stablecoins."
    },
  ]

  const upcomingEvents = [
    {
      name: "CNI Growth Idea Event",
      description: "An event to brainstorm and propose ideas for the growth of the CNI platform. The best ideas will be rewarded.",
      details: "The CNI Growth Idea Event is a week-long brainstorming session where community members can propose ideas to improve the CNI platform. Submissions can be made through our online portal. The development team will review all proposals, and the top three ideas will be selected for implementation. The winners will receive a special NFT and a share of the community grant pool."
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <div className="space-y-8">
            <Card className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">Official Events</CardTitle>
                <CardDescription className="text-lg text-gray-400">Participate in official events and contribute to the community.</CardDescription>
              </CardHeader>
            </Card>
            <Separator className="bg-gray-700" />

            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Ongoing Events</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ongoingEvents.map((event) => (
                  <Dialog key={event.name}>
                    <DialogTrigger asChild>
                      <Card className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl h-full cursor-pointer">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-xl font-semibold text-white">{event.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow p-4 pt-0">
                          <p className="text-gray-400 line-clamp-3 text-sm">{event.description}</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
                        <DialogDescription className="text-gray-400 pt-2">
                          {event.details}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Events</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Dialog key={event.name}>
                    <DialogTrigger asChild>
                      <Card className="flex flex-col bg-neutral-900 text-gray-100 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-xl h-full cursor-pointer">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-xl font-semibold text-white">{event.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow p-4 pt-0">
                          <p className="text-gray-400 line-clamp-3 text-sm">{event.description}</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
                        <DialogDescription className="text-gray-400 pt-2">
                          {event.details}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
