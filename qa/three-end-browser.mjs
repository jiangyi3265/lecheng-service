import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium } from 'playwright'

const password = process.env.LC_QA_ADMIN_PASS
if (!password) throw new Error('Set LC_QA_ADMIN_PASS before running the browser integration test')
const miniUrl = process.env.LC_QA_MINI_URL || 'http://127.0.0.1:5186'
const adminUrl = process.env.LC_QA_ADMIN_URL || 'http://127.0.0.1:5190'
const apiUrl = process.env.LC_QA_API_URL || 'http://127.0.0.1:8080'
const id = `qa-hospital-${Date.now()}`
const name = '浏览器联调医院'
const question = `浏览器联调咨询 ${id}`
const answer = `客服联调回复 ${id}`
const patient = `联调用户${Date.now()}`
const feedbackText = `页面反馈 ${id}`
const browser = await chromium.launch({ headless: true })
const admin = await browser.newPage({ viewport: { width: 1280, height: 840 } })
const mini = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errors = []
for (const page of [admin, mini]) page.on('pageerror', error => errors.push(error.message))
let adminToken = ''
let guestToken = ''

try {
  const captchaResponse = admin.waitForResponse(response => response.url().includes('/captchaImage'), { timeout: 30000 })
  await admin.goto(`${adminUrl}/login`, { waitUntil: 'domcontentloaded' })
  const captcha = await (await captchaResponse).json()
  const code = captcha.captchaEnabled
    ? execFileSync('redis-cli', ['--raw', 'GET', `captcha_codes:${captcha.uuid}`], { encoding: 'utf8' }).trim().replace(/^"|"$/g, '')
    : ''
  await admin.getByPlaceholder('账号').fill(process.env.LC_QA_ADMIN_USER || 'admin')
  await admin.getByPlaceholder('密码').fill(password)
  if (captcha.captchaEnabled) await admin.getByPlaceholder('验证码').fill(code)
  await admin.getByRole('button', { name: '登 录' }).click()
  await admin.waitForURL(url => !url.pathname.includes('/login'), { timeout: 30000 })
  adminToken = (await admin.context().cookies()).find(cookie => cookie.name === 'Admin-Token')?.value || ''
  assert.ok(adminToken, 'admin login did not set a token')
  await admin.goto(`${adminUrl}/lecheng`, { waitUntil: 'domcontentloaded' })
  await admin.getByRole('heading', { name: '乐城运营' }).waitFor({ timeout: 30000 })
  await admin.getByRole('button', { name: '新增内容' }).click()
  const dialog = admin.locator('.el-dialog')
  await dialog.locator('.el-form-item').nth(1).locator('input').fill(id)
  await dialog.locator('.el-form-item').nth(2).locator('input').fill(name)
  await dialog.locator('.el-form-item').nth(5).locator('textarea').fill(JSON.stringify({
    id, name, scene: 0, tags: ['联调'], subtitle: '三端联调测试', type: '综合医院',
    departments: ['综合内科'], address: '联调测试地址', description: '仅用于自动化测试', features: [],
  }, null, 2))
  await dialog.getByRole('button', { name: '保存并同步小程序' }).click()
  await dialog.waitFor({ state: 'hidden', timeout: 20000 })
  await admin.getByText(name).first().waitFor()
  console.log('PASS: administrator created a hospital through the UI')

  await mini.goto(`${miniUrl}/#/pages/index/index`, { waitUntil: 'domcontentloaded' })
  await mini.getByText(name).first().waitFor({ timeout: 30000 })
  await mini.screenshot({ path: path.join(os.tmpdir(), 'lecheng-three-end-home.png') })
  console.log('PASS: mini-program rendered the new hospital from the backend')

  await mini.goto(`${miniUrl}/#/pages/search/search`, { waitUntil: 'domcontentloaded' })
  await mini.getByRole('tab', { name: '批复项目' }).waitFor({ timeout: 20000 })
  await mini.getByRole('tab', { name: '特许药械' }).click()
  await mini.getByText('眼科药品示例 A').first().waitFor({ timeout: 15000 })
  await mini.getByRole('tab', { name: '亚健康项目' }).click()
  await mini.getByText('眼科检查设备').first().waitFor({ timeout: 15000 })
  console.log('PASS: mini-program search categories rendered backend content')

  await mini.goto(`${miniUrl}/#/pages/support/support`, { waitUntil: 'domcontentloaded' })
  const input = mini.locator('uni-input[aria-label="咨询内容"] input')
  await input.waitFor({ timeout: 20000 })
  await input.fill(question)
  await mini.getByRole('button', { name: '发送消息' }).click()
  await mini.getByText(question).first().waitFor({ timeout: 20000 })
  guestToken = await mini.evaluate(() => window.uni?.getStorageSync('lecheng-client-session') || '')
  assert.ok(guestToken, 'mini-program guest session was not stored')

  await admin.getByRole('tab', { name: '客服咨询' }).click()
  const conversation = admin.locator('tr').filter({ hasText: question }).first()
  await conversation.waitFor({ timeout: 20000 })
  await conversation.click()
  await admin.getByPlaceholder('输入回复').fill(answer)
  await admin.getByRole('button', { name: '回复', exact: true }).click()
  await mini.getByText(answer).first().waitFor({ timeout: 22000 })
  await mini.screenshot({ path: path.join(os.tmpdir(), 'lecheng-three-end-support.png') })
  console.log('PASS: mini-program message reached admin and reply returned to mini-program')

  await mini.goto(`${miniUrl}/#/pages/appointment/book?doctorId=international-0`, { waitUntil: 'domcontentloaded' })
  await mini.getByText('预约咨询申请将提交客服后台').waitFor({ timeout: 20000 })
  await mini.locator('.selection-chip').filter({ hasText: '09:00–09:30' }).click()
  await mini.locator('uni-input[aria-label="就诊人姓名"] input').fill(patient)
  await mini.locator('uni-input[aria-label="联系电话"] input').fill('13800138000')
  await mini.locator('uni-checkbox').first().click()
  await mini.locator('uni-button.primary-button').click()
  await mini.getByText('预约咨询申请已提交').waitFor({ timeout: 20000 })
  await admin.getByRole('tab', { name: '预约申请' }).click()
  const bookingRow = admin.locator('tr').filter({ hasText: patient }).first()
  await bookingRow.waitFor({ timeout: 20000 })
  await bookingRow.getByRole('button', { name: '标记已联系' }).click()
  await mini.reload({ waitUntil: 'domcontentloaded' })
  await mini.getByText('已联系').first().waitFor({ timeout: 20000 })
  console.log('PASS: mini-program appointment reached admin and status returned')

  await mini.goto(`${miniUrl}/#/pages/service/service?type=${encodeURIComponent('帮助与反馈')}`, { waitUntil: 'domcontentloaded' })
  await mini.locator('uni-textarea[aria-label="意见反馈"] textarea').fill(feedbackText)
  await mini.locator('uni-button.primary-button').click()
  await admin.getByRole('tab', { name: '用户反馈' }).click()
  const feedbackRow = admin.locator('tr').filter({ hasText: feedbackText }).first()
  await feedbackRow.waitFor({ timeout: 20000 })
  await feedbackRow.getByRole('button', { name: '标记已处理' }).click()
  await mini.reload({ waitUntil: 'domcontentloaded' })
  await mini.getByText(feedbackText).first().waitFor({ timeout: 20000 })
  await mini.getByText('已处理').first().waitFor({ timeout: 20000 })
  console.log('PASS: mini-program feedback reached admin and status returned')

  assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`)
  console.log('PASS: no browser page errors')
}
finally {
  if (adminToken) {
    await fetch(`${apiUrl}/lecheng/content/${encodeURIComponent(id)}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` },
    }).catch(() => {})
  }
  if (guestToken) {
    const hash = createHash('sha256').update(guestToken).digest('hex')
    const config = readFileSync(new URL('../../RuoYi-Vue/ruoyi-admin/src/main/resources/application-druid.yml', import.meta.url), 'utf8')
    const dbPassword = config.match(/^\s*password:\s*(\S+)/m)?.[1]
    const schema = config.match(/jdbc:mysql:\/\/[^/]+\/([a-zA-Z0-9_]+)/)?.[1]
    if (dbPassword && schema) execFileSync('mysql', ['-uroot', '-D', schema, '-e',
      `DELETE FROM lc_message WHERE session_hash='${hash}'; DELETE FROM lc_appointment WHERE session_hash='${hash}'; DELETE FROM lc_feedback WHERE session_hash='${hash}'; DELETE FROM lc_client WHERE session_hash='${hash}';`,
    ], { env: { ...process.env, MYSQL_PWD: dbPassword } })
  }
  await browser.close()
}
