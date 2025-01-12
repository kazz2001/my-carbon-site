@echo on
setlocal

set DOMAIN=planetky

title ftp-deploy %DOMAIN%

set LOCAL=public/

set PROTOCOL=ftps
set USER=planetky
set PASS=T.BRiWZ77zYb
set HOST=planetky.sakura.ne.jp
set DIR=home/planetky/www/

set URL=%PROTOCOL%://%USER%:%PASS%@%HOST%/%DIR%

call ftp-deploy %LOCAL% %URL%

endlocal

pause