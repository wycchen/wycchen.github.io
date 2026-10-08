/*
	app.js — 單頁式個人網站
	所有內容由 Markdown 載入（content/、news/），不需建置、不需 GitHub Actions。
	路由：#/  #/publications  #/projects  #/honors  #/teaching  #/news  #/news/<slug>  #/contact
*/
(function () {
	'use strict';

	var root = document.documentElement;
	var NOW_YEAR = new Date().getFullYear();
	var HOME_NEWS_LIMIT = 5;
	// 著作／計畫／榮譽不放在分頁列，改由總覽的「精選」區塊進入
	var SELECTED = [['publications', 'fa-book-open'], ['projects', 'fa-diagram-project'], ['honors', 'fa-award']];

	/* =========================================================
	 * 介面文字（資料都在 Markdown；這裡只有 UI 字串）
	 * ========================================================= */
	var I18N = {
		en: {
			skip: 'Skip to content',
			'nav.overview': 'Overview', 'nav.publications': 'Publications', 'nav.projects': 'Projects',
			'nav.honors': 'Honors', 'nav.teaching': 'Teaching', 'nav.news': 'News', 'nav.contact': 'Contact',
			'ui.langSwitch': 'Language', 'ui.themeSwitch': 'Toggle dark mode',
			'ui.cv': 'Download CV', 'ui.cvMissing': 'CV not uploaded yet', 'ui.email': 'Email',
			'ui.loading': 'Loading…', 'ui.loadError': 'This content could not be loaded.',
			'ui.localHint': 'Previewing from a local file? Run a local server (see README).',
			'egg.cardAlt': 'Legendary card: Yu-Chi Chen, “Group Meet Tomorrow”', 'egg.cardHint': 'Tap the card to flip · Esc to close', 'ui.close': 'Close', 'egg.decrypted': 'Decrypted: “Cryptography”. You cracked the hex! 🔓', 'ui.ongoing': 'Ongoing', 'ui.present': 'present', 'ui.pinned': 'Pinned', 'ui.close': 'Close',
			'ui.allNews': 'All announcements', 'ui.noNews': 'No announcements yet.',
			'ui.notFound': 'This page does not exist.', 'ui.home': 'Back to overview',
			'sec.about': 'About', 'sec.research': 'Research', 'sec.news': 'Latest news',
			'sec.selected': 'Selected work', 'sec.experience': 'Experience', 'sec.education': 'Education',
			'ui.curated': 'Curated', 'lead.selected': 'A hand-picked selection — not a complete list.',
			'sel.publications': 'Selected publications', 'sel.projects': 'Selected projects', 'sel.honors': 'Selected honors',
			'sel.items': '{n} items', 'sel.full': 'For the complete record, see the CV.',
			'sec.contact': 'Get in touch', 'sec.links': 'Profiles', 'sec.cv': 'Curriculum vitae', 'lead.cv': 'Download the full CV as a PDF.',
			'lead.publications': 'Representative journal articles, conference papers, patents and preprints.',
			'lead.projects': 'Representative funded research projects and lab research directions.',
			'lead.honors': 'Selected awards, fellowships and recognitions.',
			'lead.teaching': 'Courses taught over the years.',
			'lead.news': 'All announcements, newest first.',
			'lead.contact': 'The fastest way to reach me is by email.',
			'period.label': 'Period', 'period.3': '3 years', 'period.5': '5 years', 'period.all': 'All',
			'period.custom': 'Custom', 'period.from': 'From', 'period.to': 'To',
			'period.count': '{n} of {total}', 'period.range': '{from}–{to}',
			'period.empty': 'Nothing between {from} and {to}.', 'period.showAll': 'Show all',
			'term.1': 'AY {y} Fall', 'term.2': 'AY {y} Spring',
			'type.all': 'All', 'type.J': 'Journal', 'type.C': 'Conference', 'type.W': 'Workshop',
			'type.B': 'Book', 'type.P': 'Patent', 'type.R': 'Preprint', 'type.T': 'Thesis',
			'contact.email': 'Email', 'contact.office': 'Office', 'contact.address': 'Address',
			'contact.phone': 'Phone', 'contact.labPhone': 'Lab phone', 'contact.lab': 'Lab',
			'contact.copy': 'Copy', 'contact.copied': 'Copied',
			'links.scholar': 'Google Scholar', 'links.dblp': 'DBLP', 'links.orcid': 'ORCID',
			'links.github': 'GitHub', 'links.selected': 'Selected publications', 'links.lab': 'Lab website',
			title: '{name} | {univ}'
		},
		zh: {
			skip: '跳到主要內容',
			'nav.overview': '總覽', 'nav.publications': '著作', 'nav.projects': '計畫',
			'nav.honors': '榮譽', 'nav.teaching': '課程', 'nav.news': '公告', 'nav.contact': '聯絡',
			'ui.langSwitch': '語言', 'ui.themeSwitch': '切換深色模式',
			'ui.cv': '下載履歷', 'ui.cvMissing': '履歷尚未上傳', 'ui.email': '寄信',
			'ui.loading': '載入中…', 'ui.loadError': '內容載入失敗。',
			'ui.localHint': '若直接開啟本機檔案，請改用本機伺服器預覽（見 README）。',
			'egg.cardAlt': '傳說級卡片：陳昱圻「明天要 Group Meet」', 'egg.cardHint': '點卡片翻面 · 按 Esc 關閉', 'ui.close': '關閉', 'egg.decrypted': '解密成功：「Cryptography」，你破解了這串十六進位！🔓', 'ui.ongoing': '進行中', 'ui.present': '至今', 'ui.pinned': '置頂', 'ui.close': '關閉',
			'ui.allNews': '全部公告', 'ui.noNews': '目前沒有公告。',
			'ui.notFound': '找不到這個頁面。', 'ui.home': '回到總覽',
			'sec.about': '關於', 'sec.research': '研究領域', 'sec.news': '最新消息',
			'sec.selected': '精選成果', 'sec.experience': '經歷', 'sec.education': '學歷',
			'ui.curated': '精選', 'lead.selected': '經過挑選的代表性項目，並非完整清單。',
			'sel.publications': '精選著作', 'sel.projects': '精選計畫', 'sel.honors': '精選榮譽',
			'sel.items': '{n} 項', 'sel.full': '完整紀錄請見履歷。',
			'sec.contact': '聯絡方式', 'sec.links': '學術檔案', 'sec.cv': '個人履歷', 'lead.cv': '下載完整履歷（PDF）。',
			'lead.publications': '代表性的期刊、研討會論文、專利與預印本。',
			'lead.projects': '代表性的研究計畫與實驗室研究方向。',
			'lead.honors': '精選的獲獎、獎助與榮譽。',
			'lead.teaching': '歷年開設課程。',
			'lead.news': '全部公告，由新到舊。',
			'lead.contact': '最快的聯絡方式是寄電子郵件。',
			'period.label': '期間', 'period.3': '近 3 年', 'period.5': '近 5 年', 'period.all': '全部',
			'period.custom': '自訂', 'period.from': '從', 'period.to': '到',
			'period.count': '{n} / {total} 筆', 'period.range': '{from}–{to}',
			'period.empty': '{from}–{to} 沒有資料。', 'period.showAll': '顯示全部',
			'term.1': '{y} 上學期', 'term.2': '{y} 下學期',
			'type.all': '全部', 'type.J': '期刊', 'type.C': '研討會', 'type.W': '工作坊',
			'type.B': '專書', 'type.P': '專利', 'type.R': '預印本', 'type.T': '學位論文',
			'contact.email': '電子郵件', 'contact.office': '研究室', 'contact.address': '地址',
			'contact.phone': '電話', 'contact.labPhone': '實驗室電話', 'contact.lab': '實驗室',
			'contact.copy': '複製', 'contact.copied': '已複製',
			'links.scholar': 'Google Scholar', 'links.dblp': 'DBLP', 'links.orcid': 'ORCID',
			'links.github': 'GitHub', 'links.selected': '代表著作', 'links.lab': '實驗室網站',
			title: '{name}｜{univ}'
		},
		ja: {
			skip: '本文へスキップ',
			'nav.overview': '概要', 'nav.publications': '論文・著作', 'nav.projects': '研究プロジェクト',
			'nav.honors': '受賞', 'nav.teaching': '担当授業', 'nav.news': 'お知らせ', 'nav.contact': '連絡先',
			'ui.langSwitch': '言語', 'ui.themeSwitch': 'ダークモード切替',
			'ui.cv': '履歴書をダウンロード', 'ui.cvMissing': '履歴書は未掲載です', 'ui.email': 'メール',
			'ui.loading': '読み込み中…', 'ui.loadError': 'コンテンツを読み込めませんでした。',
			'ui.localHint': 'ローカルファイルを直接開いている場合は、ローカルサーバーでプレビューしてください（README 参照）。',
			'egg.cardAlt': 'レジェンドカード：陳昱圻「明日は Group Meet」', 'egg.cardHint': 'カードをタップで裏返す · Esc で閉じる', 'ui.close': '閉じる', 'egg.decrypted': '復号成功：「Cryptography」。16 進数を解読しました！🔓', 'ui.ongoing': '進行中', 'ui.present': '現在', 'ui.pinned': '固定', 'ui.close': '閉じる',
			'ui.allNews': 'すべてのお知らせ', 'ui.noNews': 'お知らせはまだありません。',
			'ui.notFound': 'このページは存在しません。', 'ui.home': '概要に戻る',
			'sec.about': 'プロフィール', 'sec.research': '研究分野', 'sec.news': '最新情報',
			'sec.selected': '主な業績', 'sec.experience': '職歴', 'sec.education': '学歴',
			'ui.curated': '厳選', 'lead.selected': '代表的なものを厳選して掲載しています（全件ではありません）。',
			'sel.publications': '主要論文・著作', 'sel.projects': '主な研究プロジェクト', 'sel.honors': '主な受賞',
			'sel.items': '{n} 件', 'sel.full': '全業績は履歴書をご覧ください。',
			'sec.contact': 'お問い合わせ', 'sec.links': '研究者プロフィール', 'sec.cv': '履歴書', 'lead.cv': '履歴書（PDF）をダウンロードできます。',
			'lead.publications': '代表的な学術論文、国際会議論文、特許、プレプリント。',
			'lead.projects': '代表的な研究助成プロジェクトと研究室の研究テーマ。',
			'lead.honors': '主な受賞、フェローシップ、表彰。',
			'lead.teaching': 'これまでの担当授業。',
			'lead.news': 'すべてのお知らせ（新しい順）。',
			'lead.contact': 'ご連絡はメールが最も確実です。',
			'period.label': '期間', 'period.3': '直近3年', 'period.5': '直近5年', 'period.all': 'すべて',
			'period.custom': '期間指定', 'period.from': '開始', 'period.to': '終了',
			'period.count': '{n} / {total} 件', 'period.range': '{from}–{to}',
			'period.empty': '{from}–{to} の該当項目はありません。', 'period.showAll': 'すべて表示',
			'term.1': '{y}年度 秋学期', 'term.2': '{y}年度 春学期',
			'type.all': 'すべて', 'type.J': '論文誌', 'type.C': '国際会議', 'type.W': 'ワークショップ',
			'type.B': '書籍', 'type.P': '特許', 'type.R': 'プレプリント', 'type.T': '学位論文',
			'contact.email': 'メール', 'contact.office': '研究室', 'contact.address': '住所',
			'contact.phone': '電話', 'contact.labPhone': '研究室電話', 'contact.lab': 'ラボ',
			'contact.copy': 'コピー', 'contact.copied': 'コピーしました',
			'links.scholar': 'Google Scholar', 'links.dblp': 'DBLP', 'links.orcid': 'ORCID',
			'links.github': 'GitHub', 'links.selected': '代表論文', 'links.lab': '研究室サイト',
			title: '{name}｜{univ}'
		}
	};
	var LANGS = ['zh', 'en', 'ja'];
	var LANG_LABEL = { zh: '中', en: 'EN', ja: '日' };
	var LANG_NAME = { zh: '繁體中文', en: 'English', ja: '日本語' };
	var HTML_LANG = { zh: 'zh-Hant-TW', en: 'en', ja: 'ja' };

	function lang() { var l = root.getAttribute('data-lang'); return LANGS.indexOf(l) >= 0 ? l : 'en'; }
	function t(key, vars) {
		var s = I18N[lang()][key] != null ? I18N[lang()][key] : (I18N.en[key] != null ? I18N.en[key] : key);
		if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
		return s;
	}
	function $(s, c) { return (c || document).querySelector(s); }
	function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}
	function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

	/* =========================================================
	 * Markdown 載入與解析
	 * ========================================================= */
	var cache = {};
	function fetchText(path) {
		if (!cache[path]) {
			cache[path] = fetch(path, { cache: 'no-cache' }).then(function (r) {
				if (!r.ok) throw new Error(r.status + ' ' + path);
				return r.text();
			});
		}
		return cache[path];
	}
	// 目前語言的檔案不存在時，改用英文版
	function loadContent(name) {
		return fetchText('content/' + lang() + '/' + name + '.md').catch(function () {
			return fetchText('content/en/' + name + '.md');
		});
	}
	function md(src) { return src ? (window.marked ? window.marked.parse(src) : '<p>' + esc(src) + '</p>') : ''; }
	// 公告內文：相對路徑的圖片以 news/ 為基準（例如 images/xxx.jpg → news/images/xxx.jpg），網址圖片照原樣
	function newsMd(src) {
		return md(src).replace(/<img\b([^>]*?)\ssrc="([^"]*)"([^>]*)>/g, function (_, pre, url, post) {
			if (url && !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) url = 'news/' + url.replace(/^\.\//, '');
			return '<img' + pre + ' src="' + url + '"' + post + ' loading="lazy" decoding="async">';
		});
	}
	function mdInline(src) { return src ? (window.marked ? window.marked.parseInline(src) : esc(src)) : ''; }
	function stripComments(src) { return src.replace(/<!--[\s\S]*?-->/g, ''); }

	function parseFrontMatter(raw) {
		var meta = {}, body = raw.replace(/^\uFEFF/, '');
		var m = body.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
		if (m) {
			m[1].split(/\r?\n/).forEach(function (line) {
				if (/^\s*#/.test(line)) return;
				var kv = line.match(/^\s*([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
				if (kv) meta[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '');
			});
			body = body.slice(m[0].length);
		}
		return { meta: meta, body: body };
	}

	function parseRange(label) {
		var s = label.trim();
		if (/^(ongoing|current|present|進行中|執行中|目前)$/i.test(s)) return { start: NOW_YEAR, end: NOW_YEAR, ongoing: true, named: true };
		var m = s.match(/^(\d{4})\s*(?:([-–—~～至])\s*(\d{4}|present|now|今|迄今|至今)?)?/i);
		if (!m) return { start: NaN, end: NaN };
		var start = +m[1];
		if (m[3] && /^\d{4}$/.test(m[3])) return { start: start, end: +m[3] };
		if (m[2]) return { start: start, end: NOW_YEAR, ongoing: true };
		return { start: start, end: start };
	}

	/*
	 * 年份區塊：「## 2025」「## 2020-2024」「## 2024-」「## Ongoing」
	 * 每個「- 」是一筆；「 | 」分隔欄位；開頭「[J]」為類型代碼
	 */
	function parseYearBlocks(src) {
		var blocks = [], cur = null, item = null;
		stripComments(src).split(/\r?\n/).forEach(function (line) {
			var h = line.match(/^#{2,3}\s+(.+?)\s*$/);
			if (h) {
				var r = parseRange(h[1]);
				cur = { label: h[1], start: r.start, end: r.end, ongoing: !!r.ongoing, named: !!r.named, items: [] };
				blocks.push(cur); item = null; return;
			}
			var li = line.match(/^[-*+]\s+(.*)$/);
			if (li && cur) { item = { text: li[1] }; cur.items.push(item); return; }
			if (item && /^\s+\S/.test(line)) item.text += ' ' + line.trim();
		});
		blocks.forEach(function (b) {
			b.items.forEach(function (it) {
				var tm = it.text.match(/^\[([A-Za-z])\]\s*/);
				it.type = tm ? tm[1].toUpperCase() : null;
				if (tm) it.text = it.text.slice(tm[0].length);
				it.fields = it.text.split(/\s+\|\s+/);
			});
		});
		return blocks.filter(function (b) { return b.items.length; })
			.map(function (b, i) { b._i = i; return b; })
			.sort(function (a, b) {
				var ka = a.named ? 1e9 : (isNaN(a.end) ? -1 : a.end + (a.ongoing ? 0.5 : 0));
				var kb = b.named ? 1e9 : (isNaN(b.end) ? -1 : b.end + (b.ongoing ? 0.5 : 0));
				if (ka !== kb) return kb - ka;
				var sa = isNaN(a.start) ? -1 : a.start, sb = isNaN(b.start) ? -1 : b.start;
				return sb !== sa ? sb - sa : a._i - b._i;
			});
	}

	function rangeLabel(b) {
		if (b.named) return t('ui.ongoing');
		if (isNaN(b.start)) return b.label;
		if (b.ongoing) return b.start + '–' + t('ui.present');
		return b.start === b.end ? String(b.start) : b.start + '–' + b.end;
	}

	/* =========================================================
	 * 個人資料
	 * ========================================================= */
	var site = {};
	function pick(key) {
		return site[key + '_' + lang()] || site[key + '_en'] || site[key] || '';
	}
	function obfuscate(e) { return e.replace('@', ' [at] '); }

	function renderProfile() {
		var l = lang();
		var name = pick('name');
		var alt = l === 'en' ? site.name_zh : site.name_en;
		var dept = site.dept_url ? '<a href="' + esc(site.dept_url) + '" target="_blank" rel="noopener">' + esc(pick('dept')) + '</a>' : esc(pick('dept'));
		var univ = site.univ_url ? '<a href="' + esc(site.univ_url) + '" target="_blank" rel="noopener">' + esc(pick('univ')) + '</a>' : esc(pick('univ'));
		var role = l !== 'en'
			? univ + '<br>' + dept + ' ' + esc(pick('title'))
			: esc(pick('title')) + ', ' + dept + '<br>' + univ;

		$$('[data-bind="name"]').forEach(function (e) { e.textContent = name; });
		$$('[data-bind="nameAlt"]').forEach(function (e) { e.textContent = alt || ''; });
		$$('[data-bind-html="role"]').forEach(function (e) { e.innerHTML = role; });
		$$('[data-bind-src]').forEach(function (e) {
			var v = site[e.getAttribute('data-bind-src')];
			if (v) { e.src = v; e.alt = name; }
		});
		$$('[data-bind-href]').forEach(function (e) {
			var v = site[e.getAttribute('data-bind-href')];
			if (v) e.href = v; else e.hidden = true;
		});
		$$('[data-bind-tags]').forEach(function (e) {
			e.innerHTML = pick('tags').split('|').map(function (s) { return s.trim(); }).filter(Boolean)
				.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
		});
		$$('[data-year]').forEach(function (e) { e.textContent = NOW_YEAR; });
		if (site.email) $$('.js-mail').forEach(function (a) { a.href = 'mailto:' + site.email; });

		var pl = $('#profile-links');
		if (pl) pl.innerHTML = linkDefs().map(function (d) {
			return '<li><a href="' + esc(d.url) + '" target="_blank" rel="noopener" title="' + esc(d.label) + '" aria-label="' + esc(d.label) + '"><i class="' + d.icon + '" aria-hidden="true"></i></a></li>';
		}).join('');
	}

	function linkDefs() {
		return [
			['lab_url', 'fa-solid fa-flask', 'links.lab'],
			['scholar', 'fa-brands fa-google-scholar', 'links.scholar'],
			['dblp', 'fa-solid fa-database', 'links.dblp'],
			['orcid', 'fa-brands fa-orcid', 'links.orcid'],
			['github', 'fa-brands fa-github', 'links.github'],
			['selected_pubs', 'fa-solid fa-bookmark', 'links.selected']
		].filter(function (d) { return site[d[0]]; }).map(function (d) {
			return { url: site[d[0]], icon: d[1], label: t(d[2]) };
		});
	}

	function checkCv() {
		if (!site.cv || location.protocol === 'file:') return;
		fetch(site.cv, { method: 'HEAD', cache: 'no-cache' }).then(function (r) {
			if (r.ok) return;
			$$('.js-cv').forEach(function (a) {
				a.classList.add('is-disabled'); a.setAttribute('aria-disabled', 'true');
				a.removeAttribute('href'); a.title = t('ui.cvMissing');
			});
		}).catch(function () {});
	}

	/* =========================================================
	 * 最新消息
	 * ========================================================= */
	var newsPromise = null;
	function loadNews() {
		if (newsPromise) return newsPromise;
		newsPromise = fetchText('news/index.md').then(function (idx) {
			var files = [];
			stripComments(idx).split(/\r?\n/).forEach(function (line) {
				var m = line.match(/\]\(\s*([^)\s]+\.md)\s*\)/) || line.match(/^[-*]\s+([^\s]+\.md)\s*$/);
				if (m) { var f = m[1].replace(/^\.?\/?(news\/)?/, ''); if (files.indexOf(f) < 0) files.push(f); }
			});
			return Promise.all(files.map(function (f) {
				return fetchText('news/' + f).then(function (raw) {
					var p = parseFrontMatter(raw);
					// 公告只寫中文，三種語言介面都顯示同一份內容
					var title = p.meta.title || f, body = p.body.trim();
					var date = p.meta.date || (f.match(/^\d{4}-\d{2}-\d{2}/) || [''])[0];
					return {
						slug: f.replace(/\.md$/, ''), date: date, year: +date.slice(0, 4),
						pinned: /^(true|yes|1)$/i.test(p.meta.pinned || ''),
						title: title, body: body
					};
				}).catch(function (e) { console.warn('[news] 找不到 ' + f, e); return null; });
			}));
		}).then(function (list) {
			return list.filter(Boolean).sort(function (a, b) {
				if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
				return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
			});
		});
		return newsPromise;
	}

	function fmtDate(d) {
		var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
		if (!m) return esc(d);
		return '<span class="d-md">' + m[2] + '.' + m[3] + '</span><span class="d-y">' + m[1] + '</span>';
	}

	/* =========================================================
	 * 期間篩選
	 * ========================================================= */
	var filters = {};
	function defaultMode() {
		var d = String(site.period_default || 'all').toLowerCase();
		return d === '3' || d === '5' ? d : 'all';
	}
	function getFilter(key, minYear) {
		if (!filters[key]) {
			var from = Math.max(minYear, NOW_YEAR - 4);
			filters[key] = { mode: key === 'news' ? 'all' : defaultMode(), from: from, to: NOW_YEAR, type: 'all',
				semFrom: semKey(from, 1), semTo: semKey(NOW_YEAR, 2) };
		}
		return filters[key];
	}
	function periodRange(st, minYear, sem) {
		if (st.mode === '3') return [NOW_YEAR - 2, NOW_YEAR];
		if (st.mode === '5') return [NOW_YEAR - 4, NOW_YEAR];
		if (st.mode === 'custom' && sem) return semRange(st).map(function (k) { return Math.floor(k / 2); });
		if (st.mode === 'custom') return [Math.min(st.from, st.to), Math.max(st.from, st.to)];
		return [minYear, NOW_YEAR];
	}

	/*
	 * 課程的自訂期間以學期為單位。「## 2025」是學年度：上學期（秋）在前、下學期（春）在後。
	 * 學期序號 = 學年度 × 2 + (上學期 0／下學期 1)，方便比大小。
	 */
	function semKey(year, half) { return year * 2 + (half - 1); }
	function semRange(st) { return [Math.min(st.semFrom, st.semTo), Math.max(st.semFrom, st.semTo)]; }
	function semLabel(k) { return t('term.' + (k % 2 + 1), { y: Math.floor(k / 2) }); }
	function termHalf(s) {
		if (/上|秋|fall|autumn|first|1st/i.test(s)) return 1;
		if (/下|春|spring|second|2nd/i.test(s)) return 2;
		return 0;
	}

	function filterBar(key, minYear, types, sem) {
		var st = filters[key];
		var h = '<div class="filter"><div class="seg" role="group" aria-label="' + esc(t('period.label')) + '">';
		['3', '5', 'all', 'custom'].forEach(function (m) {
			h += '<button type="button" data-mode="' + m + '" aria-pressed="' + (st.mode === m) + '">' +
				(m === 'custom' ? '<i class="fa-regular fa-calendar" aria-hidden="true"></i>' : '') + esc(t('period.' + m)) + '</button>';
		});
		h += '</div>';
		if (st.mode === 'custom') {
			var opts = function (sel) {
				var o = '';
				for (var y = NOW_YEAR; y >= minYear; y--) {
					if (sem) {
						[2, 1].forEach(function (half) {
							var k = semKey(y, half);
							o += '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(semLabel(k)) + '</option>';
						});
					} else o += '<option value="' + y + '"' + (y === sel ? ' selected' : '') + '>' + y + '</option>';
				}
				return o;
			};
			var kf = sem ? 'semFrom' : 'from', kt = sem ? 'semTo' : 'to';
			h += '<div class="range">' +
				'<label><span>' + esc(t('period.from')) + '</span><select data-k="' + kf + '">' + opts(st[kf]) + '</select></label>' +
				'<span class="range-dash" aria-hidden="true">–</span>' +
				'<label><span>' + esc(t('period.to')) + '</span><select data-k="' + kt + '">' + opts(st[kt]) + '</select></label></div>';
		}
		h += '</div>';
		if (types && types.length > 1) {
			h += '<div class="chips" role="group">';
			['all'].concat(types).forEach(function (ty) {
				h += '<button type="button" class="chip' + (ty !== 'all' ? ' chip-' + ty : '') + '" data-type="' + ty + '" aria-pressed="' + (st.type === ty) + '">' + esc(t('type.' + ty)) + '</button>';
			});
			h += '</div>';
		}
		return h;
	}

	function bindFilter(el, key, redraw) {
		$$('[data-mode]', el).forEach(function (b) {
			b.addEventListener('click', function () { filters[key].mode = b.getAttribute('data-mode'); redraw('[data-mode="' + filters[key].mode + '"]'); });
		});
		$$('select[data-k]', el).forEach(function (s) {
			s.addEventListener('change', function () { filters[key][s.getAttribute('data-k')] = +s.value; redraw('select[data-k="' + s.getAttribute('data-k') + '"]'); });
		});
		$$('[data-type]', el).forEach(function (b) {
			b.addEventListener('click', function () { filters[key].type = b.getAttribute('data-type'); redraw('[data-type="' + filters[key].type + '"]'); });
		});
		var all = $('.js-show-all', el);
		if (all) all.addEventListener('click', function () { filters[key].mode = 'all'; filters[key].type = 'all'; redraw('[data-mode="all"]'); });
	}

	function emptyBox(r) {
		return '<div class="empty"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><p>' +
			esc(t('period.empty', { from: r[0], to: r[1] })) + '</p><button type="button" class="btn btn-sm js-show-all">' +
			esc(t('period.showAll')) + '</button></div>';
	}

	/* =========================================================
	 * 列表樣式（每種資料一種）
	 * ========================================================= */
	var TYPE_ORDER = ['J', 'C', 'W', 'B', 'P', 'R', 'T'];

	var RENDER = {
		publications: function (it) {
			return '<li class="pub">' +
				(it.type ? '<span class="badge badge-' + it.type + '">' + esc(t('type.' + it.type)) + '</span>' : '') +
				'<div class="pub-text">' + mdInline(it.text) + '</div></li>';
		},
		projects: function (it) {
			var f = it.fields;
			return '<li class="proj"><div class="proj-title">' + mdInline(f[0]) + '</div>' +
				(f.length > 1 ? '<div class="meta">' + f.slice(1).map(function (x, i) {
					return '<span class="meta-item">' + (i === 0 ? '<i class="fa-solid fa-building-columns" aria-hidden="true"></i>' : '<i class="fa-solid fa-user-tie" aria-hidden="true"></i>') + mdInline(x) + '</span>';
				}).join('') + '</div>' : '') + '</li>';
		},
		honors: function (it) {
			var f = it.fields;
			return '<li class="honor"><span class="honor-mark"><i class="fa-solid fa-award" aria-hidden="true"></i></span><div>' +
				'<div class="honor-title">' + mdInline(f[0]) + '</div>' +
				(f[1] ? '<div class="honor-org">' + mdInline(f.slice(1).join(' · ')) + '</div>' : '') + '</div></li>';
		},
		teaching: function (it) {
			var f = it.fields;
			if (f.length === 1) return '<li class="course"><span class="course-name">' + mdInline(f[0]) + '</span></li>';
			return '<li class="course">' +
				'<span class="course-term">' + mdInline(f[0]) + '</span>' +
				'<span class="course-name">' + mdInline(f[1] || '') + '</span>' +
				'<span class="course-level">' + mdInline(f[2] || '') + '</span>' +
				'<span class="course-school">' + mdInline(f[3] || '') + '</span></li>';
		}
	};

	function collectionView(name, el) {
		el.innerHTML = loading();
		return loadContent(name).then(function (src) {
			var blocks = parseYearBlocks(src);
			var years = blocks.map(function (b) { return b.start; }).filter(function (y) { return !isNaN(y); });
			var minYear = years.length ? Math.min.apply(null, years) : NOW_YEAR;
			var types = [];
			blocks.forEach(function (b) { b.items.forEach(function (i) { if (i.type && types.indexOf(i.type) < 0) types.push(i.type); }); });
			types.sort(function (a, b) { return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b); });
			getFilter(name, minYear);

			// 課程：自訂期間可選到上／下學期
			var sem = name === 'teaching';
			function draw(focusSel) {
				var st = filters[name], r = periodRange(st, minYear, sem);
				var bySem = sem && st.mode === 'custom', sr = bySem ? semRange(st) : null;
				var total = 0, shown = 0, groups = '';
				blocks.forEach(function (b) {
					var inRange = isNaN(b.start) || (b.end >= r[0] && b.start <= r[1]);
					var items = b.items.filter(function (i) {
						total++;
						if (!inRange || (st.type !== 'all' && i.type !== st.type)) return false;
						// 「進行中」與沒寫學期的課只看年份
						var half = bySem && !b.named && !isNaN(b.start) ? termHalf(i.fields[0] || '') : 0;
						if (!half) return true;
						var k = semKey(b.start, half);
						return k >= sr[0] && k <= sr[1];
					});
					if (!items.length) return;
					shown += items.length;
					groups += '<section class="yr' + (b.ongoing ? ' is-ongoing' : '') + '">' +
						'<h3 class="yr-label"><span>' + esc(rangeLabel(b)) + '</span><em>' + items.length + '</em></h3>' +
						'<ul class="yr-items list-' + name + '">' + items.map(RENDER[name]).join('') + '</ul></section>';
				});
				el.innerHTML = '<div class="toolbar">' + filterBar(name, minYear, name === 'publications' ? types : null, sem) +
					'<span class="count">' + esc(t('period.count', { n: shown, total: total })) + '</span></div>' +
					(shown ? '<div class="years">' + groups + '</div>' : emptyBox(bySem ? sr.map(semLabel) : r));
				externalLinks(el);
				bindFilter(el, name, draw);
				if (focusSel) { var f = $(focusSel, el); if (f) f.focus({ preventScroll: true }); }
			}
			draw();
		}).catch(function (e) { showError(el, e); });
	}

	/* =========================================================
	 * 各頁
	 * ========================================================= */
	function loading() { return '<p class="status">' + esc(t('ui.loading')) + '</p>'; }
	function showError(el, err) {
		console.warn('[content]', err);
		el.innerHTML = '<p class="status">' + esc(t('ui.loadError')) + (location.protocol === 'file:' ? ' ' + esc(t('ui.localHint')) : '') + '</p>';
	}
	function externalLinks(scope) {
		$$('a[href^="http"]', scope).forEach(function (a) {
			if (a.hostname !== location.hostname) { a.target = '_blank'; a.rel = 'noopener'; }
		});
	}
	function isSelected(key) { return SELECTED.some(function (d) { return d[0] === key; }); }
	function pageTitle(key) { return t((isSelected(key) ? 'sel.' : 'nav.') + key); }
	function curatedTag() { return '<span class="curated"><i class="fa-solid fa-star" aria-hidden="true"></i>' + esc(t('ui.curated')) + '</span>'; }
	function pageHead(key, icon) {
		var sel = isSelected(key);
		return '<header class="page-head"><h2><span class="ph-icon"><i class="fa-solid ' + icon + '" aria-hidden="true"></i></span>' +
			esc(pageTitle(key)) + (sel ? curatedTag() : '') + '</h2><p>' + esc(t('lead.' + key)) + (sel ? ' ' + esc(t('sel.full')) : '') + '</p></header>';
	}
	function card(cls, title, body, extra) {
		return '<section class="card ' + cls + '">' +
			(title ? '<div class="card-head"><h3>' + title + '</h3>' + (extra || '') + '</div>' : '') +
			'<div class="card-body">' + body + '</div></section>';
	}
	function moreLink(href, label) {
		return '<a class="more" href="' + href + '">' + esc(label) + '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
	}

	var VIEWS = {
		overview: function (view) {
			view.innerHTML = '<div class="bento">' +
				card('c-about', esc(t('sec.about')), '<div class="md" id="ov-about">' + loading() + '</div>') +
				card('c-news', esc(t('sec.news')), '<div id="ov-news">' + loading() + '</div>', moreLink('#/news', t('ui.allNews'))) +
				'<section class="c-research"><h3 class="bento-title">' + esc(t('sec.research')) + '</h3><div class="research" id="ov-research">' + loading() + '</div></section>' +
				card('c-pubs', esc(t('sec.selected')) + curatedTag(), '<p class="sel-lead">' + esc(t('lead.selected')) + '</p><ul class="sel-list" id="ov-sel">' +
					SELECTED.map(function (d) {
						return '<li><a href="#/' + d[0] + '"><span class="sel-icon"><i class="fa-solid ' + d[1] + '" aria-hidden="true"></i></span>' +
							'<span class="sel-name">' + esc(t('sel.' + d[0])) + '</span><span class="sel-count" data-sel="' + d[0] + '"></span>' +
							'<i class="fa-solid fa-arrow-right sel-go" aria-hidden="true"></i></a></li>';
					}).join('') + '</ul>') +
				card('c-exp', esc(t('sec.experience')), '<div id="ov-exp">' + loading() + '</div>') +
				card('c-edu', esc(t('sec.education')), '<div id="ov-edu">' + loading() + '</div>') +
				'</div>';

			loadContent('about').then(function (s) { $('#ov-about').innerHTML = md(stripComments(s)); externalLinks($('#ov-about')); })
				.catch(function (e) { showError($('#ov-about'), e); });

			loadNews().then(function (list) {
				var el = $('#ov-news');
				if (!list.length) { el.innerHTML = '<p class="status">' + esc(t('ui.noNews')) + '</p>'; return; }
				el.innerHTML = '<ol class="news-mini">' + list.slice(0, HOME_NEWS_LIMIT).map(function (n) {
					return '<li><a href="#/news/' + encodeURIComponent(n.slug) + '">' +
						'<time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + '</time>' +
						'<span class="nm-title" lang="zh-Hant-TW">' + (n.pinned ? '<i class="fa-solid fa-thumbtack pin" aria-label="' + esc(t('ui.pinned')) + '"></i>' : '') + esc(n.title) + '</span></a></li>';
				}).join('') + '</ol>';
			}).catch(function (e) { showError($('#ov-news'), e); });

			loadContent('research').then(function (src) {
				var parts = stripComments(src).split(/^##\s+/m).slice(1);
				$('#ov-research').innerHTML = parts.map(function (p) {
					var nl = p.indexOf('\n');
					var head = (nl < 0 ? p : p.slice(0, nl)).trim(), body = nl < 0 ? '' : p.slice(nl + 1).trim(), icon = 'fa-flask';
					head = head.replace(/\s*\{\s*(fa-[\w-]+)\s*\}\s*$/, function (_, ic) { icon = ic; return ''; });
					return '<article class="r-item"><span class="r-icon"><i class="fa-solid ' + esc(icon) + '" aria-hidden="true"></i></span>' +
						'<h4>' + mdInline(head) + '</h4>' + md(body) + '</article>';
				}).join('');
			}).catch(function (e) { showError($('#ov-research'), e); });

			SELECTED.forEach(function (d) {
				loadContent(d[0]).then(function (src) {
					var n = 0;
					parseYearBlocks(src).forEach(function (b) { n += b.items.length; });
					var el = $('[data-sel="' + d[0] + '"]');
					if (el) el.textContent = t('sel.items', { n: n });
				}).catch(function () {});
			});

			['experience', 'education'].forEach(function (name) {
				var el = $(name === 'experience' ? '#ov-exp' : '#ov-edu');
				loadContent(name).then(function (src) {
					el.innerHTML = '<ol class="steps">' + parseYearBlocks(src).map(function (b) {
						return b.items.map(function (it) {
							return '<li class="' + (b.ongoing ? 'is-now' : '') + '"><span class="step-when">' + esc(rangeLabel(b)) + '</span>' +
								'<span class="step-what">' + mdInline(it.fields[0]) + '</span>' +
								(it.fields[1] ? '<span class="step-where">' + mdInline(it.fields.slice(1).join(' · ')) + '</span>' : '') + '</li>';
						}).join('');
					}).join('') + '</ol>';
				}).catch(function (e) { showError(el, e); });
			});
		},

		publications: function (view) { view.innerHTML = pageHead('publications', 'fa-book-open') + linksRow() + '<div id="c"></div>'; collectionView('publications', $('#c')); },
		projects: function (view) { view.innerHTML = pageHead('projects', 'fa-diagram-project') + '<div id="c"></div>'; collectionView('projects', $('#c')); },
		honors: function (view) { view.innerHTML = pageHead('honors', 'fa-award') + '<div id="c"></div>'; collectionView('honors', $('#c')); },
		teaching: function (view) { view.innerHTML = pageHead('teaching', 'fa-chalkboard-user') + '<div id="c"></div>'; collectionView('teaching', $('#c')); },

		news: function (view, slug) {
			view.innerHTML = pageHead('news', 'fa-bullhorn') + '<div id="c">' + loading() + '</div>';
			var el = $('#c');
			loadNews().then(function (list) {
				if (!list.length) { el.innerHTML = '<p class="status">' + esc(t('ui.noNews')) + '</p>'; return; }
				var years = list.map(function (n) { return n.year; }).filter(function (y) { return !isNaN(y); });
				var minYear = Math.min.apply(null, years.concat([NOW_YEAR]));
				getFilter('news', minYear);
				var openSet = {};
				if (slug) openSet[slug] = true;

				function draw(focusSel) {
					$$('details[open]', el).forEach(function (d) { openSet[d.getAttribute('data-slug')] = true; });
					var r = periodRange(filters.news, minYear);
					var shown = list.filter(function (n) { return n.year >= r[0] && n.year <= r[1]; });
					var groups = [], cur = null;
					shown.forEach(function (n) {
						var key = n.pinned ? 'pinned' : String(n.year);
						if (!cur || cur.key !== key) { cur = { key: key, items: [] }; groups.push(cur); }
						cur.items.push(n);
					});
					el.innerHTML = '<div class="toolbar">' + filterBar('news', minYear) +
						'<span class="count">' + esc(t('period.count', { n: shown.length, total: list.length })) + '</span></div>' +
						(shown.length ? '<div class="years">' + groups.map(function (g) {
							return '<section class="yr"><h3 class="yr-label"><span>' +
								(g.key === 'pinned' ? '<i class="fa-solid fa-thumbtack" aria-hidden="true"></i> ' + esc(t('ui.pinned')) : esc(g.key)) +
								'</span><em>' + g.items.length + '</em></h3><ul class="yr-items news-list">' +
								g.items.map(function (n) {
									var body = n.body;
									return '<li id="n-' + esc(n.slug) + '"><details data-slug="' + esc(n.slug) + '"' + (openSet[n.slug] ? ' open' : '') + '>' +
										'<summary><time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + '</time><span class="nl-title" lang="zh-Hant-TW">' + esc(n.title) + '</span>' +
										(body ? '<i class="fa-solid fa-chevron-down caret" aria-hidden="true"></i>' : '') + '</summary>' +
										(body ? '<div class="nl-body md" lang="zh-Hant-TW">' + newsMd(body) + '</div>' : '') + '</details></li>';
								}).join('') + '</ul></section>';
						}).join('') + '</div>' : emptyBox(r));
					externalLinks(el);
					bindFilter(el, 'news', draw);
					if (focusSel) { var f = $(focusSel, el); if (f) f.focus({ preventScroll: true }); }
				}
				draw();
				if (slug) {
					var target = document.getElementById('n-' + slug);
					if (target) setTimeout(function () { target.scrollIntoView({ block: 'center' }); target.classList.add('is-target'); }, 60);
				}
			}).catch(function (e) { showError(el, e); });
		},

		contact: function (view) {
			var rows = [];
			function row(icon, label, html) {
				rows.push('<div class="c-row"><dt><i class="' + icon + '" aria-hidden="true"></i>' + esc(label) + '</dt><dd>' + html + '</dd></div>');
			}
			[site.email, site.email_alt].filter(Boolean).forEach(function (em, i) {
				row(i ? 'fa-regular fa-envelope' : 'fa-solid fa-envelope', t('contact.email'),
					'<a href="mailto:' + esc(em) + '">' + esc(obfuscate(em)) + '</a>' +
					'<button type="button" class="copy js-copy" data-copy="' + esc(em) + '"><i class="fa-regular fa-copy" aria-hidden="true"></i><span>' + esc(t('contact.copy')) + '</span></button>');
			});
			if (pick('office')) row('fa-solid fa-door-open', t('contact.office'), esc(pick('office')));
			if (pick('address')) row('fa-solid fa-location-dot', t('contact.address'), esc(pick('address')));
			if (site.phone) row('fa-solid fa-phone', t('contact.phone'), esc(site.phone));
			if (site.lab_phone) row('fa-solid fa-phone', t('contact.labPhone'), esc(site.lab_phone));
			if (pick('lab')) row('fa-solid fa-flask', t('contact.lab'), site.lab_url ? '<a href="' + esc(site.lab_url) + '">' + esc(pick('lab')) + '</a>' : esc(pick('lab')));

			view.innerHTML = pageHead('contact', 'fa-at') +
				'<div class="contact">' +
				card('c-info', '', '<dl class="c-list">' + rows.join('') + '</dl>') +
				'<div class="contact-side">' +
				card('c-note', '', '<div class="md" id="ct-note">' + loading() + '</div>') +
				card('c-cv', esc(t('sec.cv')), '<p>' + esc(t('lead.cv')) + '</p><a class="btn btn-primary js-cv"' + (site.cv ? ' href="' + esc(site.cv) + '"' : '') + ' download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>' + esc(t('ui.cv')) + '</a>') +
				card('c-links', esc(t('sec.links')), '<ul class="link-list">' + linkDefs().map(function (d) {
					return '<li><a href="' + esc(d.url) + '"><i class="' + d.icon + '" aria-hidden="true"></i><span>' + esc(d.label) + '</span><i class="fa-solid fa-arrow-up-right-from-square ext" aria-hidden="true"></i></a></li>';
				}).join('') + '</ul>') +
				'</div></div>';
			externalLinks(view);
			checkCv();
			loadContent('contact').then(function (s) { $('#ct-note').innerHTML = md(stripComments(s)); externalLinks($('#ct-note')); })
				.catch(function (e) { showError($('#ct-note'), e); });
			$$('.js-copy', view).forEach(function (b) {
				b.addEventListener('click', function () {
					var done = function () {
						b.classList.add('is-done');
						b.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i><span>' + esc(t('contact.copied')) + '</span>';
						setTimeout(function () {
							b.classList.remove('is-done');
							b.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i><span>' + esc(t('contact.copy')) + '</span>';
						}, 1600);
					};
					if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, done); else done();
				});
			});
		},

		notfound: function (view) {
			view.innerHTML = '<div class="empty"><i class="fa-regular fa-compass" aria-hidden="true"></i><p>' + esc(t('ui.notFound')) + '</p><a class="btn btn-sm" href="#/">' + esc(t('ui.home')) + '</a></div>';
		}
	};

	function linksRow() {
		var d = linkDefs().filter(function (x) { return /dblp|scholar|orcid|hackmd/.test(x.url); });
		if (!d.length) return '';
		return '<div class="links-row">' + d.map(function (x) {
			return '<a class="pill-link" href="' + esc(x.url) + '" target="_blank" rel="noopener"><i class="' + x.icon + '" aria-hidden="true"></i>' + esc(x.label) + '</a>';
		}).join('') + '</div>';
	}

	/* =========================================================
	 * 路由
	 * ========================================================= */
	// 舊網址相容：#publications → #/publications
	var LEGACY = { about: '', one: '', two: '', three: 'publications', four: 'contact', five: 'teaching', research: '', publications: 'publications', projects: 'projects', honors: 'honors', teaching: 'teaching', news: 'news', contact: 'contact' };

	function parseRoute() {
		var h = location.hash.replace(/^#/, '');
		if (h && h.charAt(0) !== '/') {
			if (LEGACY.hasOwnProperty(h)) { history.replaceState(null, '', '#/' + LEGACY[h]); h = '/' + LEGACY[h]; }
		}
		var parts = h.replace(/^\/+/, '').split('/').filter(Boolean);
		var name = parts[0] || 'overview';
		return { name: VIEWS[name] && name !== 'notfound' ? name : 'notfound', arg: parts[1] ? decodeURIComponent(parts[1]) : null };
	}

	var lastRoute = null;
	function render(scroll) {
		var r = parseRoute();
		var view = $('#view');
		$$('.tabs a').forEach(function (a) {
			var on = a.getAttribute('data-route') === (isSelected(r.name) ? 'overview' : r.name);
			a.classList.toggle('active', on);
			if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
		});
		view.setAttribute('data-view', r.name);
		view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter');
		VIEWS[r.name](view, r.arg);

		var name = pick('name');
		var title = t('title', { name: name, univ: pick('univ_short') || pick('univ') });
		document.title = r.name === 'overview' || r.name === 'notfound' ? title : pageTitle(r.name) + ' · ' + title;

		var active = $('.tabs a.active');
		if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });

		if (scroll && lastRoute !== r.name && !r.arg) {
			var bar = $('.tabbar');
			var top = window.innerWidth <= 1000 ? Math.max(0, bar.offsetTop) : 0;
			if (window.scrollY > top) window.scrollTo({ top: top });
			view.focus({ preventScroll: true });
		}
		lastRoute = r.name;
	}

	/* =========================================================
	 * 主題 / 語言
	 * ========================================================= */
	function applyStaticI18n() {
		$$('[data-i18n]').forEach(function (e) { e.textContent = t(e.getAttribute('data-i18n')); });
		$$('[data-i18n-attr]').forEach(function (e) {
			e.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
				var kv = pair.split(':');
				if (kv.length === 2) { e.setAttribute(kv[0].trim(), t(kv[1].trim())); e.setAttribute('title', t(kv[1].trim())); }
			});
		});
		$$('.js-theme').forEach(function (b) { b.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark'); });
		$$('.lang-seg').forEach(function (g) {
			g.innerHTML = LANGS.map(function (l) {
				return '<button type="button" class="js-lang" data-lang-set="' + l + '" lang="' + HTML_LANG[l] + '" aria-pressed="' + (l === lang()) + '" title="' + LANG_NAME[l] + '" aria-label="' + LANG_NAME[l] + '">' + LANG_LABEL[l] + '</button>';
			}).join('');
		});
	}
	function syncThemeColor() {
		var m = $('meta[name="theme-color"]');
		if (m) m.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#070b22' : '#f3f5fa');
	}
	function setTheme(th) {
		root.classList.add('theme-anim');
		root.setAttribute('data-theme', th);
		store('yc-theme', th);
		syncThemeColor(); applyStaticI18n();
		if (cipher) cipher.redraw();
		setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
	}
	function setLang(l) {
		root.setAttribute('data-lang', l);
		root.setAttribute('lang', HTML_LANG[l]);
		store('yc-lang', l);
		applyStaticI18n(); renderProfile(); render(false);
	}
	// 公告圖片：點擊放大（圖片本身已經包在連結裡的就交給連結）
	var lightbox = null;
	function openLightbox(img) {
		if (!lightbox) {
			lightbox = document.createElement('dialog');
			lightbox.className = 'lightbox';
			lightbox.innerHTML = '<button type="button" class="lb-close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button><img alt="" />';
			lightbox.addEventListener('click', function () { lightbox.close(); });
			lightbox.addEventListener('close', function () { root.classList.remove('lb-open'); });
			document.body.appendChild(lightbox);
		}
		$('.lb-close', lightbox).setAttribute('aria-label', t('ui.close'));
		var big = $('img', lightbox);
		big.src = img.currentSrc || img.src;
		big.alt = img.alt || '';
		root.classList.add('lb-open');
		lightbox.showModal();
	}
	document.addEventListener('click', function (e) {
		var img = e.target.closest && e.target.closest('.nl-body img');
		if (img && !img.closest('a')) openLightbox(img);
	});
	document.addEventListener('click', function (e) {
		var b = e.target.closest && e.target.closest('.js-theme, .js-lang');
		if (!b) return;
		if (b.classList.contains('js-theme')) setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
		else if (b.getAttribute('data-lang-set') !== lang()) setLang(b.getAttribute('data-lang-set'));
	});

	/* =========================================================
	 * 側欄背景：密文矩陣（其中一行是「Cryptography」的十六進位編碼）
	 * 其餘數字會隨機跳動，高亮的那一行固定不動。
	 * 彩蛋：把高亮那行解碼後在鍵盤上打出來（cryptography），矩陣就會解密。
	 * ========================================================= */
	var cipher = null;
	function initCipher() {
		var canvas = $('.profile .cipher');
		if (!canvas || !canvas.getContext) return;
		var ctx = canvas.getContext('2d');
		var HEX = '0123456789ABCDEF';
		var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var seed, grid = [], cols, rows, cw, ch, secret, secretRow, start = 0, wide = false, decoded = false;
		var PLAIN = 'Cryptography', startCol = 1;
		function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

		function build() {
			var rect = canvas.getBoundingClientRect();
			var dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.round(rect.width * dpr));
			canvas.height = Math.max(1, Math.round(rect.height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
			cw = 21; ch = 19;
			cols = Math.ceil(rect.width / cw) + 1; rows = Math.ceil(rect.height / ch) + 1;
			seed = 4194; grid = [];
			for (var r = 0; r < rows; r++) {
				var row = [];
				for (var c = 0; c < cols; c++) row.push(HEX[Math.floor(rnd() * 16)] + HEX[Math.floor(rnd() * 16)]);
				grid.push(row);
			}
			secret = Array.prototype.map.call('Cryptography', function (c) { return ('0' + c.charCodeAt(0).toString(16).toUpperCase()).slice(-2); });
			// 直式側欄放在下方約 72% 處；橫式（平板／手機）放在最底列
			wide = window.innerWidth <= 1000;
			secretRow = wide ? Math.floor(rect.height / ch) - 1 : Math.floor(rows * 0.72);
		}
		function draw(p) {
			var rect = canvas.getBoundingClientRect(), h = rect.height;
			ctx.clearRect(0, 0, rect.width, h);
			var cs = getComputedStyle(root);
			var base = cs.getPropertyValue('--cipher').trim(), hi = cs.getPropertyValue('--cipher-hi').trim();
			for (var r = 0; r < rows; r++) {
				// 由下往上淡出
				var y = r * ch + ch, fs0 = wide ? 0.6 : 0.42, fade = Math.max(0, (y / h - fs0) / (1 - fs0)) * (wide ? 0.7 : 1);
				if (fade <= 0) continue;
				for (var c = 0; c < cols; c++) {
					var isSecret = r === secretRow && c >= startCol && c < startCol + secret.length;
					var txt = grid[r][c];
					if (p < 1 && Math.random() > p) txt = HEX[Math.floor(Math.random() * 16)] + HEX[Math.floor(Math.random() * 16)];
					if (isSecret && p >= 1) {
						ctx.fillStyle = 'rgba(' + hi + ',' + (0.55 + 0.4 * fade).toFixed(3) + ')';
						txt = decoded ? PLAIN[c - startCol] : secret[c - startCol];
					} else {
						ctx.fillStyle = 'rgba(' + base + ',' + (0.2 * fade).toFixed(3) + ')';
					}
					ctx.fillText(txt, c * cw + 6, y);
				}
			}
		}
		function animate(ts) {
			if (!start) start = ts;
			var p = Math.min(1, (ts - start) / 1200);
			draw(p);
			if (p < 1) requestAnimationFrame(animate); else start = 0;
		}
		var animUntil = 0;
		function play() {
			start = 0; animUntil = Date.now() + 1300;
			requestAnimationFrame(animate);
		}
		// 隨機跳動：每次換掉少量格子（高亮行不在 draw 裡讀 grid，所以不會動）
		function flicker() {
			if (document.hidden || Date.now() < animUntil || !rows) return;
			var n = Math.max(3, Math.round(rows * cols * 0.03));
			for (var i = 0; i < n; i++) {
				var r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
				grid[r][c] = HEX[Math.floor(Math.random() * 16)] + HEX[Math.floor(Math.random() * 16)];
			}
			draw(1);
		}
		function decrypt() {
			decoded = !decoded;
			if (reduce) draw(1); else play();
			if (decoded) toast(t('egg.decrypted'));
			console.info('%c' + secret.join(' ') + '  →  ' + PLAIN, 'color:#38bdf8;font-family:monospace');
		}
		var typed = '';
		document.addEventListener('keydown', function (e) {
			if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
			if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
			typed = (typed + e.key.toLowerCase()).slice(-PLAIN.length);
			if (typed === PLAIN.toLowerCase()) { typed = ''; decrypt(); }
		});
		build();
		console.info('%c' + secret.join(' '), 'color:#38bdf8;font-family:monospace', '← decode me, then type it anywhere on this page.');
		if (reduce) draw(1); else { play(); setInterval(flicker, 140); }
		var to;
		window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { build(); draw(1); }, 150); });
		cipher = { redraw: function () { build(); draw(1); } };
	}

	/* =========================================================
	 * 彩蛋：連點頭像三下，像抽卡一樣抽出「明天要 Group Meet」卡
	 * 卡片會閃（全息反光，滑鼠／手指移動時跟著傾斜），點卡片可翻面
	 * ========================================================= */
	var CARD_IMG = 'images/card_group_meet.webp';
	function initCardEgg() {
		var photo = $('.profile-photo');
		if (!photo) return;
		var taps = [];
		photo.addEventListener('click', function (e) {
			var now = Date.now();
			taps = taps.filter(function (x) { return now - x < 700; });
			taps.push(now);
			if (taps.length === 1) new Image().src = CARD_IMG; // 先預載
			if (taps.length >= 3) { taps = []; e.preventDefault(); openCard(photo); }
		});
	}
	function openCard(opener) {
		if ($('.card-egg')) return;
		var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var hex = Array.prototype.map.call('Cryptography', function (c) { return c.charCodeAt(0).toString(16).toUpperCase(); }).join(' ');
		var el = document.createElement('div');
		el.className = 'card-egg';
		el.setAttribute('role', 'dialog');
		el.setAttribute('aria-modal', 'true');
		el.setAttribute('aria-label', t('egg.cardAlt'));
		el.innerHTML = '<div class="ce-rays" aria-hidden="true"></div>' +
			'<button type="button" class="ce-card is-back" aria-label="' + esc(t('egg.cardHint')) + '">' +
				'<span class="ce-flip">' +
					'<span class="ce-face ce-front"><img src="' + CARD_IMG + '" alt="' + esc(t('egg.cardAlt')) + '" draggable="false" /><span class="ce-holo"></span><span class="ce-glare"></span></span>' +
					'<span class="ce-face ce-back"><span class="ce-back-ring"><img src="images/cislab-mark.svg" alt="" draggable="false" /></span>' +
						'<img class="ce-back-name" src="images/cislab-wordmark.png" alt="CIS Lab" draggable="false" />' +
						'<span class="ce-back-hex">' + hex + '</span><span class="ce-holo"></span><span class="ce-glare"></span></span>' +
				'</span>' +
			'</button>' +
			'<p class="ce-hint">' + esc(t('egg.cardHint')) + '</p>' +
			'<button type="button" class="ce-close" aria-label="' + esc(t('ui.close')) + '"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
		document.body.appendChild(el);
		root.classList.add('is-locked');
		var card = $('.ce-card', el);

		// 抽卡：背面朝上飛進來，停穩後翻到正面
		requestAnimationFrame(function () { el.classList.add('is-open'); });
		var revealT = setTimeout(function () { card.classList.remove('is-back'); el.classList.add('is-revealed'); }, reduce ? 150 : 1100);

		function tilt(x, y) {
			card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
			card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
			if (!reduce) {
				card.style.setProperty('--ry', ((x - 0.5) * 24).toFixed(2) + 'deg');
				card.style.setProperty('--rx', ((0.5 - y) * 24).toFixed(2) + 'deg');
			}
		}
		card.addEventListener('pointermove', function (e) {
			var r = card.getBoundingClientRect();
			card.classList.add('is-hover');
			tilt(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
		});
		card.addEventListener('pointerleave', function () {
			card.classList.remove('is-hover');
			['--mx', '--my', '--rx', '--ry'].forEach(function (k) { card.style.removeProperty(k); });
		});
		card.addEventListener('click', function () {
			if (!el.classList.contains('is-revealed')) return;
			card.classList.toggle('is-back');
		});

		function close() {
			clearTimeout(revealT);
			document.removeEventListener('keydown', onKey);
			el.classList.remove('is-open');
			root.classList.remove('is-locked');
			setTimeout(function () { el.remove(); }, reduce ? 0 : 280);
			if (opener) opener.focus({ preventScroll: true });
		}
		function onKey(e) { if (e.key === 'Escape') close(); }
		document.addEventListener('keydown', onKey);
		$('.ce-close', el).addEventListener('click', close);
		el.addEventListener('click', function (e) { if (e.target === el || e.target.classList.contains('ce-rays') || e.target.classList.contains('ce-hint')) close(); });
		$('.ce-close', el).focus({ preventScroll: true });
	}

	function toast(msg) {
		var el = $('.toast');
		if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
		el.textContent = msg;
		el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on');
		clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('is-on'); }, 4200);
	}

	/* =========================================================
	 * 啟動
	 * ========================================================= */
	function init() {
		syncThemeColor();
		applyStaticI18n();
		fetchText('content/site.md').then(function (raw) { site = parseFrontMatter(raw).meta; })
			.catch(function (e) { console.warn('[site]', e); })
			.then(function () {
				renderProfile();
				render(false);
				checkCv();
				initCipher();
				initCardEgg();
			});
		window.addEventListener('hashchange', function () { render(true); });
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
