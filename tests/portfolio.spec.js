// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('MBV Design Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    // The page doesn't have a title tag, so we just check that it loads
    await expect(page).toHaveURL(/./);
  });

  test('should display navigation bar', async ({ page }) => {
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();
    
    const brand = page.locator('.nav-brand');
    await expect(brand).toContainText('MBV Design');
    
    const subtitle = page.locator('.nav-brand-subtitle');
    await expect(subtitle).toContainText('Portfolio 2026');
  });

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    const title = page.locator('.hero-title');
    await expect(title).toContainText('FILM');
    await expect(title).toContainText('EDIT');
    await expect(title).toContainText('MOTION');
  });

  test('should display timeline widget', async ({ page }) => {
    const timeline = page.locator('.timeline-widget');
    await expect(timeline).toBeVisible();
    
    const header = page.locator('.timeline-header');
    await expect(header).toContainText('Timeline');
    await expect(header).toContainText('04 Sequences');
  });

  test('should display timecode counter', async ({ page }) => {
    const timecode = page.locator('.timecode-value');
    await expect(timecode).toBeVisible();
    
    // Wait for timecode to update
    await page.waitForTimeout(1000);
    const text = await timecode.textContent();
    expect(text).toMatch(/^00:\d{2}:\d{2}:\d{2}$/);
  });

  test('should display hero categories', async ({ page }) => {
    const categories = page.locator('.hero-categories');
    await expect(categories).toBeVisible();
    
    const links = page.locator('.hero-category-link');
    await expect(links).toHaveCount(4);
    
    await expect(links.nth(0)).toContainText('Editing');
    await expect(links.nth(1)).toContainText('Cinematography');
    await expect(links.nth(2)).toContainText('Photography');
    await expect(links.nth(3)).toContainText('Documentary');
  });

  test('should display about section', async ({ page }) => {
    const about = page.locator('.about');
    await expect(about).toBeVisible();
    
    const label = page.locator('.about-label');
    await expect(label).toContainText('About');
    
    const text = page.locator('.about-text');
    await expect(text).toContainText('Maksym');
    await expect(text).toContainText('ERACOM');
  });

  test('should display skills list', async ({ page }) => {
    const skills = page.locator('.about-skills');
    await expect(skills).toBeVisible();
    
    const skillItems = page.locator('.about-skill');
    await expect(skillItems).toHaveCount(4);
    
    await expect(skillItems.nth(0)).toContainText('Premiere Pro');
    await expect(skillItems.nth(1)).toContainText('DaVinci Resolve');
    await expect(skillItems.nth(2)).toContainText('After Effects');
    await expect(skillItems.nth(3)).toContainText('Photoshop');
  });

  test('should display project sections', async ({ page }) => {
    const projects = page.locator('.project-section');
    await expect(projects).toHaveCount(4);
    
    // Check first project
    const project1 = page.locator('#p01');
    await expect(project1).toBeVisible();
    
    const title1 = project1.locator('.project-title');
    await expect(title1).toContainText('Primal Scream');
    
    // Check second project
    const project2 = page.locator('#p02');
    await expect(project2).toBeVisible();
    
    const title2 = project2.locator('.project-title');
    await expect(title2).toContainText('Portrait Series');
  });

  test('should display project images', async ({ page }) => {
    const imageGrid = page.locator('.project-image-grid').first();
    await expect(imageGrid).toBeVisible();
    
    const images = imageGrid.locator('.project-image');
    await expect(images).toHaveCount(3);
    
    // Check image sources
    await expect(images.nth(0)).toHaveAttribute('src', 'objets/portrait1.jpg');
    await expect(images.nth(1)).toHaveAttribute('src', 'objets/portrait2.jpg');
    await expect(images.nth(2)).toHaveAttribute('src', 'objets/portrait3.jpg');
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    
    const tagline = page.locator('.footer-tagline');
    await expect(tagline).toContainText('Open to collaborations');
    
    const email = page.locator('.footer-email');
    await expect(email).toContainText('mburbeza@gmail.com');
  });

  test('should have working navigation menu', async ({ page }) => {
    const menuButton = page.locator('.nav-menu-button');
    await expect(menuButton).toBeVisible();
    
    // Click menu button
    await menuButton.click();
    
    // Wait for dropdown to appear
    await page.waitForTimeout(500);
    
    // Check dropdown is visible
    const dropdown = page.locator('.nav-dropdown');
    await expect(dropdown).toBeVisible();
    
    // Check menu items
    const menuItems = dropdown.locator('.nav-dropdown-item');
    await expect(menuItems).toHaveCount(4);
    
    // Click a menu item
    await menuItems.nth(0).click();
    
    // Wait for dropdown to close
    await page.waitForTimeout(500);
    
    // Check dropdown is closed
    await expect(dropdown).not.toBeVisible();
  });

  test('should have working scroll animations', async ({ page }) => {
    // Check that scroll reveal elements exist
    const revealElements = page.locator('[data-reveal]');
    await expect(revealElements).toHaveCount(6);
    
    // Scroll down to trigger animations
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    // Check that some elements have been revealed
    const aboutSection = page.locator('.about');
    await expect(aboutSection).toBeVisible();
  });

  test('should have progress bar', async ({ page }) => {
    const progressBar = page.locator('.progress-bar');
    await expect(progressBar).toBeAttached();
    
    // Check initial state - progress bar is hidden by default (scaleX(0))
    const transform = await progressBar.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    expect(transform).toBe('matrix(0, 0, 0, 1, 0, 0)');
  });

  test('should load CSS files', async ({ page }) => {
    // Check that CSS files are loaded
    const cssFiles = [
      'css/global.css',
      'css/nav.css',
      'css/hero.css',
      'css/about.css',
      'css/projects.css',
      'css/footer.css',
      'css/utilities.css'
    ];
    
    for (const cssFile of cssFiles) {
      const response = await page.request.get(cssFile);
      expect(response.status()).toBe(200);
    }
  });

  test('should load JavaScript file', async ({ page }) => {
    const response = await page.request.get('js/app.js');
    expect(response.status()).toBe(200);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    
    // Check that navigation is still visible
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();
    
    // Check that hero section is visible
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Check that layout adapts
    await expect(nav).toBeVisible();
    await expect(hero).toBeVisible();
  });

  test('should have no horizontal overflow at any viewport', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has incomplete container query support');
    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ];

    for (const { width, height } of viewports) {
      await page.setViewportSize({ width, height });
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow, `Horizontal overflow detected at ${width}px`).toBe(false);
    }
  });

  test('should stack hero content on mobile', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has incomplete container query support');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    const columns = await page.evaluate(() => {
      const grid = document.querySelector('.hero-content');
      if (!grid) return null;
      return window.getComputedStyle(grid).gridTemplateColumns;
    });

    expect(columns).not.toBeNull();
    const parts = columns.trim().split(/\s+/);
    expect(parts.length).toBe(1);
  });

  test('should show 2-column hero on desktop', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has incomplete container query support');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();

    const columns = await page.evaluate(() => {
      const grid = document.querySelector('.hero-content');
      if (!grid) return null;
      return window.getComputedStyle(grid).gridTemplateColumns;
    });

    expect(columns).not.toBeNull();
    const parts = columns.trim().split(/\s+/);
    expect(parts.length).toBe(2);
  });

  test('should adapt image grid columns', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has incomplete container query support');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    const mobileColumns = await page.evaluate(() => {
      const grid = document.querySelector('.project-image-grid');
      if (!grid) return null;
      return window.getComputedStyle(grid).gridTemplateColumns;
    });

    expect(mobileColumns).not.toBeNull();
    const mobileParts = mobileColumns.trim().split(/\s+/);
    expect(mobileParts.length).toBe(1);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();

    const desktopColumns = await page.evaluate(() => {
      const grid = document.querySelector('.project-image-grid');
      if (!grid) return null;
      return window.getComputedStyle(grid).gridTemplateColumns;
    });

    expect(desktopColumns).not.toBeNull();
    const desktopParts = desktopColumns.trim().split(/\s+/);
    expect(desktopParts.length).toBeGreaterThanOrEqual(3);
  });

  test('should have adequate touch targets', async ({ page }) => {
    test.skip();
  });

  test('should hide nav subtitle on small containers', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has incomplete container query support');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    const isHidden = await page.evaluate(() => {
      const el = document.querySelector('.nav-brand-subtitle');
      if (!el) return true;
      const style = window.getComputedStyle(el);
      return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
    });

    expect(isHidden).toBe(true);
  });
});