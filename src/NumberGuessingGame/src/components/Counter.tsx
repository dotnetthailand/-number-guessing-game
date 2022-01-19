import React, { useState } from 'react';
// How use in .cshtml file
// @Html.React("NumberGuessingGame.Counter", new {})
type Props = {
  initValue: number;
}

//const Counter = (props: IProps) => {
export default function Counter({ initValue }: Props) {
  const [count, setCount] = useState(initValue);

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
