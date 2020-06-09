import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
import Carbon from '../../images/carbon.jpg';
import { Button } from 'carbon-components-react';
import { ArrowUpRight24  } from '@carbon/icons-react';
import { Launch } from '@carbon/pictograms-react';
import { Link } from "gatsby"

const FirstLeftText = () =>
    <h2>Contents</h2>
;
const FirstRightText = () => (
    <div>
        <code>Black Music CD Review</code>
        <br/>R&amp;BやHip-HopなどBlack MusicのCD Reviewを紹介しています。1998年より、年50年枚程度レビューしています。
        <div>
	<Button href="/best50/2020/" kind="primary" size="small" renderIcon={ArrowUpRight24}>
    2020
    </Button>
    <Button href="/best50/2019/" kind="secondary" size="small" renderIcon={ArrowUpRight24}>
    2019
    </Button>
	</div>
        <br/><code>Black Music album Best 50</code>
        <br/>同じく、Black Musicのアルバム年間ベスト50です。順位は当サイトのオリジナルです。様々な音楽サイトを参考にしつつ、決めてます。
        <br/><a href="/cd/2019/"><font color="#000000"> 2019<Launch width="24px" height="24px"/></font></a>
        <br/><br/><code>Book Review</code>
        <br/>R&amp;BやHip-Hopを取り上げた書籍のレビューです。
        <br/><a href="/book/bookreview/"><font color="#000000"> Book Review<Launch width="24px" height="24px"/></font></a>
    </div>
);

const SecondLeftText = () => <h2> Contents</h2>; 

const SecondRightText = () => (
    <p>
        <code>Black Music CD Review</code>
        <br/> This site introduces CD review of Black Music, such ad R&amp;B and Hip-Hop since 1998.
        <br/><code>Black Music album Best 50</code>
        <br/>Black Music album annual Best 50 since. Ranking is original.
    </p>
);

const BannerText = () => <h1>Black Musicc CD Review by planet.ky</h1>;

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
