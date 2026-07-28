import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0E12]">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="glass-strong border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">RH Setup</CardTitle>
            <p className="text-muted-foreground">
              Your Supabase environment variables aren’t set yet, so the app can’t connect to your new database.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="glass rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">1) Create `.env.local`</p>
              <p className="text-sm text-muted-foreground">
                Copy <code>env.example</code> → <code>.env.local</code> and fill in:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>- NEXT_PUBLIC_SUPABASE_URL</li>
                <li>- NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>- SUPABASE_SERVICE_ROLE_KEY</li>
              </ul>
            </div>

            <div className="glass rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">2) Run SQL in Supabase</p>
              <p className="text-sm text-muted-foreground">In Supabase SQL Editor, run scripts in this order:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>- scripts/001_create_schema.sql</li>
                <li>- scripts/003_user_trigger.sql</li>
                <li>- scripts/007_make_offer_id_nullable.sql</li>
                <li>- scripts/009_create_system_offer_fixed.sql</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 font-bold flex-1">
                <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer">
                  Open Supabase API Settings
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12 glass bg-transparent flex-1">
                <a href="/auth/login">Go to Login</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


