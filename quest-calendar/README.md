# 入社までのクエスト

2026年10月〜2027年4月の入社準備計画を、日ごとのタスクにして表示するカレンダーアプリ（PWA）。
サーバー不要の静的ファイルだけで動き、一度開けばオフラインでも使える。

## 公開する（GitHub Pages）

1. GitHub で新しいリポジトリを作る（例: `quest-calendar`、Public）
2. このフォルダの中身をそのまま push する
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/quest-calendar.git
   git push -u origin main
   ```
3. リポジトリの Settings → Pages → Branch を `main` / `/(root)` にして Save
4. 1〜2分後に `https://<ユーザー名>.github.io/quest-calendar/` で開ける

## スマホのホーム画面に置く

- iPhone: Safari で開く → 共有ボタン → 「ホーム画面に追加」
- Android: Chrome で開く → メニュー → 「ホーム画面に追加」（または「アプリをインストール」）

## 毎朝の通知

アプリの ⚙ 設定 →「カレンダーに通知を追加」で .ics を作って、スマホのカレンダーに追加する。
毎朝7:50に「今日のクエスト」、受験日・申込締切・入社日の前にも通知が届く。

## ファイル

| ファイル | 役割 |
| --- | --- |
| index.html | 画面 |
| style.css | 見た目（ライト/ダーク対応） |
| app.js | 計画データ・日ごとのタスク・カレンダー・設定・.ics生成 |
| sw.js | オフライン用のキャッシュ |
| manifest.webmanifest | ホーム画面アプリとしての設定 |

計画の中身を変えたいときは `app.js` の `buildPhases()` と `tasksFor()` を編集する。
`sw.js` の `CACHE` の名前（`quest-v2`）を変えると、スマホ側も新しい版に更新される。

チェックの記録は端末のブラウザ（localStorage）にだけ保存される。機種変更時は ⚙ 設定 → バックアップ で移せる。
