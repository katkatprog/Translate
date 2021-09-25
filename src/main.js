const main = async()=>{

    //変数設定
    const pageURL = "https://translate.google.co.jp/?hl=ja&sl=en&tl=ja&op=translate";//Google翻訳 英語→日本語に翻訳するページ
    const filePath = "../config/sentences.txt"//翻訳する英文ファイルの相対パス
    const sentences = readTextFile(filePath);//ファイルを読み込み配列に格納
    const inputSelector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.UnxENd > span > span > div > textarea";
    const outputSelector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.P6w8m.BDJ8fb > div.dePhmb > div > div.J0lOec > span.VIiyi > span > span";

    //モジュール読みこみ
    const puppeteer = require('puppeteer');
    // Puppeteerの起動. ブラウザオブジェクトの作成
    const browser = await puppeteer.launch({
        headless: true, // Headlessモードで起動するかどうか. trueならバックグラウンドで実行
    });
    // 新しい空のページを開く. ページオブジェクトの作成
    const page = await browser.newPage();

    // google翻訳ページにアクセス
    await page.goto(pageURL);
    //sentences配列の要素1つ1つを翻訳する
    for (let index = 0; index < sentences.length; index++) {
        if(sentences[index] !== ""){
            await page.type(inputSelector,sentences[index]);//英文をテキストエリアに入力
            await sleepByPromise(3);
            // const result = await page.$$eval(outputSelector, (list) => list.map((elm) => elm.innerHTML));
            const result = await page.$eval(outputSelector, (hoge) => hoge.innerHTML);//翻訳された日本語を変数に格納
            console.log(result);//表示
            //バツボタンにカーソルを合わせ、エンターを押し、テキストエリアを空にする
            await page.keyboard.press("Tab");
            await page.keyboard.press("Enter");
        }
    }
    browser.close();
}

//テキストファイルを一行ずつ読み取り、配列に格納する関数
const readTextFile = (filePath) => {
    const fs = require('fs');
    const text = fs.readFileSync(filePath, 'utf8');
    const lines = text.split(/\n/);
    return lines;
}

// Promiseを使うsleep
const sleepByPromise = (sec) => {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

//関数の実行
main();