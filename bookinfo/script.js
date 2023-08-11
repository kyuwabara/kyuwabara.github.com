javascript: {
  // 書籍名の取得
  const productTitle = document.getElementById("productTitle");
  const ebooksProductTitle = document.getElementById("ebooksProductTitle");
  const title = productTitle ? productTitle.innerText.trim() : ebooksProductTitle.innerText.trim();

  // ASIN の取得
  const asinId = document.getElementById('ASIN'); 
  const asin = asinId ? asinId.value : document.getElementsByName('ASIN.0')[0].value;

  //登録情報欄を取得
  let detail = document.getElementById('detailBullets_feature_div');
  if (!detail) {
    const subdoc = document.getElementById("product-description-iframe").contentWindow.document;
    detail = subdoc.getElementById("detailBullets_feature_div");
  }

  // 出版関係の情報を取得 (ここでは出版日付だけ)
  const pubdata = detail.innerText.split(/\n/);
  const publish_date = pubdata[2].slice(10);  //出版日付

  // 書籍のタイトルとリンク貼り
  const url = `https://www.amazon.co.jp/dp/${asin}`;
  const link = `[${title}](${url})`;

  // 選択範囲を取得する
  const isSelection = window.getSelection().toString();
  const selection = isSelection ? `> [!quote]\n> ${isSelection.replace(/(\W+)( )(\W+)/g,'$1$3').replace(/\n/g,'\n> ')}` : "";

  // 書影の取得
  const imgBlkFront = document.getElementById("imgBlkFront");
  const ebooksImgBlkFront = document.getElementById("ebooksImgBlkFront");
  const imageurl = imgBlkFront ? imgBlkFront.getAttribute("src") : ebooksImgBlkFront.getAttribute("src");
  const mdimage = `\n![|100](${imageurl})\n`;  
  
  // 著者情報の取得
  const authors = [];
  const viewAuthors = [];
  document.querySelectorAll('.author').forEach((c) => {
      var at = c.innerText.replace(/\r?\n/g, '').replace(/,/, '');
      var pu = at.match(/\(.+\)/);
      var ct = at.replace(/\(.+\)/, '').replace(/ /g, '');
      viewAuthors.push(`[[${ct}]]${pu}`);
      authors.push(ct);
  });

  // 表示する内容
  const lines = `---\ntitle: ${title} \nauthor: [${authors.join(',')}]\nasin: ${asin}\npublish_date: ${publish_date}\n---\n# ${link}\n${viewAuthors.join('\n')}${mdimage}\n${selection}\n\n----\n`;
  
  document.getElementById('bookDescription_feature_div').innerHTML = `<textarea style="height:500px">${lines}</textarea>`;
  window.open('obsidian://new?vault=vaultone&name='+encodeURIComponent(title.trim())+'&content='+encodeURIComponent(body));
}
