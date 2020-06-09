import React from 'react';
import { Slider } from 'carbon-components-react';

const SliderJS4 = (props) => {
    return (
        <div>
            <hr />
                         
        <Slider
            hideTextInput
            ariaLabelInput="Label for slider value"
            id="slider"
            max={10}
            min={1}
            minLabel={" - Rating**"}
            maxLabel={" - Rating"}
            step={1}
            stepMuliplier={1}
            value={props.value}
            />
        </div>
    );
};
export default SliderJS4;