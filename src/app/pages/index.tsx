import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useNotify } from '@/hooks/notify'

export const DashboardController = () => {
  const { notify } = useNotify()
  return (
    <div className="space-y-6">
      <div>
        <h1
          onClick={() => notify.success('Hello')}
          className="text-2xl font-semibold"
        >
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back 👋</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total', value: '1,284' },
          { label: 'Active', value: '342' },
          { label: 'Pending', value: '57' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  )
}
