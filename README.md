# autoDingTalk
钉钉自动打卡脚本

## install
1. auto.js
https://github.com/SuperMonster003/AutoJs6
安装完成后，开启auto.js软件，在侧边栏中开启以下选项
①无障碍服务; \
②忽略电池优化; \
③显示在其他应用上层; \
④投影媒体权限（需要adb操作）

2. 克隆本仓库
```
git clone https://github.com/goxixi/autoDingTalk.git
``` 
3. 根据自己手机修改autoDingTalk.js脚本 \
当前版本下需要修改根据自身情况修改的部分： \
① 截图功能部分; \   
② 手机解锁部分; \
③ 钉钉密码与接收打卡结果邮箱地址 \   

4. 设置定时脚本
在安卓端auto.js添加两个脚本，分别设置定时时间为上班时间和下班时间

## log
### 2023.5.6 v1.0
检测钉钉是否登录，若否则自动登录 \
自动开启钉钉，激活极速打卡 \
脚本启动后，随机延时一段时间再开始打卡任务 \
在钉钉首页截图并发送邮件至指定邮箱 \

### TODO
适配更多手机型号 \
读取邮件通知，开启airdroid \
...

## reference
http://wp.fang1688.cn/study/941.html
