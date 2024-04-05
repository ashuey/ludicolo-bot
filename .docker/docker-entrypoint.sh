#!/bin/bash
/pb/pocketbase serve --http=0.0.0.0:8080 &

node /src/dist/cmd/index.js start &

wait -n

exit $?
