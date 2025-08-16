#!/bin/bash
rm -rf ./packages/designkit/dist
rm -rf ./pages/react
rm -rf ./pages/vue
rm -rf ./pages/www

cd packages/designkit
bun run build
cd ../../example/react
bun run build
cd ../vue
bun run build

cd ../../

mv ./example/react/dist ./pages/react
mv ./example/vue/dist ./pages/vue
mv ./packages/designkit/www ./pages/www
