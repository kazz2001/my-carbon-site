import React from 'react';
import { Slider } from '@carbon/react';

const SliderJS = (props) => {
    return (
        <Slider
            hideTextInput
            ariaLabelInput="Label for slider value"
            id="slider"
            labelText="Soul  ---   hip-hop"
            max={5}
            min={1}
            step={1}
            stepMuliplier={4}
            value={props.value}
        />
    );
};
export default SliderJS;