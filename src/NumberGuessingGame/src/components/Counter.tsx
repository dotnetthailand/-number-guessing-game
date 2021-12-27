import React, { useState } from 'react';
// How use in .cshtml file
// @Html.React("NumberGuessingGame.Counter", new {})
type IProps = {
  initValue: number;
}

//const Counter = (props: IProps) => {
export default  function Counter(props: IProps) {
  const [count, setCount] = useState(props.initValue);

  const handleButtonClick = () => {
    setCount(count + 1);
  }
  return (
    <>
      <button onClick={handleButtonClick}>
        Click me
      </button>
      <div>
        Current value {count}
      </div>
    </>
  )
};

//export default Counter;