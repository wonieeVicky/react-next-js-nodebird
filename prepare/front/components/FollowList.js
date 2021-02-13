import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons";

const FollowList = ({ header, data }) => {
  const listStyle = useMemo(() => ({ marginBottom: 20 }), []);
  const loadMoreStyle = useMemo(() => ({ textAlign: "center", margin: "10px 0" }), []);
  const renderListStyle = useMemo(() => ({ marginTop: 20 }), []);

  return (
    <List
      header={<div>{header}</div>}
      style={listStyle}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      loadMore={
        <div style={loadMoreStyle}>
          <Button>더보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={renderListStyle}>
          <Card actions={[<StopOutlined key="stop" />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
