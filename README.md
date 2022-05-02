# dragUpload

拖拽上传组件

npm i antd koa koa-body koa-static -S

思路
1、ui 完成
2、定义 DragProps 接口字段 name action onChange
3、定义 uploadFile 接口字段 file percent url status
4、监听 dragenter ondragover ondragleave ondrop 事件
5、实现 upload onProgress
6、实现 upload 接口
