import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  return (
    <div>
      <CounterWithHOC count={0} />
      <CounterWithHOC2 count={1} />
      <CounterRenderProps initialCount={2} />
      <CounterHooks initialCount={3} />
      <CounterCustomHooks initialCount={4} />
      <CounterCustomHooks2 initialCount={5} />
    </div>
  );
}

/** heiger order component */
function counterHOC(props) {
  return (
    <div>
      <h3>HOC</h3>
      <p>You clicked {props.count} times</p>
    </div>
  );
}

class CounterHOC2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count
    };
  }

  render() {
    return (
      <React.Fragment>
        <p>你點擊了 {this.props.count} 次</p>
      </React.Fragment>
    );
  }
}

const addTitle = Component => props => (
  <div>
    <h3>HOC2</h3>
    <Component {...props} />
  </div>
);

function withCounter(WrappedComponent) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: props.count
      };
    }

    render() {
      return (
        <React.Fragment>
          <WrappedComponent {...this.state} />
          <button
            onClick={() => this.setState({ count: this.state.count + 1 })}
          >
            Click me
          </button>
        </React.Fragment>
      );
    }
  };
}

const CounterWithHOC = withCounter(counterHOC);
const CounterWithHOC2 = addTitle(withCounter(CounterHOC2));

/** render props */
class CounterWithRenderProps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: Number(props.count)
    };
  }

  // Increase count
  increment = () => {
    const { count } = this.state;
    return this.setState({ count: count + 1 });
  };

  render() {
    const { count } = this.state;

    return (
      <div>
        {this.props.children({
          increment: this.increment,
          count
        })}
      </div>
    );
  }
}

class CounterRenderProps extends React.Component {
  constructor(props) {
    super(props);
  }

  theme1 = ({ increment, count }) => (
    <div>
      <h3>render proprs1</h3>
      <p>You clicked {count} times</p>
      <button onClick={() => increment()}>click me</button>
    </div>
  );

  render() {
    return (
      <div>
        <CounterWithRenderProps
          count={this.props.initialCount}
          children={this.theme1}
        />
        <CounterWithRenderProps
          count={this.props.initialCount}
          children={({ increment, count }) => (
            <div>
              <div>
                <h3>render proprs2</h3>
                <p>你點擊了 {count} 次</p>
                <button onClick={() => increment()}>Increment</button>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

/** hooks */
function CounterHooks({ initialCount }) {
  const [count, setCount] = useStatus(initialCount);

  return (
    <div>
      <h3>Hooks</h3>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// ref https://codesandbox.io/s/oqjk49m8xq
function useCounterStatus(num) {
  const [count, setCount] = useStatus(num);

  useEffect(() => {
    // Update the document title using the browser API
    console.log(`${count} times`);
  });

  const increase = () => setCount(prevCount => prevCount + 1);

  return [count, increase];
}

function CounterCustomHooks({ initialCount }) {
  const [count, increase] = useCounterStatus(initialCount);

  return (
    <div>
      <h3>Custom Hooks</h3>
      <p>You clicked {count} times</p>
      <button onClick={() => increase()}>Click me</button>
    </div>
  );
}

function CounterCustomHooks2({ initialCount }) {
  const [count, increase] = useCounterStatus(initialCount);

  return (
    <div>
      <h3>Custom Hooks2</h3>
      <p>你點擊了 {count} 次</p>
      <button onClick={() => increase()}>Click me</button>
    </div>
  );
}

function useStatus(props) {
  const [count, setCount] = useState(props);
  return [count, setCount];
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
