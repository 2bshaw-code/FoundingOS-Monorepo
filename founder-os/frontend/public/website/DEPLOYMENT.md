# WROS Website Deployment Activation

## Production URL

Before publishing, replace the relative values in `index.html` for `canonical`, `og:url`, `og:image`, and `twitter:image` with absolute URLs using the final public HTTPS domain. Do not publish a placeholder domain.

## Analytics Integration

The page dispatches a `wros:analytics` browser event for each tagged launch CTA. To forward events to an approved provider, define `window.wrosAnalytics` before the page script runs. The callback receives `{ event, surface, label }` and is intentionally provider-neutral.

## Launch Check

- Confirm the final domain serves `/website/` over HTTPS.
- Confirm the canonical URL and social-image URLs return `200` from the public domain.
- Validate the page with the social platforms used for launch.
- Confirm the dashboard, console, partner, and investor links resolve in the deployment environment.
- Add a production sitemap only after the final public domain is known.