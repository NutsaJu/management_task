"use client";

import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function Loading() {
  return (
    <LoaderWrapper>
      <Spin indicator={antIcon} />
    </LoaderWrapper>
  );
}
