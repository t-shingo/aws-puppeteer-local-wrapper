/**
 * AWS CDKのSyntheticsのWrapper
 * 部分的に、独自実装にしている
 */
const TIMEOUT_MILLSEC = 3000;
const FULL_PAGE = true;
let page;
let output_dir = '/output/';

const VP_WIDTH_SP = 1050;
const VP_HEIGHT_SP = 1680;

const VP_WIDTH_PC = 1920;
const VP_HEIGHT_PC = 1080;

let VP_width;
let VP_height;

/**
 * Lazyload対策
 * ページ最下部へ移動する
 */
const scrollBottom = async () => {
    await page.waitForNavigation({waitUtil: 'networkidle2', timeout: TIMEOUT_MILLSEC})
        .catch(e => console.log('[waitForNavigation: 1] timeout exceed. process to next operation.'));

    const getScrollHeight = () => {
        return Promise.resolve(document.documentElement.scrollHeight);
    }

    let scrollHeight = await page.evaluate(getScrollHeight);
    let currentPosition = 0;
    let scrollNumber = 0;

    while (currentPosition < scrollHeight) {
        scrollNumber += 1;
        const nextPosition = scrollNumber * VP_height;

        await page.evaluate((scrollTo) => {
            return Promise.resolve(window.scrollTo(0, scrollTo));
        }, nextPosition);

        // TODO 必ずTimeoutになる？コメントアウトしてみる
        // await page.waitForNavigation({waitUntil: 'networkidle2', timeout: TIMEOUT_MILLSEC})
        //     .catch(e => console.log('[waitForNavigation: 2] timeout exceed. process to next operation.'));

        currentPosition = nextPosition;

        scrollHeight = await page.evaluate(getScrollHeight);
    }
}

exports.setPage = async function (val, width = VP_WIDTH_PC, height = VP_HEIGHT_PC) {
    page = val;

    page.setViewport({
        width: width,
        height: height
    });
    

    // 後に、全ページスクリーンショットを取るために画面サイズを退避
    VP_width = width;
    VP_height = height;
}

exports.setOutputDir = async function (val) {
    output_dir = val;
}

exports.executeStep = async function (label, callback) {
    await scrollBottom();
    await page.screenshot({ path: output_dir + label + "_" + (new Date()).getTime() + ".png", fullPage: FULL_PAGE, });

    await callback();

    await scrollBottom();
    await page.screenshot({ path: output_dir + label  + "_" + (new Date()).getTime() + ".png", fullPage: FULL_PAGE, });
}
