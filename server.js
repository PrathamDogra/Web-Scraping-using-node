const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const csv = require("fast-csv");

const alpha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

const data = [];
alpha.map(val => {
  const url = `https://www.noslang.com/dictionary/${val}`;
  request(url, (err, response, html) => {
    if (!err) {
      const $ = cheerio.load(html);
      const allItems = $("dl").children();
      const items = [];
      const meanings = [];

      allItems.each(i => {
        items.push(
          $("dl")
            .children()
            .eq(i)
            .children()
            .eq(0)
            .children()
            .children()
            .children()
            .text()
        );
        meanings.push(
          $("dl")
            .children()
            .eq(i)
            .children()
            .eq(0)
            .attr("title")
        );
      });
      const slangs = [];
      items.map((val, i) => {
        val = val.replace(" :", "");
        slangs.push(val); // Contains the slangs
      });
      const len = slangs.length;
      for (let i = 0; i < len; i++) {
        const csv = [];
        csv.push(slangs[i]);
        csv.push(meanings[i]);
        data.push(csv);
      }
      console.log(data);
      const ws = fs.createWriteStream("data.csv");
      csv.write(data, { headers: true }).pipe(ws);
    }
  });
});


