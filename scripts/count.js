const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "chapters");

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".txt")) out.push(p);
  }
  return out;
}

const files = walk(root).sort();
const bad = [];
for (const p of files) {
  const t = fs.readFileSync(p, "utf8");
  const han = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  const noSpace = t.replace(/\s/g, "").length;
  const straight = (t.match(/["']/g) || []).length;
  const bold = (t.match(/\*\*/g) || []).length;
  const latin = t.match(/[A-Za-z]{2,}/g) || [];
  const ok = han >= 2050 && straight === 0 && bold === 0 && latin.length === 0;
  if (!ok) bad.push(path.relative(root, p));
  console.log(
    `${path.relative(root, p)} | 汉字=${han} | 去空白=${noSpace} | 直引号=${straight} | 加粗=${bold} | 英文=${latin.length ? latin.join(",") : 0} | ${ok ? "OK" : "需调整"}`
  );
}
console.log(`\n共 ${files.length} 章` + (bad.length ? "，未达标：" + bad.join("，") : "，全部达标"));
