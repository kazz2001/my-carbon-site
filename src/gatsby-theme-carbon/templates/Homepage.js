import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';
import Carbon from '../../images/carbon.jpg';

import { ArrowUpRight24  } from '@carbon/icons-react';
import { Launch } from '@carbon/pictograms-react';
import { Link } from "gatsby"

const FirstLeftText = () =>
    <h2>Contents</h2>
;
const FirstRightText = () => (
    <p>
        <code>Black Music CD Review</code>
        <br/> R&amp;BやHip-HopなどBlack MusicのCD Reviewを紹介しています。1998年より、年50年枚程度レビューしています。
        <br/><a href="/best50/2019/"><font color="#000000"> 2019</font><Launch width="24px" height="24px"/></a> 
        <br/><code>Black Music album Best 50</code>
        <br/>同じく、Black Musicのアルバム年間ベスト50です。順位は当サイトのオリジナルです。様々な音楽サイトを参考にしつつ、決めてます。
        <br/><a href="/cd/2019/"><font color="#000000"> 2019<Launch width="24px" height="24px"/></font></a>
    </p>
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
