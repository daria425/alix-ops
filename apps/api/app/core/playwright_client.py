from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
import os, json
load_dotenv()
platform_url=os.getenv("PLATFORM_URL")
current_dir = os.path.dirname(os.path.abspath(__file__))
playwright_client_credential_path=os.path.join(current_dir, "playwright-client-credentials.json")
with open(playwright_client_credential_path, "r") as f:
    playwright_client_credentials=json.loads(f.read())
    playwright_client_email=playwright_client_credentials.get("email")
    playwright_client_password=playwright_client_credentials.get("password")

class PlaywrightClient:
    def __init__(self,user_email=None, user_password=None):
        self.platform_url=platform_url
        self.email=user_email if user_email else playwright_client_email
        self.password=user_password if user_password else playwright_client_password
    def test_login(self):
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url=self.platform_url, wait_until='networkidle')
                
                # Fill login form
                page.fill('input[name="email"]', self.email)
                page.fill('input[name="password"]', self.password)
                
                # Find and click login button
                login_button = page.query_selector("button.auth__btn[type='submit']")
                if login_button is None:
                    raise Exception("Login button not found")
                login_button.click()

                # Wait for redirection after login
                page.wait_for_url(url=f"{self.platform_url}app/conversations", timeout=10000)

                # Assertions
                page.wait_for_selector("section.chat", timeout=10000)
                chat_section = page.locator("section.chat")
                assert chat_section.is_visible(), "Chat section is not visible after login"

                profile_email = page.locator("p.layout__profile-email")
                assert profile_email.is_visible(), "Profile email is not visible"
                assert profile_email.text_content() == self.email, "Logged-in email does not match"

                profile_dropdown = page.locator("div.css-i2pscg-control")
                profile_dropdown.click()

                menu = page.locator("div.css-1nmdiq5-menu")
                assert menu.is_visible(), "Dropdown menu did not appear"

                browser.close()

        except Exception as e:
            raise RuntimeError(f"Test failed: {e}")

