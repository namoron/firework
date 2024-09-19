    # python3.9のイメージをダウンロード
    FROM python:3.12
    ENV PYTHONUNBUFFERED=1
    ENV SCM_DO_BUILD_DURING_DEPLOYMENT=1

    WORKDIR /src

    # pipを使ってpoetryをインストール
    # RUN pip install poetry
    RUN curl -sSL https://install.python-poetry.org | python3
    # ENV PATH /root/.local/bin  # ここ追加
    ENV PATH="/root/.local/bin:$PATH"

    # poetryの定義ファイルをコピー (存在する場合)
    COPY pyproject.toml* poetry.lock* ./

    # poetryでライブラリをインストール (pyproject.tomlが既にある場合)
    RUN poetry config virtualenvs.in-project false
    RUN if [ -f pyproject.toml ]; then poetry lock --no-update && poetry install --no-root; fi
    # uvicornのサーバーを立ち上げる
    CMD ["poetry", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--reload"]