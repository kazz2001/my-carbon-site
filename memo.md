## Set-upファイル変更
	manifest.yml
	Staticfile
	.cfignore
yarn build

## cfへのdeploy
cf login -a https://api.us-south.cf.cloud.ibm.com --sso
	cf push -f manifest.yml

## 再setup
	https://gatsby-theme-carbon.now.sh/getting-started  の手順　 @ carbon
	git remote add origin https://github.com/kazz2001/my-carbon-site.git @ my-carbon-site
	git fetch origin
	git branch B1 origin/B1
	git checkout B1
	.gitignore 確認し更新
	
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

## Mac set up##
	xcode
	homebrew
	nodebrew
	node.js

## apple affiliate
	11lcug

[![Netlify Status](https://api.netlify.com/api/v1/badges/879f5e62-98f6-4f1d-b0a1-5bba4c6a9b55/deploy-status)](https://app.netlify.com/sites/cdreview/deploys)

Your friendly Gatsby maintainers detected your site has more JavaScript than most sites! We're working to make your site's JS compile as quickly as possible by avoiding clearing your webpack cache as 
often.

If you're interested in trialing this coming change *today* — which should make your local development experience faster — go ahead and enable the PRESERVE_WEBPACK_CACHE flag and run your develop server again.

To do so, add to your gatsby-config.js:

flags: {
  PRESERVE_WEBPACK_CACHE: true,
}

Visit the umbrella issue to learn more: https://github.com/gatsbyjs/gatsby/discussions/28331  

There are 3 other flags available that you might  
be interested in:
- FAST_DEV · Enable all experiments aimed at      
improving develop server start time
- DEV_SSR · (Umbrella Issue
(​https://gatsby.dev/dev-ssr-feedback​)) · Server 
Side Render (SSR) pages on full reloads during    
develop. Helps you detect SSR bugs and fix them   
without needing to do full builds.
- PRESERVE_FILE_DOWNLOAD_CACHE · (Umbrella Issue  
(​https://gatsby.dev/cache-clearing-feedback​)) · 
Don't delete the downloaded files cache when      
changing gatsby-node.js & gatsby-config.js files. 
- FAST_REFRESH · (Umbrella Issue
(​https://gatsby.dev/fast-refresh-feedback​)) ·   
Use React Fast Refresh instead of the legacy      
react-hot-loader for instantaneous feedback in    
your development server. Recommended for versions 
of React >= 17.0.
- PARALLEL_SOURCING · EXPERIMENTAL · (Umbrella    
Issue
(​https://gatsby.dev/parallel-sourcing-feedback​))
 · Run all source plugins at the same time instead of serially. For sites with multiple source      
plugins, this can speedup sourcing and
transforming considerably.