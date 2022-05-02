import { LoadingOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Card, Progress } from "antd";
import React, {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
export type DragProps = React.PropsWithChildren<{
  onChange: any;
  name: string;
  action: string;
}>;

export interface UploadFile {
  file: File;
  percent: number;
  url?: string;
  status: string;
}

const Dragger: React.FunctionComponent<DragProps> = function (
  props: DragProps
): JSX.Element {
  const [uploadFiles, setUploadFiles] = useState<Array<UploadFile>>([]);
  let uploadContainer: MutableRefObject<HTMLDivElement | undefined> = useRef<
    HTMLDivElement | undefined
  >();

  const onDragEnter: (event: DragEvent) => any = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragOver: (event: DragEvent) => any = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragLeave: (event: DragEvent) => any = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDrop: (event: DragEvent) => any = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    let transfer: DataTransfer | null = event.dataTransfer;
    if (transfer?.files) {
      upload(transfer?.files);
    }
  };
  function upload(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let formData = new FormData();
      formData.append("filename", file.name);
      formData.append(props.name, file);
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", props.action, true);
      xhr.responseType = "json";
      let uploadFile: UploadFile = {
        file,
        percent: 0,
        status: "uploading",
        url: "",
      };
      uploadFiles.push(uploadFile);
      xhr.onprogress = onUploadProgress;
      xhr.upload.onprogress = onUploadProgress;
      function onUploadProgress(event: ProgressEvent) {
        if (event.lengthComputable) {
          let percent = parseInt(
            ((event.loaded / event.total) * 100).toFixed(0)
          );
          console.log(percent, 111);
          uploadFile.percent = percent;
          if (percent >= 100) {
            uploadFile.status = "done";
          }
          setUploadFiles([...uploadFiles]);
        }
      }
      xhr.onerror = function () {
        uploadFile.status = "error";
        setUploadFiles([...uploadFiles]);
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          uploadFile.url = xhr.response.url;
          props.onChange(uploadFile);
        }
      };
      xhr.send(formData);
    }
  }
  useEffect(() => {
    uploadContainer.current?.addEventListener("dragenter", onDragEnter);
    uploadContainer.current?.addEventListener("dragover", onDragOver);
    uploadContainer.current?.addEventListener("dragleave", onDragLeave);
    uploadContainer.current?.addEventListener("drop", onDrop);
    return () => {
      uploadContainer.current?.removeEventListener("dragenter", onDragEnter);
      uploadContainer.current?.removeEventListener("dragover", onDragOver);
      uploadContainer.current?.removeEventListener("dragleave", onDragLeave);
      uploadContainer.current?.removeEventListener("drop", onDrop);
    };
  }, []);

  return (
    <>
      <div
        className="dragger-container"
        ref={uploadContainer as LegacyRef<HTMLDivElement> | undefined}
      >
        {props.children}
      </div>
      {uploadFiles.map((uploadfile: UploadFile, index: number) => (
        <div key={index}>
          <div>
            {uploadfile.status === "loading" ? (
              <LoadingOutlined />
            ) : (
              <PaperClipOutlined />
            )}
            <span>{uploadfile.file.name}</span>
            <Progress
              status={uploadfile.status === "error" ? "exception" : undefined}
              percent={uploadfile.percent}
            />
          </div>
        </div>
      ))}
      {uploadFiles.map((uploadFile: UploadFile, index: number) => (
        <Card
          hoverable
          style={{ width: 100 }}
          cover={<img src={uploadFile.url} />}
        >
          <Card.Meta title={uploadFile.file.name}></Card.Meta>
        </Card>
      ))}
    </>
  );
};

export default Dragger;
