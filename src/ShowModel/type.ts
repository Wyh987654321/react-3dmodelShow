 /* /components/ShowModel/type.ts */ 

 import { CSSProperties, ReactNode } from "react";
 
 import Model from "./Model";
 
 
 
 /**展示3D模型的组件Props */
 export interface showModelProps {
   /**要展示的模型的URL */
   url: string;
   mtlUrl?:string;   /**obj模型的mtl文件地址 */
   /**组件最外层的style。在这里面指定宽高等。不指定宽高，将会适配父元素宽高 */
   style?: CSSProperties;
   /**工具栏的扩展render。参数是内部数据  */
   toolBarRender?: (instance: Model) => ReactNode;
 }
 
 
 
 
 
 /**各个工具的开关和设置等，外部只读 */
 export interface setting {
   /**是否开启了骨架模式 */
   wireframe: boolean,
   /**是否开启了法线模式 */
   normal: boolean,
   /**是否开启了动画 */
   animation: boolean
   /**是否开启了坐标系 */
   axesHelper: boolean
   /**是否开启了网格 */
   gridHelper: boolean
   /**是否开启了包围盒 */
   boundingBoxHelper: boolean
   /**背景色，十六进制字符串 */
   bgcolor: string
 }
 
 /**失败的回调函数 */
 export type onErr = (e: any) => void
 