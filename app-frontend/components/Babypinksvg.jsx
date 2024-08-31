import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const PinkBabySvg = (props) => (
  <Svg width={110} height={146} viewBox="0 0 110 146" fill="none" {...props}>
    <Path d="M0 68.5C0 39.5051 23.5051 16 52.5 16C81.4949 16 105 39.5051 105 68.5V146H0V68.5Z" fill="#FCA3E3"/>
    <Ellipse cx="36" cy="69.5" rx="13" ry="16.5" fill="white"/>
    <Circle cx="32.5" cy="69.5" r="7.5" fill="black"/>
    <Circle cx="30.5" cy="69.5" r="2.5" fill="white"/>
    <Ellipse cx="69" cy="69.5" rx="13" ry="16.5" fill="white"/>
    <Circle cx="65.5" cy="69.5" r="7.5" fill="black"/>
    <Circle cx="63.5" cy="69.5" r="2.5" fill="white"/>
    <Path d="M80.0632 22.3709C81.7931 24.1684 80.7009 27.1691 78.2204 27.4342L59.0637 29.4811C56.8568 29.7169 55.1668 27.5577 55.9259 25.472L61.7234 9.54343C62.4826 7.45779 65.1651 6.89002 66.7041 8.48925L80.0632 22.3709Z" fill="#04B36E"/>
    <Path d="M74.1404 25.9492C72.4106 24.1517 73.5027 21.151 75.9833 20.886L95.1399 18.839C97.3468 18.6032 99.0368 20.7625 98.2777 22.8481L92.4802 38.7767C91.7211 40.8624 89.0385 41.4301 87.4995 39.8309L74.1404 25.9492Z" fill="#04B36E"/>
  </Svg>
);

export default PinkBabySvg;
