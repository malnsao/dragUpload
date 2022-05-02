import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { message } from "antd";
import Dragger, { DragProps, UploadFile } from "./Dragger";
import { InboxOutlined } from "@ant-design/icons";
const props: DragProps = {
  name: "file",
  action: "http://localhost:9999/upload",
  onChange: (uploadFile: UploadFile) => {
    const { status } = uploadFile;
    if (status === "done") {
      message.success(`${uploadFile.file.name}上传成功`);
    } else if (status === "error") {
      message.error(`${uploadFile.file.name}上传成功`);
    }
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Dragger {...props}>
    <InboxOutlined style={{ fontSize: 100 }} />
  </Dragger>
);
