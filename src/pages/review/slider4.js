import React from 'react';
import { Slider } from 'carbon-components-react';

const SliderJS4 = (props) => {
    return (
        <div>
            <hr />

        <p>Rating</p>
                           
        <Slider
            hideTextInput
            ariaLabelInput="Label for slider value"
            id="slider"
            max={10}
            min={1}
            step={1}
            stepMuliplier={4}
            value={props.value}
            />
        </div>
    );
};
export default SliderJS4;