echo on
rmdir public /S /Q
rmdir .cache /S /Q
rmdir node_modules /S /Q
del yarn.lockx
rename yarn.lock yarn.lockx
yarn