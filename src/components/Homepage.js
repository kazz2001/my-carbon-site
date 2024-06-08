import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/components/Layouts/Homepage';
// import { calloutLink } from './Homepage.module.scss';
// import Carbon from '../../images/carbon.jpg';
import Carbon from './carbon.jpg';
import { Button } from '@carbon/react';
import { ArrowUpRight, Search } from '@carbon/icons-react';
import PageDescription from 'gatsby-theme-carbon/src/components/PageDescription';
// import { Launch } from '@carbon/pictograms-react';
// import { Link } from "gatsby"

const FirstLeftText = () =>
    <h2>Contents</h2>
;
const FirstRightText = () => (
   <p className="smallP">
      <code>Black Music Album Review</code>
      <PageDescription  className="smallP">
        R&amp;BやHip-HopなどBlack MusicのAlbum Reviewを載せています。
        <br/>下のボタンをクリックで年ごとのレビュー一覧へ。右上の<Search size={24} />をクリックで検索できます。
      </PageDescription>
      <div style={{marginTop: '0.5rem',}}>
        <Button className="button-right-mergin" href="/cd/2023/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2023
        </Button>
        <Button className="button-right-mergin" href="/cd/2022/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2022
        </Button>
        <Button className="button-right-mergin" href="/cd/2021/" renderIcon={ArrowUpRight} size='sm' kind='tertiary'>
          2021
        </Button>
        <Button className="button-right-mergin" href="/cd/2020/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2020
        </Button>
        <Button className="button-right-mergin" href="/cd/2019/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2019
        </Button>
        <Button className="button-right-mergin" href="/cd/2018/" renderIcon={ArrowUpRight} size='sm' kind='tertiary'>
          2018
        </Button>
        <Button className="button-right-mergin" href="/cd/2017/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2017
        </Button>
        <Button className="button-right-mergin" href="/cd/2016/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2016
        </Button>
	    </div>
      <br/><code>Black Music Best 50 albums</code>
      <PageDescription  className="smallP">
        同じく、Black Musicのアルバム年間ベスト50です。順位は当サイトのオリジナルです。様々な音楽サイトを参考にしつつ、決めてます。
        <br/>下のボタンをクリックで年ごとのBest50へ。
      </PageDescription>
      <div style={{marginTop: '0.5rem',}}>
        <Button className="button-right-mergin" href="/best50/2023/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2023
        </Button>
        <Button className="button-right-mergin" href="/best50/2022/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2022
        </Button>
        <Button className="button-right-mergin" href="/best50/2021/" renderIcon={ArrowUpRight} size='sm' kind='tertiary'>
          2021
        </Button>
	      <Button className="button-right-mergin" href="/best50/2020/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2020
        </Button>
        <Button className="button-right-mergin" href="/best50/2019/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2019
        </Button>
        <Button className="button-right-mergin" href="/best50/2018/" renderIcon={ArrowUpRight} size='sm' kind='tertiary'>
          2018
        </Button>
        <Button className="button-right-mergin" href="/best50/2017/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          2017
        </Button> 
        <Button className="button-right-mergin" href="/best50/2016/" renderIcon={ArrowUpRight} size='sm' kind='secondary'>
          2016
        </Button> 
	    </div>
      <br/><code>Book Review</code>
      <PageDescription  className="smallP">
        R&amp;BやHip-Hopをテーマにした書籍のレビューです。
      </PageDescription>
      <div style={{marginTop: '0.5rem',}}>
	      <Button className="button-right-mergin" href="/book/bookreview1/" renderIcon={ArrowUpRight} size='sm' kind='primary'>
          Book Review
        </Button>
	    </div>
    </p>
);

const SecondLeftText = () => <h2> Contents</h2>; 

const SecondRightText = () => (
    <p  className="smallP">
        <code>Black Music Album Review</code>
        <PageDescription  className="smallP">
          This site introduces Album reviews of Black Music, such as R&amp;B and Hip-Hop since 1998.
        </PageDescription>
        <code>Black Music album Best 50</code>
        <PageDescription  className="smallP"> 
          Black Music album annual Best 50 since. Ranking is original.
        </PageDescription>
        <code>Book Review</code>
        <PageDescription  className="smallP">
          Book review about Black Music, such as R&B and Hip-Hop.
        </PageDescription>
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
