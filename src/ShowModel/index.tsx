// /components/ShowModel/index.tsx

import './index.scss'
import { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Progress, Space, Switch } from "antd";
// import { Button, ColorPicker, Dropdown, Progress, Space, Switch } from "antd"; ColorPicker在5.5.0版本之后提供
import showTip from './showTip';
import React from 'react';
import Model from './Model';
import { setting, showModelProps } from "./type";
import { DownOutlined } from "@ant-design/icons";

/**展示3D模型 */
export default function ShowModel({ url, mtlUrl,style = {}, toolBarRender }: showModelProps) {

  
  /**用来承载three画布的容器 */
  const threeDivRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); //进度条，大于100时隐藏，小于0时代表加载失败
  const [instance, setInstance] = useState<Model>(); //模型实例。
  //这里只是给到一个setting的demo，修改无用
  const [setting, setSetting] = useState<setting>({
    wireframe: false,
    normal: false,
    animation: false,
    axesHelper: false,
    gridHelper: false,
    boundingBoxHelper: false,
    bgcolor: "0x0000ff",
  }); //工具栏配置

  

  /**初始化模型并挂载 */
  const init = (node: HTMLDivElement) => {
    console.log('setting:',setting);
    const modelType =getModelType(url)
    const modelShow = new Model(node,modelType, (_setting) => setSetting({ ..._setting }));
    // const modelShow = new Model(node, (setting) => setSetting({ ...setting }));
    setInstance(modelShow);
    setProgress(0); //开始进度条

    

    modelShow.loadModel(
      url,
      function (model) {
        setProgress(101); //隐藏进度条
      },
      function (e) {
        // 加载进度的处理逻辑，这里实际上是AJAX请求，如果是本地文件的话就不会有加载进度条
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          if (percentComplete <= 100) {
            setProgress(parseInt(percentComplete.toFixed(2)));
          } else {
            //有时候会有超出100的情况
            setProgress(100);
          }
        }
      },
   
      function (e) {
        setProgress(-1); //错误进度条
        showTip("加载失败,请F12查看报错", "error", 5);
      },
      mtlUrl,
      
    );
   
      

    return () => {
      modelShow.destory();
    };
  };
  /**自定义下拉框渲染 */
  const dropdownRender = () => {
    if (!instance ) return <></>;
    const items = [
      <Switch
        onChange={(open) => instance.changeAxesHelper(open)}
        checkedChildren="坐标系"
        unCheckedChildren="坐标系"
        checked={setting.axesHelper}
      />,
      <Switch
        onChange={(open) => instance.changeGridHelper(open)}
        checkedChildren="网格面"
        unCheckedChildren="网格面"
        checked={setting.gridHelper}
      />,
      <Switch
        onChange={(open) => instance.changeBoundingBoxHelper(open)}
        checkedChildren="包围盒"
        unCheckedChildren="包围盒"
        checked={setting.boundingBoxHelper}
      />,
      <Button onClick={() => instance.cameraOriginalPosition()}>相机归位</Button>,
      //   <ColorPicker showText onChange={(_, hex) => instance.changeBgcolor(hex)} size="small" value={setting.bgcolor} />,
    ];
    return (
      <div style={{ ...bgStyle, padding: "10px", borderRadius: "10px" }}>
        {items.map((k, i) => {
          return (
            <div key={i} style={{ margin: "5px 0" }}>
              {k}
            </div>
          );
        })}
        {toolBarRender && toolBarRender(instance)}
      </div>
    );
  };

  const  getModelType = (url:string ):string=>{
    const parts = url.split('.');
    const fileExtension = parts[parts.length - 1];

    return fileExtension
  }

  useEffect(() => {
    if (!url) {
      showTip("请传递模型URL!", "error", 5);
      setProgress(-1);
      return;
    }
    //在react18的开发环境下，useEffect会执行两次，所以需要在return中消除副作用
    const dom = threeDivRef.current;
    if (dom) {
      setInstance(undefined);
      const destory = init(dom);
      return destory;
    }
  }, [url]);
  return (
    <div className='showModel' style={style}>
      {instance && progress > 100 && (
        <Space className="toolList" style={bgStyle}>
          <Switch onChange={(open) => instance.changeWireframe(open)} checkedChildren="骨架" unCheckedChildren="骨架" checked={setting.wireframe} />
          <Switch onChange={(open) => instance.changeNormal(open)} checkedChildren="法线" unCheckedChildren="法线" checked={setting.normal} />
          <Switch
            onChange={(open) => instance.changeAnimation(open, (e) => showTip(e, "error"))}
            checkedChildren="动画"
            unCheckedChildren="动画"
            checked={setting.animation}
          />
          <Dropdown dropdownRender={dropdownRender}>
            <DownOutlined rev={null} className="cursor-pointer" />
          </Dropdown>
        </Space>
      )}
      <div className="canvasContain" ref={threeDivRef}></div>

      <div className="progress">
        <Progress
          type="dashboard"
          status={progress < 0 ? "exception" : "active"}
          percent={progress}
          style={{ opacity: progress > 100 ? "0" : "1" }}
          strokeColor={{ "0%": "#87d068", "50%": "#ffe58f", "100%": "#ffccc7" }}
        />
      </div>
      <p className="tip">
        鼠标左键可以旋转，右键可以平移，滚轮可以控制模型放大缩小
      </p>

    </div>
  );
}

const bgStyle = { backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" };

