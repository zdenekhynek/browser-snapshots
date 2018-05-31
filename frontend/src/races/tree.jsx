import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import sizeMe from 'react-sizeme';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { line, curveBasis } from 'd3-shape';
import { min, max } from 'd3-array';

import Thumb from './thumb';
import Profile from './profile';
import { NUM_STEPS } from './reducer';
import { getVideoThumbnail } from './utils';
import { getAreaChartDefs } from './patterns.jsx';

import classes from './tree.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#FF5822',
  '#05ACB4',
  '#D9E2DA',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

class Tree extends Component {
  constructor(props) {
    super(props);

    this.chart = null;
    this.svg = null;
  }

  onMouseOver(t, i) {
    const { index } = this.props;
    this.props.onMouseOver(t, i, index);
  }

  onMouseOut() {
    this.props.onMouseOut();
  }

  renderPath(task, index, metric = 'temperature', flipped = false) {
    const { areaFn, yMap, xMap } = this.props;

    //  double it
    let points = task.toJS();
    points = points.reduce((acc, data) => {
      data.metric = data[metric];
      acc.push(data);
      return acc;
    }, []);

    const pathString = areaFn(points);
    const svgClass = (flipped) ? classes.svgFlipped : classes.svg;

    let style = {};
    let stroke = '';
    let fill = 'none';

    if (metric === 'pollution') {
      stroke = COLORS[index];
      style = { stroke, fill };
    } else if (metric === 'temperature') {
      fill = `url(#diagonalHatch-${index})`;
      style = { fill };
    } else {
      fill = COLORS[index];
      style = { fill };
    }

    console.log('style', style);

    return (
      <svg className={svgClass}>
        {getAreaChartDefs(index, COLORS[index])}
        <g>
          <path
            className={classes.progress}
            style={style}
            d={pathString}
          />
        </g>
      </svg>
    );
  }

  renderThumbnail(t, i) {
    const { xMap, yMap, sizeMap, colorMap, size } = this.props;

    //  check if it's bogus first or last point
    if (!t.has('id')) {
      // point there just for an area chart
      return '';
    }

    //  get height of the thumbnail
    const height = (size.height - 128) / (NUM_STEPS / 1.25);
    const marginBottom = `-${height / 4}px`;
    const style = { height, marginBottom };

    const thumbUrl = getVideoThumbnail(t.get('url'));
    const backgroundImage = `url(${thumbUrl})`;

    const tObj = t.toJS();
    const temparature = tObj.temperature;
    const imageStyle = { backgroundImage };

    const even = i % 2 === 0;
    const itemClass = (!even) ? classes.item : classes.itemRight;
    const lineClass = (!even) ? classes.line : classes.lineRight;
    const titleClass = classes.title;// (even) ? classes.title : classes.titleRight;

    const color = colorMap(tObj);
    const backgroundColor = color;

    return (
      <div
        className={itemClass}
        onMouseOver={() => {
          this.onMouseOver(t, i);
        }}
        onMouseOut={this.onMouseOut.bind(this)}
        style={style}
      >
        <div className={classes.itemCol}>
          <img src={thumbUrl} className={classes.image} />
          <p className={classes.title}>{tObj.title}</p>
        </div>
        <div className={classes.itemCol}>
          <div className={classes.graphics}>
            <span className={lineClass} />
            <span className={classes.number}>{i}</span>
          </div>
        </div>
        <div className={classes.itemCol} />
      </div>
    );

    //    <span className={classes.line} />
    //        <span className={classes.number}>{i}</span>

    // return (
    //   <Thumb
    //     key={i}
    //     index={i}
    //     data={t}
    //     xMap={xMap}
    //     yMap={yMap}
    //     sizeMap={sizeMap}
    //     onMouseOver={this.onMouseOver.bind(this)}
    //     onMouseOut={this.onMouseOut.bind(this)}
    //   />
    // );
  }

  renderThumbnails(tasks, i) {
    return (
      <div key={i} className={classes.thumbs}>
        {tasks.map(this.renderThumbnail.bind(this))}
      </div>
    );
  }

  renderPaths(tasks, index, metric = 'temperature') {
    return (
      <div className={classes.svgWrapper}>
        {this.renderPath(tasks, index, metric)}
        {this.renderPath(tasks, index, metric, true)}
      </div>
    );
  }

  render() {
    console.log('render');
    const { tasks, index } = this.props;

    const color = COLORS[index];

    return (
      <div className={classes.tree}>
        <Profile index={index} color={color} />
        <div className={classes.viz}>
          {this.renderPaths(tasks, index, 'temperature')}
          {this.renderPaths(tasks, index, 'noise')}
          {this.renderPaths(tasks, index, 'pollution')}
          <div>
            {this.renderThumbnails(tasks)}
          </div>
        </div>
      </div>
    );
  }
}

Tree.propTypes = {
  tasks: PropTypes.object,
};

Tree.defaultProps = {
  tasks: List(),
};
// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

// Wrap your component with the HOC.
export default sizeMeHOC(Tree);