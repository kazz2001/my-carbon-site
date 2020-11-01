import React from 'react';
import { Slider } from 'carbon-components-react';

const SliderJS1 = (props) => {
    return (
        <div>
        <hr />

        <p>  rap oriented---------song oriented</p>
        <Slider
            hideTextInput
            ariaLabelInput="Label for slider value"
            id="slider"
            max={5}
            min={1}
            step={1}
            stepMuliplier={4}
            value={props.value}
            />
        </div>
    );
};
export default SliderJS1;