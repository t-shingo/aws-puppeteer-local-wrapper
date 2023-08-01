# sample-aws-synthetics
- localでPuppetterによる自動テストを行う。

  - ただ、localhostはテストしづらい。本Containerが単体でネットワークを組むため。
  - もし他のContainer上のWebアプリをテストする時は、docker-compose等で組み込んであ
るとかが必要
  - めんどくさいので、今回は未実装
  - puppeteerはコマンドラインアプリのため、docker-composeでは起動しづらい。

## 補足
- AWS CloudWatch SyntheticsがPuppeteer 4.0で動作するため、その検証用に作成している

# 使い方？
## executeStep で何してるの？
- AWS CloudWatch Synthetics同様、スクショを撮ってます
- 一応、ページ最上部から最下部まで移動して（無限スクロールだと、無限に下へ行きます）からスクショを撮る
- スクショは、 `outputs` 配下に出力する

# 実施
## 準備
```
docker build -t puppeteer --no-cache ./
```

### 補足
作成した中身の確認用コマンド
```
docker run --rm -it \
-v ./scripts:/app \
-v ./outputs:/output \
-w /app \
puppeteer bash
```

## 実行
```
docker run --rm -it \
-v ./scripts:/app \
-v ./outputs:/output \
-w /app \
puppeteer
```

デフォルト(`script.js`)ではなく、他のスクリプトを実行したい場合
```
docker run --rm -it \
-v ./scripts:/app \
-v ./outputs:/output \
-w /app \
puppeteer \
sample.js
```

実行何回もする版
```
rm -f ./outputs/* \
&& docker run --rm -it \
-v ./scripts:/app \
-v ./outputs:/output \
-w /app \
puppeteer \
sample.js
```

## 結果
- カレントディレクトリの `outputs` に画像が出てるので、それを見たらなんとなくわかるかと
- コマンドライン上でも実行結果が出る（※エラーがあれば）はず・・・
  - `TimeoutError: waiting for XPath "//p[contains(text(),'%E3%81%BB%E3%81%92%E3%81%E3%81%92')]" failed: timeout 30000ms exceeded`
  - みたいなエラーメッセージが出るので、それで気づけるはず

# note
## ブラウザサイズ変更
- setPageの引数を設定 or 変更する
`page.setPage(page, 1920, 1080)`

## Timeoutメッセージがいっぱい出る
- わからないので、一旦放置。
  - スクショを撮るタイミングや、waitForSelector等、要素の表示待ちでExceptionが出ているので、Catch推奨です

## もっとスクショ残したい
- めんどくさいけど、 `executeStep` でいっぱい分ける
