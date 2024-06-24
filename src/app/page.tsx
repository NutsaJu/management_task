"use client";

import React from "react";
import Link from "next/link";
import { Card, Col, Row } from "antd";
import { FormOutlined, UserOutlined } from "@ant-design/icons";

export default () => {
  return (
    <div>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} lg={8}>
          <Link href="/employees-management">
            <Card
              className="dashboard-card"
              hoverable
              style={{
                display: "flex",
                height: "92px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UserOutlined style={{ fontSize: "24px" }} />
              <h3>თანამშრომლების მართვა</h3>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Link href="/tasks-management">
            <Card
              className="dashboard-card"
              hoverable
              style={{
                display: "flex",
                height: "92px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormOutlined style={{ fontSize: "24px" }} />
              <h3>დავალებების მართვა</h3>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
