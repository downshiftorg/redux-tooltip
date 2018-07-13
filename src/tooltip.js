import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { sanitize } from 'dompurify';
import { adjust, resolve, originOrEl } from './utils';
import * as styles from './styles';
import * as themes from './themes';

type Props = {
  show: boolean,
  origin: string | Object,
  el: Object,
  place: string | Array,
  content: string | Object | Array<Object>,
  auto: boolean,
  within: (*) => *,
}

class Tooltip extends React.Component<Props> {
  static defaultProps = {
    show: false,
    place: 'top',
    auto: true,
    id: 'tooltip',
    className: 'tooltip',
  }

  state = {}

  componentWillReceiveProps(nextProps) {
    const { place, content, children } = nextProps;
    const origin = originOrEl(nextProps);
    if (origin) {
      this.updatePosition(nextProps);
    }
  }

  updatePosition(props) {
    // Render content into hidden DOM element to determine size
    const content = this.children(props);
    ReactDOM.render(<div>{content}</div>, this.shadow, () => {
      const state = adjust(this.shadow, props);
      this.setState(state);
    });
  }

  children(props = this.props) {
    let { content } = props;
    if (typeof content === 'string') {
      content = <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} />;
    }
    return content ? content : props.children;
  }

  render() {
    const { id, className, show, onHover, onLeave } = this.props;
    const origin = originOrEl(this.props);
    const { place, offset } = this.state;
    const content = this.children();
    const visibility = (origin && show) ? 'visible' : 'hidden';
    const style = { visibility, ...offset };

    return (
      <div className={className}>
        <div
          ref={e => {this.tooltip = e;}}
          style={style}
          id={id}
          className={`${id}-main`}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <div
            ref={e => {this.content = e;}}
            id={`${id}-content`}
            className={`${id}-content`}
          >
            {content}
          </div>
          <div
            id={`${id}-arrow`}
            className={`${id}-arrow ${id}-arrow-${place}`}
            key={`a-${place}`}
          />
        </div>
        <div
          ref={e => {this.shadow = e;}}
          id={`${id}-shadow`}
          className={`${id}-shadow`}
        />
      </div>
    );
  }
}

function select(state, ownProps) {
  const { tooltip: tooltips } = state;
  const names = resolve(ownProps);
  if (1 < names.length) {
    console.error(`<Tooltip> does not accept a list of names as 'name' props: ${names}`);
  }
  const name = names[0];
  const tooltip = tooltips[name];
  return { ...tooltip, ...ownProps };
}

export default connect(select)(Tooltip);
