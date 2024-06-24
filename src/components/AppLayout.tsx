"use client";

import React, { Suspense } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { AppstoreOutlined, FileOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import "antd/dist/reset.css";
import Loading from "@/app/loading";

const { Content, Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <AppstoreOutlined />,
    label: <Link href="/">{"მთავარი"}</Link>,
  },
  {
    key: "2",
    icon: <FileOutlined />,
    label: <Link href="/employees-management">{"თანამშრომლები"}</Link>,
  },
  {
    key: "3",
    icon: <FileOutlined />,
    label: <Link href="/tasks-management">{"დავალებები"}</Link>,
  },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const screens = useBreakpoint();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Layout style={{ minHeight: "100vh" }}>
          {screens.md ? (
            <Sider
              theme="light"
              collapsible
              breakpoint="md"
              style={{
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
              }}
            >
              <Menu mode="inline" items={menuItems} />
            </Sider>
          ) : (
            <Sider
              theme="light"
              collapsed={true}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
              }}
            >
              <Menu mode="inline" items={menuItems} />
            </Sider>
          )}
          <Layout className="site-layout">
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Suspense>
    </>
  );
};
