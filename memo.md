## Set-upファイル変更
	manifest.yml
	Staticfile
	.cfignore
yarn build

## cfへのdeploy
	cf push -f manifest.yml

## 再setup
	https://gatsby-theme-carbon.now.sh/getting-started  の手順
	git remote add
	git fetch origin
	git branch B1 origin/B1
	git checkout B1
	
	yarnのinstall    npm i yarn　　　　yarn-cliが使えないとき

	npm install -S @carbon/pictograms
	
## 強制同期
	git stash save
	git pull origin XX

## package.json変更後のTo Do
	一部update
		 npm update
	総入れ替え
		package.jsonを最小にする。バージョンは最新
			    "@carbon/pictograms-react": "^10.12.0",
    			"gatsby": "2.23.3",
    			"gatsby-theme-carbon": "1.24.4",
    			"react": "16.13.1",
    			"react-dom": "^16.13.1"
		yarn.lock を削除
		yarn



個別に導入
@carbon/pictograms-react

## git 無視ファイルをcacheから削除
	git rm -r --cached package.json

## To Do
	style (font, grid)
	SEO

## Packageの最新化
	NCUを導入
	NCUで確認
	NCU -Uでpackage.jsonをupdate
	yarn.lock 削除
	yarn ( or NPM Install)

## NPMで困ったとき
	node --stack-size=4000 "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install
	npm cache clean -force
	npm config set strict-ssl f  
	export NODE_OPTIONS="--max-old-space-size=4096"

## メモ
	C:\Users\user\AppData\Local\Temp
	npm view carbon-components version

## VSCode
	Git History
	Git Lens
	MDX
	React Extension Pack
	React code snipets

[![Netlify Status](https://api.netlify.com/api/v1/badges/879f5e62-98f6-4f1d-b0a1-5bba4c6a9b55/deploy-status)](https://app.netlify.com/sites/cdreview/deploys)

Shadow
?@?@?@Homepage.js
		import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
			D:\carbon\my-carbon-site\node_modules\gatsby-theme-carbon\src\components\Homepage/Banner.js
			D:\carbon\my-carbon-site\node_modules\gatsby-theme-carbon\src\components\Homepage/Callout.js
		import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
			D:\carbon\my-carbon-site\node_modules\gatsby-theme-carbon\src\templates/Homepage.js
				import Layout from '../components/Layout';
				import { HomepageBanner, HomepageCallout } from '../components/Homepage';  ==>
				import Main from '../components/Main';
