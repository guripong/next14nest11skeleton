// scripts/generate-page-list.js
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "../src/nextjs/app/(pages)");

function getAllNextPages(dir, baseUrl = "") {
  let pages = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(baseUrl, file).replace(/\\/g, "/");

    if (fs.statSync(filePath).isDirectory()) {
      pages = pages.concat(getAllNextPages(filePath, relativePath));
    } else if (file === "page.tsx") {
      let route = relativePath.replace("/page.tsx", "");
      if (route === "") route = "/";
      pages.push(route);
    }
  });

  return pages;
}

const pageList = getAllNextPages(pagesDir);
fs.writeFileSync(
  path.join(__dirname, "../src/pageList.json"),
  JSON.stringify(pageList, null, 2)
);

console.log("✅ pageList.json 생성 완료");
