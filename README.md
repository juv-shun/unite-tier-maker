# Unite Tier Maker

ポケモンのTierリストをドラッグ＆ドロップで直感的に作成・管理できるWebアプリケーション。

## 特徴

- 未配置エリアからTier（S, A, B, C）へのドラッグ＆ドロップによる直感的な操作
- Tier内での並び替え、削除、リセット機能
- localStorageを用いた割り当て情報の永続化
- React.memoやuseMemoによるパフォーマンス最適化

## 技術スタック

- フレームワーク: React (TypeScript)
- ドラッグ＆ドロップ: react-dnd + react-dnd-html5-backend
- スタイリング: Emotion (@emotion/react, @emotion/styled)
- パッケージ管理: npm
- テスト: @testing-library/react
- コード品質: ESLint, TypeScript

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/juv-shun/unite-tier-maker.git
cd unite-tier-maker

# 依存関係をインストール
npm install
```

## 実行

```bash
# 開発用サーバー起動
npm start
```

ブラウザで http://localhost:3000 を開きます。

## ビルド

```bash
# 本番用ビルド
npm run build
```

## プロジェクト構成

```
unite-tier-maker/
├── public/                # HTMLテンプレートなど静的ファイル
├── src/
│   ├── components/        # UIコンポーネント
│   ├── hooks/             # カスタムフック(useTierManagement)
│   ├── contexts/          # コンテキスト(PokemonContext)
│   ├── constants/         # 定数定義(TIER一覧など)
│   ├── data/              # ポケモンデータ定義
│   ├── styles/            # Emotionによるスタイル定義
│   ├── types/             # TypeScript型定義
│   ├── App.tsx            # アプリエントリポイント
│   └── index.tsx          # ReactDOMレンダリング
└── package.json           # プロジェクト情報＆スクリプト
```

## 使用方法

1. 未配置エリアからポケモンをドラッグして任意のTierに配置
2. Tier内でドラッグして順序を変更
3. 選択状態で「×」ボタンをクリックし配置解除
4. 「リセット」ボタンで全Tierを初期状態に戻す

## デプロイ

NetlifyやVercelなどの静的サイトホスティングに対応。ビルド成果物を`build/`フォルダに配置して公開します。

## ライセンス

MIT

## 作者

juv-shun
