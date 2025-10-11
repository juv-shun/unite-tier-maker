# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ポケモンユナイトのキャラクターTierリストを作成するReactアプリケーション。ドラッグ&ドロップでポケモンをS/A/B/Cのティアに配置し、localStorageで状態を永続化する。

## 開発用コマンド

```bash
# 開発サーバー起動
pnpm start

# プロダクションビルド
pnpm run build

# テスト実行
pnpm test

# コードフォーマット
pnpm exec prettier --write src/
```

## アーキテクチャ

### コア機能
- **useTierManagement**: メインのステート管理フック（assignments配列でポケモン配置を管理）
- **PokemonContext**: ポケモンデータ提供のコンテキスト
- **react-dnd**: ドラッグ&ドロップ機能実装

### ディレクトリ構成
```
src/
├── components/        # UI コンポーネント
├── hooks/            # カスタムフック (useTierManagement)
├── contexts/         # React コンテキスト
├── data/             # ポケモンデータ定義
├── types/            # TypeScript型定義
├── styles/           # Emotionスタイル
├── constants/        # 定数定義
└── tests/            # テストファイル
```

### 重要な型
- `PokemonAssignment`: ポケモンの配置情報（id, pokemonId, location, position）
- `TierId`: S/A/B/C/UNASSIGNEDの列挙型
- `DragItem`: ドラッグアイテムの型定義

### 状態管理
- assignmentsでポケモン配置を一元管理
- localStorageで自動永続化
- 同一Tier内での重複制御あり

### スタイリング
Emotionを使用。各コンポーネントに対応するstylesファイルが存在。