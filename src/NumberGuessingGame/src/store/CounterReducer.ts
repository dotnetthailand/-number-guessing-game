const initialState = {
  count: 0
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "increase":
      return { count: state.count + action.payload };
    case "decrease":
      return { count: state.count - action.payload };
    default:
      return state;
  }
}
