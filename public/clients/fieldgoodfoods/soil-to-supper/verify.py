import json
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4173/design-directions/soil-to-supper/"
HERE = Path(__file__).resolve().parent
SHOTS_DIR = HERE.parent / "_shots"
SHOTS_DIR.mkdir(exist_ok=True)


def scroll_through(page):
    height = page.evaluate("document.documentElement.scrollHeight")
    for position in range(0, height, 650):
        page.evaluate("position => window.scrollTo(0, position)", position)
        page.wait_for_timeout(80)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(300)


def assert_page(page, viewport_name):
    page.goto(BASE_URL, wait_until="networkidle")
    scroll_through(page)
    page.wait_for_function(
        """
        () => document.fonts.status === 'loaded' &&
          [...document.images].every((image) => image.complete && image.naturalWidth > 0)
        """
    )

    assert page.locator("h1").inner_text() == "Raised from\ngood ground."
    assert page.locator("main section").count() == 8
    # 5 photographs + 2 hero videos (play-once + loop) while the hero candidates are under review.
    assert page.locator("main img, main video").count() == 7
    assert page.locator("[data-hero-video]").count() == 1
    assert page.locator("[data-hero-loop]").count() == 1
    assert page.locator(".eyebrow").count() == 1

    body_text = page.locator("body").inner_text()
    assert "—" not in body_text
    assert "–" not in body_text

    overflow = page.evaluate(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )
    assert overflow <= 1, f"{viewport_name} horizontal overflow: {overflow}px"

    invisible_reveals = page.locator("[data-reveal]").evaluate_all(
        "elements => elements.filter((el) => getComputedStyle(el).opacity === '0').length"
    )
    assert invisible_reveals == 0

    hero_cta_bottom = page.locator(".hero__actions").evaluate(
        "element => element.getBoundingClientRect().bottom"
    )
    viewport_height = page.evaluate("window.innerHeight")
    assert hero_cta_bottom <= viewport_height, (
        f"{viewport_name} hero CTA below initial viewport: "
        f"{hero_cta_bottom}px > {viewport_height}px"
    )


def run():
    results = {"desktop": {}, "mobile": {}, "reduced_motion": {}}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)

        desktop_context = browser.new_context(viewport={"width": 1440, "height": 1000})
        desktop_page = desktop_context.new_page()
        desktop_errors = []
        desktop_page.on(
            "console",
            lambda message: desktop_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        desktop_page.on("pageerror", lambda error: desktop_errors.append(str(error)))
        assert_page(desktop_page, "desktop")
        # Whichever hero video is active (play-once, or the loop after it ends) must be advancing.
        hero_videos = "[...document.querySelectorAll('[data-hero-video], [data-hero-loop]')]"
        desktop_page.wait_for_function(
            f"{hero_videos}.some(video => video.readyState >= 2 && !video.paused)"
        )
        frame_count = f"{hero_videos}.reduce((total, video) => total + video.getVideoPlaybackQuality().totalVideoFrames, 0)"
        video_start = desktop_page.evaluate(frame_count)
        desktop_page.wait_for_timeout(500)
        video_end = desktop_page.evaluate(frame_count)
        assert video_end > video_start, (
            f"Hero video frames did not advance: {video_start} -> {video_end}"
        )

        nav_tops = desktop_page.locator("#primary-nav a").evaluate_all(
            "links => [...new Set(links.map(link => Math.round(link.getBoundingClientRect().top)))]"
        )
        assert len(nav_tops) == 1, f"Desktop navigation wrapped onto {len(nav_tops)} lines"

        desktop_page.add_style_tag(
            content=".site-header{position:absolute!important}.skip-link{display:none!important}"
        )
        desktop_path = SHOTS_DIR / "soil-to-supper-desktop.png"
        desktop_page.screenshot(path=str(desktop_path), full_page=True)
        assert desktop_errors == [], desktop_errors
        results["desktop"] = {
            "screenshot": str(desktop_path),
            "console_errors": 0,
            "hero_video": "playing",
            "nav": "single-line",
        }
        desktop_context.close()

        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
        )
        mobile_page = mobile_context.new_page()
        mobile_errors = []
        mobile_page.on(
            "console",
            lambda message: mobile_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        mobile_page.on("pageerror", lambda error: mobile_errors.append(str(error)))
        assert_page(mobile_page, "mobile")

        menu = mobile_page.locator(".menu-toggle")
        menu.click()
        assert menu.get_attribute("aria-expanded") == "true"
        assert mobile_page.locator("#primary-nav").is_visible()
        mobile_page.keyboard.press("Escape")
        assert menu.get_attribute("aria-expanded") == "false"

        mobile_page.locator("[data-newsletter] input[type='email']").fill("not-an-email")
        mobile_page.locator("[data-newsletter] button").click()
        assert mobile_page.locator("[data-newsletter-status]").inner_text() == "Enter a valid email address."
        mobile_page.locator("[data-newsletter] input[type='email']").fill("reader@example.com")
        mobile_page.locator("[data-newsletter] button").click()
        mobile_page.wait_for_timeout(450)
        assert "on the list" in mobile_page.locator("[data-newsletter-status]").inner_text()

        mobile_page.locator("[data-finder] input[type='email']").fill("reader@example.com")
        mobile_page.locator("[data-finder] button").click()
        assert mobile_page.locator("[data-finder-status]").inner_text() == "Choose what you are cooking for."
        mobile_page.locator("[data-finder] input[value='celebration']").check()
        mobile_page.locator("[data-finder] button").click()
        mobile_page.wait_for_timeout(450)
        assert "Prime Porterhouse" in mobile_page.locator("[data-finder-status]").inner_text()

        mobile_page.evaluate("document.activeElement?.blur(); window.scrollTo(0, 0)")
        mobile_page.wait_for_timeout(300)
        mobile_page.add_style_tag(
            content=".site-header{position:absolute!important}.skip-link{display:none!important}"
        )
        mobile_path = SHOTS_DIR / "soil-to-supper-mobile.png"
        mobile_page.screenshot(path=str(mobile_path), full_page=True)
        assert mobile_errors == [], mobile_errors
        results["mobile"] = {
            "screenshot": str(mobile_path),
            "console_errors": 0,
            "menu": "passed",
            "newsletter": "passed",
            "steak_finder": "passed",
        }
        mobile_context.close()

        reduced_context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            reduced_motion="reduce",
        )
        reduced_page = reduced_context.new_page()
        reduced_page.goto(BASE_URL, wait_until="domcontentloaded")
        reduced_page.wait_for_selector("[data-reveal]")
        opacity = reduced_page.locator("[data-reveal]").first.evaluate(
            "element => getComputedStyle(element).opacity"
        )
        assert opacity == "1"
        assert reduced_page.locator("[data-hero-video]").evaluate("video => video.paused")
        results["reduced_motion"] = {
            "reveals_visible": True,
            "hero_video_paused": True,
        }
        reduced_context.close()

        browser.close()

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    run()
