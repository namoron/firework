# ベースイメージを指定
FROM node

# node.js の環境変数を定義する
# 本番環境では production
ENV NODE_ENV=development

# 雛形を生成するのに必要なパッケージのインストール
RUN npm install -g express-generator

# ディレクトリを移動する
WORKDIR /firework

# ポート3000番を開放する
EXPOSE 3000

