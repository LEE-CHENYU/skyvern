# Before adding cookies
LOG.info(f"About to add {len(cookies_json)} cookies:")
for i, cookie in enumerate(cookies_json):
    LOG.info(f"Cookie #{i+1}: {cookie['name']}={cookie.get('value', '')} (domain={cookie.get('domain', '')}, sameSite={cookie.get('sameSite', 'not specified')})")

# Add cookies
await browser_context.add_cookies(cookies_json)

# After adding cookies
current_cookies = await browser_context.cookies()
LOG.info(f"Successfully added {len(current_cookies)} cookies:")
for i, cookie in enumerate(current_cookies):
    LOG.info(f"Cookie #{i+1}: {cookie['name']}={cookie.get('value', '')} (domain={cookie.get('domain', '')}, sameSite={cookie.get('sameSite', 'not specified')})")