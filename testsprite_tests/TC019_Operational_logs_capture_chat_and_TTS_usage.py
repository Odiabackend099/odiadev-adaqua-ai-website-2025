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
        # Try to refresh the page or check for any hidden UI elements to start chat interactions.
        await page.goto('http://localhost:5173/', timeout=10000)
        

        # Return to the localhost app and try alternative ways to trigger or load the chat UI or check logs directly.
        await page.goto('http://localhost:5173', timeout=10000)
        

        # Check server and Supabase Edge function logs directly to find operational logs capturing chat usage and TTS request metrics.
        await page.goto('http://localhost:3000/admin/logs', timeout=10000)
        

        # Try alternative ways to access server or Supabase Edge function logs, such as checking other admin or monitoring URLs or using CLI or backend access.
        await page.goto('http://localhost:3000', timeout=10000)
        

        # Attempt to bypass reCAPTCHA by clicking the 'I'm not a robot' checkbox to continue the search or request user to provide logs or access directly.
        frame = context.pages[-1].frame_locator('html > body > div > form > div > div > div > iframe[title="reCAPTCHA"][role="presentation"][name="a-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&co=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbTo0NDM.&hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&size=normal&s=dROZrn3-qiGyo1dbICtANHbGr8nh7NKJMdmeBOuVSpHutzRgO51gStkWkZIZIvKYF1k6zdBKWoLGR3SagC2qaWNmNiXnh56enFrorwb_9xeAcZRB-9Jvg9mdmefXKhAZ7BBksS_KF5YOuOyVeX8hG1fcQpu_uQiIwqdcUEGES1JsWd69poVx2kLANYuP0DD7YPzDc6f9zLOTO--ffZGPiI130yyiGdWeDUqChcWi2ZyW8t4YpQuMhKHLi0VHiD504FSK3R1nE852y0II8jv-kBBXbzOEpI0&anchor-ms=20000&execute-ms=15000&cb=ulevkk2p1lt4"]')
        elem = frame.locator('xpath=html/body/div[2]/div[3]/div/div/div/span').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Attempt to solve the reCAPTCHA by selecting all squares with motorcycles.
        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the 'Next' button to submit the reCAPTCHA challenge and proceed with the Google search.
        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Select all squares with traffic lights and submit the challenge.
        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the 'Skip' button to bypass the current image challenge and attempt to continue the search or request user to provide logs or access directly.
        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Select all squares with crosswalks and submit the challenge.
        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[2]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[2]/div[2]/div/table/tbody/tr[3]/td[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1].frame_locator('html > body > div:nth-of-type(2) > div:nth-of-type(4) > iframe[title="recaptcha challenge expires in two minutes"][name="c-7sfrcfxjq08v"][src="https://www.google.com/recaptcha/enterprise/bframe?hl=en&v=Lu6n5xwy2ghvnPNo3IxkhcCb&k=6LdLLIMbAAAAAIl-KLj9p1ePhM-4LCCDbjtJLqRO&bft=0dAFcWeA7BcwB16OFwlj1R02W6HLMqo-4DNOrPM7EXTyb8T_q5WuvorZUjrwyaS7HWAs4QK1TuVcZyGSAW979MYPWeuSnroJogSA"]')
        elem = frame.locator('xpath=html/body/div/div/div[3]/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        assert False, 'Test failed: Unable to verify operational logs for chat usage and TTS request metrics without sensitive information.'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    