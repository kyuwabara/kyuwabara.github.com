javascript: {
  const data = {};
  data.media = "物理本";
  
  // 書籍名の取得
  const tmpTitle = document.getElementById('products_maintitle').innerText;
  const title = tmpTitle.slice(0, tmpTitle.lastIndexOf('[')-1);
  data.title = title.replace(/\(.+\)/, '').trim().replace(/\//, '／').replace(/ /, '_');

  // 出版関係の情報を取得
  document.querySelectorAll('table.specTbl>tbody>tr>td').forEach((td) => {
    const line = td.innerText;
    if (line.startsWith("出版社名")) {
      data.publisher = line.slice(5);
    } else if (line.startsWith("著者名")) {
      data.authorsString = line.slice(4);
    } else if (line.startsWith("発行年月日")) {
      const ymd = line.slice(6).split("/");
      data.year = ymd[0];
      data.month = ymd[1].padStart(2, "0");
      data.date = ymd[2].padStart(2, "0");
    } else if (line.startsWith("ページ数")) {
      data.pages = line.slice(5, line.length-3);
    } else if (line.startsWith("ISBN-10")) {
      data.isbn = line.slice(8);
    }
  });

  const uri = document.baseURI;
  data.link = `[Yodobashi](${uri})`;

  // 選択範囲を取得する
  const isSelection = window.getSelection().toString();
  data.selection = isSelection ? `> [!quote]\n> ${isSelection.replace(/(\W+)( )(\W+)/g,'$1$3').replace(/\n/g,'\n> ')}` : "";

  // 書影の取得
  const imageurl = document.getElementById('mainImg').src;
  data.mdimage = `\n![|100](${imageurl})\n`;  
  
  // 著者情報の取得
  data.authors = [];
  data.viewAuthors = [];
  data.authorsString.split("／").forEach((c) => {
      var at = c.replace(/\r?\n/g, '').replace(/,/, '');
      var pu = at.match(/（(.+)）/);
      var ct = at.replace(/（.+）/, '').replace(/ /g, '');
      data.viewAuthors.push(`- [[${ct}]](${pu[1]})`);
      data.authors.push(`"書籍/著者/${ct}"`);
  });
  if (data.authors.length > 4) {
    data.authors = [];
  }

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
