import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));

  console.log("Navigating...");
  await page.goto('http://localhost:5173/');

  // wait for it
  await page.waitForTimeout(1000);

  // login if redirected
  console.log("Logging in...");
  try {
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await page.fill('input[type="email"]', 'rm@idl.com');
      await page.fill('input[type="password"]', 'Ronak123!');
      await page.click('button:has-text("Sign In")').catch(() => page.click('button:has-text("Sign in")').catch(() => page.click('button[type="submit"]')));
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.log("Login err", e);
  }
  
  console.log("Going to add project...");
  await page.goto('http://localhost:5173/manage-project/add-project', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  try {
    // fill step 1
    console.log("Step 1...");
    await page.fill('input[name="name"]', 'TestProject');
    await page.fill('input[name="technologyStack"]', 'React');
    await page.fill('textarea[name="description"]', 'This is a long description that is over twenty characters');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // step 2
    console.log("Step 2...");
    await page.fill('input[name="managerName"]', 'Test Manager');
    await page.fill('input[name="managerEmail"]', 'manager@test.com');
    await page.fill('input[name="managerContact"]', '9876543210');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // step 3
    console.log("Step 3...");
    await page.fill('input[name="clientName"]', 'Test Client');
    await page.fill('input[name="clientManagerName"]', 'Client Manager');
    await page.fill('input[name="clientManagerEmail"]', 'client@test.com');
    await page.fill('input[name="clientManagerContact"]', '9876543210');
    await page.click('button:has-text("Next")');
    
    // wait for it
    console.log("Waiting to see what happens on Step 4...");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "step4.png" });

  } catch(e) {
    console.log("Test error", e);
    await page.screenshot({ path: "error.png" });
  }

  console.log("DONE");
  await browser.close();
})();
