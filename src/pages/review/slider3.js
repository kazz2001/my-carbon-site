import React from 'react';
import { Slider } from 'carbon-components-react';

const SliderJS3 = (props) => {
    return (
        <div>
        <hr />
                           
        <Slider
            hideTextInput
            ariaLabelInput="Label for slider value"
            id="slider"
            max={5}
            min={1}
            minLabel={" - familiar"}
            maxLabel={" - Serious"}
            step={1}
            stepMuliplier={1}
            value={props.value}
            />
        </div>
    );
};
export default SliderJS3;