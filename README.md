# Luma Store Developer Dashboard

Standalone developer dashboard for submitting and managing open-source Android apps for Luma Store.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the same Supabase project used by Luma Store.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

The dashboard includes Fastlane metadata import, current F-Droid categories, app update resubmission, developer verification, and submission status/timeline.
