/* 在畫面繪製前決定主題與語言，避免閃爍 */
(function () {
	var d = document.documentElement, theme, lang;
	try { theme = localStorage.getItem('yc-theme'); lang = localStorage.getItem('yc-lang'); } catch (e) {}
	var q = /[?&]lang=(en|zh|ja)\b/.exec(location.search);
	if (q) lang = q[1];
	// 預設淺色；只有使用者自己切過才用深色
	if (theme !== 'dark') theme = 'light';
	if (lang !== 'en' && lang !== 'zh' && lang !== 'ja') {
		var nav = navigator.language || '';
		lang = /^zh/i.test(nav) ? 'zh' : /^ja/i.test(nav) ? 'ja' : 'en';
	}
	d.setAttribute('data-theme', theme);
	d.setAttribute('data-lang', lang);
	d.setAttribute('lang', { zh: 'zh-Hant-TW', ja: 'ja', en: 'en' }[lang]);
})();
