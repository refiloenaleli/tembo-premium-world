# Tembo Premium Spirits

This project uses:

- Vercel for frontend hosting
- Supabase for database, auth, storage, and edge functions
- Google OAuth for Google login
- Resend for subscriber emails and recommended auth SMTP

## Current Status

The app-side fixes for auth redirect handling and Club House UX are already in the working tree.

What still needs to be completed outside the code:

- apply Supabase migrations to the live project
- deploy Supabase edge functions
- configure Supabase auth URLs
- configure Google auth provider
- configure SMTP for signup emails

## What You Can Do For Free First

You can launch and test most of the project for free using:

- Vercel Hobby
- Supabase Free
- Google OAuth setup
- Google Search Console
- Resend Free

Important note:

- Supabase's default email sender is not suitable for real public signup emails. Supabase recommends custom SMTP for production-like use.

Official docs:

- Supabase pricing: https://supabase.com/pricing
- Supabase custom SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase Google auth: https://supabase.com/docs/guides/auth/social-login/auth-google
- Vercel pricing: https://vercel.com/pricing
- Resend pricing: https://resend.com/pricing
- Google Search Console: https://support.google.com/webmasters/answer/9128668?hl=en

## How To Let Codex Finish The Supabase Work

I need a Supabase access token in your local environment so I can run the CLI commands for you.

### Step 1: Create a Supabase access token

1. Open https://supabase.com/dashboard/account/tokens
2. Click `Generate new token`
3. Name it `codex-tembo`
4. Copy the token

### Step 2: Add the token to `.env`

Add this line to your `.env` file:

```env
SUPABASE_ACCESS_TOKEN="paste_your_token_here"
```

### Step 3: Tell me to continue

Send this exact message:

`I added the Supabase token. Continue.`

After that I can run:

```bash
npx supabase login
npx supabase db push
npx supabase functions deploy
```

## Free Setup First: Step By Step

### 1. Deploy the site on Vercel

1. Go to https://vercel.com/
2. Click `Sign Up`
3. Choose `Continue with GitHub`
4. Push this project to GitHub if it is not already there
5. In Vercel click `Add New...`
6. Click `Project`
7. Import your repository
8. Confirm the framework is `Vite`
9. Add these environment variables:

```env
VITE_SUPABASE_URL="https://jplynisfhfzdnjxahldg.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
```

10. Click `Deploy`
11. Copy the deployed URL, for example:

```text
https://tembo-premium-world.vercel.app
```

### 2. Configure Supabase auth URLs

1. Open https://supabase.com/dashboard
2. Open your project
3. Click `Authentication`
4. Click `URL Configuration`
5. Set `Site URL` to your deployed Vercel URL:

```text
https://tembo-premium-world.vercel.app
```

6. Under `Redirect URLs`, add:

```text
https://tembo-premium-world.vercel.app/auth
http://localhost:5173/auth
```

7. Click `Save`

### 3. Fix signup confirmation template

1. In Supabase, stay in `Authentication`
2. Open `Email Templates`
3. Open `Confirm signup`
4. If the template link uses `{{ .SiteURL }}`, change it to use `{{ .RedirectTo }}`
5. Save

This matters because the app now passes the redirect URL intentionally.

### 4. Configure Google login

1. Open https://console.cloud.google.com/
2. Create a project or select one
3. Search for `Google Auth Platform`
4. Open it
5. Create an OAuth client
6. Choose `Web application`
7. Set the client name to:

```text
Tembo Web App
```

8. Add these `Authorized JavaScript origins`:

```text
https://tembo-premium-world.vercel.app
http://localhost:5173
```

9. In Supabase open:
   - `Authentication`
   - `Providers`
   - `Google`
10. Copy the callback URL shown by Supabase
11. Go back to Google Cloud
12. Add that exact callback URL under `Authorized redirect URIs`
13. Click `Create`
14. Copy the client ID and client secret
15. Go back to Supabase `Authentication -> Providers -> Google`
16. Enable Google
17. Paste the client ID and secret
18. Save

### 5. Apply the missing Club House tables

This is the part that fixes the `table does not exist` errors.

After you add `SUPABASE_ACCESS_TOKEN` to `.env`, I can do this for you.

If you want to do it yourself:

```bash
npx supabase login
npx supabase db push
```

### 6. Deploy subscriber functions later

When you are ready for subscriber emails:

```bash
npx supabase functions deploy subscribe-event-notifications
npx supabase functions deploy notify-event-subscribers
```

## Resend Setup Later

You said you want to do subscriber emails later, which is completely fine.

When you are ready:

### Resend API key

Use this name:

```text
tembo-production
```

### Resend sender name

Use this:

```text
Tembo Premium Spirits
```

### Resend from email

Example:

```text
Tembo Premium Spirits <noreply@yourdomain.com>
```

### Secrets to add later

```env
RESEND_API_KEY="your_resend_key"
RESEND_FROM_EMAIL="Tembo Premium Spirits <noreply@yourdomain.com>"
```

Then run:

```bash
npx supabase secrets set RESEND_API_KEY=your_key_here
npx supabase secrets set RESEND_FROM_EMAIL="Tembo Premium Spirits <noreply@yourdomain.com>"
```

## Costs And Payment Links

### 1. Vercel

- Free option: Hobby
- Paid option: Pro
- Official pricing: https://vercel.com/pricing

How to pay:

1. Open https://vercel.com/pricing
2. Click `Start Deploying` or upgrade from your dashboard
3. Choose `Pro` when you are ready
4. Add your card details in billing

### 2. Supabase

- Free option: Free plan
- Paid option: Pro and usage-based billing
- Official pricing: https://supabase.com/pricing
- Billing docs: https://supabase.com/docs/guides/platform/org-based-billing

How to pay:

1. Open https://supabase.com/dashboard
2. Open your organization or project billing area
3. Choose the paid plan you want
4. Add your payment method

### 3. Resend

- Free option: Free plan
- Paid option: Pro
- Official pricing: https://resend.com/pricing

How to pay:

1. Open https://resend.com/pricing
2. Sign in
3. Upgrade from Free to Pro when you need more volume
4. Add your billing card

### 4. Domain name

Not free.

Good registrars:

- Cloudflare Registrar: https://domains.cloudflare.com/
- Porkbun: https://porkbun.com/products/domains
- Namecheap: https://www.namecheap.com/domains.aspx

How to pay:

1. Search for your domain name
2. Add it to cart
3. Pay for the registration
4. Point DNS to Vercel

## Search Visibility

To make the site discoverable on Google:

1. Deploy the site publicly
2. Keep `robots.txt` enabled
3. Keep `sitemap.xml` live
4. Add the site to Google Search Console
5. Submit the sitemap URL:

```text
https://tembo-premium-world.vercel.app/sitemap.xml
```

Google Search Console:

- https://support.google.com/webmasters/answer/9128668?hl=en

## Safe Names To Use

Use these exact example names:

- Supabase token: `codex-tembo`
- Google app name: `Tembo Premium Spirits`
- Google OAuth client: `Tembo Web App`
- Resend API key: `tembo-production`
- Vercel project: `tembo-premium-spirits`

## What To Tell Codex Next

If you want me to continue the live backend setup for you, do this:

1. add `SUPABASE_ACCESS_TOKEN` to `.env`
2. save the file
3. send this message:

`I added the Supabase token. Continue with db push and function deploys.`
