# iAgree v2 🚀

**AI-powered professional freelancer marketplace**

## Stack
- **Frontend**: Next.js 15 (Pages Router)
- **Backend**: Supabase (Auth + Postgres + Storage + Realtime)
- **AI**: Anthropic Claude API
- **Payments**: Stripe
- **Email**: Resend
- **Deploy**: Vercel

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in env vars
npm run dev
```

## Supabase Migration

1. Create project at supabase.com
2. Run migrations:
```bash
supabase db push
# or paste SQL from supabase/migrations/ into Supabase SQL editor
```

## Build Plan

### Phase 1 (Weeks 2-5): Core
- [x] Repo setup + cleanup TMDT features
- [x] Supabase schema design
- [ ] Auth (Supabase → replace Laravel)
- [ ] Profiles
- [ ] Jobs CRUD
- [ ] Search + Browse
- [ ] Proposals/Bidding
- [ ] Messaging (Supabase Realtime)
- [ ] Subscription (Stripe)

### Phase 2 (Weeks 6-8): AI
- [ ] AI Job Brief Writer
- [ ] AI Smart Match
- [ ] AI Price Benchmark
- [ ] AI Contract Generator

### Phase 3 (Weeks 9-12): Trust & Growth
- [ ] A&D Verified badge
- [ ] quydinh.vn integration
- [ ] SEO landing pages
- [ ] Review system

## Removed (vs v1)
- Internal wallet / escrow (TMDT compliance)
- Legal document templates
- MySign integration (replaced by native contract system)
- Payment gateway (Stripe subscription only, no transaction commission)
