import React from 'react';
import { HomepageBanner, HomepageCallout } from 'gatsby-theme-carbon';
import HomepageTemplate from 'gatsby-theme-carbon/src/templates/Homepage';

import Carbon from '../../images/carbon.jpg';

import { gridmid } from './Homepage.module.scss';

const FirstLeftText = () => <p>CD Review</p>;

const FirstRightText = () => (
    <p>
        <code>Black Music CD Review</code> introduces CD review for Soul and Hip-Hop since 1998
    </p>
);

const SecondLeftText = () => <p> Album Best 50</p>;

const SecondRightText = () => (
    <p>
        Black Music Best 50 albums since 1998
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
    children: (
      <div className="gridmid">
        <h3 className="gridmid">aaa</h3>
      </div>
    ),
    SecondCallout: (
        <HomepageCallout
            leftText={SecondLeftText}
            rightText={SecondRightText}
            color="white"
            backgroundColor="#0043ce"
        />
    ),
};

// spreading the original props gives us props.children (mdx content)
function ShadowedHomepage(props) {
    return <HomepageTemplate {...props} {...customProps} />;
}

export default ShadowedHomepage;
