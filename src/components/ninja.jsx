import { useState } from "react";

function MyComponent() {
  const [myArray, setMyArray] = useState(new Array(9).fill(false));

  const toggleValueAtIndex = (index) => {
    setMyArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = !newArray[index];
      return newArray;
    });
  };

  return (
    <div>
      {myArray.map((value, index) => (
        <div key={index}>
          <span>{`Index ${index}: ${value.toString()}`}</span>
          <button onClick={() => toggleValueAtIndex(index)}>Toggle</button>
        </div>
      ))}
    </div>
  );
}

export default MyComponent;
