const puppeteer = require('puppeteer')
const synthetics = require('./modules/wrapper/aws/synthetics')

const flowBuilderBlueprint = async function () {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  const page = await browser.newPage()
  synthetics.setPage(page, 1980, 1080)

  let step = 0

  // ---------------------------------------------
  // sample
  step++
  task = 0
  
  // 指定したURLへ移動する
  await synthetics.executeStep(step + '_' + (task++) + '_navigateToUrl', async function (timeoutInMillis = 30000) {
    await page.goto('https://tagawa.dev/php/')
      .catch(e => console.log('[goToAdmin: 1] timeout exceed. process to next operation.'))
  })

  // リンクをクリックする
  await synthetics.executeStep(step + '_' + (task++) + '_move', async function () {
      // await page.type(Selector, input text)
      let slc = 'body > div:nth-child(3) > ul > li:nth-child(3) > a'
      await page.waitForSelector(slc, { timeout: 30000 });
      await page.click(slc)
  })

  // 文字を入力する
  await synthetics.executeStep(step + '_' + (task++) + '_push_transform', async function () {
    await page.type('body > div:nth-child(3) > div > form > input[type=textform]:nth-child(1)', 'ほげほげ')
  })

  // 変換ボタンを押す
  await synthetics.executeStep(step + '_' + (task++) + '_input', async function () {
    await page.waitForSelector('body > div:nth-child(3) > div > form > input[type=submit]:nth-child(2)', { timeout: 30000 });
    await page.click('body > div:nth-child(3) > div > form > input[type=submit]:nth-child(2)')
  })

  // 実行結果を確認する
  await synthetics.executeStep(step + '_' + (task++) + '_verifyText', async function () {
      await page.waitForXPath("//p[contains(text(),'ほげほげ')]", { timeout: 30000 })

      await page.waitForXPath("//p[contains(text(),'%E3%81%BB%E3%81%92%E3%81%BB%E3%81%92')]", { timeout: 30000 })
      // await page.waitForXPath("//p[contains(text(),'%E3%81%BB%E3%81%92%E3%81%E3%81%92')]", { timeout: 30000 }) // エラーを起こす時

      await page.waitForXPath("//p[contains(text(),'44G744GS44G744GS')]", { timeout: 30000 })
  })
  
  // ブラウザを閉じる
  await browser.close()
}

// スクリプトを実行
flowBuilderBlueprint()