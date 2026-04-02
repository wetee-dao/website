#!/bin/sh

set -eu

# 来源于网络，用于获取当前shell文件的路径
SOURCE="$0"
while [ -h "$SOURCE"  ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd  )"
    SOURCE="$(readlink "$SOURCE")"
    [ "${SOURCE#/}" = "$SOURCE" ] && SOURCE="$DIR/$SOURCE"
done
DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd  )"

cd "$DIR/../"

PROTO_FILE="${1:-src/apis/dao.proto}"

if [ ! -f "$PROTO_FILE" ]; then
  echo "proto file not found: $PROTO_FILE" >&2
  exit 1
fi

if [ ! -x "./node_modules/.bin/protoc-gen-ts_proto" ]; then
  echo "missing ts-proto plugin, run: npm install -D ts-proto" >&2
  exit 1
fi

PROTO_DIR="$(dirname "$PROTO_FILE")"
PROTO_NAME="$(basename "$PROTO_FILE")"

cd "$PROTO_DIR"

protoc \
  --plugin="$DIR/../node_modules/.bin/protoc-gen-ts_proto" \
  --ts_proto_out=. \
  --ts_proto_opt=esModuleInterop=true,env=browser,outputClientImpl=false,outputJsonMethods=false,oneof=unions-value,useOptionals=none \
  "$PROTO_NAME"

echo "generated: $PROTO_DIR/$(basename "$PROTO_NAME" .proto).ts"
