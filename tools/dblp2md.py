#!/usr/bin/env python3
"""
dblp2md.py — 從 DBLP 抓取著作，轉成網站用的 content/en/publications.md

在自己電腦執行即可（不需要 GitHub Actions）：

    python3 tools/dblp2md.py                      # 預設 pid 13/4194-1，輸出到 content/en/publications.md
    python3 tools/dblp2md.py --no-preprints       # 不含 arXiv / ePrint 等預印本
    python3 tools/dblp2md.py --out /tmp/pubs.md   # 輸出到別的檔案，先檢查再複製
    python3 tools/dblp2md.py --xml saved.xml      # 使用已下載的 XML（離線）

只用 Python 標準函式庫。產生後請檢查一次再 commit；
注意：直接輸出到 content/en/publications.md 會覆蓋手動修改的內容。
"""
import argparse
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from collections import OrderedDict
from pathlib import Path

DEFAULT_PID = "13/4194-1"
ME = "Yu-Chi Chen"

TYPE_MAP = {
    "article": "J",
    "inproceedings": "C",
    "incollection": "B",
    "book": "B",
    "phdthesis": "T",
    "mastersthesis": "T",
}


def text(el):
    return "".join(el.itertext()).strip() if el is not None else ""


def clean_name(name):
    # DBLP 用 "Yu-Chi Chen 0001" 區分同名作者，去掉尾端編號
    return re.sub(r"\s+\d{4}$", "", name.strip())


def fmt_authors(authors):
    out = []
    for a in authors:
        n = clean_name(a)
        out.append(f"**{n}**" if n == ME else n)
    return ", ".join(out)


def md_escape(s):
    return s.replace("*", r"\*").replace("_", r"\_").replace("[", r"\[").replace("]", r"\]")


def entry(rec):
    tag = rec.tag
    typ = TYPE_MAP.get(tag)
    if typ is None:
        return None, None
    informal = rec.get("publtype") in ("informal", "withdrawn")
    venue = text(rec.find("journal")) or text(rec.find("booktitle")) or text(rec.find("publisher")) or text(rec.find("school"))
    if informal or venue in ("CoRR", "IACR Cryptol. ePrint Arch."):
        typ = "R"
    if tag == "inproceedings" and re.search(r"workshop", venue, re.I):
        typ = "W"

    year = text(rec.find("year"))
    title = text(rec.find("title")).rstrip(".")
    authors = [text(a) for a in rec.findall("author")] or [text(e) for e in rec.findall("editor")]

    detail = []
    vol, num, pages = text(rec.find("volume")), text(rec.find("number")), text(rec.find("pages"))
    if vol:
        detail.append(vol + (f"({num})" if num else ""))
    if pages:
        detail.append(pages if vol else f"pp. {pages}")

    ee = text(rec.find("ee"))
    link = ""
    if ee:
        label = "DOI" if "doi.org" in ee else "arXiv" if "arxiv.org" in ee else "ePrint" if "eprint.iacr.org" in ee else "Link"
        link = f" [{label}]({ee})"

    line = f"- [{typ}] {fmt_authors(authors)}. {md_escape(title)}. *{md_escape(venue)}*"
    if detail:
        line += ", " + ": ".join(detail)
    line += f", {year}.{link}"
    return year, (typ, line)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pid", default=DEFAULT_PID)
    ap.add_argument("--xml", help="使用本機 XML 檔，不連網")
    ap.add_argument("--out", default=str(Path(__file__).resolve().parent.parent / "content" / "en" / "publications.md"))
    ap.add_argument("--no-preprints", action="store_true", help="排除 CoRR / ePrint 等預印本")
    args = ap.parse_args()

    if args.xml:
        data = Path(args.xml).read_bytes()
    else:
        url = f"https://dblp.org/pid/{args.pid}.xml"
        print(f"下載 {url} …", file=sys.stderr)
        req = urllib.request.Request(url, headers={"User-Agent": "dblp2md/1.0 (personal website)"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()

    root = ET.fromstring(data)
    by_year = {}
    count = 0
    for r in root.findall("r"):
        for rec in r:
            year, item = entry(rec)
            if not item:
                continue
            if args.no_preprints and item[0] == "R":
                continue
            by_year.setdefault(year, []).append(item)
            count += 1

    order = {"J": 0, "C": 1, "W": 2, "B": 3, "P": 4, "T": 5, "R": 6}
    lines = [
        "<!--",
        f"由 tools/dblp2md.py 自 DBLP（pid {args.pid}）產生。",
        "類型代碼：[J] 期刊 [C] 研討會 [W] 工作坊 [B] 專書 [P] 專利 [R] 預印本 [T] 論文",
        "可直接手動編輯；但重新執行此工具會覆蓋本檔。",
        "-->",
        "",
    ]
    for year in sorted(by_year, key=lambda y: (y or "0"), reverse=True):
        lines.append(f"## {year}")
        for _, line in sorted(by_year[year], key=lambda x: order.get(x[0], 9)):
            lines.append(line)
        lines.append("")

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：{count} 筆 → {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
