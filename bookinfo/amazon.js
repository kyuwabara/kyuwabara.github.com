javascript: {
  const data = {};
  if (document.getElementById('quantity') !== null) {
    data.media = "物理本";
  } else if (document.getElementById('tmm-ku-upsell') !== null) {
    data.media = "KindleUnlimited";
  } else {
    data.media = "Kindle";
  }
  
  // 書籍名の取得
  const productTitle = document.getElementById("productTitle");
  const ebooksProductTitle = document.getElementById("ebooksProductTitle");
  data.title = productTitle ? productTitle.innerText.trim().replace(/\//, '／') : ebooksProductTitle.innerText.trim().replace(/\//, '／');

  // ASIN の取得
  const asinId = document.getElementById('ASIN'); 
  const asin = asinId ? asinId.value : document.getElementsByName('ASIN.0')[0].value;

  //登録情報欄を取得
  let detail = document.getElementById('detailBullets_feature_div');
  if (!detail) {
    const subdoc = document.getElementById("product-description-iframe").contentWindow.document;
    detail = subdoc.getElementById("detailBullets_feature_div");
  }

  // 出版関係の情報を取得
  const pubdata = detail.innerText.split(/\n/);
  pubdata.forEach((line) => {
    if (line.startsWith("出版社")) {
      data.publisher = line.split(";")[0].slice(10).split(" ")[0];
    } else if (line.startsWith("発売日")) {
      const ymd = line.slice(10).split("/");
      data.year = ymd[0];
      data.month = ymd[1].padStart(2, "0");
      data.date = ymd[2].padStart(2, "0");
    } else if (line.startsWith("本の長さ") || line.startsWith("単行本")) {
      data.pages = line.slice(line.lastIndexOf(" ")+1, line.length-3);
    } else if (line.startsWith("ページ番号ソース") || line.startsWith("ISBN-10")) {
      data.isbn = line.slice(line.lastIndexOf(" ")+1);
    }
  });
  
  data.link = `[Amazon](https://www.amazon.co.jp/dp/${asin})`;

  // 選択範囲を取得する
  const isSelection = window.getSelection().toString();
  data.selection = isSelection ? `> [!quote]\n> ${isSelection.replace(/(\W+)( )(\W+)/g,'$1$3').replace(/\n/g,'\n> ')}` : "";

  // 書影の取得
  //const imgBlkFront = document.getElementById("imgBlkFront");
  //const ebooksImgBlkFront = document.getElementById("ebooksImgBlkFront");
  //const imageurl = imgBlkFront ? imgBlkFront.getAttribute("src") : ebooksImgBlkFront.getAttribute("src");
  const imageurl = document.getElementById("landingImage").getAttribute("src");
  data.mdimage = `\n![|100](${imageurl})\n`;  
  
  // 著者情報の取得
  data.authors = [];
  data.viewAuthors = [];
  document.querySelectorAll('.author').forEach((c) => {
      var at = c.innerText.replace(/\r?\n/g, '').replace(/,/, '');
      var pu = at.match(/\(.+\)/);
      var ct = at.replace(/\(.+\)/, '').replace(/ /g, '');
      data.viewAuthors.push(`- [[${ct}]]${pu}`);
      data.authors.push(`"書籍/著者/${ct}"`);
  });

  const lines = `---
tags: [
  "書籍/出版社/${data.publisher}",
  ${data.authors.join(',\n  ')},
  "書籍/発売日/${data.year}/${data.month}/${data.date}",
  "書籍/メディア/${data.media}",
  "書籍/分類/"
]
---
# 書籍情報
${data.mdimage}
${data.link}

## 著者
${data.viewAuthors.join('\n')}

## 出版社
- [[${data.publisher}]]

## 発売日
- [[${data.year}-${data.month}-${data.date}]]

## ページ数
- ${data.pages}

## ISBN
- ${data.isbn}

# 閲覧履歴
- 未読

# メモ
## 雑感

## 知見

## 再認識

## 違和感

## 行動

## その他
${data.selection}
`;
  const oburi = 'obsidian://advanced-uri?vault=vaultone&filepath='+encodeURIComponent('03_Books/'+data.title)+'&data='+encodeURIComponent(lines);
  window.open(oburi);
}
