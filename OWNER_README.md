# Tembo Premium Spirits Website Guide

This document explains the Tembo website in simple English.

It is written for the business owner and anyone helping manage the website.

It covers:
- what the website does
- how customers use it
- how the admin side works
- what security is already in place
- what still needs to be done before everything is fully live
- what the owner must handle
- what the developers must handle
- what services need to be paid for

## 1. What This Website Is

This website is the online home of Tembo Premium Spirits.

Its job is to help Tembo:
- look professional and trustworthy
- show the brand story
- display products beautifully
- let people browse and place orders
- collect customer interest for events
- let the owner manage content without asking a developer every time

In simple terms:

The website is both a marketing tool and a business tool.

It helps Tembo sell, promote, communicate, and grow.

## 2. What Customers Can Do On The Website

### Home Page

The home page introduces the brand and gives a strong first impression.

It shows:
- the Tembo brand identity
- hero banner images
- featured products
- promotions
- awards
- delivery region information

Why this matters:
- new visitors understand the brand quickly
- the website feels premium and active
- it helps convert interest into product browsing

### Shop Page

Customers can:
- view all products
- search for a specific spirit
- filter by category
- see prices
- add 750ml or 50ml bottles to cart

Why this matters:
- makes buying easier
- reduces back-and-forth messages
- helps customers discover more than one product

### Cart Page

Customers can:
- review what they selected
- increase or reduce quantity
- remove products
- choose a payment path

Right now:
- manual order checkout is working
- Shopify secure checkout has been prepared in the code, but it is not yet activated because Shopify is not set up yet

Why this matters:
- customers have a clear buying path
- Tembo can collect orders even before full online payment is active

### Events Page

Customers can:
- see upcoming events
- see past event galleries
- subscribe for event notifications by email

Why this matters:
- helps Tembo build a community, not just sell bottles
- keeps customers connected to launches, tastings, and brand events

### About Page

This tells the story of the brand, products, and values.

Why this matters:
- builds trust
- makes the brand feel real and memorable
- helps customers understand what makes Tembo special

### Contact Page

Customers can:
- see Tembo email, WhatsApp, and address
- find a quick way to contact the business

Important note:
- the contact form is now connected to the backend and saves real customer enquiries into the admin dashboard
- admin can read, track, and follow up on these messages
- it is not yet connected to automatic email forwarding, so messages are stored in the website admin rather than emailed instantly
- WhatsApp and direct contact details are the real working contact paths at the moment

### Login / Account

Customers can:
- create an account
- sign in

Why this matters:
- required for placing orders in the current setup
- separates customer activity from admin activity

### Age Gate

Before entering the site, visitors must confirm they are 18 or older.

Why this matters:
- supports responsible alcohol marketing
- helps protect the brand legally and reputationally

## 3. What Makes This Website Good For Business

This website helps Tembo in several ways:

### It builds trust

The website presents Tembo as a serious premium brand, not just a social media page.

### It saves time

Instead of explaining products one by one on WhatsApp, the website already shows:
- the product range
- prices
- sizes
- promos
- awards
- events

### It helps sales

People can browse, add to cart, and begin checkout any time.

### It helps marketing

The owner can update homepage banners, promotions, awards, and events from the admin dashboard.

### It helps customer retention

The event subscriber feature lets Tembo stay in touch with interested customers.

### It gives the owner control

The owner does not need to ask a developer for every small content update.

## 4. How The Website Works From Start To Finish

This is the normal customer flow:

1. A customer visits the website.
2. They confirm they are 18+.
3. They browse the homepage, shop, or events.
4. They add products to cart.
5. They sign in or create an account.
6. They place an order.
7. The order appears in the admin dashboard.
8. Tembo follows up to confirm payment, delivery, or order status.

This is the event flow:

1. A customer visits the Events page.
2. They enter their email.
3. Their email is saved as an event subscriber.
4. When Tembo creates or updates an event, admin can click `Notify Subscribers`.
5. Subscribers receive an email update.

This is the admin flow:

1. Admin signs in.
2. Admin opens the dashboard.
3. Admin updates products, banners, promotions, awards, events, and settings.
4. Customers immediately see the updated content on the website.

## 5. What The Admin Can Do

The admin dashboard is one of the strongest parts of this website.

The admin can manage:

### Products

Admin can:
- edit product names
- edit product descriptions
- change prices
- change images
- mark products as featured
- activate or deactivate products

Why this is efficient:
- the product catalog can be updated without developer help

### Promotions

Admin can:
- add a promotion
- change promotion text
- add discount information
- activate or deactivate promotions

Why this is efficient:
- promotions can be changed quickly for campaigns or seasonal specials

### Orders

Admin can:
- view customer orders
- see order totals
- see order status
- contact customers by WhatsApp or email
- update order status

Why this is efficient:
- makes order handling simple
- keeps customer communication organized

### Hero Banners

Admin can:
- upload homepage banner images
- change banner text

Why this is efficient:
- the website always looks fresh
- Tembo can highlight launches, campaigns, or brand moments

### Awards

Admin can:
- add award titles
- add images for awards
- connect awards to products

Why this is efficient:
- awards increase trust and premium positioning

### Events

Admin can:
- create events
- edit event details
- upload event images
- hide or publish events
- view subscribers
- send notifications to subscribers

Why this is efficient:
- makes the website useful for community building and event promotion

### Settings

Admin can:
- update WhatsApp number
- update contact email
- update address
- add another admin user
- save future Shopify settings

Why this is efficient:
- the key business contact details can be updated without a developer

## 6. Security And Protection Already In Place

The website already includes important protections.

### Admin access control

Only approved admin users can access the dashboard.

This helps prevent unauthorized people from editing products, orders, or events.

### User login system

Customer and admin accounts use Supabase authentication.

This means:
- passwords are not stored manually inside the website code
- login is handled by a proper authentication platform

### Database rules

The system uses database access rules so normal users cannot manage admin data.

This is very important because it protects:
- orders
- products
- site settings
- admin-only information

### Age verification

Visitors must confirm they are 18 or older before browsing.

### Hosted backend services

The project uses hosted services instead of a custom insecure server.

This reduces risk and makes the system more stable.

## 7. Important Honest Notes About Current Status

The website is strong, but a few things still need final setup before it is fully complete.

### Working now

- homepage and public pages
- product display
- cart
- account creation and login
- admin dashboard
- product management
- promotions management
- awards management
- banner management
- event management
- event subscriber saving
- contact form message saving
- admin contact message inbox
- manual order creation
- WhatsApp contact links

### Partly ready but still needs setup

#### Event notification emails

The code is ready, but real email sending will only work after:
- a real domain is bought for Tembo
- Resend is set up
- the sender domain is verified
- Supabase email secrets are added

#### Shopify secure checkout

The code is prepared for Shopify redirect checkout, but it is not ready for customers until:
- a Shopify store exists
- products and variants are created there
- Shopify variant IDs are linked in admin settings
- Shopify payments are set up by the owner

#### Contact form

The contact form is now a real lead-handling system.

It now:
- saves every message to the backend
- stores the customer name, email, phone, region, and message
- makes the message visible in the admin dashboard

Still optional for later:
- automatic email alerts
- CRM integration

## 8. What Still Needs To Be Done To Fully Launch

### For subscriber notifications

Needed:
- buy a real domain for Tembo
- create a Resend account
- verify the domain in Resend
- create a sender email like `events@tembospirits.com`
- add `RESEND_API_KEY` to Supabase
- add `RESEND_FROM_EMAIL` to Supabase
- deploy the Supabase edge functions if not already deployed
- test sending to a real subscriber

### For checkout

There are 2 paths:

#### Option A: Launch first with manual payment

This means:
- customers place orders on the website
- Tembo confirms payment by EFT, cash, or direct follow-up

This is the fastest way to start.

#### Option B: Launch with Shopify secure checkout later

Needed:
- create Shopify store
- owner completes billing and payments setup
- add products and size variants in Shopify
- connect Shopify store domain and variant IDs in Tembo admin
- test the customer checkout flow

### For contact form

Already completed:
- the form now stores enquiries in the backend
- admin can read and manage messages in the dashboard

Optional next step:
- send automatic email alerts to the Tembo team when a new message is submitted

## 9. What The Owner Must Do

These are business-owner responsibilities, not developer responsibilities.

The owner should handle:
- buying the domain name
- deciding the official business email addresses
- approving branding, wording, prices, and product descriptions
- creating or owning the Shopify account if Shopify will be used
- entering legal business details into Shopify
- setting up bank payout details in Shopify Payments or another payment provider
- paying for subscriptions
- deciding who should be admins
- approving launch readiness

Why this should be the owner:
- these items affect money, legal ownership, billing, and business identity

## 10. What We As Developers Must Do

These are developer responsibilities.

We should handle:
- making sure the website works reliably
- fixing bugs
- deploying functions
- connecting external services properly
- securing admin access
- testing checkout flow
- testing subscriber notifications
- maintaining the contact message system
- optionally adding automatic email alerts for contact messages
- helping with domain DNS setup when needed
- helping with Shopify integration when the owner is ready

## 11. Services And Subscriptions Needed

Below is the practical list of services required to run the website properly.

### 1. Domain name

Purpose:
- gives Tembo a real professional web identity
- needed for branded email sending

Examples:
- `tembospirits.com`
- `tembo.co.za`

Can be bought from:
- Cloudflare Registrar
- Namecheap
- Porkbun

Cost:
- depends on the exact domain ending and registrar
- usually paid yearly

Reference:
- Cloudflare says domains are registered at cost through Cloudflare Registrar: [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)

### 2. Supabase

Purpose:
- database
- authentication
- storage for images
- edge functions
- admin/backend system

Current note:
- this website already depends heavily on Supabase

Pricing reference:
- Supabase billing documentation says paid organizations use a Pro plan plus compute and usage charges, and the Pro plan is billed at $25/month with one project typically covered by included compute credits; usage overages depend on traffic and storage: [Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase)

Practical meaning:
- Tembo can begin on the free level for testing
- for a serious live business setup, paid Supabase is the safer long-term plan

### 3. Resend

Purpose:
- sends event subscriber emails

Pricing reference:
- Resend currently shows a Free plan at $0/month with 3,000 emails/month and a Pro plan at $20/month with 50,000 emails/month: [Resend pricing](https://resend.com/pricing)

Practical meaning:
- free plan may be enough for early-stage event notifications
- paid plan may be needed once Tembo grows

### 4. Shopify

Purpose:
- secure hosted checkout
- safer customer confidence for card payments
- owner-controlled store, payouts, and payment handling

Pricing reference:
- Shopify currently shows Basic starting at $29/month billed yearly, with card rates starting at 2.9% + 30 cents online in the US pricing example shown on their pricing page: [Shopify pricing](https://www.shopify.com/pricing)

Important note:
- Shopify is optional for now if Tembo starts with manual orders first
- Shopify becomes required if Tembo wants proper live online card checkout

### 5. Website hosting / deployment

This project also needs to be hosted publicly so customers can open it online.

The exact hosting cost depends on where the frontend is deployed.

Common choices:
- Vercel
- Netlify
- another static hosting provider

If this has not been set up yet, it still needs to be done before public launch.

## 12. Recommended Launch Strategy

The safest business path is:

### Phase 1: Soft launch

Launch with:
- website live
- products visible
- manual checkout
- admin dashboard
- WhatsApp contact

Also finish:
- domain purchase
- branded email setup
- subscriber notification setup
- contact message admin process

This gets Tembo online faster.

### Phase 2: Strengthen communication

Finish:
- Resend domain verification
- live subscriber notification testing
- optional contact message email alerts

### Phase 3: Full online payment

When the owner is ready:
- open Shopify
- add products and variants
- enable payments
- connect Shopify checkout

This is the best balance of speed, safety, and professionalism.

## 13. Why This Website Is Efficient For Tembo

This website is efficient because it reduces dependency on developers for daily content changes.

It allows the business to manage:
- product presentation
- pricing updates
- promotions
- events
- banners
- awards
- customer orders
- contact details

That means:
- faster campaigns
- quicker updates
- lower maintenance effort
- better brand control

Instead of rebuilding pages each time, the owner can update business content from the admin dashboard.

That is a big advantage for a growing premium brand.

## 14. Final Summary

The Tembo website is already a strong business asset.

It gives Tembo:
- a premium brand presence
- a product catalog
- order handling
- customer accounts
- event marketing
- admin control

To make it fully complete and fully live for long-term business use, the main missing pieces are:
- a real Tembo domain
- branded email sending through Resend
- optional Shopify setup for secure online card checkout
- optional automatic email alerts for contact messages
- final live deployment and testing

If these final steps are completed properly, the website can serve as a real working digital platform for Tembo Premium Spirits, not just a brochure site.
