import { useEffect, useState } from 'react';
import { Clock3, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { DAILY_FREE_LIMIT, getUsage } from '@/lib/credits';

export function UsageIndicator() {
  const [usage, setUsage] = useState(getUsage);
  useEffect(() => { const refresh = () => setUsage(getUsage()); window.addEventListener('focus', refresh); return () => window.removeEventListener('focus', refresh); }, []);
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usage.used);
  return (
    <Card className="border-primary/15 bg-primary/[0.03]">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-primary" />Daily advanced analysis allowance</div><p className="mt-1 text-sm text-muted-foreground">{remaining} of {DAILY_FREE_LIMIT} free analyses remaining</p></div>
          <span className="text-sm font-medium text-primary">{usage.used} / {DAILY_FREE_LIMIT} used</span>
        </div>
        <Progress value={(usage.used / DAILY_FREE_LIMIT) * 100} className="mt-3" aria-label={`${usage.used} of ${DAILY_FREE_LIMIT} analyses used`} />
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />This local usage preview resets after 24 hours. Paid credits will be validated securely on a future server.</p>
      </CardContent>
    </Card>
  );
}