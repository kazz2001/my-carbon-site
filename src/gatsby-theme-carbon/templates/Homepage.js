import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
import Carbon from '../../images/carbon.jpg';
import { Button } from 'carbon-components-react';
import { ArrowUpRight24  } from '@carbon/icons-react';
// import { Launch } from '@carbon/pictograms-react';
// import { Link } from "gatsby"

const FirstLeftText = () =>
    <h2>Contents</h2>
;
const FirstRightText = () => (
    <div>
        <code>Black Music Album Review</code>
        <br/>R&amp;BやHip-HopなどBlack MusicのAlbum Reviewを載せています。1998年より、年50年枚程度レビューしています。
        <div>
	      <Button href="/cd/2020/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
            2020
          </Button>
          <Button href="/cd/2019/" kind="secondary" size="small" renderIcon={ArrowUpRight24}>
            2019
          </Button>
          <Button href="/cd/2018/" kind="tertiary" size="small" renderIcon={ArrowUpRight24}>
            2018
          </Button>
          <Button href="/cd/2017/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
            2017
          </Button>
          <Button href="/cd/2016/" kind="secondary" size="small" renderIcon={ArrowUpRight24}>
            2016
          </Button>
	    </div>
        <br/><code>Black Music album Best 50</code>
        <br/>同じく、Black Musicのアルバム年間ベスト50です。順位は当サイトのオリジナルです。様々な音楽サイトを参考にしつつ、決めてます。
        <div>
	      <Button href="/best50/2019/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
            2019
          </Button>
          <Button href="/best50/2018/" kind="secondary" size="small" renderIcon={ArrowUpRight24}>
            2018
          </Button>
          <Button href="/best50/2017/" kind="tertiary" size="small" renderIcon={ArrowUpRight24}>
            2017
          </Button>
          <Button href="/best50/2016/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
            2016
          </Button>
	    </div>
        <br/><code>Book Review</code>
        <br/>R&amp;BやHip-Hopをテーマにした書籍のレビューです。
        <div>
	      <Button href="/book/bookreview1/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
            Book Review
          </Button>
	    </div>
    </div>
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

const BannerText = () => <h1>Black Music CD Review by planet.ky</h1>;

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
