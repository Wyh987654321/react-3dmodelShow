/* /utils/index.ts */
import { ReactNode } from "react"
import { NoticeType } from "antd/es/message/interface"
import { message } from "antd"
/**使用antd做弹窗，展示信息 
* @param content 要提示的文字，或者一个ReactNode
* @param type 类型，默认"success"。 
* @param duration 显示时间，单位s，默认2s ，0代表不关闭
* @param key 每个message唯一的key， 可以用于destroy。默认为当前时间戳
* @returns 返回弹窗实例，可以进行.then等
*/
export default function showTip(content: ReactNode | string, type: NoticeType = 'success', duration: number = 2, key: any = new Date().getTime()) {
    return message.open({
        type,
        content,
        duration,
        key,
        style: { zIndex: 99999 }
    })
}
