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
	npm update

## git 無視ファイルをcacheから削除
	git rm -r --cached .vs

## To Do
	style (font, grid)
	favicon (内部参照)
	SEO
	Google Analytics

## メモ
	C:\Users\user\AppData\Local\Temp

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
