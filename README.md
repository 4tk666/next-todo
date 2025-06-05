# Next.js ToDo アプリケーション

階層構造をサポートしたタスク管理アプリケーションです。

## ✨ 主な機能

- 📝 **タスク管理** - タスクの作成、編集、削除、完了状態の切り替え
- 🏗️ **階層構造** - 親子関係を持つタスクの管理（サブタスクの作成）
- 📅 **期日設定** - タスクに期日を設定して管理
- 🎯 **優先度設定** - 高・中・低の3段階での優先度設定
- 🔐 **認証機能** - NextAuth.jsを使用したユーザー認証（サインアップ・サインイン）

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15（App Router）** 
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**

### バックエンド・データベース
- **Prisma**
- **PostgreSQL**
- **NextAuth.js**

### 開発・テスト
- **Vitest**
- **React Testing Library**
- **Biome**
- **pnpm**

## 🚀 はじめかた

### 前提条件

- Node.js 18.18以上
- pnpm
- PostgreSQLデータベース
- dockerコマンドの使用


### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local`ファイルを参考に、`.env`ファイルを作成してください。

### 3. データベースのセットアップ

```bash
# PostgreSQLデータベースの起動
docker compose up -d

# Prismaクライアントの生成
pnpm generate

# データベースマイグレーションの実行
pnpm migrate
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### 5.  prisma studioの起動

```bash
pnpm studio
```

ブラウザで [http://localhost:5555](http://localhost:5555) を開いてアプリケーションを確認できます。

## 🏗️ プロジェクト構造

```
src/
├── .github/               # GitHub設定ディレクトリ
│   ├── copilot-instructions.md  # GitHub Copilot用の指示ファイル
│   └── workflows/         # GitHub Actions ワークフロー
│       ├── ci.yml         # CI/CDパイプライン
│       └── vercel-deploy.yml  # Vercelデプロイ設定
├── app/                   # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── api/               # APIルート
│   ├── todos/             # ToDo機能ページ
│   └── layout.tsx         # ルートレイアウト
├── components/
│   ├── elements/          # 基本的なUIコンポーネント
│   ├── features/          # ページ固有のコンポーネント
│   └── layouts/           # レイアウトコンポーネント
├── lib/
│   ├── data/              # データ取得ロジック
│   ├── dto/               # dto定義
│   ├── features/          # ページ固有のロジック
│   ├── schemas/           # Zodバリデーションスキーマ
│   ├── server-actions/    # サーバーアクション
│   └── utils/             # ユーティリティ関数
├── constants/             # 定数定義
└── types/                 # TypeScript型定義
```


## 🚀 デプロイ

### Vercelでのデプロイ（推奨）

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動デプロイが開始されます

詳細は[Next.jsデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。
