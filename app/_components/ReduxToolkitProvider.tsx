"use client";
import React, { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

interface IReduxToolkitProvider {
  children: ReactNode;
}
const ReduxToolkitProvider: FC<IReduxToolkitProvider> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxToolkitProvider;
