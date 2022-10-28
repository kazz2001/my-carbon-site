import React from 'react';
import { Slider } from '@carbon/react';

const SliderJS2 = (props) => {
    return (
        <div>
        <hr/>

        <p>  urban-------------------------earthy</p>
                                      
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
export default SliderJS2;