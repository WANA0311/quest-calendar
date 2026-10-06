(function () {
  "use strict";

  // ===== 計画データ =====
  const JOIN_DAY = "2027-04-01";
  const FIRST_DAY = "2026-10-02";
  const LS_DONE = "quest-done-v1", LS_FE = "quest-fe-date";
  const KIND = { start: "start", fe: "fe", dev: "dev", ap: "ap", free: "free" };
  const KIND_LABEL = { start: "準備", fe: "基本情報", dev: "開発", ap: "応用情報", free: "自由・入社" };

  const FE_MIN = "2026-11-24", FE_MAX = "2026-12-19";
  let feDay = load(LS_FE, "2026-12-11");
  if (typeof feDay !== "string" || feDay < FE_MIN || feDay > FE_MAX) feDay = "2026-12-11";

  function buildPhases() {
    return [
      { id: "start", kind: KIND.start, name: "準備", from: "2026-10-02", to: "2026-10-04", tag: "スタートダッシュ" },
      { id: "feA", kind: KIND.fe, name: "基本情報 科目A", from: "2026-10-05", to: "2026-10-31", tag: "過去問道場で知識固め" },
      { id: "feB", kind: KIND.fe, name: "基本情報 科目B", from: "2026-11-01", to: "2026-11-22", tag: "擬似言語のトレース" },
      { id: "feFinal", kind: KIND.fe, name: "基本情報 仕上げ", from: "2026-11-23", to: addDays(feDay, -1), tag: "時間を計って通し演習" },
      { id: "feExam", kind: KIND.fe, name: "基本情報 受験日", from: feDay, to: feDay, tag: "BOSS BATTLE" },
      { id: "dev1", kind: KIND.dev, name: "ゲーム完成＋DB準備", from: addDays(feDay, 1), to: "2026-12-20", tag: "作る側に切り替え" },
      { id: "apA", kind: KIND.ap, name: "応用情報 科目A＋API", from: "2026-12-21", to: "2027-01-15", tag: "PHPでAPIを作る" },
      { id: "apB", kind: KIND.ap, name: "応用情報 科目B＋Unity接続", from: "2027-01-16", to: "2027-01-26", tag: "卒論の追い込みも" },
      { id: "apApply", kind: KIND.ap, name: "応用情報 申込期間", from: "2027-01-27", to: "2027-02-16", tag: "紹介サイトづくり" },
      { id: "apFinal", kind: KIND.ap, name: "応用情報 本番前", from: "2027-02-17", to: "2027-02-28", tag: "WebGLを埋め込む" },
      { id: "release", kind: KIND.dev, name: "公開・仕上げ", from: "2027-03-01", to: "2027-03-20", tag: "デプロイしてREADME" },
      { id: "free", kind: KIND.free, name: "自由時間", from: "2027-03-21", to: "2027-03-31", tag: "ツーリング・入社準備" },
      { id: "join", kind: KIND.free, name: "入社", from: JOIN_DAY, to: JOIN_DAY, tag: "NEW GAME" }
    ].filter(p => p.from <= p.to);
  }
  function events() {
    const e = {
      "2026-10-02": "今日から開始！まずは受験日を予約しよう",
      "2027-01-27": "応用情報 後期の申込受付スタート",
      "2027-02-16": "応用情報 申込締切日！",
      "2027-04-01": "入社おめでとう！"
    };
    e[feDay] = "基本情報 受験日";
    return e;
  }

  const FIELDS_A = ["週の復習：今週間違えた問題だけ解き直す", "基礎理論・アルゴリズム", "コンピュータシステム", "データベース・ネットワーク", "セキュリティ", "マネジメント", "ストラテジ"];
  const thesis = { id: "thesis", title: "卒論を進める", note: "1時間だけでもOK", time: "60分" };
  const game = { id: "game", title: "Unityでゲーム制作", note: "息抜き枠。少しでも進めば勝ち", time: "30分" };
  const pick = (list, i) => list[((i % list.length) + list.length) % list.length];

  function tasksFor(key, ph, i, len) {
    const dow = parse(key).getDay();
    const field = dow === 0 ? "総復習" : FIELDS_A[dow];
    switch (ph.id) {
      case "start": return [
        [{ id: "s1", title: "基本情報のCBT受験日を予約する", note: "12月11日に予約済み", time: "10分" },
         { id: "s2", title: "参考書を1冊選ぶ", note: "科目B対策が厚いもの", time: "20分" },
         { id: "s3", title: "過去問道場を10問だけ解いてみる", note: "今の実力チェック", time: "20分" }],
        [{ id: "s4", title: "過去問道場 20問", note: "分野ごとの正答率をメモ", time: "40分" },
         { id: "s5", title: "UnityプロジェクトをGit管理にする", note: "git init → GitHubにpush", time: "30分" }, thesis],
        [{ id: "s6", title: "過去問道場 20問", note: "間違えた問題の解説を読む", time: "40分" },
         { id: "s7", title: "10月の勉強時間をカレンダーに入れる", time: "10分" }, thesis]
      ][Math.min(i, 2)];
      case "feA": return [
        { id: "a1", title: "科目A 過去問25問：" + field, note: dow === 0 ? FIELDS_A[0] : "正答率7〜8割が目標", time: "50分" },
        { id: "a2", title: "間違えた問題の解説を読む", note: "用語はノートに1行でまとめる", time: "15分" }, thesis, game];
      case "feB": return [
        { id: "b1", title: "科目B 擬似言語 " + (2 + (i % 2)) + "問をトレース", note: "変数の値を紙に書いて追う", time: "60分" },
        { id: "b2", title: "科目B セキュリティ 1問", note: "IPAのサンプル・公開問題から", time: "15分" },
        { id: "b3", title: "科目A 10問：" + (dow === 0 ? "弱点分野" : field), time: "20分" }, thesis];
      case "feFinal": return [
        i % 2 === 0 ? { id: "f1", title: "科目A 60問を90分で通し演習", note: "本番と同じ時間で", time: "90分" }
                    : { id: "f1", title: "科目B 20問を100分で通し演習", note: "時間配分を確認", time: "100分" },
        { id: "f2", title: "通し演習で間違えた所を復習", time: "30分" },
        { id: "f3", title: "本人確認書類と会場までの行き方を確認", note: i >= len - 3 ? "受験直前チェック" : "早めに済ませておく", time: "5分" }, thesis];
      case "feExam": return [
        { id: "e1", title: "本人確認書類を持って会場へ", time: "朝" },
        { id: "e2", title: "基本情報を受験する", note: "落ち着いていこう", time: "本番" },
        { id: "e3", title: "今日はしっかり休む", note: "お疲れさま！", time: "夜" }];
      case "dev1": return [pick([
        { id: "d1", title: "ゲーム：残りの機能をリストにする", note: "完成に必要なものだけ", time: "30分" },
        { id: "d1", title: "ゲーム：コア部分を仕上げる", time: "90分" },
        { id: "d1", title: "ローカル環境を作る（XAMPPかDocker）", note: "PHPとMySQLが動けばOK", time: "60分" },
        { id: "d1", title: "scoresテーブルを設計してCREATE TABLE", note: "名前・スコア・登録日時", time: "45分" },
        { id: "d1", title: "SQL練習：ORDER BY と LIMIT でランキング", time: "45分" },
        { id: "d1", title: "ゲーム：タイトル画面とリザルト画面", time: "90分" }], i), thesis, game];
      case "apA": return [
        { id: "p1", title: "応用情報 科目A 20問：" + (dow === 0 ? "今週の復習" : field), time: "40分" },
        pick([
          { id: "p2", title: "API：スコア登録（POST）を作る", note: "プリペアドステートメントで", time: "60分" },
          { id: "p2", title: "API：ランキング取得（GET）を作る", note: "上位10件をJSONで返す", time: "60分" },
          { id: "p2", title: "API：ありえないスコアを弾く", note: "上限値・送信回数のチェック", time: "45分" },
          { id: "p2", title: "SQL練習：GROUP BY で期間別ランキング", time: "45分" },
          { id: "p2", title: "ゲームを完成させる", time: "90分" }], i), thesis];
      case "apB": return [
        { id: "q1", title: "応用情報 科目B 1問", note: i % 2 === 0 ? "情報セキュリティ（必須）" : "選択分野（PM・サービスマネジメントなど）", time: "45分" },
        pick([
          { id: "q2", title: "Unity：UnityWebRequestでスコア送信", time: "60分" },
          { id: "q2", title: "Unity：ランキングを取得して表示", time: "60分" },
          { id: "q2", title: "通信エラー時の表示を作る", time: "45分" },
          { id: "q2", title: "Unity側にパスワードが無いか確認", note: "必ずAPI経由", time: "15分" }], i),
        { id: "q3", title: "卒論を進める", note: "提出日に向けて追い込み", time: "120分" }];
      case "apApply": return [
        ...(i === 0 ? [{ id: "r0", title: "応用情報 後期を申し込む", note: "締切 2/16", time: "15分" }] : []),
        { id: "r1", title: "応用情報 過去問", note: i % 2 === 0 ? "科目A 40問" : "科目B 2問", time: "60分" },
        pick([
          { id: "r2", title: "紹介サイト：ページ構成を決める", time: "30分" },
          { id: "r2", title: "紹介サイト：トップと遊び方ページ", time: "60分" },
          { id: "r2", title: "紹介サイト：スクリーンショットを載せる", time: "45分" },
          { id: "r2", title: "紹介サイト：ランキング表示ページ", time: "60分" }], i)];
      case "apFinal": return [
        { id: "u1", title: "応用情報 過去問を時間を計って通し", note: i % 2 === 0 ? "科目A 150分" : "科目B 150分", time: "150分" },
        { id: "u2", title: "WebGLビルドをサイトに埋め込む", time: "45分" }];
      case "release": return [pick([
        { id: "v1", title: "サーバーを選んで準備する", time: "60分" },
        { id: "v1", title: "APIとDBをサーバーへデプロイ", time: "90分" },
        { id: "v1", title: "本番でスコア登録・ランキングを確認", time: "30分" },
        { id: "v1", title: "GitHubのREADMEを書く", note: "構成図・使った技術・工夫した点", time: "60分" }], i),
        { id: "v2", title: "友達に遊んでもらって感想をもらう", time: "15分" }];
      case "free": return [
        { id: "w1", title: "思いきり遊ぶ・ツーリング", note: "学生最後の休み", time: "1日" },
        { id: "w2", title: "入社書類と持ち物を確認", time: "15分" }];
      case "join": return [{ id: "j1", title: "入社式", note: "ここからが本番！", time: "朝" }];
    }
    return [];
  }

  // ===== 日付 =====
  function keyOf(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(k) { return new Date(k + "T00:00:00"); }
  function addDays(k, n) { const d = parse(k); d.setDate(d.getDate() + n); return keyOf(d); }
  function diff(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
  const DOW = ["日", "月", "火", "水", "木", "金", "土"];
  const label = k => { const d = parse(k); return (d.getMonth() + 1) + "月" + d.getDate() + "日（" + DOW[d.getDay()] + "）"; };

  // ===== 保存（この端末のみ） =====
  function load(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  let done = load(LS_DONE, {});

  // ===== 状態 =====
  let today = keyOf(new Date());
  let phases = buildPhases();
  const clampDay = k => k < FIRST_DAY ? FIRST_DAY : (k > JOIN_DAY ? JOIN_DAY : k);
  let sel = clampDay(today);
  let month = sel.slice(0, 7);

  const phaseOf = k => phases.find(p => k >= p.from && k <= p.to);
  function dayInfo(k) {
    const ph = phaseOf(k);
    if (!ph) return { ph: null, list: [] };
    const i = diff(ph.from, k), len = diff(ph.from, ph.to) + 1;
    return { ph, i, len, list: tasksFor(k, ph, i, len) };
  }

  const $ = id => document.getElementById(id);

  // ===== 描画 =====
  function renderCounts() {
    const fe = diff(today, feDay), j = diff(today, JOIN_DAY);
    $("cFe").textContent = fe > 0 ? fe : (fe === 0 ? "今日" : "済");
    $("cFeLabel").textContent = fe >= 0 ? "基本情報まで（日）" : "基本情報 受験済み";
    $("cJoin").textContent = j > 0 ? j : (j === 0 ? "今日" : "済");
  }

  function renderCalendar() {
    const [y, m] = month.split("-").map(Number);
    $("monthLabel").textContent = y + "年" + m + "月";
    $("prevM").disabled = month <= FIRST_DAY.slice(0, 7);
    $("nextM").disabled = month >= JOIN_DAY.slice(0, 7);
    const grid = $("grid");
    grid.innerHTML = "";
    const first = new Date(y, m - 1, 1);
    for (let b = 0; b < first.getDay(); b++) grid.append(document.createElement("span"));
    const days = new Date(y, m, 0).getDate();
    const ev = events();
    for (let d = 1; d <= days; d++) {
      const k = keyOf(new Date(y, m - 1, d));
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day";
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = d;
      btn.append(num);
      const info = dayInfo(k);
      if (!info.ph) { btn.disabled = true; }
      else {
        btn.style.setProperty("--pc", "var(--p-" + info.ph.kind + ")");
        const strip = document.createElement("span"); strip.className = "strip"; btn.append(strip);
        const n = (done[k] || []).filter(id => info.list.some(t => t.id === id)).length;
        if (n && n === info.list.length) btn.classList.add("done"); else if (n) btn.classList.add("part");
        if (ev[k]) { const mk = document.createElement("span"); mk.className = "mark"; mk.textContent = "★"; btn.append(mk); }
        btn.setAttribute("aria-label", label(k) + " " + info.ph.name + (ev[k] ? " " + ev[k] : ""));
        btn.addEventListener("click", () => { sel = k; render(); });
      }
      if (k === today) btn.classList.add("today");
      if (k === sel) btn.classList.add("sel");
      grid.append(btn);
    }
    const lg = $("legend");
    lg.innerHTML = "";
    Object.keys(KIND_LABEL).forEach(kd => {
      const s = document.createElement("span");
      const i = document.createElement("i"); i.style.background = "var(--p-" + kd + ")";
      s.append(i, KIND_LABEL[kd]);
      lg.append(s);
    });
    const star = document.createElement("span"); star.textContent = "★ 大事な日";
    lg.append(star);
  }

  function renderDay() {
    const { ph, i, len, list } = dayInfo(sel);
    $("qDate").textContent = label(sel) + (sel === today ? "・今日" : "");
    $("phaseName").textContent = ph ? ph.name : "--";
    $("phaseTag").textContent = ph ? (len > 1 ? ph.tag + "・" + (i + 1) + "/" + len + "日目" : ph.tag) : "";
    const ev = events()[sel];
    $("event").hidden = !ev;
    $("event").textContent = ev || "";
    $("event").classList.toggle("big", sel === feDay || sel === JOIN_DAY);
    $("toToday").hidden = sel === clampDay(today);

    const ul = $("tasks");
    ul.innerHTML = "";
    const ids = new Set(done[sel] || []);
    list.forEach((t, n) => {
      const li = document.createElement("li");
      const lab = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = "task-" + n; cb.checked = ids.has(t.id);
      cb.addEventListener("change", () => {
        const s = new Set(done[sel] || []);
        cb.checked ? s.add(t.id) : s.delete(t.id);
        done[sel] = [...s];
        save(LS_DONE, done);
        li.classList.toggle("done", cb.checked);
        progress(list);
        renderCalendar();
      });
      const title = document.createElement("span"); title.className = "t-title"; title.textContent = t.title;
      if (t.note) { const s = document.createElement("span"); s.className = "t-note"; s.textContent = t.note; title.append(s); }
      const time = document.createElement("span"); time.className = "t-time"; time.textContent = t.time || "";
      lab.append(cb, title, time);
      li.append(lab);
      li.classList.toggle("done", cb.checked);
      ul.append(li);
    });
    progress(list);
  }

  function progress(list) {
    const ids = new Set(done[sel] || []);
    const n = list.filter(t => ids.has(t.id)).length;
    $("xpText").textContent = n + " / " + list.length;
    $("xpBar").style.width = (list.length ? n / list.length * 100 : 0) + "%";
    $("clear").hidden = !(list.length && n === list.length);
  }

  function render() { renderCounts(); renderCalendar(); renderDay(); }

  // ===== 操作 =====
  function shiftMonth(n) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + n, 1);
    month = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    renderCalendar();
  }
  $("prevM").addEventListener("click", () => shiftMonth(-1));
  $("nextM").addEventListener("click", () => shiftMonth(1));
  $("toToday").addEventListener("click", () => { sel = clampDay(today); month = sel.slice(0, 7); render(); });

  // 横スワイプで月を切り替え
  let sx = null;
  $("grid").addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  $("grid").addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 60) { if (dx < 0 && !$("nextM").disabled) shiftMonth(1); if (dx > 0 && !$("prevM").disabled) shiftMonth(-1); }
  });

  // 日付が変わったら（アプリを開きっぱなしでも）今日を更新
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const t = keyOf(new Date());
    if (t !== today) { const wasToday = sel === clampDay(today); today = t; if (wasToday) { sel = clampDay(today); month = sel.slice(0, 7); } render(); }
  });

  // ===== 設定 =====
  const dlg = $("settings");
  const msg = t => { $("settingsMsg").textContent = t; };
  $("openSettings").addEventListener("click", () => { $("feDate").value = feDay; msg(""); dlg.showModal(); });
  $("feDate").addEventListener("change", e => {
    const v = e.target.value;
    if (!v || v < FE_MIN || v > FE_MAX) { msg("11月24日〜12月19日の間で選んでください"); return; }
    feDay = v; save(LS_FE, feDay); phases = buildPhases(); render();
    msg("受験日を" + label(v) + "にしました");
  });

  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  $("exportBtn").addEventListener("click", () => {
    download("quest-backup.json", JSON.stringify({ done, feDay }), "application/json");
    msg("バックアップを書き出しました");
  });
  $("importFile").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data.done && typeof data.done === "object") { done = data.done; save(LS_DONE, done); }
      if (data.feDay) { feDay = data.feDay; save(LS_FE, feDay); phases = buildPhases(); $("feDate").value = feDay; }
      render(); msg("バックアップを読み込みました");
    } catch (err) { msg("読み込めませんでした。書き出したJSONファイルを選んでください"); }
    e.target.value = "";
  });

  // 毎朝の通知用カレンダー（.ics）を今の設定から作る
  function buildIcs() {
    const esc = s => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const d8 = k => k.replace(/-/g, "");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//nyusha-quest//JP", "CALSCALE:GREGORIAN", "X-WR-CALNAME:入社までのクエスト", "X-WR-TIMEZONE:Asia/Tokyo",
      "BEGIN:VTIMEZONE", "TZID:Asia/Tokyo", "BEGIN:STANDARD", "DTSTART:19700101T000000", "TZOFFSETFROM:+0900", "TZOFFSETTO:+0900", "TZNAME:JST", "END:STANDARD", "END:VTIMEZONE"];
    let uid = 0;
    phases.forEach(p => {
      if (p.id === "join") return;
      const sample = tasksFor(p.from, p, 0, diff(p.from, p.to) + 1).map(t => "・" + t.title).join("\n");
      L.push("BEGIN:VEVENT", "UID:quest-" + (uid++) + "-" + d8(p.from) + "@nyusha-quest", "DTSTAMP:" + stamp,
        "DTSTART;TZID=Asia/Tokyo:" + d8(p.from) + "T075000", "DTEND;TZID=Asia/Tokyo:" + d8(p.from) + "T080000",
        "RRULE:FREQ=DAILY;UNTIL=" + d8(p.to) + "T145959Z",
        "SUMMARY:" + esc("今日のクエスト：" + p.name), "DESCRIPTION:" + esc(sample + "\n\n詳しくはクエストアプリで"), "TRANSP:TRANSPARENT",
        "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(p.name), "TRIGGER:PT0M", "END:VALARM", "END:VEVENT");
    });
    const big = [[feDay, "基本情報 受験日", "本人確認書類を忘れずに", 7 * 1440], ["2027-01-27", "応用情報 後期 申込開始", "申込は2/16まで", 0],
      ["2027-02-16", "応用情報 後期 申込締切", "今日中に申込を確認", 3 * 1440], [JOIN_DAY, "入社日", "いよいよ入社！", 7 * 1440]];
    big.forEach(([k, name, desc, pre]) => {
      L.push("BEGIN:VEVENT", "UID:quest-m" + (uid++) + "-" + d8(k) + "@nyusha-quest", "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + d8(k), "DTEND;VALUE=DATE:" + d8(addDays(k, 1)),
        "SUMMARY:" + esc(name), "DESCRIPTION:" + esc(desc),
        "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(name), "TRIGGER:PT7H", "END:VALARM");
      if (pre) L.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(name), "TRIGGER:-PT" + pre + "M", "END:VALARM");
      L.push("END:VEVENT");
    });
    L.push("END:VCALENDAR");
    return L.join("\r\n") + "\r\n";
  }
  $("icsBtn").addEventListener("click", () => {
    download("nyusha-quest.ics", buildIcs(), "text/calendar");
    msg("カレンダーのファイルを作りました。開いて「追加」してください");
  });

  // ===== 起動 =====
  render();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  window.__quest = { buildIcs, dayInfo, tasksFor };
})();
