function formReducer(state, action) {
  switch (action.type) {
    case "USER_INPUT":
      return {
        ...state,
        [action.field]: action.payload,
      };
  }
}

export { formReducer };
