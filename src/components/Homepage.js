import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
// import { calloutLink } from './Homepage.module.scss';
import Carbon from '../../images/carbon.jpg';
import { Button } from '@carbon/react';
import { ArrowUpRight, Search } from '@carbon/icons-react';
// import { Launch } from '@carbon/pictograms-react';
// import { Link } from "gatsby"

const FirstLeftText = () =>
    <h2>Contents</h2>
;
const FirstRightText = () => (
    <p className="p700J">
      <code>Black Music Album Review</code>
      <Search size={32} />
      <br/>R&amp;BやHip-HopなどBlack MusicのAlbum Reviewを載せています。 。
      <br/>下のボタンをクリックで年ごとのレビュー一覧へ。右上の<Search size={32} />をクリックで検索できます。
      <div style={{marginTop: '0.5rem',}}>
        <Button className="button-right-mergin" href="/cd/2022/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          20222
        </Button>
        <Button className="button-right-mergin" href="/cd/2021/" kind="secondary" renderIcon={ArrowUpRight} size="sm">
          2021
        </Button>
        <Button className="button-right-mergin" href="/cd/2020/" kind="tertiary" renderIcon={ArrowUpRight} size="sm">
          2020
        </Button>
        <Button className="button-right-mergin" href="/cd/2019/" kind="primary" renderIcon={ArrowUpRight} size="sm">
          2019
        </Button>
        <Button className="button-right-mergin" href="/cd/2018/" kind="secondary" renderIcon={ArrowUpRight} size="sm">
          2018
        </Button>
        <Button className="button-right-mergin" href="/cd/2017/" kind="tertiary" renderIcon={ArrowUpRight} size="sm">
          2017
        </Button>
        <Button className="button-right-mergin" href="/cd/2016/" kind="primary" renderIcon={ArrowUpRight} size="sm">
          2016
        </Button>
	    </div>
      <br/><code>Black Music Best 50 albums</code>
      <br/>同じく、Black Musicのアルバム年間ベスト50です。順位は当サイトのオリジナルです。様々な音楽サイトを参考にしつつ、決めてます。
      <br/>下のボタンをクリックで年ごとのBest50へ。
      <div style={{marginTop: '0.5rem',}}>
        <Button className="button-right-mergin" href="/best50/2020/" kind="primary" size='sm' renderIcon={ArrowUpRight}>
          2021
        </Button>
        <Button className="button-right-mergin" href="/best50/2020/" kind="secondary" size='sm' renderIcon={ArrowUpRight}>
          2020
        </Button>
	      <Button className="button-right-mergin" href="/best50/2019/" kind="tertiary" size='sm' renderIcon={ArrowUpRight}>
          2019
        </Button>
        <Button className="button-right-mergin" href="/best50/2018/" kind="primary" size='sm' renderIcon={ArrowUpRight}>
          2018
        </Button>
        <Button className="button-right-mergin"href="/best50/2017/" kind="secondary" size='sm' renderIcon={ArrowUpRight}>
          2017
        </Button>
        <Button className="button-right-mergin" href="/best50/2016/" kind="tertiary" size='sm' renderIcon={ArrowUpRight}>
          2016
        </Button> 
	    </div>
      <br/><code>Book Review</code>
      <br/>R&amp;BやHip-Hopをテーマにした書籍のレビューです。
      <div style={{marginTop: '0.5rem',}}>
	      <Button className="button-right-mergin" href="/book/bookreview1/" kind="primary" size='sm' renderIcon={ArrowUpRight}>
          Book Review
        </Button>
	    </div>
    </p>
);

const SecondLeftText = () => <h2> Contents</h2>; 

const SecondRightText = () => (
    <p>
        <code>Black Music Album Review</code>
        <br/> This site introduces Album reviews of Black Music, such as R&amp;B and Hip-Hop since 1998.
        <br/><code>Black Music album Best 50</code>
        <br/>Black Music album annual Best 50 since. Ranking is original.
        <br/><code>Book Review</code>
        <br/>Book review of Black Music, such as R&B and Hip-Hop.
    </p>
);

const BannerText = () => <h1>Black Music Album Review by planet.ky</h1>;

const customProps = {
    Banner: <HomepageBanner renderText={BannerText} image={Carbon} />,
    FirstCallout: (
        <HomepageCallout
            backgroundColor="#78a9ff"
            color="white"
            leftText={FirstLeftText}
            rightText={FirstRightText}
        />
    ),
    SecondCallout: (
        <HomepageCallout
            leftText={SecondLeftText}
            rightText={SecondRightText}
            color="white"
            backgroundColor="#78a9ff"
        />
    ),
};

// spreading the original props gives us props.children (mdx content)
function ShadowedHomepage(props) {
    return <HomepageTemplate {...props} {...customProps} />;
}

export default ShadowedHomepage;
