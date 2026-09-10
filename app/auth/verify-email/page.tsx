import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex w-full flex-col gap-4 text-center">
      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
        <svg className="h-8 w-8 text-sapphire-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h1 className="ds-h2 text-ink">Check Your Email</h1>
      <p className="text-sm font-medium text-ink-3">We&apos;ve sent you a verification link</p>
      <p className="text-base leading-relaxed text-ink-2">
        Click the link in your email to verify your account and start generating affiliate pages.
      </p>
      <p className="text-sm text-ink-3">
        Didn&apos;t receive the email? Check your spam folder or{" "}
        <Link href="/auth/sign-up" className="font-semibold text-sapphire-700 hover:underline">
          try again
        </Link>
      </p>
    </div>
  )
}
