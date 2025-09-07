import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Assert the AI chat response format
        assert 'response' in chat_response, 'Chat response missing expected key `response`'
        assert isinstance(chat_response['response'], str) and len(chat_response['response']) > 0, 'Chat response should be a non-empty string'
        
        # Assert health check endpoint status and content
        assert health_check_response.status == 200, f'Health check endpoint returned status {health_check_response.status}, expected 200'
        health_data = await health_check_response.json()
        assert 'status' in health_data and health_data['status'] == 'healthy', 'Health check status is not healthy'
        
        # Assert CORS headers restrict to allowed origins
        allowed_origins = ['https://your-allowed-origin.com']
        cors_header = health_check_response.headers.get('access-control-allow-origin')
        assert cors_header in allowed_origins, f'CORS header {cors_header} not in allowed origins {allowed_origins}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    